import { PrismaClient } from '@prisma/client';

// ฟังก์ชันสำหรับกำหนดผู้ใช้เป็น Admin
async function setUserAsAdmin(email: string) {
  const prisma = new PrismaClient();
  
  try {
    // ตรวจสอบว่ามีผู้ใช้ที่มีอีเมลนี้หรือไม่
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    
    if (!existingUser) {
      console.log(`ไม่พบผู้ใช้ที่มีอีเมล ${email} ในระบบ`);
      return;
    }
    
    // อัปเดตผู้ใช้ให้เป็น Admin
    const updatedUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        role: 'ADMIN',
      },
    });
    
    console.log(`เปลี่ยนผู้ใช้ ${updatedUser.email} เป็น Admin สำเร็จแล้ว!`);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปเดตผู้ใช้:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// กำหนดอีเมลที่ต้องการเปลี่ยนเป็น Admin
const adminEmail = process.argv[2] || 'ใส่อีเมลที่ต้องการกำหนดเป็น Admin ตรงนี้';

setUserAsAdmin(adminEmail)
  .then(() => {
    console.log('เสร็จสิ้นการทำงาน');
  })
  .catch((error) => {
    console.error('เกิดข้อผิดพลาดในการทำงานของสคริปต์:', error);
  }); 