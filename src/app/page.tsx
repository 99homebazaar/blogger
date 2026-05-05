"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Website = { _id: string; name: string };

export default function CreatePost() {
  const [form, setForm] = useState({ title: "", description: "", shortDescription: "", category: "" });
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
      const fd = new FormData();
      fd.append("image", imageFile);
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("shortDescription", form.shortDescription);
      fd.append("category", form.category);
      fd.append("websiteNames", JSON.stringify(selected));

      const res = await fetch(`${API}/api/posts`, { method: "POST", body: fd });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) { setError(data.error || "Failed to publish"); return; }
      setSuccess(true);
      setForm({ title: "", description: "", shortDescription: "", category: "" });
      setImageFile(null);
      setPreview("");
      setSelected([]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setLoading(false);
      setError((err as Error).message || "Network error");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-6 text-white">Create Post</h1>

      <div className="card flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input className="input" name="title" placeholder="Title" required
            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

          <input className="input" name="shortDescription" placeholder="Short Description" required
            value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />

          <textarea className="input resize-none" name="description" placeholder="Full Description"
            required rows={5} value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <input className="input" name="category" placeholder="Category" required
            value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />

          {/* Image */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500 uppercase tracking-wider">Cover Image</label>
            <label className="flex items-center gap-3 cursor-pointer bg-[#13131f] border border-dashed border-white/10 rounded-xl p-4 hover:border-indigo-500/50 transition-colors">
              <span className="text-2xl">🖼️</span>
              <span className="text-sm text-gray-400">{imageFile ? imageFile.name : "Click to upload image"}</span>
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" required />
            </label>
            {preview && <img src={preview} alt="preview" className="rounded-xl h-44 object-cover w-full" />}
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
                        : "bg-transparent border-white/10 text-gray-400 hover:border-indigo-500/50"
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
