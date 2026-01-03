import express from "express";
import type { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { logger } from "./src/utils/logger.js";
import { getCategories } from "./src/handlers/categoryHandler.js";
import { getMonths } from "./src/handlers/monthHandler.js";
import { getTransactions } from "./src/handlers/transactionHandler.js";
import { getProjects } from "./src/handlers/projectHandler.js";
import { login, logout, checkAuth } from "./src/handlers/authHandler.js";
import { authenticateToken } from "./src/middleware/authMiddleware.js";
import { requireAdmin } from "./src/middleware/adminMiddleware.js";
import { getUsers, createUser, updateUser, deleteUser } from "./src/handlers/userHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// API Routes prefixed with /api
const apiRouter = express.Router();

// Auth routes (public)
apiRouter.post("/auth/login", login);
apiRouter.post("/auth/logout", logout);

// Protected routes
apiRouter.get("/auth/me", authenticateToken, checkAuth);
apiRouter.get("/categories", authenticateToken, getCategories);
apiRouter.get("/months", authenticateToken, getMonths);
apiRouter.get("/transactions", authenticateToken, getTransactions);
apiRouter.get("/projects", authenticateToken, getProjects);

// User Management (Admin only)
apiRouter.get("/users", authenticateToken, requireAdmin, getUsers);
apiRouter.post("/users", authenticateToken, requireAdmin, createUser);
apiRouter.put("/users/:id", authenticateToken, requireAdmin, updateUser);
apiRouter.delete("/users/:id", authenticateToken, requireAdmin, deleteUser);

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