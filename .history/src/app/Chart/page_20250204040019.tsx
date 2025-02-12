"use client";

import { useEffect, useState } from "react";
import PieChart from "@/components/Piechart/PieChart";
import Loading from "@/components/Loading/Loading";
import type { ChartDataItem, ApiResponse } from "@/types";
import { StatCard } from "@/components/Dashboard/StatCard";

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

  const calculateStats = (data: ChartDataItem[]) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const avgRating = data.reduce((sum, item) => sum + (item.rating * item.count), 0) / total;
    const fiveStarPercentage = (data.find(i => i.rating === 5)?.percentage || 0).toFixed(1);
    
    return { total, avgRating: avgRating.toFixed(1), fiveStarPercentage };
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
    <div className="dashboard-layout">
      <div className="stats-overview">
        <div className="glassmorphic-header">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
          <h1 className="hero-title">Restaurant Analytics</h1>
          <p className="hero-subtitle">Insights & Performance Metrics</p>
        </div>

        {!loading && !error && chartData.length > 0 && (
          <div className="stats-cards">
            <div className="stat-card premium">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">⭐</span>
              </div>
              <div className="stat-info">
                <h3>Average Rating</h3>
                <div className="stat-value">
                  {calculateStats(chartData).avgRating}
                  <span className="stat-trend positive">↑ 12%</span>
                </div>
              </div>
            </div>
            
            {/* Add more stylized stat cards */}
          </div>
        )}

        <div className="chart-section">
          <div className="date-navigator">
            <button className="nav-btn prev" onClick={() => changeDate(-1)} disabled={loading}>
              <span className="btn-content">Previous Day</span>
            </button>
            
            <div className="date-picker-wrapper">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="modern-date-picker"
              />
              <div className="date-display">
                {new Date(selectedDate).toLocaleDateString('th-TH', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            <button className="nav-btn next" onClick={() => changeDate(1)} disabled={loading}>
              <span className="btn-content">Next Day</span>
            </button>
          </div>

          <div className="visualization-container">
            {loading ? (
              <Loading />
            ) : error ? (
              <div className="error-message">
                <div className="error-message-icon">⚠️</div>
                <h3 className="error-message-title">เกิดข้อผิดพลาด</h3>
                <p className="error-message-description">{error}</p>
              </div>
            ) : (
              <PieChart 
                data={chartData} 
                isLoading={loading} 
                selectedDate={selectedDate} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPage;
