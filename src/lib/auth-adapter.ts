import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

/**
 * Custom adapter สำหรับ NextAuth ที่จัดการกับ emailVerified ให้เข้ากับโมเดลของเรา
 * adapter นี้จะตั้งค่า emailVerified เป็น true สำหรับผู้ใช้ที่เข้าสู่ระบบผ่าน OAuth
 */
export function CustomPrismaAdapter() {
  // สร้าง adapter ปกติก่อน
  const adapter = PrismaAdapter(prisma);

  // แทนที่ฟังก์ชั่น createUser เพื่อจัดการ emailVerified
  return {
    ...adapter,
    createUser: async (data) => {
      // OAuth providers (เช่น Google) จะมี emailVerified เป็น null
      // แต่เราต้องการให้เป็น true เพราะ provider ได้ยืนยันอีเมลแล้ว
      const isOAuthSignIn = !data.password;
      
      // สร้างผู้ใช้ใหม่โดยตั้งค่า emailVerified เป็น true ถ้าเป็นการลงชื่อเข้าใช้ด้วย OAuth
      const newUserData = {
        ...data,
        emailVerified: isOAuthSignIn ? true : data.emailVerified || false
      };
      
      return prisma.user.create({
        data: newUserData
      });
    },
    
    // อัปเดต linkAccount เพื่อตั้งค่า emailVerified เป็น true เมื่อผู้ใช้เชื่อมต่อบัญชีกับ OAuth
    linkAccount: async (data) => {
      // สร้าง account ตามปกติ
      const account = await prisma.account.create({
        data
      });
      
      // ถ้าเป็น OAuth provider เช่น Google, Facebook
      if (data.provider === "google" || data.provider === "facebook") {
        // อัปเดต emailVerified เป็น true
        await prisma.user.update({
          where: { id: data.userId },
          data: { emailVerified: true }
        });
      }
      
      return account;
    }
  };
} 