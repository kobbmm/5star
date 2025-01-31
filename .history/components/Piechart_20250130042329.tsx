import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../Style/global.css";

ChartJS.register(ArcElement, Tooltip, Legend);

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
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1a1a1a',
        titleFont: { size: 14, weight: 'bold' },
        bodyColor: '#64748b',
        bodyFont: { size: 13 },
        padding: 12,
        borderColor: '#e2e8f0',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            const dataItem = data[context.dataIndex];
            return `${dataItem.rating} ดาว: ${dataItem.percentage.toFixed(1)}% (${dataItem.count} reviews)`;
          }
        }
      },
      datalabels: {
        color: '#fff',
        font: { size: 14 },
        formatter: (value: number) => value.toFixed(1) + '%'
      }
    },
    maintainAspectRatio: false,
    responsive: true
  };

  return (
    <div className="PieChart">
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
          <Pie data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default PieChart;
