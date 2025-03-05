import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "รายงานการประเมินความพึงพอใจ",
  description: "ดูสถิติการประเมินความพึงพอใจในแต่ละวัน",
};

export default function ChartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full">
      {children}
    </div>
  );
} 