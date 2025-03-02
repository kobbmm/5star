This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

```bash
# ติดตั้งแพ็คเกจทั้งหมดในครั้งเดียว
npm install
```

## การติดตั้งแพ็คเกจ

โปรเจค 5star ต้องใช้แพ็คเกจต่างๆ ดังต่อไปนี้ ซึ่งคุณสามารถใช้คำสั่ง `npm install` ครั้งเดียวได้เนื่องจากทุกแพ็คเกจอยู่ใน `package.json` แล้ว:

### แพ็คเกจหลัก
```bash
# แพ็คเกจหลักของ Next.js
npm install next react react-dom
```

### แพ็คเกจสำหรับ UI และการแสดงผล
```bash
# UI Components และ Icons
npm install lucide-react framer-motion

# กราฟและแผนภูมิ
npm install chart.js react-chartjs-2
```

### แพ็คเกจสำหรับฐานข้อมูลและการจัดการข้อมูล
```bash
# Prisma ORM
npm install prisma @prisma/client --save
npx prisma init

# Cache และ Utils
npm install lru-cache dayjs uuid
```

### แพ็คเกจสำหรับ Authentication และ API
```bash
# Authentication
npm install next-auth bcrypt bcryptjs jsonwebtoken 

# API และความปลอดภัย
npm install cookie cors zod helmet morgan axios

# Type definitions
npm install --save-dev @types/bcryptjs

# Email
npm install nodemailer resend

# Environment Variables
npm install dotenv
```

## วิธีใช้งาน

```bash
# รัน development server
npm run dev

# สร้าง production build
npm run build

# รัน production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# 5star Application

## วิธีการ Deploy บน Vercel

### ขั้นตอนที่ 1: อัปโหลดโปรเจคไปยัง GitHub
1. สร้าง repository ใหม่บน GitHub
2. เชื่อมโยง repository กับโปรเจคของคุณ:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

### ขั้นตอนที่ 2: Deploy บน Vercel
1. ไปที่ [Vercel](https://vercel.com) และล็อกอินด้วยบัญชี GitHub
2. คลิก "Add New..." และเลือก "Project"
3. เลือก repository ที่คุณเพิ่งอัปโหลด
4. ในส่วนการตั้งค่า (Configure Project) ให้เพิ่มตัวแปรสภาพแวดล้อม:
   - `DATABASE_URL`: URL ของฐานข้อมูล TiDB Cloud
   - `NEXTAUTH_SECRET`: รหัสลับสำหรับ NextAuth (ใช้รหัสเดียวกับใน .env)
   - `NEXTAUTH_URL`: ให้ใช้ URL ของ Vercel (จะเป็น https://your-project-name.vercel.app)
   - `GOOGLE_CLIENT_ID`: Client ID สำหรับ Google OAuth
   - `GOOGLE_CLIENT_SECRET`: Client Secret สำหรับ Google OAuth
   - `FACEBOOK_CLIENT_ID`: Client ID สำหรับ Facebook OAuth (ถ้ามี)
   - `FACEBOOK_CLIENT_SECRET`: Client Secret สำหรับ Facebook OAuth (ถ้ามี)
5. คลิก "Deploy"

### ขั้นตอนที่ 3: หลังจาก Deploy
1. หลังจาก deploy สำเร็จ ให้เข้าไปที่ Developer Console ของ Google และ Facebook
2. เพิ่ม URL ของ Vercel เป็น Authorized redirect URI:
   - Google: `https://your-project-name.vercel.app/api/auth/callback/google`
   - Facebook: `https://your-project-name.vercel.app/api/auth/callback/facebook`

### การแก้ไขปัญหา
- หากพบปัญหาการเชื่อมต่อกับฐานข้อมูล TiDB ให้ตรวจสอบว่าได้เพิ่ม IP ของ Vercel ในรายการอนุญาตใน TiDB Cloud แล้ว
- หากระบบยืนยันตัวตนไม่ทำงาน ให้ตรวจสอบว่า URL ใน Developer Console ของ Google และ Facebook ถูกต้อง

## การพัฒนาโปรเจค
```bash
# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev

# สร้าง production build
npm run build

# รัน production server
npm start
```

## การแก้ไขปัญหาเพิ่มเติมสำหรับการ Deploy บน Vercel

### ปัญหาด้าน ESLint และ TypeScript
หากการ build ล้มเหลวเนื่องจากปัญหา ESLint หรือ TypeScript คุณสามารถปรับแต่งไฟล์ `next.config.js` ดังนี้:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // ข้ามการตรวจสอบ ESLint ระหว่าง build
  },
  typescript: {
    ignoreBuildErrors: true, // ข้ามการตรวจสอบ TypeScript ระหว่าง build
  },
  images: {
    domains: ['localhost', 'cloudandcreme.vercel.app', 'github.com'],
  },
  // ตั้งค่า security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  // ตั้งค่า redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

### การตั้งค่าไฟล์ .env
โปรเจค 5star ต้องการตัวแปรสภาพแวดล้อมหลายตัว คุณสามารถใช้ไฟล์ `.env.example` เป็นต้นแบบ ซึ่งควรมีเนื้อหาดังต่อไปนี้:

```
# Database
DATABASE_URL="mysql://username:password@host:port/database_name"

# NextAuth
NEXTAUTH_SECRET="your_nextauth_secret_here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
FACEBOOK_CLIENT_ID="your_facebook_client_id"
FACEBOOK_CLIENT_SECRET="your_facebook_client_secret"

# Email
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="user@example.com"
EMAIL_SERVER_PASSWORD="password"
EMAIL_FROM="noreply@example.com"

# Application
APP_URL="http://localhost:3000"
```

สิ่งสำคัญที่ควรทราบเกี่ยวกับ NEXTAUTH_URL:
1. ในระหว่างการพัฒนา ให้ตั้งค่าเป็น `http://localhost:3000`
2. สำหรับการ deploy บน Vercel ให้ตั้งค่าเป็น `https://your-project-name.vercel.app`
3. ถ้าใช้โดเมนหลักให้ตั้งค่าเป็น URL ของโดเมนนั้น

### ปัญหาเกี่ยวกับรูปภาพ
หากมีปัญหาเกี่ยวกับการแสดงรูปภาพ ให้ตรวจสอบว่าได้เพิ่มโดเมนที่เกี่ยวข้องในส่วน `images.domains` ของไฟล์ `next.config.js` แล้ว

### ปัญหาเกี่ยวกับ Prisma
หากมีปัญหาเกี่ยวกับ Prisma client หลังจาก deploy ให้ลองใช้คำสั่งต่อไปนี้เพื่อสร้าง Prisma client ใหม่:

```bash
# สร้าง Prisma client ใหม่
npx prisma generate
```

## การอัปเดต Database Schema
หากมีการเปลี่ยนแปลง schema ของฐานข้อมูล คุณสามารถใช้คำสั่งต่อไปนี้:

```bash
# อัปเดต schema ของฐานข้อมูล
npx prisma db push

# หรือหากต้องการสร้าง migration
npx prisma migrate dev --name [ชื่อการเปลี่ยนแปลง]
```
