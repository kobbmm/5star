import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { prisma } from "./prisma";
import { CustomPrismaAdapter } from "./auth-adapter";

// แยกการตั้งค่า authOptions ออกมาเพื่อใช้ร่วมกันในหลายไฟล์
export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter(),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "อีเมล", type: "email" },
        password: { label: "รหัสผ่าน", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          return null;
        }
        
        // ตรวจสอบว่าผู้ใช้ยืนยันอีเมลแล้วหรือไม่
        if (!user.emailVerified) {
          throw new Error("email-not-verified");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: null
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: null,
          emailVerified: true,
          role: "USER" // ผู้ใช้ที่ล็อกอินด้วย Google จะได้สิทธิ์ USER เท่านั้น
        };
      }
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login", // จะใช้สำหรับแสดงข้อผิดพลาดการเข้าสู่ระบบ
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 วัน
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.picture = null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role;
        session.user.image = null;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
}; 