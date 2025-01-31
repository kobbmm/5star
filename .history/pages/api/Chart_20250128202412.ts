import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const data = await prisma.review.groupBy({
        by: ["rating"],
        _count: {
          rating: true,
        },
      });

      const counts = Array(5).fill(0);
      data.forEach(({ rating, _count }) => {
        if (rating >= 1 && rating <= 5) {
          counts[rating - 1] = _count.rating;
        }
      });

      res.status(200).json(counts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chart data." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}

export default handler;
