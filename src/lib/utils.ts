import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function stripHtml(input?: string): string {
  if (!input) return "";
  return cleanProductText(input);
}

export function cleanProductText(input?: string): string {
  if (!input) return "";
  return input
    .replace(/\\r\\n|\\n|\\r/g, "\n")
    .replace(/\r\n|\r/g, "\n")
    .replace(/<table[\s\S]*?<\/table>/gi, "")
    .replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, "")
    .replace(/<\/(p|div|tr|li|h[1-6])>/gi, "\n\n")
    .replace(/<br\s*[\/]?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/&[a-z0-9#]+;/gi, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();
}

export function parseHtmlTableSpecs(html?: string): Array<{ label: string; value: string }> {
  if (!html || !html.includes("<table")) return [];
  const specs: Array<{ label: string; value: string }> = [];
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch: RegExpExecArray | null;
  while ((trMatch = trRegex.exec(html)) !== null) {
    const rowContent = trMatch[1];
    const cells: string[] = [];
    const cellRegex = /<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi;
    let cellMatch: RegExpExecArray | null;
    while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
      const text = cellMatch[1]
        .replace(/<[^>]*>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&nbsp;/g, " ")
        .replace(/\\r\\n|\\n|\\r/g, " ")
        .replace(/\r\n|\r|\n/g, " ")
        .trim();
      cells.push(text);
    }
    if (cells.length >= 2) {
      const label = cells[0].replace(/[:*]/g, "").trim();
      const value = cells[1].trim();
      if (
        label &&
        value &&
        label.toLowerCase() !== "specification" &&
        label.toLowerCase() !== "specifications" &&
        label.toLowerCase() !== "details"
      ) {
        specs.push({ label, value });
      }
    }
  }
  return specs;
}

