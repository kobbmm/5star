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

const PieChart = ({ data, isLoading }: { data: ChartDataItem[]; isLoading: boolean }) => {
  const chartData = {
    labels: ["1 ดาว", "2 ดาว", "3 ดาว", "4 ดาว", "5 ดาว"],
    datasets: [{
      data: data.map(item => item.percentage),
      backgroundColor: ["#FADBD8", "#F5B7B1", "#EC7063", "#CD6155", "#943126"],
      borderWidth: 0,
    }],
  };

  const options = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
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
      <h2 className="pie-chart-title">Daily Reviews</h2>
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
