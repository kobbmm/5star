import Link from "next/link";

const HeaderTop = () => {
  return (
    <nav className="bg-red-700 text-white fixed w-full h-16 flex items-center justify-between px-6 z-50">
      <div className="text-xl font-bold">Cloud & Crème</div>
      <ul className="flex space-x-6">
        <li>
          <Link href="#home" className="hover:text-yellow-400">Home</Link>
        </li>
        <li>
          <Link href="#chef" className="hover:text-yellow-400">Chef</Link>
        </li>
        <li>
          <Link href="#menu" className="hover:text-yellow-400">Menu</Link>
        </li>
        <li>
          <Link href="#reviews" className="hover:text-yellow-400">Reviews</Link>
        </li>
        <li>
          <Link href="#contact" className="hover:text-yellow-400">Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

export default HeaderTop;