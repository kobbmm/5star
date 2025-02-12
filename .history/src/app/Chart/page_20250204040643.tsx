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
      <nav className="top-nav">
        <div className="brand">
          <span className="brand-icon">🌟</span>
          <h1>Restaurant Analytics</h1>
        </div>
        <div className="nav-actions">
          {/* Add more actions here later */}
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="insight-cards">
          {!loading && !error && chartData.length > 0 && (
            <>
              <div className="metric-card primary">
                <div className="metric-value">{calculateStats(chartData).avgRating}</div>
                <div className="metric-label">คะแนนเฉลี่ย</div>
                <div className="metric-icon">⭐</div>
              </div>
              <div className="metric-card secondary">
                <div className="metric-value">{calculateStats(chartData).total}</div>
                <div className="metric-label">จำนวนความคิดเห็น</div>
                <div className="metric-icon">📊</div>
              </div>
              <div className="metric-card accent">
                <div className="metric-value">{calculateStats(chartData).fiveStarPercentage}%</div>
                <div className="metric-label">ความพึงพอใจสูงสุด</div>
                <div className="metric-icon">🏆</div>
              </div>
            </>
          )}
        </div>

        <div className="chart-section">
          <div className="date-control">
            <button className="date-nav-btn" onClick={() => changeDate(-1)}>
              <span className="nav-icon">←</span>
            </button>
            
            <div className="date-display">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
              />
              <div className="current-date">
                {new Date(selectedDate).toLocaleDateString('th-TH', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            <button className="date-nav-btn" onClick={() => changeDate(1)}>
              <span className="nav-icon">→</span>
            </button>
          </div>

          <div className="visualization-area">
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
      </main>
    </div>
  );
};

export default ChartPage;
