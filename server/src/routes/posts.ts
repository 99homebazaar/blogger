import { Router, Request, Response } from "express";
import Post from "../models/Post";
import Website from "../models/Website";

const router = Router();

// POST /api/posts
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, shortDescription, category, websiteNames, url, imageUrl } = req.body;

    if (!title || !description || !shortDescription || !category || !url || !imageUrl) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const nameList: string[] = Array.isArray(websiteNames) ? websiteNames : JSON.parse(websiteNames ?? "[]");

    let websiteIds: any[] = [];
    if (nameList.length > 0) {
      const foundWebsites = await Website.find({ name: { $in: nameList } });
      if (foundWebsites.length !== nameList.length) {
        const found = foundWebsites.map((w) => w.name);
        const invalid = nameList.filter((n) => !found.includes(n));
        res.status(400).json({ error: `Invalid website names: ${invalid.join(", ")}` });
        return;
      }
      websiteIds = foundWebsites.map((w) => w._id);
    }

    const post = await Post.create({
      title, description, shortDescription, category,
      imageUrl, url,
      websiteNames: websiteIds,
    });

    const populated = await post.populate("websiteNames", "name");
    res.status(201).json({ success: true, post: populated });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/posts
router.get("/", async (_req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("websiteNames", "name").sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/posts/name/:name — must be before /:id
router.get("/name/:name", async (req: Request, res: Response) => {
  try {
    const name = req.params.name;
    const website = await Website.findOne({ name });
    if (!website) { res.status(404).json({ error: "Website not found" }); return; }

    const posts = await Post.find({ websiteNames: website._id }).populate("websiteNames", "name");
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/posts/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate("websiteNames", "name");
    if (!post) { res.status(404).json({ error: "Post not found" }); return; }
    res.json({ post });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// DELETE /api/posts/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
