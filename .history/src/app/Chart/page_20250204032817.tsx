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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="date-picker-container">
        <button 
          onClick={() => changeDate(-1)} 
          className="nav-button"
          disabled={loading}
        >
          <span className="nav-arrow">←</span>
          <span className="nav-text">ก่อนหน้า</span>
        </button>

        <div className="calendar-wrapper">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-picker"
            disabled={loading}
          />
          <span className="calendar-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
            </svg>
          </span>
        </div>

        <button 
          onClick={() => changeDate(1)} 
          className="nav-button"
          disabled={loading}
        >
          <span className="nav-text">ถัดไป</span>
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
