"use client";
import { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import "../../app/Style/login.css"; // นำเข้าไฟล์ CSS
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const response = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });
      
      if (response?.error) {
        toast.error('ล็อกอินล้มเหลว อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        return;
      }
      
      toast.success('ล็อกอินสำเร็จ!');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการล็อกอิน:', error);
      toast.error('เกิดข้อผิดพลาดในการล็อกอิน');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      setLoading(true);
      await signIn(provider, { callbackUrl: '/' });
    } catch (error) {
      console.error(`ล็อกอินด้วย ${provider} ล้มเหลว:`, error);
      toast.error(`ล็อกอินด้วย ${provider} ล้มเหลว`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
    <div className="flex flex-col items-center justify-center min-h-screen  px-6">
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <div className="text-right">
            <a href="/forgot-password" className="block text-white mb-1 text-center">
              Forgot Password?
            </a>
          </div>

          <button type="submit" 
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-white font-bold bg-[#AB3434] hover:bg-[#922B2B] transition mt-4"
          disabled={loading}>
            {loading ? 'กำลังทำงาน...' : 'LOGIN'}
          </button>
        </form>

        <p className="text-white font-normal text-sm mt-4 text-center">
          Don't have an account?{" "}
          <a href="/signup" className=" text-primary text-thin hover:underline ml-1">
            Sign Up
          </a>
        </p>

        <div className="text-center text-white mt-4">-----------Sign up with-----------</div>

        <div className="flex items-center gap-3 p-3 rounded-lg">
          {/* ปุ่ม Facebook */}
          <button 
            className="flex items-center justify-center gap-2 w-full py-1 border rounded-lg shadow-lg text-white font-normal hover:bg-gray-200 transition"
            onClick={() => handleSocialLogin('facebook')}
            disabled={loading}
          >
            <FaFacebook size={17} />
            <span>Facebook</span>
          </button>

          {/* ปุ่ม Google */}
          <button 
            className="flex items-center justify-center gap-2 w-full py-1 border rounded-lg shadow-lg text-white font-normal hover:bg-gray-200 transition"
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
          >
            <FaGoogle size={17} />
            <span>Google</span>
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
