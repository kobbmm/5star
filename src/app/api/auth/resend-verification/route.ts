import { NextResponse } from "next/server";
import { resendVerificationEmail } from "@/lib/auth";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { handleApiError, createApiResponse } from "@/lib/api-utils";

// กำหนดให้เป็น dynamic route
export const dynamic = 'force-dynamic';

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
      return createApiResponse(null, "คุณขอส่งอีเมลยืนยันบ่อยเกินไป กรุณาลองใหม่ในอีก 1 นาที", 429);
    }
    
    // รับ email จาก request body
    const { email } = await req.json();
    
    // ตรวจสอบว่ามี email ใน request หรือไม่
    if (!email) {
      return createApiResponse(null, "กรุณาระบุอีเมล", 400);
    }
    
    // เพิ่ม log เพื่อตรวจสอบการทำงาน
    console.log(`Attempting to resend verification email to: ${email}`);
    
    // ส่งอีเมลยืนยันใหม่
    const result = await resendVerificationEmail(email);
    
    // เพิ่ม log หลังจากส่งอีเมล
    console.log(`Resend verification email result:`, result);
    
    if (!result.success) {
      throw new Error(result.error || "ไม่สามารถส่งอีเมลได้");
    }
    
    return createApiResponse(
      { email },
      "ส่งอีเมลยืนยันไปยังที่อยู่อีเมลของคุณแล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ",
      200
    );
    
  } catch (error: any) {
    console.error("Resend verification error:", error);
    
    // ตรวจสอบข้อความข้อผิดพลาดเฉพาะ
    if (error.message === "ไม่พบผู้ใช้ที่มีอีเมลนี้") {
      return createApiResponse(null, "ไม่พบบัญชีผู้ใช้ที่ใช้อีเมลนี้", 404);
    }
    
    if (error.message === "อีเมลนี้ได้รับการยืนยันแล้ว") {
      return createApiResponse(null, "อีเมลนี้ได้รับการยืนยันแล้ว คุณสามารถเข้าสู่ระบบได้ทันที", 400);
    }
    
    return handleApiError(error, "เกิดข้อผิดพลาดในการส่งอีเมลยืนยัน กรุณาลองอีกครั้งในภายหลัง");
  }
} 