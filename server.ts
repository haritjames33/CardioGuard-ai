import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import morgan from "morgan";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());

  // Mock API routes for "Django-like" backend
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "CardioGuard AI Backend is running" });
  });

  // Save prediction history to "Supabase" (simulated or real)
  app.post("/api/predictions", (req, res) => {
    const { patientData, result } = req.body;
    // In a real app, this would use the supabase-js client
    console.log("Saving prediction:", { patientData, result });
    res.json({ success: true, id: Math.random().toString(36).substr(2, 9) });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
