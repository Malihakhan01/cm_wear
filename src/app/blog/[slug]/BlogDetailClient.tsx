"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  User,
  Share2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { contentService } from "@/services/content.service";
import { BlogPostItem } from "@/types";

export default function BlogPostDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const [post, setPost] = useState<BlogPostItem | null>(null);
  const [related, setRelated] = useState<BlogPostItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    contentService
      .getBlogBySlug(slug)
      .then((res) => {
        if (!isMounted) return;
        if (res && res.post) {
          setPost(res.post);
          setRelated(res.related || []);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load blog detail:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[#FF333D]">
        Loading Article Specification...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold uppercase font-display mb-4">Article Not Found</h1>
        <p className="text-neutral-400 text-sm mb-6">The requested publication could not be located in our technical archive.</p>
        <Link
          href="/blog"
          className="px-6 py-2.5 bg-[#FF333D] text-white font-mono text-xs uppercase font-bold hover:bg-[#e02630] transition-colors"
        >
          Return to Knowledge Hub
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-[#0A0A0A] text-white select-none">
      {/* Header Breadcrumbs */}
      <div className="border-b border-[#2A2A28] bg-[#121210] py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs font-mono">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Archive Index</span>
          </Link>
          <div className="flex items-center gap-2 text-neutral-500">
            <span>Engineering Bulletin</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#FF333D] uppercase font-bold">{post.category?.name || "Technical"}</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <section className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-1 bg-[#20201E] border border-[#3A3A36] text-[10px] font-mono uppercase font-bold text-[#FF333D]">
              {post.category?.name || "Manufacturing Archive"}
            </span>
            {post.is_featured && (
              <span className="px-2.5 py-1 bg-[#FF333D]/10 border border-[#FF333D]/30 text-[10px] font-mono uppercase font-bold text-[#FF333D]">
                Verified Technical Reference
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight font-display text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-neutral-400 pt-2 border-t border-[#20201E]">
            <span className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-[#FF333D]" />
              {post.author?.name || "TAWFIQ Technical Editorial Team"}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              {post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent"}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              {post.estimated_reading_time || 5} Min Read
            </span>
            <button
              onClick={handleCopyLink}
              className="ml-auto flex items-center gap-2 text-neutral-300 hover:text-[#FF333D] transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? "Link Copied!" : "Share Link"}</span>
            </button>
          </div>
        </div>

        {/* Featured Image */}
        {post.cover_image && (
          <div className="mt-8 rounded-sm overflow-hidden border border-[#2A2A28] bg-[#151513] aspect-video max-h-[480px]">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Summary Lead */}
        {post.summary && (
          <div className="mt-8 p-6 bg-[#161614] border-l-2 border-[#FF333D] rounded-r text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
            {post.summary}
          </div>
        )}

        {/* Content Body */}
        <div
          className="mt-8 prose prose-invert prose-neutral max-w-none text-neutral-300 leading-relaxed font-sans"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="border-t border-[#2A2A28] py-12 bg-[#0E0E0D]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-bold uppercase font-display text-white mb-6">
              Related Engineering Publications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/blog/${item.slug}`}
                  className="p-5 bg-[#161614] border border-[#2A2A28] hover:border-[#FF333D] transition-all rounded-sm flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-mono text-[#FF333D] uppercase font-bold">
                      {item.category?.name || "Manufacturing"}
                    </span>
                    <h3 className="text-base font-bold text-white mt-2 group-hover:text-[#FF333D] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 group-hover:text-white">
                    Read Publication <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
