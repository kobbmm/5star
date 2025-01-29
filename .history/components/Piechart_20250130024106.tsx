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
      <div className="pie-chart-container">
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
                      margin 20,
                    },
                  },
                },
                layout: {
                  padding: {
                    left: 60, // เพิ่ม padding ซ้าย (ระยะห่างระหว่าง Legend กับ Chart)
                    right: 20,
                    top: 20,
                    bottom: 20,
                  },
                },
                maintainAspectRatio: false,
                responsive: true,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PieChart;
