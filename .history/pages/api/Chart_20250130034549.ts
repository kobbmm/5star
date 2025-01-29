import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Get total count
      const total = await prisma.review.count();
      
      // Get counts and dates by rating
      const data = await prisma.review.groupBy({
        by: ["rating"],
        _count: {
          rating: true,
        },
        _min: {
          date: true
        },
        _max: {
          date: true
        }
      });

      const results = Array(5).fill(null).map((_, i) => ({
        rating: i + 1,
        count: 0,
        percentage: 0,
        firstReview: null,
        lastReview: null
      }));

      data.forEach(({ rating, _count, _min, _max }) => {
        if (rating >= 1 && rating <= 5) {
          const index = rating - 1;
          results[index] = {
            rating,
            count: _count.rating,
            percentage: (_count.rating / total) * 100,
            firstReview: _min.date,
            lastReview: _max.date
          };
        }
      });

      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chart data." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}

export default handler;
