import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import "../../app/Style/welcome.css"; 
import Link from "next/link";

const Welcome: React.FC = () => {
  return (
    <div className="welcome-page">
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        {/* กล่องที่ 1: Welcome Section */}
        <div className="bg-white p-6 text-center w-full max-w-md welcome-section">
          <h1 className="text-white text-[64px] font-montserrat font-bold text-left">Welcome to</h1>
          <h2 className="text-primary text-[64px] font-aboreto font-normal text-left">CLOUD & CRÈME</h2>
          <p className="text-secondary text-[24px] font-montserrat font-normal text-left">Your favourite foods delivered fast at your door.</p>
        </div>
        </div>
      {/* กล่องที่ 2: Sign-in Section */}
      <div className="bg-white p-6 mt-6 w-full max-w-md sign-in-section">
        <p className="text-white text-32px font-montserrat font-bold text-center">Sign in with</p>

        <div className="flex items-center gap-3 p-3 rounded-lg">
          {/* ปุ่ม Facebook */}
          <button className="flex items-center justify-center gap-2 w-full py-1 border rounded-lg text-white font-normal hover:bg-gray-200 transition">
            <FaFacebook size={17} />
            <span>Facebook</span>
          </button>

          {/* ปุ่ม Google */}
          <button className="flex items-center justify-center gap-2 w-full py-1 border rounded-lg shadow-lg text-white font-normal hover:bg-gray-200 transition">
            <FaGoogle size={17} />
            <span>Google</span>
          </button>
        </div>

        {/* ปุ่ม Start with email or phone */}
        <button className="flex items-center justify-center gap-2 w-full py-2 border rounded-lg text-white font-normal hover:bg-gray-200 transition mt-4">
          <span>Start with email or phone</span>
        </button>

        {/* ข้อความ Already have an account? */}
        <p className="text-white font-normal text-sm mt-4 text-center">
          Already have an account? 
          <Link href="/login" className="text-primary font-normal hover:underline ml-1">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Welcome;
