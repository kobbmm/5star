"use client";
import { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import "../../app/Style/login.css"; // นำเข้าไฟล์ CSS


export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        {/* กล่องที่ 1: Welcome Section */}
        <div className="bg-white p-6 text-center w-full max-w-md welcome-section">
          <h1 className="text-white text-[64px] font-montserrat font-bold text-left">Welcome to</h1>
          <h2 className="text-primary text-[64px] font-aboreto font-normal text-left">CLOUD & CRÈME</h2>
          <p className="text-secondary text-[24px] font-montserrat font-normal text-left">Your favourite foods delivered fast at your door.</p>
        </div>
        </div>



      {/* กล่องที่ 2: Login Section */}
      <div className="bg-white p-6 mt-6 w-full max-w-md login-section">
        <h2 className="text-white text-32px font-montserrat font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="email" className="block text-white mb-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className="login-input"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-white mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="login-input"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <div className="text-right">
            <a href="#" className="block text-white mb-1 text-center">
              Forgot Password?
            </a>
          </div>

          <button type="submit" 
          className="flex items-center justify-center gap-2 w-full py-2 border rounded-lg text-white font-bold bg-[#AB3434] hover:bg-[#922B2B] transition mt-4">
            LOGIN
          </button>
        </form>

        <p className="text-white font-normal text-sm mt-4 text-center">
          Don't have an account?{" "}
          <a href="#" className=" text-primary text-thin hover:underline ml-1">
            Sign Up
          </a>
        </p>



        <div className="text-center text-white mt-4">Sign up with</div>

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
      </div>
    </div>
  );
}
