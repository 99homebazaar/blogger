"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
type Website = { _id: string; name: string };

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWebsites = () =>
    fetch(`${API}/api/websites`).then((r) => r.json()).then((d) => setWebsites(d.websites ?? []));

  useEffect(() => { fetchWebsites(); }, []);

  const addWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError("");
    setLoading(true);
    const res = await fetch(`${API}/api/websites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    setName("");
    fetchWebsites();
  };

  const deleteWebsite = async (id: string) => {
    await fetch(`${API}/api/websites/${id}`, { method: "DELETE" });
    fetchWebsites();
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-6 text-white">Manage Websites</h1>

      {/* Add form */}
      <div className="card mb-6">
        <form onSubmit={addWebsite} className="flex gap-3">
          <input className="input" placeholder="Website name (e.g. Dev.to)" value={name}
            onChange={(e) => setName(e.target.value)} required />
          <button type="submit" className="btn-primary shrink-0" disabled={loading}>
            {loading ? "..." : "+ Add"}
          </button>
        </form>
        {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
      </div>

      {/* List */}
      <div className="card flex flex-col gap-2">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Saved Websites ({websites.length})</p>
        {websites.length === 0 && (
          <p className="text-sm text-gray-600 italic">No websites yet. Add one above.</p>
        )}
        {websites.map((w) => (
          <div key={w._id} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-sm text-gray-200">{w.name}</span>
            <button onClick={() => deleteWebsite(w._id)}
              className="text-xs text-gray-600 hover:text-red-400 transition-colors cursor-pointer px-2 py-1">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
