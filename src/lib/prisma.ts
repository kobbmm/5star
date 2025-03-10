import { PrismaClient } from '@prisma/client';

// ในกรณีที่เราใช้ Hot Reloading ในการพัฒนา
// เราต้องใช้ global object เพื่อเก็บ prisma instance ไว้
// เพื่อป้องกันการสร้าง connection ใหม่ทุกครั้งที่มีการ reload

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma; 