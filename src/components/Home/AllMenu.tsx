import React from "react";
import Image from "next/image";

const menuItems = [
  { name: "Apple Pie", image: "/images/applespie.png" },
  { name: "Tiramisu", image: "/images/tiramisu.png" },
  { name: "Red Fruit Crater", image: "/images/RedFruitCrater.png" },
  { name: "Chocolate Ganache", image: "/images/ChocolateGanache.png" },
  { name: "Earl Grey Tea", image: "/images/EarlGreytea.png" },
  { name: "Parfait", image: "/images/Parfait.png" },
  { name: "Virgin Mojito", image: "/images/VirginMojito.png" },
  { name: "Berry & Juice", image: "/images/Berry&Juice.png" },
];

const AllMenu: React.FC = () => {
  return (
    <div className="relative w-full bg-[#FFFFFF] py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-center text-3xl sm:text-4xl font-lancelot italic mb-6 sm:mb-8">Menu</h2>
      
      {/* ปรับ grid เพื่อรองรับหน้าจอทุกขนาด */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
        {menuItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center transform transition-transform hover:scale-105 duration-300">
            <div className="relative w-full aspect-[3/4] rounded-lg shadow-lg overflow-hidden">
              <Image 
                src={item.image} 
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={index < 4} // เฉพาะ 4 รายการแรกใช้ priority
              />
            </div>
            <p className="mt-4 text-base sm:text-lg font-lato text-black text-center">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMenu;