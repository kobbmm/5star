import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ApiResponse, ChartDataItem } from "@/types";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || new Date().toISOString().split('T')[0];

    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

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
    const errorResponse: ApiResponse<null> = {
      data: null,
      status: 500,
      message: "Failed to fetch chart data",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
