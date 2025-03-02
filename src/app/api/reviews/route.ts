import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

// GET - ดึงข้อมูลรีวิวทั้งหมด
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: reviews, status: 200, message: "Success" });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { data: null, status: 500, message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST - เพิ่มรีวิวใหม่
export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'anonymous';
    
    await limiter.check(10, ip);

    const { rating, comment, userName } = await req.json();

    if (!rating) {  // เช็คแค่ rating อย่างเดียว
      return NextResponse.json({
        data: null,
        status: 400,
        message: "Rating is required"
      }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        date: new Date(),
        time: new Date().toLocaleTimeString(),
        rating,
        comment: comment || "",  // ถ้าไม่มี comment ให้เป็นค่าว่าง
        userName: userName || "Anonymous"  // ถ้าไม่มี userName ให้เป็น Anonymous
      }
    });

    return NextResponse.json({
      data: review,
      status: 201,
      message: "Review created successfully"
    }, { status: 201 });

  } catch (error: unknown) {
    // วิธีที่ 1: ใช้ type guard
    if (error instanceof Error && error.message === "Rate limit exceeded") {
      return NextResponse.json(
        { data: null, status: 429, message: "Too many requests" },
        { status: 429 }
      );
    }

    // หรือวิธีที่ 2: ใช้ type assertion
    if ((error as Error).message === "Rate limit exceeded") {
      return NextResponse.json(
        { data: null, status: 429, message: "Too many requests" },
        { status: 429 }
      );
    }

    console.error('Error creating review:', error);
    return NextResponse.json(
      { data: null, status: 500, message: "Failed to create review" },
      { status: 500 }
    );
  }
}
