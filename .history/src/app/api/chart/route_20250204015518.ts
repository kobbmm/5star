import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || new Date().toISOString().split('T')[0];

    // ดึงข้อมูลรีวิวประจำวัน
    const dailyReviews = await prisma.review.findMany({
      where: {
        date: {
          gte: new Date(date),
          lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
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
    return NextResponse.json({ error: "Failed to fetch chart data" }, { status: 500 });
  }
}
