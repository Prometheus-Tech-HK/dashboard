import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import { logger } from "../utils/logger.js";

export const getProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    res.json(projects);
  } catch (error) {
    logger.error(error, "Error fetching projects:");
    res.status(500).json({ error: "Internal Server Error" });
  }
};
