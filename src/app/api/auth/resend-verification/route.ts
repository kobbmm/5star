import { NextResponse } from "next/server";
import { resendVerificationEmail } from "@/lib/auth";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";

// สร้าง rate limiter (อนุญาตให้ส่งคำขอใหม่ได้ 3 ครั้งต่อนาที)
const limiter = rateLimit({
  uniqueTokenPerInterval: 10,
  interval: 60 * 1000,
  limit: 3,
});

export async function POST(req: Request) {
  try {
    // ตรวจสอบ IP ของผู้ใช้สำหรับ rate limiting
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    
    try {
      await limiter.check(3, ip);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "คุณขอส่งอีเมลยืนยันบ่อยเกินไป กรุณาลองใหม่ในอีก 1 นาที" },
        { status: 429 }
      );
    }
    
    // รับ email จาก request body
    const { email } = await req.json();
    
    // ตรวจสอบว่ามี email ใน request หรือไม่
    if (!email) {
      return NextResponse.json(
        { success: false, message: "กรุณาระบุอีเมล" },
        { status: 400 }
      );
    }
    
    // ส่งอีเมลยืนยันใหม่
    await resendVerificationEmail(email);
    
    return NextResponse.json(
      { success: true, message: "ส่งอีเมลยืนยันไปยังที่อยู่อีเมลของคุณแล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ" },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error("Resend verification error:", error);
    
    // ตรวจสอบข้อความข้อผิดพลาดเฉพาะ
    if (error.message === "ไม่พบผู้ใช้ที่มีอีเมลนี้") {
      return NextResponse.json(
        { success: false, message: "ไม่พบบัญชีผู้ใช้ที่ใช้อีเมลนี้" },
        { status: 404 }
      );
    }
    
    if (error.message === "อีเมลนี้ได้รับการยืนยันแล้ว") {
      return NextResponse.json(
        { success: false, message: "อีเมลนี้ได้รับการยืนยันแล้ว คุณสามารถเข้าสู่ระบบได้ทันที" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการส่งอีเมลยืนยัน กรุณาลองอีกครั้งในภายหลัง" },
      { status: 500 }
    );
  }
} 