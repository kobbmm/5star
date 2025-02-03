import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ApiResponse, ChartDataItem } from "@/types";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";

// Create singleton instance
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Add cache for 5 minutes
export const revalidate = 300;

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 1000
});

export async function GET(req: Request) {
  try {
    // More lenient rate limiting (30 requests per minute)
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'anonymous';
    await limiter.check(30, ip); // Increased from 10 to 30

    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");
    
    if (!dateStr?.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return NextResponse.json({
        data: null,
        status: 400,
        message: "Invalid date format",
        error: "Date must be YYYY-MM-DD"
      }, { status: 400 });
    }

    const startDate = new Date(dateStr);
    startDate.setHours(0, 0, 0, 0);
    
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
    if (error instanceof Error && error.message === 'Rate limit exceeded') {
      return NextResponse.json({
        data: null,
        status: 429,
        message: "Too Many Requests",
        error: "Please wait a minute before trying again"
      }, { 
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Reset': String(Date.now() + 60000)
        }
      });
    }
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
  } finally {
    // Clean up if not production
    if (process.env.NODE_ENV !== 'production') {
      await prisma.$disconnect()
    }
  }
}
