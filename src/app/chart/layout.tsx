import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "แผนภูมิข้อมูล | Cloud & Crème",
  description: "แสดงข้อมูลสถิติต่างๆ ของร้าน Cloud & Crème ในรูปแบบแผนภูมิ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#B91C1C",
};

export default function ChartLayout({
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