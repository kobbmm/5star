"use client";

import { useEffect, useState } from "react";
import PieChart from "../../components/Piechart";

const Home: React.FC = () => {
  const [chartData, setChartData] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/Chart");
        if (!res.ok) {
          throw new Error("Failed to fetch chart data.");
        }
        const data: number[] = await res.json();
        setChartData(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Restaurant Review Statistics</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && <PieChart data={chartData} />}
    </div>
  );
};

export default Home;
