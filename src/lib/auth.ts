import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import prisma from "./prisma";
import crypto from "crypto";
import { sendVerificationEmail } from "./email";

// เพิ่ม enum TokenType เพื่อให้สอดคล้องกับ schema.prisma
export enum TokenType {
  RESET_PASSWORD = "RESET_PASSWORD",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION"
}

export async function getSession() {
  return await getServerSession(authOptions as any);
}

export async function getCurrentUser() {
  try {
    const session = await getSession();
    
    if (!session?.user?.email) {
      return null;
    }
    
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });
    
    if (!currentUser) {
      return null;
    }
    
    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function resetPassword(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("ไม่พบผู้ใช้งานด้วยอีเมลนี้");
    }

    // ใช้ฟังก์ชัน generateToken แทนการสร้าง token เอง
    const token = await generateToken(user.id, TokenType.RESET_PASSWORD, 1); // 1 ชั่วโมง
    
    return token;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
}

// ฟังก์ชันสร้าง token สำหรับการยืนยันอีเมล
export async function generateToken(userId: string, type: TokenType, expiresIn: number = 24) {
  // ลบ token เก่าที่ยังมีอยู่สำหรับผู้ใช้นี้และประเภทเดียวกัน
  await prisma.token.deleteMany({
    where: {
      userId,
      type
    }
  });
  
  // สร้าง token ใหม่
  const token = crypto.randomBytes(32).toString('hex');
  
  // คำนวณเวลาหมดอายุ (ชั่วโมง)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresIn);
  
  // บันทึก token ลงฐานข้อมูล
  const savedToken = await prisma.token.create({
    data: {
      id: uuidv4(),
      token,
      type,
      expiresAt,
      user: {
        connect: {
          id: userId
        }
      }
    }
  });
  
  return savedToken;
}

// ฟังก์ชันลงทะเบียนผู้ใช้ใหม่
export async function registerUser(
  params: { email: string; password: string; fullname?: string } | string,
  password?: string,
  fullname?: string
) {
  // รองรับทั้งการเรียกแบบเก่า registerUser(email, password, fullname)
  // และแบบใหม่ registerUser({email, password, fullname})
  let email: string;
  
  if (typeof params === 'object') {
    email = params.email;
    password = params.password;
    fullname = params.fullname;
  } else {
    email = params;
    // password และ fullname จะเป็นตามที่ส่งมาในพารามิเตอร์ที่ 2 และ 3
  }
  
  // ตรวจสอบว่ามีผู้ใช้ที่ใช้อีเมลนี้อยู่แล้วหรือไม่
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  
  if (existingUser) {
    throw new Error("อีเมลนี้ถูกใช้งานแล้ว");
  }
  
  // เข้ารหัสพาสเวิร์ด
  const hashedPassword = await bcrypt.hash(password as string, 10);
  
  // สร้างผู้ใช้ใหม่
  const user = await prisma.user.create({
    data: {
      id: uuidv4(),
      email,
      name: fullname,
      password: hashedPassword,
      emailVerified: false, // กำหนดเป็น false ตามที่กำหนดใน schema
    }
  });
  
  // สร้าง token สำหรับการยืนยันอีเมล
  const verificationToken = await generateToken(user.id, TokenType.EMAIL_VERIFICATION);
  
  // ส่งอีเมล แต่จัดการกรณีส่งไม่สำเร็จ
  try {
    const emailResult = await sendVerificationEmail(
      user.email,
      user.name || email.split('@')[0],
      verificationToken.token
    );
    
    if (!emailResult.success) {
      console.error('ไม่สามารถส่งอีเมลได้:', emailResult.error);
      // แต่ยังคงสร้างบัญชีผู้ใช้ได้
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการส่งอีเมล:', error);
    // แต่ยังคงดำเนินการต่อและคืนค่า user
  }
  
  return { user, token: verificationToken };
}

// ฟังก์ชันร้องขอ token ใหม่สำหรับการยืนยันอีเมล
export async function resendVerificationEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      throw new Error("ไม่พบผู้ใช้ที่มีอีเมลนี้");
    }
    
    if (user.emailVerified) {
      throw new Error("อีเมลนี้ได้รับการยืนยันแล้ว");
    }
    
    // สร้าง token ใหม่
    const verificationToken = await generateToken(user.id, TokenType.EMAIL_VERIFICATION);
    
    // ส่งอีเมลยืนยันและตรวจสอบผลลัพธ์
    const emailResult = await sendVerificationEmail(
      user.email, 
      user.name || email.split('@')[0], 
      verificationToken.token
    );
    
    if (!emailResult.success) {
      console.error('ไม่สามารถส่งอีเมลได้:', emailResult.error);
      throw new Error('ไม่สามารถส่งอีเมลยืนยันได้ กรุณาลองอีกครั้งในภายหลัง');
    }
    
    return { success: true, token: verificationToken };
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการส่งอีเมลยืนยันใหม่:', error);
    throw error;
  }
} 