import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    websiteNames: [{ type: Schema.Types.ObjectId, ref: "Website" }],
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
