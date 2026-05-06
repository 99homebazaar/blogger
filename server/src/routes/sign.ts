import { Router, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

const router = Router();

// GET /api/sign — returns signature for direct Cloudinary upload
router.get("/", (_req: Request, res: Response) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: "blogger" },
    process.env.CLOUDINARY_API_SECRET!
  );

  res.json({
    timestamp,
    signature,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  });
});

export default router;
