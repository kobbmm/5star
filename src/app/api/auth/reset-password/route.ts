import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    // รับข้อมูลจาก request body
    const { token, password } = await req.json();
    
    // ตรวจสอบว่ามีข้อมูลครบหรือไม่
    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: "กรุณาระบุข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }
    
    // ตรวจสอบความยาวของรหัสผ่าน
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร" },
        { status: 400 }
      );
    }
    
    // ค้นหา token ในฐานข้อมูล
    const resetToken = await prisma.token.findUnique({
      where: {
        token,
        type: "PASSWORD_RESET",
      },
      include: {
        user: true,
      },
    });
    
    // หากไม่พบ token หรือ token ไม่ถูกต้อง
    if (!resetToken) {
      return NextResponse.json(
        { success: false, message: "ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว" },
        { status: 400 }
      );
    }
    
    // ตรวจสอบว่า token หมดอายุหรือยัง
    if (resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, message: "ลิงก์รีเซ็ตรหัสผ่านหมดอายุแล้ว กรุณาขอลิงก์ใหม่" },
        { status: 400 }
      );
    }
    
    // เข้ารหัสรหัสผ่านใหม่
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // อัปเดตรหัสผ่านของผู้ใช้
    await prisma.user.update({
      where: {
        id: resetToken.userId,
      },
      data: {
        password: hashedPassword,
      },
    });
    
    // ลบ token หลังจากใช้งานเสร็จแล้ว
    await prisma.token.delete({
      where: {
        id: resetToken.id,
      },
    });
    
    return NextResponse.json(
      { success: true, message: "รีเซ็ตรหัสผ่านสำเร็จ คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Reset password error:", error);
    
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน กรุณาลองใหม่ในภายหลัง" },
      { status: 500 }
    );
  }
} 