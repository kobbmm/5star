import { PrismaClient } from '@prisma/client';

// สร้าง logger function เพื่อให้การแสดงข้อผิดพลาดชัดเจนขึ้น
const logError = (e: any) => {
  console.error('Prisma Error:', e);
};

// สร้าง client instance เพียงครั้งเดียวเพื่อป้องกันปัญหา connection limit
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error'],
    errorFormat: 'pretty',
  });
};

// บน global จะมีตัวแปรที่เก็บ instance ของ PrismaClient ไว้
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// ใช้ instance ที่มีอยู่แล้ว หรือสร้างใหม่ถ้ายังไม่มี
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// ใน development จะเก็บ instance ไว้ใน global object เพื่อไม่ให้สร้างใหม่ตลอด
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// ทดสอบการเชื่อมต่อและแสดงข้อความที่เหมาะสม
export const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('Database connection successful');
    return true;
  } catch (error) {
    logError(error);
    return false;
  }
};

// เรียกใช้ฟังก์ชัน testConnection เพื่อตรวจสอบการเชื่อมต่อเมื่อเริ่มต้น
testConnection()
  .catch(logError);

export default prisma; 