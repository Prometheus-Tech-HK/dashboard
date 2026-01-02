import express from "express";
import type { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "./src/utils/logger.js";
import { getCategories } from "./src/handlers/categoryHandler.js";
import { getMonths } from "./src/handlers/monthHandler.js";
import { getTransactions } from "./src/handlers/transactionHandler.js";
import { getProjects } from "./src/handlers/projectHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// API Routes prefixed with /api
const apiRouter = express.Router();

apiRouter.get("/categories", getCategories);
apiRouter.get("/months", getMonths);
apiRouter.get("/transactions", getTransactions);
apiRouter.get("/projects", getProjects);

app.use("/api", apiRouter);

// Any request that doesn't match an API route or a static file serves index.html
app.use((req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } else {
    res.status(404).json({ error: "API endpoint not found" });
  }
});


app.listen(port, () => {
  logger.info(`Backend server listening on port ${port}`);
});