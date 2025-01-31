import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../Style/global.css"; // นำเข้าไฟล์ CSS

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, isLoading }: { data: number[]; isLoading: boolean }) => {
  const chartData = {
    labels: ["1 ดาว", "2 ดาว", "3 ดาว", "4 ดาว", "5 ดาว"],
    datasets: [
      {
        data,
        backgroundColor: ["#FADBD8", "#F5B7B1", "#EC7063", "#CD6155", "#943126"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="PieChart">
      <h2 className="pie-chart-title">GRAPH REVIEWS</h2>
      <div className="chart-legend-container">
        <div className="legend-wrapper">
          {chartData.labels.map((label, index) => (
            <div key={index} className="legend-item">
              <span 
                className="legend-color" 
                style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
              />
              <span className="legend-label">{label}</span>
            </div>
          ))}
        </div>
        <div className="pie-chart-wrapper">
          <Pie
            data={chartData}
            options={{
              plugins: {
                legend: {
                  display: false // Hide default legend
                }
              },
              maintainAspectRatio: false,
              responsive: true
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PieChart;
