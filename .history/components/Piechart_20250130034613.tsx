import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../Style/global.css"; // นำเข้าไฟล์ CSS

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

  return (
    <div className="PieChart">
      <h2 className="pie-chart-title">GRAPH REVIEWS</h2>
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
                <div className="legend-dates">
                  <small>First: {new Date(item.firstReview).toLocaleDateString()}</small>
                  <small>Last: {new Date(item.lastReview).toLocaleDateString()}</small>
                </div>
              </span>
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
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const dataItem = data[context.dataIndex];
                      return [
                        `${dataItem.percentage.toFixed(1)}%`,
                        `Reviews: ${dataItem.count}`,
                        `First: ${new Date(dataItem.firstReview).toLocaleDateString()}`,
                        `Last: ${new Date(dataItem.lastReview).toLocaleDateString()}`
                      ];
                    }
                  }
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
