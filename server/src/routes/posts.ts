import { Router, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import Post from "../models/Post";
import Website from "../models/Website";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/posts
router.post("/", upload.single("image"), async (req: Request, res: Response) => {
  try {
    const { title, description, shortDescription, category, websiteNames } = req.body;

    if (!title || !description || !shortDescription || !category || !req.file) {
      res.status(400).json({ error: "All fields including image are required" });
      return;
    }

    // configure cloudinary here so dotenv is already loaded
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // parse websiteNames (sent as JSON string from FormData)
    const nameList: string[] = typeof websiteNames === "string" ? JSON.parse(websiteNames) : websiteNames ?? [];

    // validate names only if provided
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

    const base64 = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;
    const uploaded = await cloudinary.uploader.upload(dataUri, { folder: "blogger" });

    const post = await Post.create({
      title,
      description,
      shortDescription,
      category,
      imageUrl: uploaded.secure_url,
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

router.get("/name/:name", async (req: Request, res: Response) => {
try {
    const website = await Website.findOne({ name: req.params.name });
    if (!website) { res.status(404).json({ error: "Website not found" }); return; }

    const posts = await Post.find({ websiteNames: website._id });
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
