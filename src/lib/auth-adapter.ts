import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import type { Adapter } from "next-auth/adapters";
import type { Awaitable } from "next-auth";

/**
 * Custom adapter สำหรับ NextAuth ที่จัดการกับ emailVerified ให้เข้ากับโมเดลของเรา
 * adapter นี้จะตั้งค่า emailVerified เป็น true สำหรับผู้ใช้ที่เข้าสู่ระบบผ่าน OAuth
 */
export function CustomPrismaAdapter(): Adapter {
  // สร้าง adapter ปกติก่อน
  const originalAdapter = PrismaAdapter(prisma);
  
  // ใช้ as unknown as Adapter เพื่อแก้ไขปัญหา TypeScript
  return {
    ...originalAdapter,
    createUser: async (userData) => {
      // OAuth providers (เช่น Google) จะมี emailVerified เป็น null
      // แต่เราต้องการให้เป็น true เพราะ provider ได้ยืนยันอีเมลแล้ว
      const isOAuthSignIn = !userData.password;
      
      // สร้างผู้ใช้ใหม่โดยตั้งค่า emailVerified เป็น true ถ้าเป็นการลงชื่อเข้าใช้ด้วย OAuth
      // และตั้งค่า image เป็น null เพื่อไม่ใช้รูปภาพจาก provider
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email!,
          emailVerified: isOAuthSignIn ? true : false,
          image: null // ยกเลิกการใช้รูปภาพจาก provider
        }
      });
      
      // แปลงข้อมูลให้ตรงกับที่ NextAuth คาดหวัง
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified ? new Date() : null,
        image: user.image
      };
    },
    
    // อัปเดต linkAccount เพื่อตั้งค่า emailVerified เป็น true เมื่อผู้ใช้เชื่อมต่อบัญชีกับ OAuth
    linkAccount: async (data) => {
      // สร้าง account ตามปกติ
      const account = await prisma.account.create({
        data
      });
      
      // ถ้าเป็น OAuth provider เช่น Google, Facebook
      if (data.provider === "google" || data.provider === "facebook") {
        // อัปเดต emailVerified เป็น true และตั้งค่า image เป็น null
        await prisma.user.update({
          where: { id: data.userId },
          data: { 
            emailVerified: true,
            image: null // ยกเลิกการใช้รูปภาพจาก provider
          }
        });
      }
      
      return account;
    }
  } as unknown as Adapter;
} 