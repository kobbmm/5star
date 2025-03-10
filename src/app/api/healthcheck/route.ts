import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// กำหนดให้เป็น dynamic route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // ทดสอบการเชื่อมต่อกับฐานข้อมูล
    let databaseStatus = "unknown";
    let error = null;
    let dbDetails = {};
    
    try {
      await prisma.$connect();
      
      // ทดสอบการ query ข้อมูลเบื้องต้น
      const usersCount = await prisma.user.count();
      const reviewsCount = await prisma.review.count();
      
      databaseStatus = "connected";
      dbDetails = {
        usersCount,
        reviewsCount
      };
    } catch (dbError: any) {
      databaseStatus = "error";
      error = dbError.message;
    } finally {
      await prisma.$disconnect();
    }
    
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        status: databaseStatus,
        ...dbDetails
      },
      environment_variables: {
        has_database_url: !!process.env.DATABASE_URL,
        has_nextauth_url: !!process.env.NEXTAUTH_URL,
        has_nextauth_secret: !!process.env.NEXTAUTH_SECRET,
        has_gmail_user: !!process.env.GMAIL_USER,
        has_gmail_password: !!process.env.GMAIL_APP_PASSWORD,
        nextauth_url: process.env.NEXTAUTH_URL,
      },
      error
    });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 