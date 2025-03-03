import React, { useEffect, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartType } from "chart.js";
import type { ChartDataItem } from "@/types";
import Loading from "@/components/Loading/Loading";

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

interface PieChartProps {
  data: ChartDataItem[];
  isLoading: boolean;
  selectedDate: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, isLoading, selectedDate }) => {
  const chartRef = useRef<ChartJS | null>(null);

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
    return <Loading />;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📊</div>
        <h3 className="empty-state-title">ยังไม่มีข้อมูล</h3>
        <p className="empty-state-description">
          ยังไม่มีการประเมินความพึงพอใจในวันที่ {new Date(selectedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);
  if (total === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⭐</div>
        <h3 className="empty-state-title">There are no reviews yet.</h3>
        <p className="empty-state-description">
        No reviews available on {new Date(selectedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
    );
  }

  const chartData = {
    labels: ["1 ดาว", "2 ดาว", "3 ดาว", "4 ดาว", "5 ดาว"],
    datasets: [{
      data: data.map(item => item.percentage),
      backgroundColor: [
        "hsl(0, 83.80%, 92.70%)",
        "rgb(250, 154, 154)",
        "rgb(167, 55, 55)",
        "rgb(104, 20, 20)",
        "hsl(0, 57.40%, 9.20%)"
      ],
      hoverBackgroundColor: [
        "hsl(0, 83.80%, 92.70%)",
        "rgb(250, 154, 154)",
        "rgb(167, 55, 55)",
        "rgb(104, 20, 20)",
        "hsl(0, 57.40%, 9.20%)"
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
          label: function(context: {
            dataIndex: number;
            label?: string;
            raw?: number;
          }) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(1)}% (${data[context.dataIndex].count} ความคิดเห็น)`;
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
        Graph Reviews 
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
                  {item.count} ความคิดเห็น
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
