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
import ReviewComment from '@/components/Home/ReviewComment';
import ProfileOverlay from '@/components/Home/ProfileOverlay';

function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <ProfileOverlay />
      <HeaderTop />

      {/* Sections with ID for Smooth Scrolling */}
      <section id="home">
        <HeaderSection />
      </section>

      <section id="chef">
        <Headerdetails />
        <HeaderChef />
        <Chefrecommended />
      </section>

      <section id="menu">
        <TypesDesserts />
        <AllMenu />
      </section>

      <section id="reviews">
        <ReviewComment />
      </section>

      <section id="contact">
        <Contact />
      </section>
    </main>
  );
}

export default Home;