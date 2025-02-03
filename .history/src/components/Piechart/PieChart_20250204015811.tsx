import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { rateLimit } from "@/lib/rate-limit";

// Initialize Prisma
const prisma = new PrismaClient();

// Rate limiter: 100 requests per minute
const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500
});

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
      datalabels: {
        color: '#fff',
        font: { size: 14, weight: 'bold' },
        formatter: (value: number) => value.toFixed(1) + '%',
        anchor: 'center',
        align: 'center',
        offset: 0
      }
    },
    maintainAspectRatio: true,
    responsive: true,
    layout: {
      padding: 20
    }
  };

  return (
    <div className="PieChart">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
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

export async function GET(request: Request) {
  try {
    // Rate limiting
    await limiter.check(5, "CACHE_TOKEN");

    // Get and validate date parameter
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    
    if (!date || !isValidDate(date)) {
      return NextResponse.json(
        { error: "Invalid date parameter" },
        { status: 400 }
      );
    }

    // Query database
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const reviews = await prisma.review.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate
        }
      },
      select: {
        rating: true,
        comment: true
      }
    });

    // Process data
    const results = processReviewData(reviews);

    return NextResponse.json(results);

  } catch (error) {
    console.error("[Chart API Error]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

function processReviewData(reviews: any[]) {
  const total = reviews.length;
  return Array(5).fill(null).map((_, i) => {
    const rating = i + 1;
    const ratingReviews = reviews.filter(r => r.rating === rating);
    return {
      rating,
      count: ratingReviews.length,
      percentage: total ? (ratingReviews.length / total) * 100 : 0,
      reviews: ratingReviews
    };
  });
}

export function rateLimit({ interval, uniqueTokenPerInterval }: {
  interval: number;
  uniqueTokenPerInterval: number;
}) {
  const tokenCache = new Map();

  return {
    check: async (limit: number, token: string) => {
      const now = Date.now();
      const windowStart = now - interval;
      
      const tokenCount = tokenCache.get(token) || 0;
      if (tokenCount > limit) {
        throw new Error('Rate limit exceeded');
      }
      
      tokenCache.set(token, tokenCount + 1);
      return true;
    }
  };
}
