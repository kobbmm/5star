"use client";

import { useEffect, useState } from "react";
import PieChart from "@/components/Piechart/PieChart"
import { ChartDataItem } from "@/types";


const Home: React.FC = () => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/chart?date=${selectedDate}`);
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="date-navigation">
        <button onClick={() => changeDate(-1)} className="nav-button">
          ◀
        </button>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-picker"
        />
        <button onClick={() => changeDate(1)} className="nav-button">
          ▶
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <PieChart data={chartData} isLoading={loading} selectedDate={selectedDate} />
      )}
    </div>
  );
};

export default Home;
