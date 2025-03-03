"use client";

import { useState } from "react";
import "@/app/Style/verification.css"; // นำเข้าไฟล์ CSS

export default function VerificationCode() {
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Verification Code:", code);
  };

  const handleResend = () => {
    console.log("Resending verification code");
    // ตรงนี้จะเป็นโค้ดสำหรับการส่งรหัสยืนยันใหม่
  };

  return (
    <div className="verification-page">
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      {/* กล่องที่ 1: Welcome Section */}
      <div className="bg-white p-6 text-center w-full max-w-md welcome-section">
          <h1 className="text-white text-[64px] font-montserrat font-bold text-left">Welcome to</h1>
          <h2 className="text-primary text-[64px] font-aboreto font-normal text-left">CLOUD & CRÈME</h2>
          <p className="text-secondary text-[24px] font-montserrat font-normal text-left">Your favourite foods delivered fast at your door.</p>
        </div>

      {/* กล่องที่ 2: Verification Code Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 mt-6 w-full max-w-md verification-section">
        <h2 className="text-white text-32px font-montserrat font-bold text-center">Verification Code</h2>
        <p className="text-secondary font-normal text-sm mt-4 text-left">
          Please type the verification code sent to 
          <span className="text-secondary font-normal text-sm mt-4 text-left"> prelookstudio@gmail.com</span>
        </p>  

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="code" className="block text-white mb-1">
              Enter Code
            </label>
            <input
              id="code"
              type="text"
              className="verification-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              maxLength={6}
            />
          </div>

          <button type="submit" className="verification-button">
            Verify
          </button>
        </form>

        <p className="text-secondary font-normal text-sm mt-4 text-left">
          I don&apos;t receive a code?{" "}
          <button 
            onClick={handleResend}
            className="text-secondary font-normal text-sm mt-4 text-left hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            Please resend
          </button>
        </p>
      </div>
    </div>
    </div>
  );
}
