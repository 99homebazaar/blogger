import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import postRoutes from "./routes/posts";
import websiteRoutes from "./routes/websites";
import signRoute from "./routes/sign";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/posts", postRoutes);
app.use("/api/websites", websiteRoutes);
app.use("/api/sign", signRoute);

app.get("/", (_req, res) => res.json({ message: "Blogger API running" }));

connectDB();

// local dev
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

export default app;
