import React, { useEffect, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export interface ChartData {
  rating: number;
  count: number;
  percentage: number;
  total: number;
  date: string;
}

export type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
}

interface ChartDataItem {
  rating: number;
  count: number;
  percentage: number;
  firstReview: string;
  lastReview: string;
}

const PieChart = ({ 
  data, 
  isLoading, 
  selectedDate 
}: { 
  data: ChartDataItem[]; 
  isLoading: boolean;
  selectedDate: string;
}) => {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  // Add error boundary
  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return <div className="no-data">ไม่พบข้อมูลสำหรับวันที่เลือก</div>;
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);
  if (total === 0) {
    return <div className="no-data">ไม่มีรีวิวในวันที่เลือก</div>;
  }

  const chartData = {
    labels: ["1 ดาว", "2 ดาว", "3 ดาว", "4 ดาว", "5 ดาว"],
    datasets: [{
      data: data.map(item => item.percentage),
      backgroundColor: [
        "#f472b6", // Pink
        "#a78bfa", // Purple
        "#60a5fa", // Blue
        "#34d399", // Green
        "#fbbf24"  // Yellow
      ],
      borderWidth: 0,
    }],
  };

  const options = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        mode: 'nearest',
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(1)}% (${data[context.dataIndex].count} reviews)`;
          }
        }
      },
      datalabels: {
        color: '#fff',
        font: { size: 14, weight: 'bold' },
        formatter: (value: number) => value.toFixed(1) + '%',
        anchor: 'center',
        align: 'center',
        offset: 0
      }
    },
    maintainAspectRatio: false,
    responsive: true,
    layout: {
      padding: 20
    }
  };

  return (
    <div className="PieChart">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      <h2 className="pie-chart-title">
        Reviews for {new Date(selectedDate).toLocaleDateString()}
      </h2>
      <div className="Pie-chart-container">
        <div className="label">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <span 
                className="legend-color" 
                style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
              />
              <span className="legend-label">
                {`${item.rating} ดาว (${item.percentage.toFixed(1)}%)`}
                <div className="legend-count">
                  Reviews: {item.count}
                </div>
              </span>
            </div>
          ))}
        </div>
        <div className="pie-chart-wrapper">
          <Pie ref={chartRef} data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default PieChart;
