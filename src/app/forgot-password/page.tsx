"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email) {
      toast.error("กรุณาระบุอีเมล");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok && data.message) {
        throw new Error(data.message);
      }
      
      setIsSubmitted(true);
      toast.success(data.message || "เราได้ส่งอีเมลรีเซ็ตรหัสผ่านไปยังที่อยู่อีเมลของคุณแล้ว");
      
    } catch (error: any) {
      console.error('เกิดข้อผิดพลาดในการขอรีเซ็ตรหัสผ่าน:', error);
      toast.error(error.message || "เกิดข้อผิดพลาดในการขอรีเซ็ตรหัสผ่าน");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {!isSubmitted ? (
          <>
            <h1 className="mb-4 text-2xl font-bold text-center text-gray-800">ลืมรหัสผ่าน</h1>
            <p className="mb-6 text-sm text-center text-gray-600">
              กรุณากรอกอีเมลของคุณ เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปให้คุณ
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                  อีเมล
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#AB3434]"
                  disabled={isSubmitting}
                  required
                  placeholder="example@domain.com"
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
                {isSubmitting ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
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
            <h1 className="mb-4 text-2xl font-bold text-center text-gray-800">ตรวจสอบอีเมลของคุณ</h1>
            <p className="mb-6 text-sm text-center text-gray-600">
              เราได้ส่งอีเมลพร้อมคำแนะนำในการรีเซ็ตรหัสผ่านไปยัง <strong>{email}</strong> โปรดตรวจสอบกล่องจดหมายของคุณ
            </p>
            <div className="p-4 mb-6 text-sm bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-700">
                <span className="mr-2">⚠️</span>
                ลิงก์รีเซ็ตรหัสผ่านจะมีอายุการใช้งาน 1 ชั่วโมง หากคุณไม่ได้รับอีเมล กรุณาตรวจสอบโฟลเดอร์สแปมหรือถังขยะของคุณ
              </p>
            </div>
          </>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            จำรหัสผ่านได้แล้ว?{" "}
            <Link href="/login" className="font-medium text-[#AB3434] hover:underline">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 