"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ถ้าไม่มีการล็อกอินและโหลดเสร็จแล้ว ให้เปลี่ยนเส้นทางไปยังหน้าล็อกอิน
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/dashboard");
    } else if (status === "authenticated") {
      setLoading(false);
    }
  }, [status, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-lg text-center w-full max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">กำลังโหลด...</h2>
          <p className="text-gray-600">กรุณารอสักครู่</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">แดชบอร์ด</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-primary">ยินดีต้อนรับ {session?.user?.name || 'ผู้ใช้'}</h2>
          <p className="text-gray-600 mb-4">
            ขณะนี้หน้าแดชบอร์ดอยู่ในระหว่างการพัฒนา กรุณากลับมาตรวจสอบในภายหลัง
          </p>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 font-medium">
              <span className="font-bold">หมายเหตุ:</span> เราจะเพิ่มฟีเจอร์ใหม่ๆ เร็วๆ นี้
            </p>
          </div>
        </div>
        
        {/* สถานะผู้ใช้ */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">ข้อมูลบัญชีของคุณ</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">อีเมล</p>
              <p className="font-medium">{session?.user?.email || 'ไม่มีข้อมูล'}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">สถานะ</p>
              <p className="font-medium">ผู้ใช้ทั่วไป</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 