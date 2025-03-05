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
      <div className="empty-state w-full h-full">
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
      <div className="empty-state w-full h-full">
        <div className="empty-state-icon">⭐</div>
        <h3 className="empty-state-title">ยังไม่มีรีวิว</h3>
        <p className="empty-state-description">
          ไม่มีรีวิวในวันที่ {new Date(selectedDate).toLocaleDateString('th-TH', {
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
        "hsl(0, 83.80%, 92.70%)",      // 1 ดาว - สีชมพูอ่อน
        "rgb(250, 154, 154)",          // 2 ดาว - สีชมพูเข้ม
        "rgb(167, 55, 55)",            // 3 ดาว - สีแดงอิฐ
        "rgb(104, 20, 20)",            // 4 ดาว - สีแดงเข้ม
        "hsl(0, 57.40%, 9.20%)",       // 5 ดาว - สีน้ำตาลแดง
      ],
      hoverBackgroundColor: [
        "hsl(0, 83.80%, 92.70%)",
        "rgb(250, 154, 154)",
        "rgb(167, 55, 55)",
        "rgb(104, 20, 20)",
        "hsl(0, 57.40%, 9.20%)"
      ],
      borderWidth: 0,
      offset: [0, 0, 30, 0, 0],        // เพิ่ม offset เพื่อทำให้ชิ้นส่วนกราฟแยกออกมาเล็กน้อย
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
      }
    },
    maintainAspectRatio: false,
    responsive: true,
    layout: {
      padding: 20
    },
    radius: '90%',
    cutout: '0%',      // ตั้งค่าเป็น 0% เพื่อให้เป็นวงกลมเต็ม ไม่เป็นโดนัท
    rotation: -90,      // หมุนเพื่อให้ส่วนที่แยกออกมาอยู่ด้านบน
  };

  return (
    <div className="PieChart w-full h-full flex flex-col">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      <h2 className="pie-chart-title text-center text-2xl font-bold text-primary mb-6">
        GRAPH REVIEWS
      </h2>
      <div className="Pie-chart-container flex flex-col-reverse md:flex-row items-center gap-8 flex-grow">
        <div className="legend w-full md:w-2/5 p-4 bg-white/50 rounded-lg">
          {data.map((item, index) => (
            <div key={index} className="legend-item flex items-center mb-3 p-2">
              <span 
                className="legend-color w-6 h-6 rounded mr-2" 
                style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
              />
              <span className="legend-label text-lg font-medium">
                {`${item.rating} ดาว (${item.percentage.toFixed(1)}%)`}
                <div className="legend-count text-sm text-gray-600">
                  {item.count} ความคิดเห็น
                </div>
              </span>
            </div>
          ))}
        </div>
        <div className="pie-chart-wrapper w-full md:w-3/5 flex-grow flex items-center justify-center">
          <Pie 
            ref={chartRef} 
            data={chartData} 
            options={options} 
          />
        </div>
      </div>
    </div>
  );
};

export default PieChart;
