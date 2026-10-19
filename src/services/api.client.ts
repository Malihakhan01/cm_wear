import { siteConfig } from "@/config/site.config";

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:8000/api/v1";
    }
    return `${window.location.origin}/api/v1`;
  }
  return (siteConfig.apiUrl || "https://cmsportswear.pk/api/v1").replace(/\/$/, "");
}

interface FetchOptions extends RequestInit {
  timeoutMs?: number;
}

export const apiClient = {
  async get<T>(endpoint: string, options: FetchOptions = {}): Promise<T | null> {
    const { timeoutMs = 15000, ...customConfig } = options;
    const url = `${getApiBaseUrl()}/${endpoint.replace(/^\//, "")}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...customConfig,
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          ...customConfig.headers,
        },
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.warn(`[apiClient GET] HTTP error ${response.status} on ${url}`);
        return null;
      }

      return (await response.json()) as T;
    } catch (err: unknown) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === "AbortError") {
        return null;
      }
      console.warn(`[apiClient GET] Request to ${url} failed or offline:`, err);
      return null;
    }
  },

  async post<T, B = unknown>(endpoint: string, body: B, options: FetchOptions = {}): Promise<T | null> {
    const { timeoutMs = 12000, ...customConfig } = options;
    const url = `${getApiBaseUrl()}/${endpoint.replace(/^\//, "")}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...customConfig,
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...customConfig.headers,
        },
        body: JSON.stringify(body),
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[apiClient POST] HTTP error ${response.status} on ${url}:`, errorText);
        return null;
      }

      return (await response.json()) as T;
    } catch (err) {
      clearTimeout(timeout);
      console.warn(`[apiClient POST] Request to ${url} failed or offline:`, err);
      return null;
    }
  },

  async upload<T>(endpoint: string, formData: FormData, options: FetchOptions = {}): Promise<T | null> {
    const { timeoutMs = 20000, ...customConfig } = options;
    const url = `${getApiBaseUrl()}/${endpoint.replace(/^\//, "")}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...customConfig,
        method: "POST",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          ...customConfig.headers,
        },
        body: formData,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[apiClient UPLOAD] HTTP error ${response.status} on ${url}:`, errorText);
        return null;
      }

      return (await response.json()) as T;
    } catch (err) {
      clearTimeout(timeout);
      console.warn(`[apiClient UPLOAD] Request to ${url} failed or offline:`, err);
      return null;
    }
  },
};
