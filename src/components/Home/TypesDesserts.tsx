import React from "react";

const TypesDesserts: React.FC = () => {
  return (
    <div className="relative w-full h-[500px] bg-[#AB3434] flex items-center justify-center">
      <div className="absolute w-[1000px] h-[400px] bg-white border border-[#F9EEEC] rounded-[25px] flex flex-col p-8">
        {/* Title */}
        <h2 className="font-[Lancelot] text-[40px] text-black text-center mb-6">
          Types of desserts
        </h2>
        
        {/* Dessert Categories */}
        <div className="space-y-6">
          {[
            "Newly created desserts.",
            "A party of the nobility.",
            "Famous desserts.",
            "Drinks with atmosphere."
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b border-[#E5E5E5] pb-4">
              <p className="font-[Lato] text-[18px] text-black">{item}</p>
              <span className="font-[Lato] text-[18px] text-black">+</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypesDesserts;