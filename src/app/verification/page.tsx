"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function VerificationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams?.get("email") || "";
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  async function handleResendVerification() {
    if (countdown > 0) return;
    
    if (!email) {
      toast.error("ไม่พบอีเมล กรุณาลงทะเบียนใหม่");
      router.push("/signup");
      return;
    }
    
    try {
      setIsResending(true);
      
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'การขอส่งอีเมลยืนยันใหม่ล้มเหลว');
      }
      
      toast.success(data.message || 'ส่งอีเมลยืนยันใหม่เรียบร้อยแล้ว');
      setCountdown(60); // ตั้งเวลาถอยหลัง 60 วินาที
      
    } catch (error: any) {
      console.error('เกิดข้อผิดพลาดในการขอส่งอีเมลยืนยันใหม่:', error);
      toast.error(error.message || 'เกิดข้อผิดพลาดในการขอส่งอีเมลยืนยันใหม่');
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-center text-gray-800">ยืนยันอีเมลของคุณ</h1>
        
        <div className="p-4 mb-6 text-sm bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="mb-2 font-medium text-yellow-800">
            <span className="mr-2">⚠️</span>
            จำเป็นต้องยืนยันอีเมล
          </p>
          <p className="text-yellow-700">
            เราได้ส่งลิงก์ยืนยันไปยังอีเมล {email ? <strong>{email}</strong> : "ของคุณ"} แล้ว 
            กรุณาตรวจสอบกล่องจดหมายของคุณและคลิกที่ลิงก์เพื่อยืนยันบัญชีของคุณ
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="mb-2 text-lg font-medium text-gray-800">ไม่ได้รับอีเมล?</h2>
          <ul className="pl-5 mb-4 text-sm text-gray-600 list-disc">
            <li className="mb-1">ตรวจสอบโฟลเดอร์สแปมหรือถังขยะของคุณ</li>
            <li className="mb-1">ตรวจสอบว่าพิมพ์อีเมลถูกต้อง</li>
            <li>หากยังไม่ได้รับอีเมล คุณสามารถขอส่งใหม่ได้</li>
          </ul>
          
          <button
            onClick={handleResendVerification}
            disabled={isResending || countdown > 0}
            className={`w-full py-2 font-medium text-white transition-colors rounded-md ${
              isResending || countdown > 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#AB3434] hover:bg-[#922B2B]"
            }`}
          >
            {isResending
              ? "กำลังส่งอีเมล..."
              : countdown > 0
              ? `ขอส่งใหม่อีกครั้งใน (${countdown}s)`
              : "ส่งอีเมลยืนยันใหม่"}
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            กลับไปที่{" "}
            <Link href="/login" className="font-medium text-[#AB3434] hover:underline">
              หน้าเข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 