import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

// Validate date parameter
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date || !dateSchema.safeParse(date).success) {
      return NextResponse.json(
        { error: "Invalid date parameter" },
        { status: 400 }
      );
    }

    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const dailyReviews = await prisma.review.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    const total = dailyReviews.length;

    const results = Array(5)
      .fill(null)
      .map((_, i) => {
        const rating = i + 1;
        const ratingReviews = dailyReviews.filter((r) => r.rating === rating);
        return {
          rating,
          count: ratingReviews.length,
          percentage: total ? (ratingReviews.length / total) * 100 : 0,
          reviews: ratingReviews,
        };
      });

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Fetch API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chart data", details: (error as Error).message },
      { status: 500 }
    );
  }
}
