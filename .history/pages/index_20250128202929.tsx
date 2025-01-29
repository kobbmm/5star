"use client";

import { useEffect, useState } from "react";
import PieChart from "../components/Piechart";

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
          const errorText = await res.text();
          throw new Error(`Failed to fetch chart data: ${errorText}`);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <PieChart data={chartData} />;
};

export default Home;
