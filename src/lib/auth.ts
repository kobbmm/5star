import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function getSession() {
  return await getServerSession(authOptions);
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

export async function registerUser(email: string, password: string, name?: string) {
  try {
    // ตรวจสอบว่ามีผู้ใช้งานด้วยอีเมลนี้อยู่แล้วหรือไม่
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new Error("อีเมลนี้มีผู้ใช้งานแล้ว");
    }

    // เข้ารหัสพาสเวิร์ด
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่
    const newUser = await prisma.user.create({
      data: {
        id: uuidv4(),
        email,
        password: hashedPassword,
        name: name || null,
      },
    });

    // สร้าง token สำหรับการยืนยันอีเมล
    const token = await prisma.token.create({
      data: {
        id: uuidv4(),
        type: "EMAIL_VERIFICATION",
        token: uuidv4(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 ชั่วโมง
        userId: newUser.id,
      },
    });

    return { user: newUser, token };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
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

    // ลบโทเคนรีเซ็ตรหัสผ่านเก่า (ถ้ามี)
    await prisma.token.deleteMany({
      where: {
        userId: user.id,
        type: "RESET_PASSWORD",
      },
    });

    // สร้างโทเคนใหม่สำหรับรีเซ็ตรหัสผ่าน
    const token = await prisma.token.create({
      data: {
        id: uuidv4(),
        type: "RESET_PASSWORD",
        token: uuidv4(),
        expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 ชั่วโมง
        userId: user.id,
      },
    });

    return token;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
} 