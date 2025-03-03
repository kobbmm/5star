"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const HeaderTop = () => {
  const { data: session } = useSession();
  // @ts-ignore - เรายังไม่ได้กำหนด type ของ role
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <nav className="bg-red-700 text-white fixed w-full h-16 flex items-center justify-between px-6 z-50">
      <div className="text-xl font-bold">Cloud & Crème</div>
      <ul className="flex space-x-6">
        <li>
          <Link href="#home" className="hover:text-yellow-400">Home</Link>
        </li>
        <li>
          <Link href="#about" className="hover:text-yellow-400">เกี่ยวกับเรา</Link>
        </li>
        <li>
          <Link href="#chef" className="hover:text-yellow-400">Chef</Link>
        </li>
        <li>
          <Link href="#menu" className="hover:text-yellow-400">Menu</Link>
        </li>
        <li>
          <Link href="#reservation" className="hover:text-yellow-400">จองโต๊ะ</Link>
        </li>
        <li>
          <Link href="#reviews" className="hover:text-yellow-400">Reviews</Link>
        </li>
        <li>
          <Link href="#contact" className="hover:text-yellow-400">Contact</Link>
        </li>
        {isAdmin && (
          <li>
            <Link href="/admin" className="bg-yellow-400 text-red-800 px-3 py-1 rounded font-medium hover:bg-yellow-300">
              Admin
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default HeaderTop;