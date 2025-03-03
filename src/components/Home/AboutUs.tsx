import React from 'react';
import Image from 'next/image';

const AboutUs: React.FC = () => {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50 to-transparent z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-[Lancelot] text-3xl sm:text-4xl md:text-[40px] text-black mb-4">
            เกี่ยวกับเรา
          </h2>
          <div className="w-20 h-1 bg-red-700 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl font-medium text-gray-900 mb-4">
              ร้านขนมหวานพรีเมียมแห่งแรกในเมืองไทย
            </h3>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Cloud & Crème ก่อตั้งขึ้นในปี 2022 โดยเชฟอัญชลี พิพัฒน์พงษ์ ผู้มีประสบการณ์กว่า 15 ปีในวงการทำขนมนานาชาติ 
              ด้วยความหลงใหลในศิลปะการทำขนมหวานฝรั่งเศส เชฟอัญชลีจึงผสมผสานเทคนิคและวัตถุดิบท้องถิ่นเข้ากับขนมหวานสไตล์ยุโรป 
              สร้างสรรค์รสชาติที่โดดเด่นและเป็นเอกลักษณ์
            </p>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              ร้านของเราให้ความสำคัญกับวัตถุดิบคุณภาพสูง โดยคัดเลือกจากแหล่งผลิตที่มีมาตรฐาน 
              และจับมือกับเกษตรกรท้องถิ่นเพื่อให้ได้ผลไม้ตามฤดูกาลที่สดใหม่ที่สุด 
              นำมาสร้างสรรค์เป็นขนมหวานที่มีรสชาติกลมกล่อม และรูปลักษณ์สวยงามดุจงานศิลปะ
            </p>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">คุณภาพระดับพรีเมียม</h4>
                  <p className="text-gray-600 text-sm">วัตถุดิบคัดสรรพิเศษทุกชิ้น</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">สูตรพิเศษเฉพาะร้าน</h4>
                  <p className="text-gray-600 text-sm">ทุกเมนูคิดค้นโดยเชฟมืออาชีพ</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="relative h-[400px] sm:h-[500px] shadow-xl rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-red-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.9999V7.9999C21 6.8954 20.1046 5.9999 19 5.9999H5C3.89543 5.9999 3 6.8954 3 7.9999V15.9999M21 15.9999V17.9999C21 19.1045 20.1046 19.9999 19 19.9999H5C3.89543 19.9999 3 19.1045 3 17.9999V15.9999M21 15.9999H3M12 11.9999C12.5523 11.9999 13 11.5522 13 10.9999C13 10.4477 12.5523 9.9999 12 9.9999C11.4477 9.9999 11 10.4477 11 10.9999C11 11.5522 11.4477 11.9999 12 11.9999ZM16 11.9999C16.5523 11.9999 17 11.5522 17 10.9999C17 10.4477 16.5523 9.9999 16 9.9999C15.4477 9.9999 15 10.4477 15 10.9999C15 11.5522 15.4477 11.9999 16 11.9999ZM8 11.9999C8.55228 11.9999 9 11.5522 9 10.9999C9 10.4477 8.55228 9.9999 8 9.9999C7.44772 9.9999 7 10.4477 7 10.9999C7 11.5522 7.44772 11.9999 8 11.9999Z" />
                </svg>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-red-700 rounded-full flex items-center justify-center text-white font-serif text-xl">
              <span className="rotate-12">Est.<br/>2022</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
    </section>
  );
};

export default AboutUs; 