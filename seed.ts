import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createUser() {
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      phone: '+1234567890',
      passwordHash: 'hashedpassword',
      isVerified: false,
    },
  });
  console.log(user);
}

createUser()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

