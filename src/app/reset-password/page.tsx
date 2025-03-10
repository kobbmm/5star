"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

// แยก component ที่ใช้ useSearchParams ออกมา
function SearchParamsWrapper({ children }: { children: (token: string | null) => React.ReactNode }) {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  return <>{children(token)}</>;
}

// Component ที่ไม่ใช้ useSearchParams โดยตรง
function ResetPasswordForm({ token }: { token: string | null }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // ตรวจสอบว่ามี token หรือไม่
  useEffect(() => {
    if (!token) {
      toast.error("ไม่พบโทเค็นสำหรับรีเซ็ตรหัสผ่าน");
      router.push("/forgot-password");
    }
  }, [token, router]);
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // ตรวจสอบความถูกต้องของข้อมูล
    if (!password || !confirmPassword) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    
    if (password.length < 8) {
      toast.error("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน");
      }
      
      setIsSuccess(true);
      toast.success(data.message || "รีเซ็ตรหัสผ่านสำเร็จ");
      
    } catch (error: any) {
      console.error('เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน:', error);
      toast.error(error.message || "เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน");
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {!isSuccess ? (
          <>
            <h1 className="mb-4 text-2xl font-bold text-center text-gray-800">ตั้งรหัสผ่านใหม่</h1>
            <p className="mb-6 text-sm text-center text-gray-600">
              กรุณากำหนดรหัสผ่านใหม่ของคุณ
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                  รหัสผ่านใหม่
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#AB3434]"
                  disabled={isSubmitting}
                  required
                  placeholder="รหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)"
                  minLength={8}
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
                  ยืนยันรหัสผ่านใหม่
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#AB3434]"
                  disabled={isSubmitting}
                  required
                  placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                  minLength={8}
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 font-medium text-white transition-colors rounded-md ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#AB3434] hover:bg-[#922B2B]"
                }`}
              >
                {isSubmitting ? "กำลังดำเนินการ..." : "ตั้งรหัสผ่านใหม่"}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <h1 className="mb-4 text-2xl font-bold text-center text-gray-800">รีเซ็ตรหัสผ่านสำเร็จ</h1>
            <p className="mb-6 text-sm text-center text-gray-600">
              คุณได้ทำการตั้งรหัสผ่านใหม่เรียบร้อยแล้ว สามารถเข้าสู่ระบบได้ทันที
            </p>
            <Link 
              href="/login" 
              className="block w-full py-2 font-medium text-center text-white transition-colors rounded-md bg-[#AB3434] hover:bg-[#922B2B]"
            >
              ไปที่หน้าเข้าสู่ระบบ
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

// หน้าหลักที่ใช้ Suspense ครอบ SearchParamsWrapper
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 className="mb-4 text-2xl font-bold text-center text-gray-800">กำลังโหลด...</h1>
          <div className="flex justify-center my-8">
            <div className="w-12 h-12 border-4 border-t-[#AB3434] rounded-full animate-spin"></div>
          </div>
          <p className="text-center text-gray-600">กำลังตรวจสอบโทเค็นรีเซ็ตรหัสผ่าน...</p>
        </div>
      </div>
    }>
      <SearchParamsWrapper>
        {(token) => <ResetPasswordForm token={token} />}
      </SearchParamsWrapper>
    </Suspense>
  );
} 