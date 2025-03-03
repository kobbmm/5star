import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * เพิ่ม type สำหรับ role ใน Session
   */
  interface Session {
    user: {
      id: string;
      role?: "USER" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "USER" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "USER" | "ADMIN";
  }
} 