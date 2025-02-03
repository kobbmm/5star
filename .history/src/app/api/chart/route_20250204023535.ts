import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ApiResponse, ChartDataItem } from "@/types";
import { headers } from "next/headers";

const prisma = new PrismaClient();

// Add cache for 5 minutes
export const revalidate = 300;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({
        data: null,
        status: 400,
        message: "Date parameter is required",
        error: "Missing date parameter"
      }, { status: 400 });
    }

    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    // Validate date
    if (isNaN(startDate.getTime())) {
      return NextResponse.json({
        data: null,
        status: 400,
        message: "Invalid date format",
        error: "Date must be in YYYY-MM-DD format"
      }, { status: 400 });
    }

    const dailyReviews = await prisma.review.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    const total = dailyReviews.length;

    const results: ChartDataItem[] = Array(5).fill(null).map((_, i) => {
      const rating = i + 1;
      const ratingReviews = dailyReviews.filter(r => r.rating === rating);
      return {
        rating,
        count: ratingReviews.length,
        percentage: total ? (ratingReviews.length / total) * 100 : 0,
        firstReview: ratingReviews[0]?.date.toISOString() || '',
        lastReview: ratingReviews[ratingReviews.length - 1]?.date.toISOString() || ''
      };
    });

    const response: ApiResponse<ChartDataItem[]> = {
      data: results,
      status: 200,
      message: "Success"
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chart API Error:', error);
    const errorResponse: ApiResponse<null> = {
      data: null,
      status: 500,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : "Unknown error") : 
        "An unexpected error occurred"
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
