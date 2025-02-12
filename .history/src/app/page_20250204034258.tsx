import Link from 'next/link';
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function Home() {
  return (
    <main className="min-h-screen relative bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="leaf-pattern"></div>
        <div className="circle-glow"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <header className="py-16 text-center">
          <h1 className={`${playfair.className} text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600`}>
            5 Star Restaurant
          </h1>
          <p className="mt-4 text-xl text-amber-800/80">คุณภาพของรสชาติ สัมผัสแห่งความประทับใจ</p>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Analytics Card */}
            <Link href="/chart" className="feature-card group">
              <div className="card-content">
                <div className="card-icon">📊</div>
                <h2 className="card-title">Analytics Dashboard</h2>
                <p className="card-description">
                  ดูผลการวิเคราะห์และสถิติของร้านอาหาร
                </p>
              </div>
              <div className="card-backdrop"></div>
            </Link>

            {/* Reviews Card */}
            <div className="feature-card group">
              <div className="card-content">
                <div className="card-icon">⭐</div>
                <h2 className="card-title">รีวิวล่าสุด</h2>
                <p className="card-description">
                  อ่านความคิดเห็นจากลูกค้าที่มาใช้บริการ
                </p>
              </div>
              <div className="card-backdrop"></div>
            </div>

            {/* Menu Card */}
            <div className="feature-card group">
              <div className="card-content">
                <div className="card-icon">🍽️</div>
                <h2 className="card-title">เมนูแนะนำ</h2>
                <p className="card-description">
                  สำรวจเมนูพิเศษและอาหารยอดนิยม
                </p>
              </div>
              <div className="card-backdrop"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}