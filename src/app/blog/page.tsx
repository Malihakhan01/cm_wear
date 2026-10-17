"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Calendar, Clock, BookOpen, ArrowRight, User, Sparkles, ChevronRight, Filter } from "lucide-react";
import { contentService } from "@/services/content.service";
import { BlogPostItem, BlogCategoryItem } from "@/types";

// High-quality initial fallback articles
const INITIAL_ARTICLES: BlogPostItem[] = [
  {
    id: 1,
    title: "The Complete Guide to Fleece GSM: 380 GSM vs 450 GSM vs 500 GSM",
    slug: "fleece-hoodie-gsm-guide",
    summary: "Understanding fabric density, diagonal loopback vs brushed interior, and pre-shrunk cotton standards for premium heavyweight streetwear hoodies.",
    content: "Fabric weight is universally measured in Grams per Square Meter (GSM)...",
    cover_image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    published_at: "2026-10-08T10:00:00Z",
    views_count: 312,
    is_featured: true,
    estimated_reading_time: 5,
    category: {
      id: 1,
      name: "Fabric Sourcing & GSM",
      slug: "fabric-sourcing-gsm",
    },
    author: {
      id: 1,
      name: "CM Technical Editorial Team",
    },
  },
  {
    id: 2,
    title: "Custom Cycling Kit Engineering: Aerodynamic Speed Meshes & Chamois Density",
    slug: "custom-cycling-kit-engineering",
    summary: "How we construct pro-tour race jerseys combining dimpled airflow sleeve mesh, Italian warp-knit lycra bibs, and multi-density 8-hour gel chamois.",
    content: "Aerodynamics and thermal regulation dominate cycling apparel engineering...",
    cover_image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    published_at: "2026-10-05T12:00:00Z",
    views_count: 245,
    is_featured: true,
    estimated_reading_time: 6,
    category: {
      id: 4,
      name: "Teamwear & Sports Tech",
      slug: "teamwear-sports-tech",
    },
    author: {
      id: 1,
      name: "CM Technical Editorial Team",
    },
  },
  {
    id: 3,
    title: "Private Label Streetwear Blueprint: Woven Damask Labels, Tech Packs & Turnkey Packaging",
    slug: "private-label-streetwear-blueprint",
    summary: "A step-by-step masterclass for apparel founders scaling from 50-piece prototypes to 5,000-piece container deliveries with full custom packaging.",
    content: "Many emerging brands start with off-the-shelf catalog blanks...",
    cover_image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    published_at: "2026-10-01T09:00:00Z",
    views_count: 489,
    is_featured: true,
    estimated_reading_time: 7,
    category: {
      id: 3,
      name: "Private Label Strategy",
      slug: "private-label-strategy",
    },
    author: {
      id: 1,
      name: "CM Technical Editorial Team",
    },
  },
  {
    id: 4,
    title: "Waterproof Outerwear Standards: 3-Layer Membranes, 20,000mm Hydrostatic Head & Seam Sealing",
    slug: "waterproof-outerwear-standards-membranes-seam-sealing",
    summary: "Deconstructing technical alpine ski wear and waterproof shell jackets: 20K/20K microporous membranes, DWR coatings, and hot-air seam taping.",
    content: "Mountain sports and alpine expeditions demand complete protection...",
    cover_image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    published_at: "2026-09-27T14:00:00Z",
    views_count: 178,
    is_featured: true,
    estimated_reading_time: 8,
    category: {
      id: 2,
      name: "Technical Manufacturing",
      slug: "technical-manufacturing",
    },
    author: {
      id: 1,
      name: "CM Technical Editorial Team",
    },
  },
];

const INITIAL_CATEGORIES: BlogCategoryItem[] = [
  { id: 1, name: "Fabric Sourcing & GSM", slug: "fabric-sourcing-gsm" },
  { id: 2, name: "Technical Manufacturing", slug: "technical-manufacturing" },
  { id: 3, name: "Private Label Strategy", slug: "private-label-strategy" },
  { id: 4, name: "Teamwear & Sports Tech", slug: "teamwear-sports-tech" },
  { id: 5, name: "Logistics & Incoterms", slug: "logistics-incoterms" },
];

