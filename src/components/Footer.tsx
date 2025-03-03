import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter, FaLine } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-red-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* คอลัมน์ 1: เกี่ยวกับเรา */}
          <div>
            <h3 className="text-xl font-bold mb-4">Cloud & Crème</h3>
            <p className="text-gray-300 mb-4">
              ร้านขนมหวานพรีเมียมที่คัดสรรวัตถุดิบคุณภาพเยี่ยม
              เพื่อมอบประสบการณ์ความอร่อยที่เหนือระดับ
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-white hover:text-yellow-300 transition">
                <FaFacebook size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-white hover:text-yellow-300 transition">
                <FaInstagram size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="text-white hover:text-yellow-300 transition">
                <FaTwitter size={24} />
              </a>
              <a href="https://line.me" target="_blank" rel="noreferrer" aria-label="Line" className="text-white hover:text-yellow-300 transition">
                <FaLine size={24} />
              </a>
            </div>
          </div>

          {/* คอลัมน์ 2: ลิงก์ที่มีประโยชน์ */}
          <div>
            <h3 className="text-xl font-bold mb-4">ลิงก์ที่มีประโยชน์</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-yellow-300 transition">หน้าหลัก</Link>
              </li>
              <li>
                <Link href="/#about" className="text-gray-300 hover:text-yellow-300 transition">เกี่ยวกับเรา</Link>
              </li>
              <li>
                <Link href="/#menu" className="text-gray-300 hover:text-yellow-300 transition">เมนู</Link>
              </li>
              <li>
                <Link href="/#reservation" className="text-gray-300 hover:text-yellow-300 transition">จองโต๊ะ</Link>
              </li>
              <li>
                <Link href="/#reviews" className="text-gray-300 hover:text-yellow-300 transition">รีวิว</Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-300 hover:text-yellow-300 transition">ติดต่อเรา</Link>
              </li>
            </ul>
          </div>

          {/* คอลัมน์ 3: ข้อมูลติดต่อ */}
          <div>
            <h3 className="text-xl font-bold mb-4">ติดต่อเรา</h3>
            <address className="not-italic text-gray-300 space-y-2">
              <p>123 ถนนสุขุมวิท</p>
              <p>แขวงคลองตัน เขตคลองเตย</p>
              <p>กรุงเทพฯ 10110</p>
              <p className="mt-2">โทร: 02-XXX-XXXX</p>
              <p>อีเมล: info@cloudandcreme.com</p>
            </address>
          </div>

          {/* คอลัมน์ 4: เวลาทำการ */}
          <div>
            <h3 className="text-xl font-bold mb-4">เวลาทำการ</h3>
            <ul className="text-gray-300 space-y-1">
              <li>จันทร์: ปิด</li>
              <li>อังคาร - ศุกร์: 16:00 - 20:00</li>
              <li>เสาร์ - อาทิตย์: 17:00 - 23:00</li>
            </ul>
          </div>
        </div>

        {/* ส่วนล่างของ Footer */}
        <div className="border-t border-red-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300">
              &copy; {currentYear} Cloud & Crème. สงวนลิขสิทธิ์.
            </p>
            <div className="mt-4 md:mt-0 space-x-4 text-sm text-gray-300">
              <Link href="/privacy-policy" className="hover:text-yellow-300 transition">
                นโยบายความเป็นส่วนตัว
              </Link>
              <span>|</span>
              <Link href="/terms-of-service" className="hover:text-yellow-300 transition">
                เงื่อนไขการใช้บริการ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 