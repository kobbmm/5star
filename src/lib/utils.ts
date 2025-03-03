/**
 * ฟังก์ชันสำหรับรับ base URL ของแอปพลิเคชัน
 * จะใช้ NEXTAUTH_URL จาก environment ถ้ามี ไม่เช่นนั้นจะใช้ตรรกะสำหรับสภาพแวดล้อมที่แตกต่างกัน
 */
export function getBaseUrl() {
  // หากกำหนด NEXTAUTH_URL ใน env ให้ใช้ค่านั้น
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // เมื่อรันบน Vercel จะมี VERCEL_URL ให้
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // สำหรับการพัฒนาในเครื่อง
  return 'http://localhost:3000';
}

/**
 * สร้าง URL เต็มสำหรับใช้ในอีเมล
 */
export function getAbsoluteUrl(path: string): string {
  return `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * ตรวจสอบว่ากำลังทำงานใน production หรือไม่
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * ตรวจสอบว่ากำลังทำงานบน Vercel หรือไม่
 */
export function isVercel(): boolean {
  return !!process.env.VERCEL;
}

/**
 * ฟอร์แมตข้อความแสดงเวลา
 */
export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  
  if (diffSec < 60) {
    return 'เมื่อครู่นี้';
  } else if (diffMin < 60) {
    return `${diffMin} นาทีที่แล้ว`;
  } else if (diffHr < 24) {
    return `${diffHr} ชั่วโมงที่แล้ว`;
  } else if (diffDay < 30) {
    return `${diffDay} วันที่แล้ว`;
  } else {
    // วันเดือนปี
    return past.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
} 