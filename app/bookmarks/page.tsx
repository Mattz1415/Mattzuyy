'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, Trash2, Play, Film, Star } from 'lucide-react';
import { useBookmarks } from '@/lib/storage';
import AnimeImage from '@/components/ui/anime-image';

export default function BookmarksPage() {
  const { bookmarks, toggleBookmark, mounted } = useBookmarks();

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-zinc-500">
        Loading bookmarks...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-purple-400 fill-current" />
            <span>My Bookmarks</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Your saved anime watchlist stored locally on your device.
          </p>
        </div>
        <span className="text-xs text-zinc-500 font-medium tabular-nums">
          {bookmarks.length} Saved
        </span>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800/80 bg-[#12141d]/50 p-12 text-center my-10">
          <div className="relative h-44 w-44 mb-4 overflow-hidden rounded-2xl">
            <Image
              src="/empty-cat.jpg"
              alt="Empty Bookmarks"
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-base font-semibold text-white">Your Watchlist is Empty</h3>
          <p className="mt-1 text-xs text-zinc-400 max-w-sm">
            Save shows to your bookmarks while browsing to easily pick up where you left off.
          </p>
          <Link
            href="/"
            className="mt-5 rounded-lg bg-gradient-to-r from-purple-600 to-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:brightness-110 transition-all"
          >
            Explore Anime
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {bookmarks.map((anime) => (
            <div
              key={anime.animeSlug}
              className="group relative flex flex-col overflow-hidden rounded-xl bg-[#141620] border border-zinc-800/80 transition-all hover:border-purple-500/50 hover:shadow-xl"
            >
              <Link href={`/anime/${anime.animeSlug}`} className="flex flex-col flex-1">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
                  <AnimeImage
                    src={anime.poster}
                    alt={anime.title}
                    fallbackTitle={anime.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleBookmark(anime);
                    }}
                    title="Remove from bookmarks"
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-zinc-300 backdrop-blur-md hover:bg-rose-600 hover:text-white transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  {anime.score && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 text-xs font-semibold text-amber-400">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{anime.score}</span>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="text-xs font-semibold text-white line-clamp-1 group-hover:text-purple-400 transition-colors">
                    {anime.title}
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    {anime.status || 'Anime'}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
