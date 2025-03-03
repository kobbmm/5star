import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";

// Rate limiter สำหรับป้องกันการลงทะเบียนหลายครั้ง
const limiter = rateLimit({
  interval: 60 * 1000, // 1 นาที
  uniqueTokenPerInterval: 500,
  limit: 5,
});

export async function POST(req: Request) {
  try {
    // ใช้ Rate limiter
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'anonymous';
    
    try {
      await limiter.check(5, ip); // อนุญาตให้ทำการลงทะเบียนได้ 5 ครั้งต่อ IP ต่อนาที
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "คุณลงทะเบียนบ่อยเกินไป กรุณาลองใหม่ในภายหลัง" },
        { status: 429 } // Too Many Requests
      );
    }
    
    // ตรวจสอบว่า body ไม่เป็น null
    if (!req.body) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลการลงทะเบียน" },
        { status: 400 }
      );
    }
    
    const { name, email, password } = await req.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "อีเมลและรหัสผ่านจำเป็นต้องระบุ" },
        { status: 400 }
      );
    }
    
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร" },
        { status: 400 }
      );
    }
    
    // Register user using auth lib function (รูปแบบใหม่)
    const { user, token } = await registerUser({
      email,
      password,
      fullname: name || email.split('@')[0]
    });
    
    // ควรจะส่งอีเมลยืนยันตัวตนที่นี่
    // await sendVerificationEmail(email, token.token);
    
    return NextResponse.json(
      { 
        success: true, 
        message: "ลงทะเบียนสำเร็จ กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี",
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      },
      { status: 201 }
    );
    
  } catch (error: any) {
    // แก้ไขการใช้ console.error เพื่อป้องกัน payload error
    try {
      console.error("Registration error:", error?.message || "Unknown error");
    } catch (logError) {
      // ถ้าเกิดข้อผิดพลาดในการล็อก ก็ข้ามไป
    }
    
    // จัดการ Error ที่เฉพาะเจาะจง
    if (error && error.message === "อีเมลนี้ถูกใช้งานแล้ว") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 409 } // Conflict
      );
    }
    
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการลงทะเบียน" },
      { status: 500 }
    );
  }
} 