"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ProfileOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // ลบ Token หรือข้อมูลผู้ใช้ (ถ้ามี)
    // localStorage.removeItem("token");

    // เปลี่ยนไปที่หน้า login.tsx
    router.push("/login");
  };

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      {/* Profile Circle */}
      <div
        className="relative w-16 h-16 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="absolute w-16 h-16 rounded-full border border-black bg-gradient-to-b from-red-500 to-black"></div>
        <img
          src="images/User.png"
          alt="User"
          className="absolute w-8 h-8 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Overlay Profile */}
      {isOpen && (
        <div className="absolute left-20 top-1/2 -translate-y-1/2 w-[270px] h-[400px] bg-white shadow-xl rounded-2xl p-4 z-50">
            {/* Header */}
            <div className="relative w-full h-[116px] rounded-t-2xl bg-gradient-to-b from-red-700 to-black">
                <div className="absolute w-full h-[20px] bottom-0 bg-black rounded-b-2xl"></div>
                <img
                src="images/kavah.jpg"
                alt="Profile"
                className="absolute left-1/2 top-[50px] -translate-x-1/2 w-[100px] h-[100px] rounded-full border-2 border-white"
                />
            </div>

            {/* Name & Info */}
            <div className="mt-[60px] text-center">
                <p className="text-black font-bold text-lg">Liam Anderson</p>
                <p className="text-gray-500 text-xs">12 Jan 1995</p>
            </div>

            {/* Contact Info */}
            <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                <img src="images/FacebookF.png" alt="Facebook" className="w-4 h-4" />
                <p className="text-sm text-gray-600">Liam Anderson</p>
                </div>
                <div className="flex items-center space-x-2">
                <img src="images/Envelope.png" alt="Email" className="w-4 h-4" />
                <p className="text-sm text-gray-600">Liam_Anderson@asd.gu</p>
                </div>
                <div className="flex items-center space-x-2">
                <img src="images/phone.png" alt="Phone" className="w-4 h-4" />
                <p className="text-sm text-gray-600">076-765-8787</p>
                </div>
            </div>

            {/* Logout Button */}
            <button className="mt-4 w-full py-2 bg-red-700 text-white rounded-full" onClick={handleLogout}>
                Log Out
            </button>
        </div>
      )}
    </div>
  );
};

export default ProfileOverlay;