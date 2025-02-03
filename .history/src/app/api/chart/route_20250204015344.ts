import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Create Prisma client as a global instance
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");

    // Validate date parameter
    if (!dateParam || isNaN(Date.parse(dateParam))) {
      return NextResponse.json(
        { error: "Invalid date parameter" },
        { status: 400 }
      );
    }

    const date = new Date(dateParam);
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if date is within reasonable range
    const now = new Date();
    const minDate = new Date(now);
    minDate.setFullYear(now.getFullYear() - 1); // 1 year ago
    
    if (date > now || date < minDate) {
      return NextResponse.json(
        { error: "Date must be within the last year" },
        { status: 400 }
      );
    }

    const dailyReviews = await prisma.review.findMany({
      where: {
        date: {
          gte: date,
          lt: tomorrow
        }
      }
    });

    const total = dailyReviews.length;

    const results = Array(5).fill(null).map((_, i) => {
      const rating = i + 1;
      const ratingReviews = dailyReviews.filter(r => r.rating === rating);
      return {
        rating,
        count: ratingReviews.length,
        percentage: total ? (ratingReviews.length / total) * 100 : 0,
        reviews: ratingReviews
      };
    });

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error("Chart API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chart data", details: (error as Error).message },
      { status: 500 }
    );
  }
}
