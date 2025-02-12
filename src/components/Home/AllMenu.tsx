import React from "react";

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
        <div className="relative w-full bg-[#FFFFFF] py-10">
            <h2 className="text-center text-4xl font-lancelot italic mb-8">Menu</h2>
            <div className="grid grid-cols-4 gap-8 px-20">
                {menuItems.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                    <div className="w-[274px] h-[367px] bg-cover bg-center rounded-lg shadow-lg" style={{ backgroundImage: `url(${item.image})` }}>
                    </div>
                    <p className="mt-4 text-lg font-lato text-black">
                        {item.name}
                    </p>
                </div>
                ))}
            </div>
        </div>
    );
    };

export default AllMenu;