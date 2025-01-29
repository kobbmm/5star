import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Chart } from "chart.js";
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
                    position: "left",
                    align: "start",
                    rtl: false,
                    labels: {
                      usePointStyle: true, // Use point style for better spacing
                      padding: 25, // Spacing between labels
                      font: {
                        family: "serif",
                        size: 12
                      },
                      color: "#8B0000",
                      generateLabels: function(chart) {
                        const data = chart.data;
                        if ((data.labels?.length ?? 0) > 0 && (data.datasets?.length ?? 0) > 0) {
                          return (data.labels ?? []).map((label, i) => {
                            const meta = chart.getDatasetMeta(0);
                            const style = meta.controller.getStyle(i, false);
                            
                            return {
                              text: label as string,
                              fillStyle: Array.isArray(data.datasets[0].backgroundColor) ? data.datasets[0].backgroundColor[i] : undefined,
                              strokeStyle: Array.isArray(data.datasets[0].backgroundColor) ? data.datasets[0].backgroundColor[i] : undefined,
                              lineWidth: 2,
                              hidden: false,
                              index: i
                            };
                          });
                        }
                        return [];
                      }
                    }
                  }
                },
                maintainAspectRatio: false,
                responsive: true,
                layout: {
                  padding: {
                    left: 100,
                    right: 20,
                    top: 20,
                    bottom: 20
                  }
                }
              }}
              height={300}
              width={400}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PieChart;
