"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Post = {
  _id: string; title: string; shortDescription: string;
  description: string; category: string; imageUrl: string;
  imgAlt: string; createdAt: string;
};

export default function PreviewPost() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    fetch(`${API}/api/posts/${id}`).then((r) => r.json()).then((d) => setPost(d.post));
  }, [id]);

  if (!post) return (
    <div className="sti-wrap">
      <div className="sti-inner">
        <div className="sti-sk" style={{ height: 400, marginBottom: 28 }} />
        <div className="sti-sk" style={{ height: 13, width: 120 }} />
        <div className="sti-sk" style={{ height: 38, width: "80%" }} />
        <div className="sti-sk" style={{ height: 13, width: "100%" }} />
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        .sti-wrap{--acc:#c8602a;--acc-bg:#fdf3ee;--dark:#1a1208;--body:#3a2e22;--mid:#5c4a3a;--muted:#8a7060;--border:#e5d9ce;width:100%;max-width:100%;font-family:'Lora',Georgia,serif;color:var(--body);box-sizing:border-box;}
        .sti-wrap *,.sti-wrap *::before,.sti-wrap *::after{box-sizing:border-box;}
        @keyframes sti-sh{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .sti-sk{border-radius:5px;background:linear-gradient(90deg,#ede5dc 25%,#d9cdc2 50%,#ede5dc 75%);background-size:200% 100%;animation:sti-sh 1.5s infinite;margin-bottom:12px;}
        .sti-inner{max-width:800px;margin:0 auto;padding:0 clamp(14px,4vw,28px);}
        .sti-hero{width:100%;height:420px;border-radius:8px;overflow:hidden;margin-bottom:32px;position:relative;background:var(--border);}
        .sti-hero img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .7s ease;}
        .sti-hero:hover img{transform:scale(1.03);}
        .sti-hero-grad{position:absolute;inset:0;background:linear-gradient(to top,rgba(26,18,8,.55) 0%,transparent 52%);}
        @media(max-width:600px){.sti-hero{height:220px;}}
        .sti-meta{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:16px;}
        .sti-badge{background:var(--acc);color:#fff;font-size:10px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;padding:5px 12px;border-radius:3px;}
        .sti-dot{width:4px;height:4px;border-radius:50%;background:var(--border);}
        .sti-date{font-size:13px;color:var(--muted);font-style:italic;}
        .sti-h1{font-family:'Playfair Display',serif!important;font-size:clamp(26px,4.5vw,42px)!important;font-weight:800!important;color:var(--dark)!important;line-height:1.22!important;margin:0 0 18px!important;}
        .sti-lead{font-size:17px;font-style:italic;color:var(--mid);line-height:1.82;border-left:3px solid var(--acc);padding-left:18px;margin:0 0 36px!important;}
        .sti-orn{text-align:center;margin:4px 0 36px;color:var(--acc);font-size:17px;letter-spacing:10px;opacity:.4;}
        .sti-body *{max-width:100%;box-sizing:border-box;}
        .sti-body h1,.sti-body h2,.sti-body h3,.sti-body h4,.sti-body h5,.sti-body h6{all:revert;font-family:'Playfair Display',serif!important;color:var(--dark)!important;}
        .sti-body h2{font-size:22px!important;font-weight:700!important;line-height:1.3!important;margin:36px 0 12px!important;}
        .sti-body h3{font-size:18px!important;font-weight:600!important;margin:28px 0 10px!important;}
        .sti-body p{all:revert;font-family:'Lora',Georgia,serif!important;margin:0 0 15px!important;line-height:1.9!important;color:var(--body)!important;font-size:16.5px!important;}
        .sti-body ul,.sti-body ol{all:revert;padding-left:26px!important;margin:0 0 18px!important;font-family:'Lora',Georgia,serif!important;}
        .sti-body li{all:revert;margin-bottom:8px!important;color:var(--body)!important;line-height:1.75!important;font-size:16.5px!important;}
        .sti-body ul li{list-style-type:disc!important;}
        .sti-body ol li{list-style-type:decimal!important;}
        .sti-body strong,.sti-body b{font-weight:700!important;color:var(--dark)!important;}
        .sti-body em,.sti-body i{font-style:italic!important;}
        .sti-body a{color:var(--acc)!important;text-decoration:underline!important;text-underline-offset:3px!important;}
        .sti-body blockquote{all:revert;border-left:3px solid var(--acc)!important;padding:14px 20px!important;margin:24px 0!important;color:var(--mid)!important;font-style:italic!important;background:var(--acc-bg)!important;border-radius:0 5px 5px 0!important;}
        .sti-body img{max-width:100%!important;height:auto!important;border-radius:6px!important;margin:22px 0!important;display:block!important;}
        .sti-body pre{background:var(--acc-bg)!important;padding:14px 18px!important;border-radius:6px!important;overflow-x:auto!important;margin-bottom:16px!important;}
        .sti-body code{background:var(--acc-bg)!important;padding:2px 6px!important;border-radius:3px!important;font-size:0.9em!important;}
        .sti-divider{border:none;border-top:1px solid var(--border);margin:36px 0!important;}
        .sti-back-row{margin-top:52px;padding-top:24px;border-top:1px solid var(--border);}
        .sti-back{display:inline-flex;align-items:center;gap:8px;color:var(--acc)!important;font-size:12px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;text-decoration:none!important;cursor:pointer;transition:gap .2s;}
        .sti-back:hover{gap:13px;}
        @keyframes sti-in{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        #sti-content{animation:sti-in .45s ease both;}
      `}</style>

      <div className="sti-wrap">
        <div id="sti-content" className="sti-inner">
          {post.imageUrl && (
            <div className="sti-hero">
              <img src={post.imageUrl} alt={post.imgAlt || post.title} />
              <div className="sti-hero-grad" />
            </div>
          )}

          <div className="sti-meta">
            <span className="sti-badge">{post.category}</span>
            <span className="sti-dot" />
            <span className="sti-date">
              {new Date(post.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>

          <h1 className="sti-h1">{post.title}</h1>
          {post.shortDescription && <p className="sti-lead">{post.shortDescription}</p>}
          <div className="sti-orn">✦ ✦ ✦</div>

          <div className="sti-body" dangerouslySetInnerHTML={{ __html: post.description }} />

          <div className="sti-back-row">
            <span className="sti-back" onClick={() => router.back()}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
