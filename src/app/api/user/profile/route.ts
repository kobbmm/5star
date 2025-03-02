import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// GET - ดึงข้อมูลโปรไฟล์ของผู้ใช้ที่ล็อกอินอยู่
export async function GET() {
  try {
    // ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { 
          data: null, 
          status: 401, 
          message: "กรุณาเข้าสู่ระบบ" 
        }, 
        { status: 401 }
      );
    }

    // สร้างข้อมูลที่จะส่งกลับ (ไม่รวมข้อมูลที่เป็นความลับ เช่น รหัสผ่าน)
    const userData = {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      image: currentUser.image,
      emailVerified: currentUser.emailVerified,
      createdAt: currentUser.createdAt,
      updatedAt: currentUser.updatedAt
    };

    return NextResponse.json({
      data: userData,
      status: 200,
      message: "ดึงข้อมูลผู้ใช้สำเร็จ"
    });
    
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { 
        data: null, 
        status: 500, 
        message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" 
      }, 
      { status: 500 }
    );
  }
} 