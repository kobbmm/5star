import React from "react";
import Image from "next/image";

const Chefrecommended: React.FC = () => {
  return (
    <div className="relative w-full bg-white flex flex-col items-center py-10 px-5">
      {/* Chef Image */}
      <div className="w-[610px] h-auto mb-6">
        <Image src="/images/Latestblogs.png" alt="Chef and Food" width={610} height={629} className="object-cover" />
      </div>
      
      {/* Chef's recommended title */}
      <p className="font-[Lato] italic text-[36px] leading-[43px] text-black text-center mb-6">
        Chef's Recommended
      </p>
      
      {/* Blogs Section */}
      <div className="flex flex-wrap justify-center gap-10 max-w-[1200px]">
        {/* Chocolat Mexique Savoie */}
        <div className="w-[389px] h-auto text-center">
          <Image src="/images/Chocolat Mexique Savoie.png" alt="Chocolat Mexique Savoie" width={389} height={518} className="object-cover" />
          <p className="font-[Lato] text-[28px] leading-[34px] text-black mt-4">Chocolat Mexique Savoie</p>
        </div>

        {/* A Strelitzia */}
        <div className="w-[389px] h-auto text-center">
          <Image src="/images/A Strelitzia.png" alt="A Strelitzia" width={389} height={518} className="object-cover" />
          <p className="font-[Lato] text-[28px] leading-[34px] text-black mt-4">A Strelitzia</p>
        </div>
      </div>
    </div>
  );
};

export default Chefrecommended;
