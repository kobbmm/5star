import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // ทดสอบการเชื่อมต่อกับ Database
    const dbOk = await prisma.$queryRaw`SELECT 1`
      .then(() => true)
      .catch(() => false);

    // รวบรวมสถานะทั้งหมด
    const status = {
      server: true,
      database: dbOk,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      uptime: process.uptime()
    };

    // ตรวจสอบว่าทุกอย่างทำงานปกติหรือไม่
    const allHealthy = Object.values(status).every(
      (val) => val !== false
    );

    return NextResponse.json(
      {
        healthy: allHealthy,
        status
      },
      {
        status: allHealthy ? 200 : 503,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Health check failed:", error);
    
    return NextResponse.json(
      {
        healthy: false,
        error: "Health check failed",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
} 