"use client";
import { useState, useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import "../../app/Style/login.css"; // นำเข้าไฟล์ CSS
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/";
  const error = searchParams?.get("error");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: ""
  });
  
  const [loading, setLoading] = useState(false);

  // แสดงข้อความข้อผิดพลาดตาม URL parameter
  useEffect(() => {
    if (error === "email-not-verified") {
      toast.error('กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ');
    } else if (error) {
      toast.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    }
  }, [error]);

  // ตรวจสอบความถูกต้องของข้อมูล
  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };
    
    // ตรวจสอบอีเมล
    if (!formData.email) {
      newErrors.email = "กรุณากรอกอีเมล";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "กรุณากรอกอีเมลให้ถูกต้อง";
      isValid = false;
    }
    
    // ตรวจสอบรหัสผ่าน
    if (!formData.password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
      isValid = false;
    }
    
    setValidationErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ตรวจสอบความถูกต้องของข้อมูลก่อนส่ง
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const response = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });
      
      if (response?.error) {
        console.log("Login error:", response.error);
        
        if (response.error === "email-not-verified") {
          toast.error('กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ');
          router.push('/verification?email=' + encodeURIComponent(formData.email));
          return;
        }
        
        // แสดงข้อความแจ้งเตือนที่เหมาะสมตามประเภทข้อผิดพลาด
        if (response.error === "CredentialsSignin") {
          toast.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        } else {
          toast.error('ล็อกอินล้มเหลว: ' + response.error);
        }
        
        // เพิ่ม toast อีกครั้งในกรณีที่ toast แรกไม่ทำงาน (workaround)
        setTimeout(() => {
          toast.error('กรุณาตรวจสอบข้อมูลการเข้าสู่ระบบของคุณอีกครั้ง');
        }, 100);
        
        return;
      }
      
      toast.success('ล็อกอินสำเร็จ! กำลังนำคุณไปยังหน้าหลัก...');
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการล็อกอิน:', error);
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      setLoading(true);
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error(`ล็อกอินด้วย ${provider} ล้มเหลว:`, error);
      toast.error(`ล็อกอินด้วย ${provider} ล้มเหลว`);
    } finally {
      setLoading(false);
    }
  };

  // อัพเดทฟอร์มข้อมูลและล้างข้อผิดพลาดเมื่อมีการเปลี่ยนแปลง
  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // ล้างข้อผิดพลาดเมื่อผู้ใช้พิมพ์
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // คอนฟิกแอนิเมชัน
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24, 
        delay: 0.2,
        staggerChildren: 0.07
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="welcome-section">
          <h1 className="font-aboreto font-bold text-white">5STAR</h1>
          <h2 className="font-aboreto font-bold text-white">RESTAURANT</h2>
          <p className="font-montserrat font-thin text-white">เข้าสู่ระบบเพื่อจองโต๊ะอาหารและสั่งอาหารออนไลน์</p>
        </div>
        <div className="login-section">
          <form onSubmit={handleSubmit}>
            <h2 className="text-32px font-montserrat text-white mb-4">เข้าสู่ระบบ</h2>
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="font-montserrat font-thin text-white">อีเมล</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="login-input font-montserrat"
                placeholder="name@example.com"
                required
              />
              {validationErrors.email && <p className="text-red-300 text-sm mt-1">{validationErrors.email}</p>}
            </div>
            {/* Password */}
            <div className="mb-6">
              <label htmlFor="password" className="font-montserrat font-thin text-white">รหัสผ่าน</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="login-input font-montserrat"
                placeholder="••••••••"
                required
              />
              {validationErrors.password && <p className="text-red-300 text-sm mt-1">{validationErrors.password}</p>}
            </div>
            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary"
                  />
                </div>
                <div className="ml-2 text-sm">
                  <label htmlFor="remember" className="font-montserrat font-thin text-white">จดจำฉัน</label>
                </div>
              </div>
              <Link href="/forgot-password" className="text-sm font-montserrat font-thin text-white hover:underline">ลืมรหัสผ่าน?</Link>
            </div>
            {/* Login button */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white font-montserrat py-2 px-4 rounded-md transition duration-300 ease-in-out mb-4"
            >
              เข้าสู่ระบบ
            </button>
          </form>
          {/* Or divider */}
          <div className="flex items-center mb-4">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 font-montserrat font-thin text-white">หรือ</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          {/* Google login button */}
          <button
            onClick={() => handleSocialLogin('google')}
            type="button"
            className="w-full flex items-center justify-center bg-white hover:bg-gray-100 text-gray-800 font-montserrat py-2 px-4 rounded-md transition duration-300 ease-in-out mb-4"
          >
            <svg width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
              <path d="M896 786h725q12 67 12 128 0 217-91 387.5t-259.5 266.5-386.5 96q-157 0-299-60.5t-245-163.5-163.5-245-60.5-299 60.5-299 163.5-245 245-163.5 299-60.5q300 0 515 201l-209 201q-123-119-306-119-129 0-238.5 65t-173.5 176.5-64 243.5 64 243.5 173.5 176.5 238.5 65q87 0 160-24t120-60 82-82 51.5-87 22.5-78h-436v-264z"></path>
            </svg>
            เข้าสู่ระบบด้วย Google
          </button>
          <p className="font-montserrat font-thin text-white text-center">
            ยังไม่มีบัญชีใช่ไหม? <Link href="/signup" className="underline font-normal">สมัครสมาชิก</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
