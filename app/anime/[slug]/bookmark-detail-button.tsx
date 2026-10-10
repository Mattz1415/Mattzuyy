'use client';

import { Bookmark } from 'lucide-react';
import { BookmarkItem } from '@/types/anime';
import { useBookmarks } from '@/lib/storage';

interface BookmarkDetailButtonProps {
  anime: BookmarkItem;
}

export default function BookmarkDetailButton({ anime }: BookmarkDetailButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(anime.animeSlug);

  return (
    <button
      onClick={() => toggleBookmark(anime)}
      className={`flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium transition-all active:scale-95 ${
        bookmarked
          ? 'border-purple-500 bg-purple-950/60 text-purple-200'
          : 'border-zinc-700 bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-white'
      }`}
    >
      <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current text-purple-400' : ''}`} />
      <span>{bookmarked ? 'Saved to Bookmarks' : 'Add to Bookmarks'}</span>
    </button>
  );
}
