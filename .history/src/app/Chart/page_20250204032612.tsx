"use client";

import { useEffect, useState } from "react";
import PieChart from "@/components/Piechart/PieChart";
import Loading from "@/components/Loading/Loading";
import type { ChartDataItem, ApiResponse } from "@/types";

const ChartPage: React.FC = () => {
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
    let isSubscribed = true;

    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`/api/chart?date=${selectedDate}`);
        if (!res.ok) {
          throw new Error(res.status === 429 
            ? "Too many requests. Please try again later."
            : "Failed to fetch data"
          );
        }

        const response: ApiResponse<ChartDataItem[]> = await res.json();
        
        if (isSubscribed) {
          setChartData(response.data);
        }
      } catch (err) {
        if (isSubscribed) {
          setError(err instanceof Error ? err.message : "An unexpected error occurred");
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchChartData();

    return () => {
      isSubscribed = false;
    };
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

export default ChartPage;
