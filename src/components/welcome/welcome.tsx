// filepath: /C:/Users/Topviewpoint/5star/src/components/welcome/welcome.tsx
import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "../../app/Style/welcome.css"; 

const Welcome: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      {/* กล่องที่ 1: Welcome Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 text-center w-full max-w-md welcome-section">
        <h1 className="text-[64px] font-bold text-white">Welcome to</h1>
        <h2 className="text-[64px] font-bold text-primary">CLOUD & CRÈME</h2>
        <p className="mt-2 text-secondary">Your favourite foods delivered fast at your door.</p>
      </div>

      {/* กล่องที่ 2: Sign-in Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 mt-6 w-full max-w-md sign-in-section">
        <p className="text-[64px] font-bold text-white">Sign in with</p>

        <div className="flex flex-col gap-3 mt-3">
          <button className="flex items-center justify-center gap-3 w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
            <FaFacebook size={20} />
            <span>Facebook</span>
          </button>

          <button className="flex items-center justify-center gap-3 w-full py-2 border rounded-lg text-gray-700 hover:bg-gray-200 transition">
            <FcGoogle size={20} />
            <span>Google</span>
          </button>
        </div>

        <p className="text-center text-gray-500 mt-4">or</p>

        <button className="w-full py-2 mt-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Start with email or phone
        </button>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="#" className="text-indigo-600 font-medium hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Welcome;