"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Clock, BookOpen, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { contentService } from "@/services/content.service";
import { BlogPostItem } from "@/types";

const cleanHtml = (text: string) => {
  if (!text) return "";
  return text.replace(/<[^>]*>?/gm, "").trim();
};

const DEFAULT_HOMEPAGE_POSTS: BlogPostItem[] = [
  {
    id: 1,
    title: "The Complete Guide to Fleece GSM: 380 GSM vs 450 GSM vs 500 GSM",
    slug: "fleece-hoodie-gsm-guide",
    summary: "Understanding fabric density, diagonal loopback vs brushed interior, and pre-shrunk cotton standards for premium streetwear.",
    content: "",
    cover_image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    status: "published",
    views_count: 312,
    is_featured: true,
    estimated_reading_time: 5,
    category: { id: 1, name: "Fabric Sourcing & GSM", slug: "fabric-sourcing-gsm" },
  },
  {
    id: 2,
    title: "Custom Cycling Kit Engineering: Aerodynamic Speed Meshes & Chamois Density",
    slug: "custom-cycling-kit-engineering",
    summary: "How we construct pro-tour race jerseys combining dimpled airflow sleeve mesh, Italian warp-knit lycra bibs, and multi-density 8-hour gel chamois.",
    content: "",
    cover_image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    status: "published",
    views_count: 245,
    is_featured: true,
    estimated_reading_time: 6,
    category: { id: 4, name: "Teamwear & Sports Tech", slug: "teamwear-sports-tech" },
  },
  {
    id: 3,
    title: "Private Label Streetwear Blueprint: Woven Damask Labels, Tech Packs & Turnkey Packaging",
    slug: "private-label-streetwear-blueprint",
    summary: "A step-by-step masterclass for apparel founders scaling from 50-piece prototypes to 5,000-piece container deliveries with full custom packaging.",
    content: "",
    cover_image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
    status: "published",
    views_count: 489,
    is_featured: true,
    estimated_reading_time: 7,
    category: { id: 3, name: "Private Label Strategy", slug: "private-label-strategy" },
  },
];

export const LatestBlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostItem[]>(DEFAULT_HOMEPAGE_POSTS);

  useEffect(() => {
    let isMounted = true;
    async function loadLatest() {
      try {
        const res = await contentService.getBlogs({ per_page: 3 });
        if (isMounted && res && res.posts && res.posts.length > 0) {
          setPosts(res.posts.slice(0, 3));
        }
      } catch (err) {
        console.error("LatestBlogSection fetch error:", err);
      }
    }
    loadLatest();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-white py-20 border-b border-[#DADBD2] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Link to All Articles */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <SectionHeading
            eyebrow="FACTORY INSIGHTS & SPECIFICATIONS"
            eyebrowColor="#D61C24"
            title="Manufacturing Blog & Whitepapers"
            description="Deep-dive technical guides on fabric density, pattern engineering, private label tech packs, and commercial export logistics."
          />

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-[#0A0A0A] hover:text-[#D61C24] transition-colors pb-8 shrink-0"
          >
            <span>View All Editorial Guides ({posts.length}+)</span>
            <ArrowRight className="w-4 h-4 text-[#D61C24]" />
          </Link>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => {
            const fallbackImg = "/categories/Casual wear (1).png";
            const cover = post.cover_image || fallbackImg;
            const categoryName = post.category?.name || "Manufacturing Guide";

            return (
              <article
                key={post.id}
                className="bg-white border border-[#DADBD2] rounded-[2px] overflow-hidden flex flex-col justify-between hover:border-[#D61C24] transition-all group shadow-sm hover:shadow-md"
              >
                <div>
                  {/* Article Thumbnail */}
                  <Link href={`/blog/${post.slug}`} className="block relative h-48 sm:h-52 overflow-hidden bg-neutral-900">
                    <img
                      src={cover}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#0A0A0A] bg-white/95 px-2 py-0.5 rounded-[1px] shadow-sm">
                        {categoryName}
                      </span>
                    </div>
                  </Link>

                  {/* Body */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-[11px] font-mono text-[#72726D]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#D61C24]" />
                        {post.estimated_reading_time || 5} min read
                      </span>
                      <span>•</span>
                      <span>Published Article</span>
                    </div>

                    <h3 className="text-base font-bold uppercase tracking-tight text-[#0A0A0A] font-display group-hover:text-[#D61C24] transition-colors leading-snug line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-[#72726D] leading-relaxed font-sans line-clamp-3">
                      {cleanHtml(post.summary || "")}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 pt-3 border-t border-[#F4F4EF] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#72726D]">
                    TAWFIQ Technical
                  </span>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-[#0A0A0A] group-hover:text-[#D61C24] transition-colors"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D61C24]" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};
