import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import { logger } from "../utils/logger.js";

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { from, to, category, type } = req.query;

    const filters: any = {};

    if (from || to) {
      filters.transactionDate = {};
      if (from) filters.transactionDate.gte = new Date(from as string);
      if (to) filters.transactionDate.lt = new Date(to as string);
    }

    if (category) {
      filters.category = category as string;
    }

    if (type) {
      filters.type = type as string;
    }

    if (req.query.projectId && req.query.projectId !== 'all') {
      filters.projectId = parseInt(req.query.projectId as string);
    }

    const transactions = await prisma.transaction.findMany({
      where: filters,
      orderBy: {
        transactionDate: 'desc',
      },
    });

    res.json(transactions);
  } catch (error) {
    logger.error(error, "Error fetching transactions:");
    res.status(500).json({ error: "Internal Server Error" });
  }
};
