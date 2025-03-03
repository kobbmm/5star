import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "แดชบอร์ด | Cloud & Crème",
  description: "จัดการบัญชีผู้ใช้และดูข้อมูลการสั่งซื้อของคุณ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#B91C1C",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </div>
  );
} 