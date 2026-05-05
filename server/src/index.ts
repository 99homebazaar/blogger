import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import postRoutes from "./routes/posts";
import websiteRoutes from "./routes/websites";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/posts", postRoutes);
app.use("/api/websites", websiteRoutes);

app.get("/", (_req, res) => res.json({ message: "Blogger API running" }));

connectDB();

// local dev
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

export default app;
