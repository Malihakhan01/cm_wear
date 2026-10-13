import { apiClient } from "./api.client";
import { FaqItem, BlogPostItem, BlogCategoryItem, TestimonialItem } from "@/types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
  };
  related?: BlogPostItem[];
}

export const contentService = {
  /**
   * Fetch FAQs with optional topic filter.
   */
  async getFaqs(topic?: string): Promise<FaqItem[]> {
    const endpoint = topic ? `faqs?topic=${encodeURIComponent(topic)}` : "faqs";
    const res = await apiClient.get<ApiResponse<FaqItem[]>>(endpoint);
    return res && res.success && Array.isArray(res.data) ? res.data : [];
  },

  /**
   * Fetch published blog posts.
   */
  async getBlogs(params?: {
    category?: string;
    featured?: boolean;
    page?: number;
    per_page?: number;
  }): Promise<{ posts: BlogPostItem[]; meta: any }> {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.featured) query.set("featured", "1");
    if (params?.page) query.set("page", params.page.toString());
    if (params?.per_page) query.set("per_page", params.per_page.toString());

    const qs = query.toString();
    const endpoint = qs ? `blogs?${qs}` : "blogs";
    const res = await apiClient.get<ApiResponse<BlogPostItem[]>>(endpoint);

    if (res && res.success && Array.isArray(res.data)) {
      return { posts: res.data, meta: res.meta || {} };
    }
    return { posts: [], meta: {} };
  },

  /**
   * Fetch a single blog post by slug.
   */
  async getBlogBySlug(slug: string): Promise<{ post: BlogPostItem | null; related: BlogPostItem[] }> {
    const res = await apiClient.get<ApiResponse<BlogPostItem>>(`blogs/${slug}`);
    if (res && res.success && res.data) {
      return {
        post: res.data,
        related: res.related || [],
      };
    }
    return { post: null, related: [] };
  },

  /**
   * Fetch active blog categories.
   */
  async getBlogCategories(): Promise<BlogCategoryItem[]> {
    const res = await apiClient.get<ApiResponse<BlogCategoryItem[]>>("blog-categories");
    return res && res.success && Array.isArray(res.data) ? res.data : [];
  },

  /**
   * Fetch client testimonials.
   */
  async getTestimonials(featured?: boolean): Promise<TestimonialItem[]> {
    const endpoint = featured ? "testimonials?featured=1" : "testimonials";
    const res = await apiClient.get<ApiResponse<TestimonialItem[]>>(endpoint);
    return res && res.success && Array.isArray(res.data) ? res.data : [];
  },
};
