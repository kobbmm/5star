"use client";

import { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "@/app/Style/login.css"; // นำเข้าไฟล์ CSS

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
      {/* กล่องที่ 1: Welcome Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 text-center w-full max-w-md welcome-section">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to</h1>
        <h2 className="text-4xl font-bold text-primary">CLOUD & CRÈME</h2>
        <p className="mt-2 text-secondary">
          Your favourite foods delivered fast at your door.
        </p>
      </div>

      {/* กล่องที่ 2: Login Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 mt-6 w-full max-w-md login-section">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-1">
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
            <label htmlFor="password" className="block text-gray-700 mb-1">
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
            <a href="#" className="text-indigo-600 text-sm hover:underline">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="login-button">
            LOGIN
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="#" className="text-indigo-600 font-medium hover:underline">
            Sign Up
          </a>
        </p>

        <div className="text-center text-gray-500 mt-4">Sign up with</div>

        <div className="flex flex-col gap-3 mt-3">
          <button className="social-button bg-blue-600 hover:bg-blue-700">
            <FaFacebook size={20} />
            <span>Facebook</span>
          </button>

          <button className="social-button border hover:bg-gray-200">
            <FcGoogle size={20} />
            <span>Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
