import React from 'react'

export default function PrivacyPolicy() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-24 mt-8">
      <h1 className="text-3xl font-bold mb-8 text-red-700">นโยบายความเป็นส่วนตัว (Privacy Policy)</h1>
      
      <div className="space-y-6 text-gray-700">
        <p className="text-lg">
          ที่ Cloud & Crème เราให้ความสำคัญกับความเป็นส่วนตัวของคุณเป็นอย่างมาก นโยบายความเป็นส่วนตัวนี้อธิบายถึงวิธีการที่เราเก็บรวบรวม ใช้ และปกป้องข้อมูลส่วนบุคคลของคุณเมื่อคุณใช้เว็บไซต์และบริการของเรา
        </p>

        <div>
          <h2 className="text-xl font-semibold mb-3 text-red-700">1. ข้อมูลที่เราเก็บรวบรวม</h2>
          <p>เราอาจเก็บรวบรวมข้อมูลต่อไปนี้:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>ข้อมูลส่วนบุคคล: ชื่อ, อีเมล, หมายเลขโทรศัพท์, ที่อยู่</li>
            <li>ข้อมูลการล็อกอิน: รายละเอียดบัญชีผู้ใช้และรหัสผ่าน (เข้ารหัส)</li>
            <li>ข้อมูลการทำธุรกรรม: รายละเอียดการสั่งซื้อ การจองโต๊ะ และการชำระเงิน</li>
            <li>ข้อมูลเทคนิค: IP address, ข้อมูล cookie, ข้อมูลอุปกรณ์</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 text-red-700">2. วิธีการใช้ข้อมูลของคุณ</h2>
          <p>เราใช้ข้อมูลของคุณเพื่อ:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>ให้บริการและจัดการบัญชีของคุณ</li>
            <li>ดำเนินการการจองโต๊ะและการสั่งอาหาร</li>
            <li>ปรับปรุงและพัฒนาเว็บไซต์และบริการของเรา</li>
            <li>ส่งการแจ้งเตือน อัปเดต และข้อมูลโปรโมชั่น (หากคุณเลือกรับข้อมูล)</li>
            <li>วิเคราะห์พฤติกรรมการใช้งานเพื่อปรับปรุงประสบการณ์ผู้ใช้</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 text-red-700">3. การแบ่งปันข้อมูล</h2>
          <p>เราไม่ขายหรือเช่าข้อมูลส่วนบุคคลของคุณให้กับบุคคลที่สาม เราอาจแบ่งปันข้อมูลกับ:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>ผู้ให้บริการที่เป็นบุคคลที่สามที่ทำงานในนามของเรา (เช่น บริการชำระเงิน)</li>
            <li>หน่วยงานบังคับใช้กฎหมายเมื่อจำเป็นตามกฎหมาย</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 text-red-700">4. ความปลอดภัยของข้อมูล</h2>
          <p>
            เราใช้มาตรการทางเทคนิคและองค์กรที่เหมาะสมเพื่อปกป้องข้อมูลของคุณจากการเข้าถึง การเปิดเผย การแก้ไข หรือการทำลายโดยไม่ได้รับอนุญาต ข้อมูลที่ละเอียดอ่อนเช่นรหัสผ่านและข้อมูลการชำระเงินได้รับการเข้ารหัสและมีการจำกัดการเข้าถึง
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 text-red-700">5. สิทธิความเป็นส่วนตัวของคุณ</h2>
          <p>คุณมีสิทธิ์:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>เข้าถึงข้อมูลส่วนบุคคลของคุณ</li>
            <li>แก้ไขข้อมูลที่ไม่ถูกต้อง</li>
            <li>ลบข้อมูลของคุณ (หากสามารถทำได้ตามกฎหมาย)</li>
            <li>ถอนความยินยอมในการประมวลผลข้อมูล</li>
            <li>ปฏิเสธการรับข้อมูลทางการตลาด</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 text-red-700">6. การเปลี่ยนแปลงนโยบายความเป็นส่วนตัว</h2>
          <p>
            เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว การเปลี่ยนแปลงจะถูกประกาศบนหน้านี้ โปรดตรวจสอบนโยบายนี้เป็นระยะๆ เพื่อให้มั่นใจว่าคุณพอใจกับการเปลี่ยนแปลงใดๆ
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 text-red-700">7. ติดต่อเรา</h2>
          <p>
            หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวของเราหรือต้องการใช้สิทธิ์ของคุณ โปรดติดต่อเราที่:
          </p>
          <p className="mt-2">
            อีเมล: privacy@cloudandcreme.com<br />
            โทรศัพท์: 02-XXX-XXXX<br />
            ที่อยู่: 123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพฯ 10110
          </p>
        </div>

        <p className="text-sm text-gray-500 mt-10">
          นโยบายนี้มีผลบังคับใช้ตั้งแต่: 1 มีนาคม 2567
        </p>
      </div>
    </div>
  )
} 