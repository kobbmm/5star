import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// เส้นทางที่ต้องการล็อกอินก่อนเข้าถึง
const protectedRoutes = ['/dashboard', '/profile', '/settings'];

// เส้นทางที่อนุญาตให้เข้าถึงได้เฉพาะเมื่อไม่ได้ล็อกอินเท่านั้น
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];

// เส้นทางที่จำกัดให้ Admin เท่านั้น
const adminRoutes = ['/admin', '/chart', '/api/chart'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // รับ token จาก JWT (session)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // ผู้ใช้ล็อกอินเมื่อมี token
  const isAuthenticated = !!token;
  
  // ตรวจสอบว่าผู้ใช้เป็น Admin หรือไม่
  const isAdmin = token?.role === "ADMIN";
  
  // ถ้าผู้ใช้พยายามเข้าถึงเส้นทางที่จำกัดให้ Admin เท่านั้น
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    // ถ้าไม่ได้ล็อกอิน
    if (!isAuthenticated) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    
    // ถ้าล็อกอินแล้วแต่ไม่ใช่ Admin
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // ถ้าผู้ใช้พยายามเข้าถึงเส้นทางที่ต้องการล็อกอิน แต่ยังไม่ได้ล็อกอิน
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }
  
  // ถ้าผู้ใช้ล็อกอินแล้วพยายามเข้าถึงเส้นทางสำหรับผู้ไม่ได้ล็อกอินเท่านั้น
  if (authRoutes.some(route => pathname.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// เฉพาะเส้นทางที่ต้องการตรวจสอบ middleware เท่านั้น
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/admin/:path*',
    '/chart/:path*',
    '/api/chart/:path*'
  ]
}; 