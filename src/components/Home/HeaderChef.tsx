import React from "react";
import Image from 'next/image';

const HeaderChef: React.FC = () => {
  return (
    <div className="relative w-full h-[600px] bg-black flex flex-wrap items-center justify-between px-6">
      {/* Chef Image on the Left */}
      <div className="w-full md:w-1/3 h-auto flex justify-center">
        <Image src="/images/chef.jpg" alt="Chef" width={700} height={600} className="object-cover max-w-full h-auto" />
      </div>
      
      {/* Text Box in the Center */}
      <div className="w-full md:w-[700px] h-[300px] bg-white border border-black p-6 flex flex-col justify-between max-w-[90%] md:max-w-[700px] mx-auto md:mx-0">
        <h2 className="font-[Aboreto] text-[30px] leading-[35px] text-black">
          Anchalee Phiphatphong
        </h2>
        <p className="font-[Aboreto] text-[18px] leading-[27px] text-black mt-4">
          <strong>Experience:</strong> With over 15 years of experience in the bakery industry.
        </p>
        <p className="font-[Aboreto] text-[18px] leading-[27px] text-black mt-2">
          <strong>Signature Dishes:</strong> Special Rose-scented Macarons.
        </p>
        <p className="font-[Aboreto] text-[18px] leading-[27px] text-black mt-2">
          <strong>Specialty:</strong> Specializes in creating desserts that blend art with flavor.
        </p>
      </div>
      
      {/* Scroll Image on the Right */}
      <div className="w-1/6 flex justify-center items-center">
        <Image src="/images/Scroll.png" alt="Scroll Indicator" width={40} height={70} className="object-contain" />
      </div>
    </div>
  );
};

export default HeaderChef;