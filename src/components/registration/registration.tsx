"use client";
import { useState } from "react";
import "../../app/Style/registration.css"; // นำเข้าไฟล์ CSS

const Registration: React.FC = () => {
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // การจัดการการส่งข้อมูล เช่น การยืนยันหมายเลขโทรศัพท์
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        {/* กล่องที่ 1: Welcome Section */}
        <div className="welcome-section">
          <h1 className="text-[64px] font-bold text-white">Welcome to</h1>
          <h2 className="text-[64px] font-bold text-primary">CLOUD & CRÈME</h2>
          <p className="mt-2 text-secondary">
            Your favourite foods delivered fast at your door.
          </p>
        </div>

        {/* กล่องที่ 2: Registration Section */}
        <div className="registration-section">
          <h2 className="text-white text-32px font-montserrat font-bold text-center">
            Registration
          </h2>
          <p className="mt-4 text-secondary font-normal text-sm">
            Enter your phone number to verify your account
          </p>

          <form onSubmit={handleSubmit} className="registration-form">
            <div className="mb-4">
              <label htmlFor="phone" className="block text-white mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-white font-bold bg-[#AB3434] hover:bg-[#922B2B] transition mt-4"
            >
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
