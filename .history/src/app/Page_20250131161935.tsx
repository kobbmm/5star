import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">5 Star Restaurant</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link 
            href="/chart" 
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-3">Analytics Dashboard →</h2>
            <p className="text-gray-600">View restaurant performance and statistics</p>
          </Link>
          
          {/* Add more menu items */}
        </div>
      </div>
    </main>
  );
}