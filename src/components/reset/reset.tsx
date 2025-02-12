"use client";
import { useState } from "react";
import "../../app/Style/reset.css"; // นำเข้าไฟล์ CSS


const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // การจัดการการส่งข้อมูล เช่น การรีเซ็ตรหัสผ่าน
  };

  return (
    <div className="reset-page">
    <div className="reset-container">
      {/* กล่องที่ 1: Welcome Section */}
      <div className="reset-section">
        <h1 className="text-[64px] font-bold text-white">Welcome to</h1>
        <h2 className="text-[64px] font-bold text-primary">CLOUD & CRÈME</h2>
        <p className="mt-2 text-secondary">Your favourite foods delivered fast at your door.</p>
      </div>

      {/* กล่องที่ 2: Reset Password Section */}
      <div className="reset-password-section">
        <h2 className="text-white text-32px font-montserrat font-bold text-center">Reset Password</h2>
        <p className="mt-4 text-secondary font-normal text-sm mt-4">Please enter your email address to request a password reset</p>

        <form onSubmit={handleSubmit} className="reset-password-form">
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-white mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <button type="submit" 
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-white font-bold bg-[#AB3434] hover:bg-[#922B2B] transition mt-4">
            SEND NEW PASSWORD
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default ResetPassword;


