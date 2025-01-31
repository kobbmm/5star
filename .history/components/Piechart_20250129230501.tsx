import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../Style/PieChart.css"; // นำเข้าไฟล์ CSS
i

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
    <div className="pie-chart-container  p-40 ">
      <h2 className="pie-chart-title ">GRAPH REVIEWS</h2>
      {isLoading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div className="pie-chart-wrapper">
          <Pie
            data={chartData}
            options={{
              plugins: {
                legend: {
                  display: true,
                  position: "left", // กำหนดตำแหน่ง Legend
                  labels: {
                    color: "#8B0000",
                    font: {
                      family: "serif",
                      size: 12,
                    },
                  },
                },
              },
              
              
              maintainAspectRatio: false,
              responsive: true,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PieChart;
