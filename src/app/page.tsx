"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Website = { _id: string; name: string };

const toSlug = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

export default function CreatePost() {
  const [form, setForm] = useState({
    title: "", description: "", shortDescription: "", category: "",
    metaTitle: "", metaDescription: "", slug: "", imgAlt: "", schemaMarkup: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/api/websites`)
      .then((r) => r.json())
      .then((d) => setWebsites(d.websites ?? []));
  }, []);

  const toggle = (name: string) =>
    setSelected((prev) => prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) { setError("Please select an image"); return; }
    if (selected.length === 0) { setError("Select at least one website"); return; }
    setError("");
    setLoading(true);

    try {
      const sigRes = await fetch(`${API}/api/sign`);
      const { timestamp, signature, api_key, cloud_name } = await sigRes.json();

      const fd = new FormData();
      fd.append("file", imageFile);
      fd.append("timestamp", timestamp);
      fd.append("signature", signature);
      fd.append("api_key", api_key);
      fd.append("folder", "blogger");

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
        method: "POST",
        body: fd,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) { setError(uploadData.error?.message || "Image upload failed"); setLoading(false); return; }

      const res = await fetch(`${API}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          shortDescription: form.shortDescription,
          category: form.category,
          imageUrl: uploadData.secure_url,
          websiteNames: selected,
          metaTitle: form.metaTitle,
          metaDescription: form.metaDescription,
          slug: form.slug,
          imgAlt: form.imgAlt,
          schemaMarkup: form.schemaMarkup,
        }),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) { setError(data.error || "Failed to publish"); return; }
      setSuccess(true);
      setForm({ title: "", description: "", shortDescription: "", category: "", metaTitle: "", metaDescription: "", slug: "", imgAlt: "", schemaMarkup: "" });
      setImageFile(null);
      setPreview("");
      setSelected([]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setLoading(false);
      setError((err as Error).message || "Network error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-6 text-gray-800">Create Post</h1>

      <div className="card flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input className="input" placeholder="H1 Tag / Title" required
            value={form.title} onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({ ...f, title, slug: toSlug(title), metaTitle: f.metaTitle || title }));
            }} />

          <input className="input" placeholder="Short Description" required
            value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 uppercase tracking-wider">Full Description</label>
            <div data-color-mode="light">
              <MDEditor
                value={form.description}
                onChange={(val) => setForm({ ...form, description: val ?? "" })}
                height={250}
                preview="edit"
              />
            </div>
          </div>

          <input className="input" placeholder="Category" required
            value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />

          {/* SEO Fields */}
          <div className="flex flex-col gap-3 border border-dashed border-indigo-200 rounded-xl p-4 bg-indigo-50/40">
            <p className="text-xs text-indigo-400 uppercase tracking-wider font-semibold">SEO Settings</p>
            <input className="input" placeholder="Meta Title"
              value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} />
            <input className="input" placeholder="Meta Description"
              value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} />
            <input className="input" placeholder="SEO Slug (auto-generated from title)"
              value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <input className="input" placeholder="Image Alt Tag"
              value={form.imgAlt} onChange={(e) => setForm({ ...form, imgAlt: e.target.value })} />
            <textarea className="input resize-none" rows={4}
              placeholder={`Schema Markup (JSON-LD)\n{\n  "@context": "https://schema.org",\n  "@type": "Article"\n}`}
              value={form.schemaMarkup} onChange={(e) => setForm({ ...form, schemaMarkup: e.target.value })} />
          </div>

          {/* Image */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500 uppercase tracking-wider">Cover Image</label>
            <label className="flex items-center gap-3 cursor-pointer bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 hover:border-indigo-400 transition-colors">
              <span className="text-2xl">🖼️</span>
              <span className="text-sm text-gray-500">{imageFile ? imageFile.name : "Click to upload image"}</span>
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" required />
            </label>
            {preview && <img src={preview} alt={form.imgAlt || "preview"} className="rounded-xl h-44 object-cover w-full" />}
          </div>

          {/* Websites */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500 uppercase tracking-wider">Target Websites</label>
            {websites.length === 0 ? (
              <p className="text-sm text-gray-600 italic">No websites found. Add them in the Websites page.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {websites.map((w) => (
                  <button key={w._id} type="button" onClick={() => toggle(w.name)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                      selected.includes(w.name)
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "bg-white border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-500"
                    }`}>
                    {w.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-400 bg-red-500/10 px-4 py-2 rounded-lg">{error}</p>}
          {success && <p className="text-sm text-green-400 bg-green-500/10 px-4 py-2 rounded-lg">✅ Post published successfully!</p>}

          <button type="submit" className="btn-primary mt-1" disabled={loading}>
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
