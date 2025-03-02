/**
 * สภาพแวดล้อมของแอปพลิเคชัน
 * ใช้สำหรับกำหนด URL ที่ใช้ในการส่งอีเมลและการยืนยันตัวตน
 */

export const APP_URL = 
  process.env.NEXTAUTH_URL || 
  process.env.VERCEL_URL ? 
    `https://${process.env.VERCEL_URL}` : 
    'http://localhost:3000';

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

/**
 * สร้าง URL สำหรับส่งในอีเมลยืนยันตัวตน
 * @param path path ที่ต้องการเพิ่มต่อท้าย URL
 * @returns URL แบบเต็ม
 */
export function getBaseUrl(path: string = ''): string {
  // ตัดขีดคั่นออกหากมีทั้งที่ท้าย URL และต้น path
  if (APP_URL.endsWith('/') && path.startsWith('/')) {
    return `${APP_URL}${path.substring(1)}`;
  }
  
  // เพิ่มขีดคั่นหากไม่มีทั้งที่ท้าย URL และต้น path
  if (!APP_URL.endsWith('/') && !path.startsWith('/')) {
    return `${APP_URL}/${path}`;
  }
  
  return `${APP_URL}${path}`;
} 