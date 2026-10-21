"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Clock, BookOpen, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [totalCount, setTotalCount] = useState<number>(7);
  const [activeDot, setActiveDot] = useState<number>(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    async function loadLatest() {
      try {
        const res = await contentService.getBlogs({ per_page: 3 });
        if (isMounted && res) {
          if (res.posts && res.posts.length > 0) {
            setPosts(res.posts.slice(0, 3));
          }
          if (res.meta?.total) {
            setTotalCount(res.meta.total);
          }
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

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    const cardWidth = scrollContainerRef.current.firstElementChild?.clientWidth || clientWidth * 0.85;
    const index = Math.round(scrollLeft / (cardWidth + 16));
    setActiveDot(Math.min(Math.max(0, index), posts.length - 1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isMouseDownRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !scrollContainerRef.current) return;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasMovedRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
    handleScroll();
  };

  const handleMouseUpOrLeave = () => {
    isMouseDownRef.current = false;
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const cardWidth = scrollContainerRef.current.firstElementChild?.clientWidth || 320;
    const offset = direction === "left" ? -(cardWidth + 24) : (cardWidth + 24);
    scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-12 sm:py-20 border-b border-[#DADBD2] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Integrated Action CTA and Previous/Next buttons */}
        <SectionHeading
          eyebrow="FACTORY INSIGHTS &amp; SPECIFICATIONS"
          eyebrowColor="#D61C24"
          title={
            <>
              MANUFACTURING<br />BLOG &amp; WHITEPAPERS
            </>
          }
          description="Deep-dive technical guides on fabric density, pattern engineering, private label tech packs, and commercial export logistics."
          action={
            <div className="flex items-center gap-3 pt-1">
              {/* Previous & Next Chevron Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scroll("left")}
                  aria-label="Previous articles"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-[2px] bg-white border border-[#DADBD2] hover:border-[#D61C24] hover:text-[#D61C24] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll("right")}
                  aria-label="Next articles"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-[2px] bg-white border border-[#DADBD2] hover:border-[#D61C24] hover:text-[#D61C24] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* View All CTA */}
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-[#0A0A0A] hover:text-[#D61C24] transition-colors group ml-1"
              >
                <span>View All ({totalCount > 0 ? totalCount : posts.length}+)</span>
                <ArrowRight className="w-4 h-4 text-[#D61C24] transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          }
        />

        {/* Horizontal Slider Track: Touch swipe & Mouse drag with Click Guard */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="flex items-stretch gap-4 sm:gap-6 md:gap-8 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x snap-x snap-mandatory pb-4 pt-2 cursor-grab active:cursor-grabbing"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {posts.map((post) => {
            const fallbackImg = "/categories/Casual wear (1).png";
            const cover = post.cover_image || fallbackImg;
            const categoryName = post.category?.name || "Manufacturing Guide";

            return (
              <article
                key={post.id}
                className="w-[85vw] max-w-[340px] sm:w-[380px] md:w-[calc((100%-4rem)/3)] shrink-0 snap-start bg-white border border-[#DADBD2] rounded-[2px] overflow-hidden flex flex-col justify-between hover:border-[#D61C24] transition-all group shadow-sm hover:shadow-md"
              >
                <div>
                  {/* Article Thumbnail */}
                  <Link
                    href={`/blog/${post.slug}`}
                    onClick={handleLinkClick}
                    className="block relative h-44 sm:h-52 overflow-hidden bg-neutral-900"
                  >
                    <img
                      src={cover}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== fallbackImg && !target.src.endsWith(fallbackImg)) {
                          target.src = fallbackImg;
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#0A0A0A] bg-white/95 px-2 py-0.5 rounded-[1px] shadow-sm">
                        {categoryName}
                      </span>
                    </div>
                  </Link>

                  {/* Body */}
                  <div className="p-4 sm:p-6 space-y-2.5 sm:space-y-3">
                    <div className="flex items-center gap-2.5 text-[10.5px] sm:text-[11px] font-mono text-[#72726D]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#D61C24]" />
                        {post.estimated_reading_time || 5} min read
                      </span>
                      <span>•</span>
                      <span>Published Article</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold uppercase tracking-tight text-[#0A0A0A] font-display group-hover:text-[#D61C24] transition-colors leading-snug line-clamp-2">
                      <Link href={`/blog/${post.slug}`} onClick={handleLinkClick}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-[11.5px] sm:text-xs text-[#72726D] leading-relaxed font-sans line-clamp-2 sm:line-clamp-3">
                      {cleanHtml(post.summary || "")}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 border-t border-[#F4F4EF] flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-mono text-[#72726D]">
                    CM Technical
                  </span>

                  <Link
                    href={`/blog/${post.slug}`}
                    onClick={handleLinkClick}
                    className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono uppercase font-bold text-[#0A0A0A] group-hover:text-[#D61C24] transition-colors"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D61C24]" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mobile Slide Indicator Dots */}
        <div className="md:hidden flex items-center justify-center gap-1.5 pt-4">
          {posts.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (!scrollContainerRef.current) return;
                const cardWidth = scrollContainerRef.current.firstElementChild?.clientWidth || 320;
                scrollContainerRef.current.scrollTo({ left: i * (cardWidth + 16), behavior: "smooth" });
                setActiveDot(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeDot === i ? "w-6 bg-[#D61C24]" : "w-1.5 bg-[#DADBD2]"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
