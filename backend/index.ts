import express from "express";
import type { Request, Response } from "express";
import { logger } from "./src/utils/logger.js";
import { getCategories } from "./src/handlers/categoryHandler.js";
import { getMonths } from "./src/handlers/monthHandler.js";
import { getTransactions } from "./src/handlers/transactionHandler.js";
import { getProjects } from "./src/handlers/projectHandler.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Backend!");
});

app.get("/categories", getCategories);
app.get("/months", getMonths);
app.get("/transactions", getTransactions);
app.get("/projects", getProjects);

app.listen(port, () => {
  logger.info(`Backend server listening on port ${port}`);
});