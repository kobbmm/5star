import React, { useState } from "react";
import "../../app/Style/password.css"; // นำเข้าไฟล์ CSS

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // การจัดการการส่งข้อมูล เช่น การรีเซ็ตรหัสผ่าน
  };

  return (
    <div className="reset-password-container">
      {/* กล่องที่ 1: Welcome Section */}
      <div className="welcome-section">
        <h1 className="text-[64px] font-bold text-white">Welcome to</h1>
        <h2 className="text-[64px] font-bold text-primary">CLOUD & CRÈME</h2>
        <p className="mt-2 text-secondary">Your favourite foods delivered fast at your door.</p>
      </div>

      {/* กล่องที่ 2: Reset Password Section */}
      <div className="reset-password-section">
        <h2 className="text-[32px] font-bold text-primary">Reset Password</h2>
        <p className="mt-4 text-secondary">Please enter your email address to request a password reset</p>

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            SEND NEW PASSWORD
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
