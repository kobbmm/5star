"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

// แยก component ที่ใช้ useSearchParams
function VerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams?.get("email") || "";
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!email) {
      router.push("/login");
    }
  }, [email, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  async function handleResendVerification() {
    if (countdown > 0) return;
    
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
        throw new Error(data.message || "ไม่สามารถส่งอีเมลยืนยันได้");
      }
      
      toast.success(data.message || "ส่งอีเมลยืนยันสำเร็จ กรุณาตรวจสอบกล่องข้อความของคุณ");
      
      // ตั้งเวลานับถอยหลัง 60 วินาที
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
      
    } catch (error: any) {
      console.error('เกิดข้อผิดพลาดในการส่งอีเมลยืนยัน:', error);
      toast.error(error.message || "เกิดข้อผิดพลาดในการส่งอีเมลยืนยัน");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-center text-gray-800">ยืนยันอีเมลของคุณ</h1>
        
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-gray-700">
            เราได้ส่งลิงก์ยืนยันไปยัง <span className="font-semibold">{email}</span> แล้ว กรุณาตรวจสอบกล่องข้อความและคลิกที่ลิงก์เพื่อยืนยันบัญชีของคุณ
          </p>
        </div>
        
        <p className="mb-6 text-sm text-center text-gray-600">
          ไม่ได้รับอีเมล? ตรวจสอบโฟลเดอร์สแปมของคุณ หรือคลิกด้านล่างเพื่อส่งใหม่
        </p>
        
        <div className="space-y-4">
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
              ? "กำลังส่ง..."
              : countdown > 0
              ? `ส่งใหม่อีกครั้งใน (${countdown}s)`
              : "ส่งลิงก์ยืนยันอีกครั้ง"}
          </button>
          
          <Link
            href="/login"
            className="block w-full py-2 text-center font-medium text-gray-700 transition-colors bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            กลับไปยังหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
}

// หน้าหลักที่ใช้ Suspense
export default function VerificationPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 className="mb-4 text-2xl font-bold text-center text-gray-800">กำลังโหลด...</h1>
          <div className="flex justify-center my-8">
            <div className="w-12 h-12 border-4 border-t-[#AB3434] rounded-full animate-spin"></div>
          </div>
          <p className="text-center text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    }>
      <VerificationContent />
    </Suspense>
  );
} 