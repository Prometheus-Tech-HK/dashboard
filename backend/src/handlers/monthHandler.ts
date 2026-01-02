import { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import { logger } from "../utils/logger.js";

export const getMonths = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      select: {
        transactionDate: true,
      },
      orderBy: {
        transactionDate: 'asc',
      },
    });

    const monthMap = new Map<string, { start: string; end: string }>();

    transactions.forEach(t => {
      const d = new Date(t.transactionDate);
      const year = d.getFullYear();
      const month = d.getMonth();
      const key = `${year}-${month}`;

      if (!monthMap.has(key)) {
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
        monthMap.set(key, { 
          start: start.toISOString(), 
          end: end.toISOString() 
        });
      }
    });

    res.json(Array.from(monthMap.values()));
  } catch (error) {
    logger.error(error, "Error fetching months:");
    res.status(500).json({ error: "Internal Server Error" });
  }
};
