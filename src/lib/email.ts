import nodemailer from 'nodemailer';
import { getAbsoluteUrl } from './utils';

// สร้าง function สำหรับการสร้าง transporter ที่เหมาะสมกับ environment
const createTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('Email credentials are missing - GMAIL_USER or GMAIL_APP_PASSWORD not found in environment variables');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // ใช้ SSL
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production' // ตรวจสอบใบรับรองเฉพาะใน production
    },
    debug: process.env.NODE_ENV !== 'production' // เปิดโหมดดีบักเฉพาะใน development
  });
};

// สร้าง transporter
const transporter = createTransporter();

// ฟังก์ชันสำหรับทดสอบการเชื่อมต่อ
const verifyTransporter = async () => {
  if (!transporter) {
    console.error('Email transporter could not be created');
    return false;
  }
  
  return new Promise<boolean>((resolve) => {
    transporter.verify(function(error: unknown, success: boolean) {
      if (error) {
        console.error('SMTP connection error:', error);
        resolve(false);
      } else {
        console.log('SMTP server is ready to take our messages');
        resolve(true);
      }
    });
  });
};

// ทดสอบการเชื่อมต่อเมื่อเริ่มต้น (แต่ไม่ block การทำงานของแอป)
verifyTransporter().catch(error => {
  console.error('Error verifying email transport:', error);
});

// ฟังก์ชันส่งอีเมลยืนยันตัวตน
export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
) {
  if (!transporter) {
    console.error("Email transporter not available");
    return { success: false, error: "Email service not available" };
  }

  const verificationUrl = getAbsoluteUrl(`/email-verified?token=${token}`);
  
  try {
    console.log(`กำลังส่งอีเมลยืนยันไปยัง ${email} ด้วยอีเมล ${process.env.GMAIL_USER}`);
    
    const mailOptions = {
      from: {
        name: '5Star Restaurant',
        address: process.env.GMAIL_USER || ''
      },
      to: email,
      subject: 'ยืนยันอีเมลของคุณ - 5Star Restaurant',
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #ff6b6b;">5Star Restaurant</h1>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">สวัสดีคุณ ${name},</p>
          
          <p style="font-size: 16px; line-height: 1.5;">กรุณาคลิกที่ปุ่มด้านล่างเพื่อยืนยันอีเมลของคุณ:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #ff6b6b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">ยืนยันอีเมลของฉัน</a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">หรือคัดลอกลิงก์นี้: ${verificationUrl}</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eaeaea;" />
          
          <p style="font-size: 14px; color: #666; text-align: center;">หากคุณไม่ได้ลงทะเบียนใน 5Star Restaurant กรุณาละเว้นอีเมลนี้</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`อีเมลส่งสำเร็จ: ${info.messageId}`);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error in sendVerificationEmail:', error);
    return { success: false, error };
  }
}

// ฟังก์ชันส่งอีเมลรีเซ็ตรหัสผ่าน
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
) {
  if (!transporter) {
    console.error("Email transporter not available");
    return { success: false, error: "Email service not available" };
  }

  const resetUrl = getAbsoluteUrl(`/reset-password?token=${token}`);
  
  try {
    console.log(`กำลังส่งอีเมลรีเซ็ตรหัสผ่านไปยัง ${email}`);
    
    const mailOptions = {
      from: {
        name: '5Star Restaurant',
        address: process.env.GMAIL_USER || ''
      },
      to: email,
      subject: 'รีเซ็ตรหัสผ่านของคุณ - 5Star Restaurant',
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #ff6b6b;">5Star Restaurant</h1>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">สวัสดีคุณ ${name},</p>
          
          <p style="font-size: 16px; line-height: 1.5;">เราได้รับคำขอให้รีเซ็ตรหัสผ่านสำหรับบัญชีของคุณ กรุณาคลิกที่ปุ่มด้านล่างเพื่อดำเนินการ:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #ff6b6b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">รีเซ็ตรหัสผ่านของฉัน</a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">หากคุณไม่สามารถคลิกที่ปุ่มได้ กรุณาคัดลอกและวาง URL ด้านล่างลงในเบราว์เซอร์ของคุณ:</p>
          
          <p style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; word-break: break-all;">${resetUrl}</p>
          
          <p style="font-size: 16px; line-height: 1.5;">หากคุณไม่ได้ร้องขอการรีเซ็ตรหัสผ่านนี้ คุณสามารถละเว้นอีเมลนี้ได้อย่างปลอดภัย</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eaeaea;" />
          
          <p style="font-size: 14px; color: #666; text-align: center;">อีเมลนี้ถูกส่งโดยอัตโนมัติ กรุณาอย่าตอบกลับ</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`อีเมลรีเซ็ตรหัสผ่านส่งสำเร็จ: ${info.messageId}`);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error in sendPasswordResetEmail:', error);
    return { success: false, error };
  }
} 