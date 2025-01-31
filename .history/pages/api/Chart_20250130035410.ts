import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const date = req.query.date as string || new Date().toISOString().split('T')[0];
      
      // Get daily reviews
      const dailyReviews = await prisma.review.findMany({
        where: {
          date: {
            gte: new Date(date),
            lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
          }
        }
      });

      const total = dailyReviews.length;
      
      const results = Array(5).fill(null).map((_, i) => {
        const rating = i + 1;
        const ratingReviews = dailyReviews.filter(r => r.rating === rating);
        return {
          rating,
          count: ratingReviews.length,
          percentage: total ? (ratingReviews.length / total) * 100 : 0,
          reviews: ratingReviews
        };
      });

      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chart data" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export default handler;
