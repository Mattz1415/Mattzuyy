'use client';

import { useSyncExternalStore } from 'react';
import { BookmarkItem, WatchHistoryItem } from '@/types/anime';

const BOOKMARKS_KEY = 'kurostream_bookmarks';
const HISTORY_KEY = 'kurostream_history';
const EVENT_BOOKMARKS_CHANGED = 'kurostream_bookmarks_changed';
const EVENT_HISTORY_CHANGED = 'kurostream_history_changed';

let cachedBookmarksRaw = '';
let cachedBookmarks: BookmarkItem[] = [];

let cachedHistoryRaw = '';
let cachedHistory: WatchHistoryItem[] = [];

export function getStoredBookmarks(): BookmarkItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY) || '[]';
    if (raw !== cachedBookmarksRaw) {
      cachedBookmarksRaw = raw;
      cachedBookmarks = JSON.parse(raw);
    }
    return cachedBookmarks;
  } catch (e) {
    console.error('Error reading bookmarks:', e);
    return [];
  }
}

export function saveBookmark(item: BookmarkItem): void {
  if (typeof window === 'undefined') return;
  try {
    const list = [...getStoredBookmarks()];
    const itemToSave = {
      ...item,
      addedAt: item.addedAt || Date.now()
    };
    const existingIndex = list.findIndex(b => b.animeSlug === item.animeSlug);
    if (existingIndex > -1) {
      list[existingIndex] = itemToSave;
    } else {
      list.unshift(itemToSave);
    }
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(EVENT_BOOKMARKS_CHANGED));
  } catch (e) {
    console.error('Error saving bookmark:', e);
  }
}

export function removeBookmark(animeSlug: string): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredBookmarks().filter(b => b.animeSlug !== animeSlug);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(EVENT_BOOKMARKS_CHANGED));
  } catch (e) {
    console.error('Error removing bookmark:', e);
  }
}

export function isAnimeBookmarked(animeSlug: string): boolean {
  const list = getStoredBookmarks();
  return list.some(b => b.animeSlug === animeSlug);
}

export function getStoredHistory(): WatchHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY) || '[]';
    if (raw !== cachedHistoryRaw) {
      cachedHistoryRaw = raw;
      cachedHistory = JSON.parse(raw);
    }
    return cachedHistory;
  } catch (e) {
    console.error('Error reading history:', e);
    return [];
  }
}

export function saveWatchHistory(item: WatchHistoryItem): void {
  if (typeof window === 'undefined') return;
  try {
    const list = [...getStoredHistory()];
    const filtered = list.filter(h => h.animeSlug !== item.animeSlug);
    filtered.unshift(item);
    const limited = filtered.slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limited));
    window.dispatchEvent(new Event(EVENT_HISTORY_CHANGED));
  } catch (e) {
    console.error('Error saving history:', e);
  }
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_KEY);
    window.dispatchEvent(new Event(EVENT_HISTORY_CHANGED));
  } catch (e) {
    console.error('Error clearing history:', e);
  }
}

// Subscriptions for useSyncExternalStore
function subscribeBookmarks(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(EVENT_BOOKMARKS_CHANGED, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENT_BOOKMARKS_CHANGED, callback);
    window.removeEventListener('storage', callback);
  };
}

function subscribeHistory(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(EVENT_HISTORY_CHANGED, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENT_HISTORY_CHANGED, callback);
    window.removeEventListener('storage', callback);
  };
}

const emptyBookmarks: BookmarkItem[] = [];
const emptyHistory: WatchHistoryItem[] = [];

export function useBookmarks() {
  const bookmarks = useSyncExternalStore(
    subscribeBookmarks,
    getStoredBookmarks,
    () => emptyBookmarks
  );

  const toggleBookmark = (item: BookmarkItem) => {
    if (bookmarks.some(b => b.animeSlug === item.animeSlug)) {
      removeBookmark(item.animeSlug);
    } else {
      saveBookmark(item);
    }
  };

  const isBookmarked = (slug: string) => {
    return bookmarks.some(b => b.animeSlug === slug);
  };

  return { bookmarks, toggleBookmark, isBookmarked, mounted: true };
}

export function useWatchHistory() {
  const history = useSyncExternalStore(
    subscribeHistory,
    getStoredHistory,
    () => emptyHistory
  );

  return { history, clearHistory, mounted: true };
}
