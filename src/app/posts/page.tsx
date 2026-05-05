"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Post = {
  _id: string;
  title: string;
  shortDescription: string;
  category: string;
  imageUrl: string;
  websiteNames: { _id: string; name: string }[];
  createdAt: string;
};

type Website = { _id: string; name: string };

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const fetchPosts = (websiteName?: string) => {
    setLoading(true);
    const url = websiteName
      ? `${API}/api/posts/name/${encodeURIComponent(websiteName)}`
      : `${API}/api/posts`;

    fetch(url)
      .then((r) => r.json())
      .then((d) => { setPosts(d.posts ?? []); setLoading(false); });
  };

  useEffect(() => {
    fetch(`${API}/api/websites`)
      .then((r) => r.json())
      .then((d) => setWebsites(d.websites ?? []));
    fetchPosts();
  }, []);

  const handleFilter = (name: string) => {
    setActiveFilter(name);
    fetchPosts(name === "all" ? undefined : name);
  };

  const deletePost = async (id: string) => {
    await fetch(`${API}/api/posts/${id}`, { method: "DELETE" });
    fetchPosts(activeFilter === "all" ? undefined : activeFilter);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-6 text-white">All Posts ({posts.length})</h1>

      {/* Website filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleFilter("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
            activeFilter === "all"
              ? "bg-indigo-600 border-indigo-600 text-white"
              : "bg-transparent border-white/10 text-gray-400 hover:border-indigo-500/50"
          }`}>
          All
        </button>
        {websites.map((w) => (
          <button key={w._id} onClick={() => handleFilter(w.name)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
              activeFilter === w.name
                ? "bg-indigo-600 border-indigo-600 text-white"
                : "bg-transparent border-white/10 text-gray-400 hover:border-indigo-500/50"
            }`}>
            {w.name}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500 text-sm">Loading...</p>}

      {!loading && posts.length === 0 && (
        <div className="card text-center text-gray-600 text-sm py-12">No posts found.</div>
      )}

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <div key={post._id} className="card flex gap-4">
            <img src={post.imageUrl} alt={post.title}
              className="w-28 h-24 rounded-xl object-cover shrink-0" />
            <div className="flex flex-col flex-1 gap-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-base font-semibold text-white truncate">{post.title}</h2>
                <button onClick={() => deletePost(post._id)}
                  className="text-xs text-gray-600 hover:text-red-400 transition-colors shrink-0 cursor-pointer">
                  Delete
                </button>
              </div>
              <p className="text-sm text-gray-500 truncate">{post.shortDescription}</p>
              <div className="flex items-center gap-2 mt-auto flex-wrap">
                <span className="tag">{post.category}</span>
                {post.websiteNames?.map((w) => (
                  <span key={w._id} className="tag">{w.name}</span>
                ))}
                <span className="text-xs text-gray-600 ml-auto">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
