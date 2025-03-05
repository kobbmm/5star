"use client";

import Loading from "@/components/Loading/Loading";
import type { ChartDataItem, ApiResponse } from "@/types";
import PieChart from "@/components/Piechart/PieChart";
import { useEffect, useState } from "react";

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
    <div className="min-h-screen h-screen flex flex-col bg-primary">
      <div className="w-full h-full flex flex-col p-4 sm:p-6 lg:p-8">
        <div className="w-full bg-white rounded-lg shadow-lg p-4 md:p-6 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-6 max-w-2xl mx-auto w-full">
            <button 
              onClick={() => changeDate(-1)} 
              className="flex items-center text-primary hover:text-primary-dark transition-colors px-4 py-2 rounded-md hover:bg-red-50"
              disabled={loading}
            >
              <span className="mr-2 text-xl">←</span>
              <span className="font-medium">วันก่อนหน้า</span>
            </button>

            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border-2 border-red-200 rounded-md px-4 py-2 focus:outline-none focus:border-primary text-center"
                disabled={loading}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary">📅</span>
            </div>

            <button 
              onClick={() => changeDate(1)} 
              className="flex items-center text-primary hover:text-primary-dark transition-colors px-4 py-2 rounded-md hover:bg-red-50"
              disabled={loading}
            >
              <span className="font-medium">วันถัดไป</span>
              <span className="ml-2 text-xl">→</span>
            </button>
          </div>

          <div className="chart-container bg-red-50 rounded-xl p-4 md:p-8 flex-grow flex flex-col">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loading />
              </div>
            ) : error ? (
              <div className="error-message flex flex-col items-center justify-center text-center p-8 h-full">
                <span className="text-4xl mb-4">⚠️</span>
                <p className="text-lg font-medium text-red-600">{error}</p>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <PieChart 
                  data={chartData} 
                  isLoading={loading} 
                  selectedDate={selectedDate} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPage;
