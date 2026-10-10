import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSynopsis(synopsis: any, fallback: string = ''): string {
  if (!synopsis) return fallback;
  if (typeof synopsis === 'string') {
    return synopsis.trim() || fallback;
  }
  if (typeof synopsis === 'object') {
    if (Array.isArray(synopsis.paragraphs) && synopsis.paragraphs.length > 0) {
      const text = synopsis.paragraphs.filter(Boolean).join('\n\n').trim();
      if (text) return text;
    }
  }
  return fallback;
}