const cleanHtml = (text: string) => {
  if (!text) return "";
  return text.replace(/<[^>]*>?/gm, "").trim();
};

export default function BlogListingPage() {
  const [articles, setArticles] = useState<BlogPostItem[]>(INITIAL_ARTICLES);
  const [categories, setCategories] = useState<BlogCategoryItem[]>(INITIAL_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [postsRes, catsRes] = await Promise.all([
          contentService.getBlogs({ per_page: 20 }),
          contentService.getBlogCategories(),
        ]);
        if (isMounted) {
          if (postsRes && postsRes.posts && postsRes.posts.length > 0) {
            setArticles(postsRes.posts);
          }
          if (catsRes && catsRes.length > 0) {
            setCategories(catsRes);
          }
        }
      } catch (err) {
        console.error("Failed to load blog articles:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const featuredArticle = useMemo(() => {
    return articles.find((a) => a.is_featured) || articles[0];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const catSlug = art.category?.slug;
      const matchesCategory = selectedCategory === "ALL" || catSlug === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;
      const matchesSearch =
        art.title.toLowerCase().includes(q) ||
        (art.summary && cleanHtml(art.summary).toLowerCase().includes(q)) ||
        (art.category?.name && art.category.name.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen text-[#0A0A0A]">
      
      {/* Dark Industrial Hero */}
      <section className="bg-[#0A0A0A] text-white border-b border-[#2A2A28] py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D61C24_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <Link href="/resources" className="hover:text-white transition-colors">Resources</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-[#FF333D] font-bold">Apparel Engineering & Manufacturing Editorial</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-[#D61C24]/10 border border-[#D61C24]/30 text-[#FF333D] text-[11px] font-mono uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Sialkot Technical Knowledge Hub
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white font-display leading-[1.05]">
              Manufacturing Whitepapers & Editorial Guides
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
              Authoritative blueprints on GSM density, circular knitting, sublimation fidelity, tech packs, and commercial export logistics from our master factory floor.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article Hero Spotlight */}
      {featuredArticle && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="bg-white border border-[#DADBD2] rounded-[2px] overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12 hover:border-[#D61C24] transition-all group">
            
            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto min-h-[300px] overflow-hidden bg-neutral-900">
              <img
                src={featuredArticle.cover_image || "/categories/Casual wear (1).png"}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-[#D61C24] text-white text-[10px] font-mono font-bold uppercase px-2.5 py-1 tracking-wider rounded-[1px]">
                  Featured Whitepaper
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-mono text-[#72726D]">
                  <span className="text-[#D61C24] font-bold uppercase bg-[#F4F4EF] px-2 py-0.5 rounded-[1px]">
                    {featuredArticle.category?.name || "Manufacturing Guide"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredArticle.estimated_reading_time || 6} min read
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display group-hover:text-[#D61C24] transition-colors leading-tight">
                  <Link href={`/blog/${featuredArticle.slug}`}>
                    {featuredArticle.title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-[#40403C] leading-relaxed font-sans line-clamp-3">
                  {cleanHtml(featuredArticle.summary || "")}
                </p>
              </div>

              <div className="pt-6 border-t border-[#F4F4EF] flex items-center justify-between">
                <div className="text-xs font-mono text-[#72726D] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#D61C24]" />
                  <span>CM Technical Team</span>
                </div>

                <Link
                  href={`/blog/${featuredArticle.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase font-bold text-[#0A0A0A] hover:text-[#D61C24] transition-colors group-hover:translate-x-1"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 text-[#D61C24]" />
                </Link>
              </div>

            </div>

          </div>
        </section>
      )}

      {/* Filter and Article Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Controls: Categories & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#DADBD2]">
          
          {/* Category Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-3 py-1.5 rounded-[2px] text-xs font-mono uppercase transition-colors shrink-0 ${
                selectedCategory === "ALL"
                  ? "bg-[#D61C24] text-white font-bold"
                  : "bg-white border border-[#DADBD2] text-[#40403C] hover:bg-[#F4F4EF]"
              }`}
            >
              All Articles ({articles.length})
            </button>
            {categories.map((c) => {
              const isActive = selectedCategory === c.slug;
              return (
                <button
                  key={c.slug}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`px-3 py-1.5 rounded-[2px] text-xs font-mono uppercase transition-colors shrink-0 ${
                    isActive
                      ? "bg-[#D61C24] text-white font-bold"
                      : "bg-white border border-[#DADBD2] text-[#40403C] hover:bg-[#F4F4EF]"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-[#72726D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, fabrics, GSM..."
              className="w-full bg-white border border-[#DADBD2] pl-9 pr-3 py-1.5 text-xs text-[#0A0A0A] rounded-[2px] focus:outline-none focus:border-[#D61C24] transition-colors"
            />
          </div>

        </div>

        {/* Articles Grid */}
        <div className="mt-10">
          {filteredArticles.length === 0 ? (
            <div className="bg-white border border-[#DADBD2] p-12 text-center rounded-[2px] space-y-4">
              <BookOpen className="w-10 h-10 text-neutral-400 mx-auto" />
              <div className="text-base font-bold uppercase tracking-tight text-[#0A0A0A]">
                No articles found matching &ldquo;{searchQuery}&rdquo;
              </div>
              <p className="text-xs text-[#72726D]">
                Try selecting &ldquo;All Articles&rdquo; or searching for topics like &ldquo;fleece&rdquo;, &ldquo;sublimation&rdquo;, or &ldquo;packaging&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("ALL");
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-[#D61C24] text-white text-xs font-mono font-bold uppercase rounded-[2px]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((art) => {
                return (
                  <article
                    key={art.id}
                    className="bg-white border border-[#DADBD2] rounded-[2px] overflow-hidden flex flex-col justify-between hover:border-[#D61C24] transition-all group shadow-sm"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <Link href={`/blog/${art.slug}`} className="block relative h-48 overflow-hidden bg-neutral-900">
                        <img
                          src={art.cover_image || "/categories/Casual wear (1).png"}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="text-[10px] font-mono uppercase font-bold text-[#0A0A0A] bg-white/95 px-2 py-0.5 rounded-[1px] shadow-sm">
                            {art.category?.name || "Manufacturing"}
                          </span>
                        </div>
                      </Link>

                      {/* Content Body */}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center gap-3 text-[11px] font-mono text-[#72726D]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {art.estimated_reading_time || 6} min read
                          </span>
                          <span>•</span>
                          <span>{art.views_count || 100}+ Views</span>
                        </div>

                        <h3 className="text-base font-bold uppercase tracking-tight text-[#0A0A0A] font-display group-hover:text-[#D61C24] transition-colors leading-snug">
                          <Link href={`/blog/${art.slug}`}>
                            {art.title}
                          </Link>
                        </h3>

                        <p className="text-xs text-[#72726D] leading-relaxed font-sans line-clamp-3">
                          {cleanHtml(art.summary || "")}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6 pt-2 border-t border-[#F4F4EF] flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#72726D]">
                        CM Technical Team
                      </span>

                      <Link
                        href={`/blog/${art.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-[#0A0A0A] group-hover:text-[#D61C24] transition-colors"
                      >
                        <span>Read Specs</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#D61C24]" />
                      </Link>
                    </div>

                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Sourcing CTA Banner */}
        <div className="mt-16 bg-[#0A0A0A] text-white p-8 sm:p-12 rounded-[2px] border border-[#2A2A28] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-[#FF333D] tracking-widest">
              Direct Factory Consultation
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight font-display text-white">
              Ready to Turn These Specifications into Real Garments?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans">
              Send your tech pack or request physical yarn and fabric swatches directly from our Sialkot manufacturing floor.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/request-quote"
              className="px-6 py-3 bg-[#D61C24] hover:bg-[#b0141b] text-white text-xs font-mono uppercase font-bold tracking-wider transition-colors rounded-[2px]"
            >
              Submit Tech Pack (RFQ)
            </Link>
            <Link
              href="/resources/faq"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono uppercase font-bold tracking-wider transition-colors rounded-[2px]"
            >
              Browse Manufacturing FAQs
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}
