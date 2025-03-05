import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "ไม่พบโทเคน" }, { status: 400 });
  }

  try {
    // ค้นหาโทเคนในฐานข้อมูล
    const verificationToken = await prisma.token.findFirst({
      where: {
        token,
        type: "EMAIL_VERIFICATION"
      },
      include: {
        user: true
      }
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "โทเคนไม่ถูกต้องหรือหมดอายุ" }, { status: 400 });
    }

    // อัปเดตสถานะ emailVerified
    await prisma.user.update({
      where: {
        id: verificationToken.userId
      },
      data: {
        emailVerified: true
      }
    });

    // ลบโทเคนที่ใช้แล้ว
    await prisma.token.delete({
      where: {
        id: verificationToken.id
      }
    });

    return NextResponse.json({ success: true, message: "อีเมลได้รับการยืนยันแล้ว" });
  } catch (error) {
    // ไม่ใช้ console.error เพื่อหลีกเลี่ยงข้อผิดพลาด
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการยืนยันอีเมล" }, { status: 500 });
  }
} 