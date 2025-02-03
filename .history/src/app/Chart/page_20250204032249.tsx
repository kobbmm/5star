"use client";

import { useEffect, useState } from "react";
import PieChart from "@/components/Piechart/PieChart"
import { ChartDataItem } from "@/types";
import Loading from "@/components/Loading/Loading";

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
        if (res.status === 429) {
          const retryAfter = res.headers.get('Retry-After') || '60';
          throw new Error(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`);
        }
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const data = await res.json();
        setChartData(data.data);
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
      <div className="date-picker-container">
        <button 
          onClick={() => changeDate(-1)} 
          className="nav-button"
          disabled={loading}
        >
          <span className="nav-arrow">←</span>
          <span className="nav-text">Previous</span>
        </button>

        <div className="calendar-wrapper">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-picker"
            disabled={loading}
          />
          <span className="calendar-icon">📅</span>
        </div>

        <button 
          onClick={() => changeDate(1)} 
          className="nav-button"
          disabled={loading}
        >
          <span className="nav-text">Next</span>
          <span className="nav-arrow">→</span>
        </button>
      </div>

      <div className={`chart-container ${loading ? 'loading' : ''}`}>
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <PieChart 
            data={chartData} 
            isLoading={loading} 
            selectedDate={selectedDate} 
          />
        )}
      </div>
    </div>
  );
};

export default Home;
