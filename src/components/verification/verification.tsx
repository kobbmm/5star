"use client";

import { useState } from "react";
import "@/app/Style/verification.css"; // นำเข้าไฟล์ CSS

export default function VerificationCode() {
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Verification Code:", code);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      {/* กล่องที่ 1: Welcome Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 text-center w-full max-w-md welcome-section">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to</h1>
        <h2 className="text-4xl font-bold text-primary">CLOUD & CRÈME</h2>
        <p className="mt-2 text-secondary">
          Your favourite foods delivered fast at your door.
        </p>
      </div>

      {/* กล่องที่ 2: Verification Code Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 mt-6 w-full max-w-md verification-section">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Verification Code</h2>
        <p className="text-center text-gray-600 mt-2">
          Please type the verification code sent to 
          <span className="font-semibold text-indigo-600"> prelookstudio@gmail.com</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="code" className="block text-gray-700 mb-1">
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

        <p className="text-center text-gray-600 mt-4">
          I don't receive a code?{" "}
          <a href="#" className="text-indigo-600 font-medium hover:underline">
            Please resend
          </a>
        </p>
      </div>
    </div>
  );
}
