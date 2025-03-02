"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  emailVerified: boolean;
  createdAt: string;
}

const ProfileOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // ดึงข้อมูลโปรไฟล์ผู้ใช้
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.email) return;
      
      try {
        setIsLoading(true);
        const response = await fetch('/api/user/profile');
        
        if (!response.ok) {
          throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
        }
        
        const data = await response.json();
        setUserProfile(data.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchUserProfile();
    }
  }, [session, isOpen]);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/login");
      toast.success('ออกจากระบบเรียบร้อย');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('เกิดข้อผิดพลาดในการออกจากระบบ');
    }
  };
  
  // ตัดคำที่ยาวเกินไป
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // ฟอร์แมตวันที่
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  // ใช้รูปโปรไฟล์จาก Google หรือรูปเริ่มต้น
  const profileImage = session?.user?.image || "/images/User.png";
  
  // ตรวจสอบว่ารูปโปรไฟล์มาจาก Google หรือไม่
  const isGoogleProfileImage = profileImage && profileImage.includes('googleusercontent.com');

  // แอนิเมชันสำหรับไอคอนโปรไฟล์
  const profileButtonVariants = {
    hover: { 
      scale: 1.1,
      boxShadow: "0px 0px 12px rgba(171, 52, 52, 0.7)",
      transition: { duration: 0.3 } 
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 } 
    }
  };

  // แอนิเมชันสำหรับป๊อปอัพโปรไฟล์
  const profileCardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24,
        duration: 0.4 
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { 
        duration: 0.2 
      } 
    }
  };

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      {/* Profile Circle */}
      <motion.div
        className="relative w-16 h-16 cursor-pointer rounded-full overflow-hidden border-2 border-red-700 bg-gradient-to-b from-red-500 to-black shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        variants={profileButtonVariants}
        whileHover="hover"
        whileTap="tap"
        initial={{ scale: 1 }}
      >
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <Image
            src={profileImage}
            alt="User"
            width={64}
            height={64}
            className="w-full h-full object-cover"
            priority
            unoptimized={profileImage.startsWith("http")}
          />
        </div>
      </motion.div>

      {/* Overlay Profile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 bg-white shadow-xl rounded-2xl overflow-hidden z-50"
            variants={profileCardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="relative w-full h-24 bg-gradient-to-b from-red-700 to-black">
              <div className="absolute w-full h-5 bottom-0 bg-black opacity-50"></div>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center -mt-12 mb-2">
              <div className="relative rounded-full overflow-hidden w-20 h-20 border-4 border-white shadow-md">
                <Image
                  src={profileImage}
                  alt="Profile"
                  fill
                  className="object-cover"
                  priority
                  unoptimized={profileImage.startsWith("http")}
                />
              </div>
            </div>

            {/* Name & Info */}
            <div className="text-center px-4 pb-2">
              <h3 className="text-gray-900 font-bold text-lg">
                {session?.user?.name || "ไม่ระบุชื่อ"}
              </h3>
              <p className="text-gray-500 text-xs">
                {isLoading ? "กำลังโหลด..." : userProfile ? 
                  `สมัครเมื่อ ${formatDate(userProfile.createdAt)}` : 
                  "ไม่มีข้อมูล"}
              </p>
            </div>

            {/* User Details */}
            <div className="px-4 space-y-2 mb-3">
              <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-7 h-7 bg-red-100 rounded-full flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-700">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3v-8.58a3 3 0 00-3-3h-15a3 3 0 00-3 3z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600 flex-1 break-words overflow-hidden">
                  {session?.user?.email || "ไม่มีอีเมล"}
                </p>
              </div>
              
              <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-7 h-7 bg-green-100 rounded-full flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-700">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600">
                  {isLoading ? "กำลังตรวจสอบ..." : 
                  userProfile?.emailVerified ? "ยืนยันอีเมลแล้ว" : "ยังไม่ยืนยันอีเมล"}
                </p>
              </div>
              
              <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-700">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600">
                  ID: {truncateText(userProfile?.id || "ไม่มีข้อมูล", 10)}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <div className="px-4 pb-4">
              <button 
                className="w-full py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition shadow-md flex items-center justify-center gap-1"
                onClick={handleLogout}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">ออกจากระบบ</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileOverlay;