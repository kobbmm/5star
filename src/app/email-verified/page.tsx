"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function EmailVerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("กำลังตรวจสอบการยืนยันอีเมลของคุณ...");
  const token = searchParams?.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("ไม่พบโทเค็นยืนยัน กรุณาตรวจสอบลิงก์ในอีเมลของคุณอีกครั้ง");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "ยืนยันอีเมลสำเร็จ! คุณสามารถเข้าสู่ระบบได้แล้ว");
        } else {
          setStatus("error");
          setMessage(data.message || "เกิดข้อผิดพลาดในการยืนยันอีเมล กรุณาลองใหม่อีกครั้ง");
        }
      } catch (error) {
        console.error("Email verification error:", error);
        setStatus("error");
        setMessage("เกิดข้อผิดพลาดในการยืนยันอีเมล กรุณาลองใหม่อีกครั้ง");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {status === "loading" && (
          <>
            <h1 className="mb-4 text-2xl font-bold text-center text-gray-800">กำลังตรวจสอบ</h1>
            <div className="flex justify-center my-8">
              <div className="w-12 h-12 border-4 border-t-[#AB3434] rounded-full animate-spin"></div>
            </div>
            <p className="text-center text-gray-600">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <h1 className="mb-4 text-2xl font-bold text-center text-gray-800">ยืนยันอีเมลสำเร็จ!</h1>
            <p className="mb-6 text-center text-gray-600">{message}</p>
            <Link 
              href="/login" 
              className="block w-full py-2 text-center font-medium text-white transition-colors bg-[#AB3434] hover:bg-[#922B2B] rounded-md"
            >
              เข้าสู่ระบบ
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>
            <h1 className="mb-4 text-2xl font-bold text-center text-gray-800">เกิดข้อผิดพลาด</h1>
            <p className="mb-6 text-center text-gray-600">{message}</p>
            <div className="flex flex-col space-y-3">
              <Link 
                href="/verification" 
                className="block w-full py-2 text-center font-medium text-white transition-colors bg-[#AB3434] hover:bg-[#922B2B] rounded-md"
              >
                ขอส่งลิงก์ยืนยันใหม่
              </Link>
              <Link 
                href="/login" 
                className="block w-full py-2 text-center font-medium text-gray-700 transition-colors bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                กลับไปยังหน้าเข้าสู่ระบบ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function EmailVerifiedPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 className="mb-4 text-2xl font-bold text-center text-gray-800">กำลังโหลด...</h1>
          <div className="flex justify-center my-8">
            <div className="w-12 h-12 border-4 border-t-[#AB3434] rounded-full animate-spin"></div>
          </div>
          <p className="text-center text-gray-600">กำลังตรวจสอบการยืนยันอีเมลของคุณ...</p>
        </div>
      </div>
    }>
      <EmailVerificationContent />
    </Suspense>
  );
} 