import { FC } from "react";

const HeaderTop: FC = () => {
  return (
    <nav className="bg-red-700 text-white fixed w-full h-16 flex items-center justify-between px-6 z-50">
      <div className="text-xl font-bold">Cloud & Crème</div>
      <ul className="flex space-x-6">
        <li>
          <a href="#home" className="hover:text-yellow-400">Home</a>
        </li>
        <li>
          <a href="#chef" className="hover:text-yellow-400">Chef</a>
        </li>
        <li>
          <a href="#menu" className="hover:text-yellow-400">Menu</a>
        </li>
        <li>
          <a href="#reviews" className="hover:text-yellow-400">Reviews</a>
        </li>
        <li>
          <a href="#contact" className="hover:text-yellow-400">Contact</a>
        </li>
      </ul>
    </nav>
  );
};

export default HeaderTop;