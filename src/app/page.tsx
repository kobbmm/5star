import { FC } from 'react';
import Link from 'next/link';
import HeaderTop from '@/components/Home/HeaderTop';
import HeaderSection from '@/components/Home/HeaderSection';
import Headerdetails from '@/components/Home/Headerdetails';
import HeaderChef from '@/components/Home/HeaderChef';
import Chefrecommended from '@/components/Home/Chefrecommended';
import TypesDesserts from '@/components/Home/TypesDesserts';
import AllMenu from '@/components/Home/AllMenu';
import Contact from '@/components/Home/Contact';

function Home() {
  return (

    <main className="min-h-screen bg-gray-50">
      <HeaderTop />
      <HeaderSection />
      <Headerdetails />
      <HeaderChef />
      <Chefrecommended />
      <TypesDesserts />
      <AllMenu />
      {/* Reviews Page */}
      {/* Graph Reviews Page */}
      <Contact />
    </main>
  );
}

export default Home;