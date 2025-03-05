import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateToken } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";

// สร้าง rate limiter (อนุญาตให้ส่งคำขอรีเซ็ตรหัสผ่านได้ 3 ครั้งต่อชั่วโมง)
const limiter = rateLimit({
  uniqueTokenPerInterval: 10,
  interval: 60 * 60 * 1000, // 1 ชั่วโมง
  limit: 3,
});

export async function POST(req: Request) {
  try {
    // ตรวจสอบ IP ของผู้ใช้สำหรับ rate limiting
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    
    try {
      await limiter.check(5, ip);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "คุณขอรีเซ็ตรหัสผ่านบ่อยเกินไป กรุณาลองใหม่ในภายหลัง" },
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
    
    // ค้นหาผู้ใช้ด้วยอีเมล
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    // หากไม่พบผู้ใช้ ก็ส่งข้อความสำเร็จเพื่อไม่ให้เปิดเผยข้อมูลว่ามีอีเมลนี้ในระบบหรือไม่
    if (!user) {
      return NextResponse.json(
        { success: true, message: "หากมีบัญชีผู้ใช้ที่ใช้อีเมลนี้ เราจะส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลดังกล่าว" },
        { status: 200 }
      );
    }
    
    // ตรวจสอบว่าผู้ใช้ได้ยืนยันอีเมลแล้วหรือยัง
    if (!user.emailVerified) {
      return NextResponse.json(
        { success: false, message: "คุณต้องยืนยันอีเมลก่อนจึงจะสามารถรีเซ็ตรหัสผ่านได้" },
        { status: 400 }
      );
    }
    
    // สร้าง token สำหรับการรีเซ็ตรหัสผ่าน
    const resetToken = await generateToken(user.id, "PASSWORD_RESET", 1); // หมดอายุใน 1 ชั่วโมง
    
    // ส่งอีเมลรีเซ็ตรหัสผ่าน
    await sendPasswordResetEmail(user.email, user.name || email.split('@')[0], resetToken.token);
    
    return NextResponse.json(
      { success: true, message: "เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ" },
      { status: 200 }
    );
    
  } catch (error: any) {
    if (error) {
      console.error("Forgot password error:", error);
    }
    
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการขอรีเซ็ตรหัสผ่าน กรุณาลองใหม่ในภายหลัง" },
      { status: 500 }
    );
  }
} 