import { NextResponse } from "next/server";
import { ApiResponse, ChartDataItem } from "@/types";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

// Add cache for 5 minutes
export const revalidate = 0;

// เพิ่ม dynamic route configuration
export const dynamic = 'force-dynamic';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 1000
});

export async function GET(req: Request) {
  try {
    // ตรวจสอบ session ของผู้ใช้
    const session = await getServerSession(authOptions);
    
    // ตรวจสอบสิทธิ์ Admin (สำรองกรณี middleware ไม่ทำงาน)
    // @ts-ignore - เรา type session ยังไม่ได้อัปเดต
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({
        data: null,
        status: 403,
        message: "ไม่มีสิทธิ์เข้าถึงข้อมูล - ต้องเป็น Admin เท่านั้น"
      }, { status: 403 });
    }
    
    // Verify Prisma connection
    await prisma.$connect();
    
    // Fix: Use await with headers()
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'anonymous';
    
    // Rate limiting check
    try {
      await limiter.check(30, ip);
    } catch {
      return NextResponse.json({
        data: null,
        status: 429,
        message: "Too Many Requests - Please wait a minute before trying again"
      }, { 
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Reset': String(Date.now() + 60000)
        }
      });
    }

    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");
    
    if (!dateStr?.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return NextResponse.json({
        data: null,
        status: 400,
        message: "Invalid date format - Date must be YYYY-MM-DD"
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
    console.log("เกิดข้อผิดพลาด:", error);
    
    // แสดงรายละเอียดข้อผิดพลาดเพิ่มเติม
    if (error instanceof Error) {
      console.log("Error name:", error.name);
      console.log("Error message:", error.message);
      console.log("Error stack:", error.stack);
    } else {
      console.log("Unknown error type:", typeof error);
    }
    
    // Handle Prisma-specific errors
    if (error instanceof Error && error.message.includes('Prisma')) {
      console.log('Prisma Error:', error);
      return NextResponse.json({
        data: null,
        status: 500,
        message: "Database connection error - Unable to connect to database"
      }, { status: 500 });
    }
    
    if (error instanceof Error && error.message === 'Rate limit exceeded') {
      return NextResponse.json({
        data: null,
        status: 429,
        message: "Too Many Requests - Please wait a minute before trying again"
      }, { 
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Reset': String(Date.now() + 60000)
        }
      });
    }
    
    // ใช้ console.log แทน console.error เพื่อหลีกเลี่ยงปัญหา
    console.log('Chart API Error (Handled safely):', error ? JSON.stringify(error) : 'null error');
    
    const errorResponse: ApiResponse<null> = {
      data: null,
      status: 500,
      message: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? `Internal server error: ${error.message}` : "Unknown error") : 
        "An unexpected error occurred"
    };
    return NextResponse.json(errorResponse, { status: 500 });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {
      console.error('Error disconnecting from database:', e);
    }
  }
}
