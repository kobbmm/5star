import { FC } from 'react';
import Image from 'next/image';

const HeaderSection: FC = () => {
  return (
    <header className="relative w-full min-h-[550px] bg-black flex flex-col items-center justify-center text-white overflow-hidden">
      <div className="container mx-auto px-4 py-10 flex flex-col lg:flex-row items-center">
        <div className="flex-1 flex flex-col items-center lg:items-start z-10 mb-8 lg:mb-0">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-red-700 mb-6 text-center lg:text-left">
            Cloud & Crème
          </h1>
          
          <p className="text-base sm:text-lg mb-6 text-center lg:text-left">
            Chef: Anchalee Phiphatphong
          </p>
          
          <div className="bg-red-700 p-3 sm:p-4 rounded-lg text-center w-full max-w-xs">
            <h3 className="text-base sm:text-lg font-medium mb-2">Opening Hours</h3>
            <p className="text-sm sm:text-base">Mon: Closed</p>
            <p className="text-sm sm:text-base">Tue - Fri: 4pm - 8pm</p>
            <p className="text-sm sm:text-base">Sat - Sun: 5pm - 11pm</p>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="relative w-[280px] h-[350px] sm:w-[350px] sm:h-[420px] lg:w-[450px] lg:h-[550px]">
            <Image 
              src="/images/picturhead.png" 
              alt="Dessert Display" 
              fill
              className="object-contain"
              priority
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 350px, 450px"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;