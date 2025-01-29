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
                    align: "center", // จัดตำแหน่งแนวตั้ง
                    rtl: false, // Ensures legend items are left-aligned
                    labels: {
                      padding: 30, // เพิ่ม padding ระหว่าง labels
                      boxWidth: 20, // ปรับขนาดกล่องสี
                      color: "#8B0000",
                      font: {
                        family: "serif",
                        size: 12,
                      },
                      generateLabels: (chart) => {
                        // Custom label generation to add more spacing
                        const original = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                        return original.map(label => ({
                          ...label,
                          margin: 20 // Add margin between items
                        }));
                      }
                    },
                  },
                },
                maintainAspectRatio: false, // Allow chart to be resized independently
                responsive: true,
                layout: {
                  padding: {
                    left: 100, // Add space for legend
                  }
                },
              }}
              height={300} // Explicit height
              width={400}  // Explicit width
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PieChart;
