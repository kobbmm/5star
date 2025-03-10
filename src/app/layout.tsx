import './globals.css';
import { Inter } from 'next/font/google';
import { NextAuthProvider } from '@/providers/NextAuthProvider';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';
import Footer from '@/components/Footer';

// เพิ่มฟอนต์ที่ใช้แบบ optimized
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// ย้าย viewport ออกมาเป็น export แยก
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// ย้าย themeColor ออกมาเป็น export แยก
export const themeColor = '#B91C1C';

export const metadata = {
  title: 'Cloud & Crème - ร้านขนมหวานระดับพรีเมียม',
  description: 'ร้านขนมหวานสไตล์ฝรั่งเศสคุณภาพสูง เสิร์ฟความอร่อยที่หลากหลายโดยเชฟมืออาชีพ',
  keywords: 'ขนมหวาน, เบเกอรี่, พรีเมียม, ร้านอาหาร, เชฟ, เดสเสิร์ต',
  authors: [{ name: 'Cloud & Crème', url: 'https://cloudandcreme.com' }],
  openGraph: {
    title: 'Cloud & Crème - ร้านขนมหวานระดับพรีเมียม',
    description: 'ร้านขนมหวานสไตล์ฝรั่งเศสคุณภาพสูง เสิร์ฟความอร่อยที่หลากหลายโดยเชฟมืออาชีพ',
    url: 'https://cloudandcreme.com',
    siteName: 'Cloud & Crème',
    locale: 'th_TH',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cloud & Crème',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-white text-black flex flex-col">
        <NextAuthProvider>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          <main className="flex-grow">{children}</main>
          <Footer />
        </NextAuthProvider>
        
        {/* Performance analytics - กรณีที่มีการ deploy แล้ว */}
        {process.env.NODE_ENV === 'production' && (
          <Script
            strategy="afterInteractive"
            id="performance-analytics"
            dangerouslySetInnerHTML={{
              __html: `
                // Basic performance measurement
                window.addEventListener('load', () => {
                  // Report to analytics or console for now
                  console.log('Performance:', {
                    FCP: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
                    LCP: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime,
                    FID: performance.getEntriesByType('first-input')[0]?.processingStart - 
                         performance.getEntriesByType('first-input')[0]?.startTime,
                    CLS: performance.getEntriesByType('layout-shift')
                         .reduce((total, entry) => total + entry.value, 0),
                  });
                });
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}


