import { PrismaClient } from '@prisma/client';

// ป้องกันการสร้าง PrismaClient หลาย instance ในการพัฒนา
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// สร้าง client instance พร้อมการตั้งค่าที่เหมาะสม
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// เก็บ instance ไว้ใน global object ในโหมดพัฒนา
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Ensure connection is closed properly
if (process.env.NODE_ENV === 'production') {
  // In production, handle the connection with care
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}

export default prisma; 