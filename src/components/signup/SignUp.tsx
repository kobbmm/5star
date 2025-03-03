"use client";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import "../../app/Style/signup.css"; // นำเข้าไฟล์ CSS
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

type FormData = {
  fullname: string;
  email: string;
  password: string;
};

type ValidationErrors = {
  fullname: string;
  email: string;
  password: string;
};

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    email: "",
    password: "",
  });
  
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    fullname: "",
    email: "",
    password: "",
  });
  
  const [loading, setLoading] = useState(false);

  // ตรวจสอบความถูกต้องของข้อมูล
  const validateForm = () => {
    let isValid = true;
    const newErrors: ValidationErrors = { fullname: "", email: "", password: "" };
    
    // ตรวจสอบชื่อผู้ใช้
    if (!formData.fullname.trim()) {
      newErrors.fullname = "กรุณากรอกชื่อผู้ใช้";
      isValid = false;
    } else if (formData.fullname.trim().length < 3) {
      newErrors.fullname = "ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร";
      isValid = false;
    }
    
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
    } else if (formData.password.length < 8) {
      newErrors.password = "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร";
      isValid = false;
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "รหัสผ่านต้องประกอบด้วยตัวอักษรและตัวเลข";
      isValid = false;
    }
    
    setValidationErrors(newErrors);
    return isValid;
  };

  // อัพเดทฟอร์มข้อมูลและล้างข้อผิดพลาดเมื่อมีการเปลี่ยนแปลง
  const handleInputChange = (field: keyof FormData, value: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ตรวจสอบความถูกต้องของข้อมูลก่อนส่ง
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // เรียก API เพื่อลงทะเบียน
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullname,
          email: formData.email,
          password: formData.password,
        }),
      });
      
      let data;
      try {
        // ตรวจสอบว่ามี content หรือไม่ก่อนเรียก json()
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          data = await response.json();
        } else {
          // ถ้าไม่ใช่ JSON ให้ใช้ข้อความ text จาก response
          const text = await response.text();
          throw new Error(text || 'การลงทะเบียนล้มเหลว (ไม่ได้รับ JSON response)');
        }
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        throw new Error('เกิดข้อผิดพลาดในการประมวลผลข้อมูลจากเซิร์ฟเวอร์');
      }
      
      if (!response.ok) {
        // แสดงข้อความข้อผิดพลาดที่เฉพาะเจาะจง
        if (data?.message?.includes('email already exists')) {
          setValidationErrors(prev => ({ ...prev, email: 'อีเมลนี้ถูกใช้งานแล้ว' }));
          throw new Error('อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น');
        }
        throw new Error(data?.message || 'การลงทะเบียนล้มเหลว');
      }
      
      toast.success('ลงทะเบียนสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีของคุณ');
      router.push('/verification?email=' + encodeURIComponent(formData.email));
      
    } catch (error: any) {
      console.error('เกิดข้อผิดพลาดในการลงทะเบียน:', error);
      toast.error(error.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
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
    <div className="signup-page">
      <div className="signup-container">
        <div className="welcome-section">
          <h1 className="font-aboreto font-bold text-white">5STAR</h1>
          <h2 className="font-aboreto font-bold text-white">RESTAURANT</h2>
          <p className="font-montserrat font-thin text-white">สมัครสมาชิกเพื่อจองโต๊ะอาหารและสั่งอาหารออนไลน์</p>
        </div>
        <div className="SignUp-section">
          <form onSubmit={handleSubmit}>
            <h2 className="text-32px font-montserrat text-white mb-4">สมัครสมาชิก</h2>
            {/* ชื่อ */}
            <div className="mb-4">
              <label htmlFor="fullname" className="font-montserrat font-thin text-white">ชื่อ-นามสกุล</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={(e) => handleInputChange('fullname', e.target.value)}
                className="login-input font-montserrat"
                placeholder="ชื่อ นามสกุล"
                required
              />
              {validationErrors.fullname && <p className="text-red-300 text-sm mt-1">{validationErrors.fullname}</p>}
            </div>
            {/* อีเมล */}
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
            {/* รหัสผ่าน */}
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
            {/* ปุ่มสมัครสมาชิก */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white font-montserrat py-2 px-4 rounded-md transition duration-300 ease-in-out mb-4"
            >
              สมัครสมาชิก
            </button>
          </form>
          {/* Or divider */}
          <div className="flex items-center mb-4">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 font-montserrat font-thin text-white">หรือ</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          {/* Google signup button */}
          <button
            onClick={() => handleSocialLogin('google')}
            type="button"
            className="w-full flex items-center justify-center bg-white hover:bg-gray-100 text-gray-800 font-montserrat py-2 px-4 rounded-md transition duration-300 ease-in-out mb-4"
          >
            <svg width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
              <path d="M896 786h725q12 67 12 128 0 217-91 387.5t-259.5 266.5-386.5 96q-157 0-299-60.5t-245-163.5-163.5-245-60.5-299 60.5-299 163.5-245 245-163.5 299-60.5q300 0 515 201l-209 201q-123-119-306-119-129 0-238.5 65t-173.5 176.5-64 243.5 64 243.5 173.5 176.5 238.5 65q87 0 160-24t120-60 82-82 51.5-87 22.5-78h-436v-264z"></path>
            </svg>
            สมัครสมาชิกด้วย Google
          </button>
          <p className="font-montserrat font-thin text-white text-center">
            มีบัญชีอยู่แล้วใช่ไหม? <Link href="/login" className="underline font-normal">เข้าสู่ระบบ</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
