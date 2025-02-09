import { FC } from 'react';
import Image from 'next/image';

const HeaderSection: FC = () => {
  return (
    <header className="relative w-full h-[550px] bg-black flex flex-col items-center justify-center text-white">
      <div className="absolute top-80 left-40 bg-red-700 p-4 rounded-lg text-center">
        <h3 className="text-lg font-medium">Opening Hours</h3>
        <p>Mon: Closed</p>
        <p>Tue - Fri: 4pm - 8pm</p>
        <p>Sat - Sun: 5pm - 11pm</p>
      </div>
      <h1 className="absolute top-25 text-6xl font-serif text-red-700">Cloud & Crème</h1>
      <p className="absolute top-80 left-45 text-lg">Chef: Anchalee Phiphatphong</p>
      <div className="mt-4 absolute right-20">
        <Image src="/images/picturhead.png" alt="pictur" width={450} height={550} />
      </div>
    </header>
  );
};

export default HeaderSection;