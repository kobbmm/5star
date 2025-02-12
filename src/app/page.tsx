import { FC } from 'react';
import Link from 'next/link';
import HeaderTop from '@/components/Home/HeaderTop';
import HeaderSection from '@/components/Home/HeaderSection';

function Home() {
  return (

    <main className="min-h-screen bg-gray-50">
      <HeaderTop />
      <HeaderSection />

    </main>
  );
}

export default Home;