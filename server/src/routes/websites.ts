import { Router, Request, Response } from "express";
import Website from "../models/Website";

const router = Router();

// GET /api/websites — get all websites
router.get("/", async (_req: Request, res: Response) => {
  try {
    const websites = await Website.find().sort({ name: 1 });
    res.json({ websites });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /api/websites — add a new website name
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) { res.status(400).json({ error: "Name is required" }); return; }
    const website = await Website.create({ name });
    res.status(201).json({ success: true, website });
  } catch (err: any) {
    if (err.code === 11000) { res.status(409).json({ error: "Website already exists" }); return; }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/websites/:id — remove a website
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await Website.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
