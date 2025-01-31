"use client";

import { useEffect, useState } from "react";
import PieChart from "../components/Piechart";

const Home: React.FC = () => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/Chart?date=${selectedDate}`);
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const data = await res.json();
        setChartData(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedDate]);

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="p-2 border rounded"
      />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <PieChart data={chartData} isLoading={loading} />
      )}
    </div>
  );
};

export default Home;
