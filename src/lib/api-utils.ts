import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

/**
 * ฟังก์ชันเพื่อจัดการข้อผิดพลาดใน API routes
 */
export function handleApiError(error: unknown, customMessage?: string) {
  console.error('API Error:', error);

  let statusCode = 500;
  let message = customMessage || 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์';

  if (error instanceof Error) {
    // ข้อผิดพลาดเกี่ยวกับฐานข้อมูล
    if (error.message.includes('Prisma') || error.message.includes('database')) {
      message = 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล';
    }
    
    // ข้อผิดพลาดเกี่ยวกับการยืนยันตัวตน
    if (error.message.includes('Authentication') || error.message.includes('Unauthorized')) {
      statusCode = 401;
      message = 'จำเป็นต้องเข้าสู่ระบบ';
    }

    // ข้อผิดพลาดเกี่ยวกับสิทธิ์การเข้าถึง
    if (error.message.includes('Forbidden') || error.message.includes('Permission')) {
      statusCode = 403;
      message = 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้';
    }

    // ข้อผิดพลาดเกี่ยวกับข้อมูลไม่ถูกต้อง
    if (error.message.includes('Invalid') || error.message.includes('validation')) {
      statusCode = 400;
      message = 'ข้อมูลไม่ถูกต้อง';
    }

    // แสดงข้อความจริงในโหมด development
    if (process.env.NODE_ENV === 'development') {
      message = `${message} - ${error.message}`;
    }
  }

  const response: ApiResponse<null> = {
    data: null,
    status: statusCode,
    message
  };

  return NextResponse.json(response, { status: statusCode });
}

/**
 * ฟังก์ชันสำหรับส่งการตอบกลับในรูปแบบมาตรฐาน
 */
export function createApiResponse<T>(data: T, message = 'สำเร็จ', statusCode = 200): NextResponse {
  const response: ApiResponse<T> = {
    data,
    status: statusCode,
    message
  };

  return NextResponse.json(response, { status: statusCode });
}

/**
 * ฟังก์ชันสำหรับตรวจสอบว่ามีค่าหรือไม่
 */
export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]): string | null {
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      return `กรุณากรอกข้อมูล ${field}`;
    }
  }
  return null;
} 