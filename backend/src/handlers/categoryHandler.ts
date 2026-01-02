import { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import { logger } from "../utils/logger.js";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.transaction.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
      orderBy: {
        category: 'asc',
      },
    });
    res.json(categories.map(c => c.category));
  } catch (error) {
    logger.error(error, "Error fetching categories:");
    res.status(500).json({ error: "Internal Server Error" });
  }
};
