'use client';

import Link from 'next/link';
import { Play, Clock, ArrowRight, Trash2 } from 'lucide-react';
import { useWatchHistory } from '@/lib/storage';
import AnimeImage from '@/components/ui/anime-image';

export default function ContinueWatchingRow() {
  const { history, clearHistory, mounted } = useWatchHistory();

  if (!mounted || history.length === 0) {
    return null;
  }

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">Continue Watching</h2>
          <span className="text-xs text-zinc-500 tabular-nums">({history.length})</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => clearHistory()}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
            title="Clear watch history"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>
          <Link
            href="/history"
            className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {history.slice(0, 4).map((item) => (
          <Link
            key={item.episodeSlug}
            href={`/watch/${item.episodeSlug}`}
            className="group relative flex items-center gap-3.5 overflow-hidden rounded-xl border border-zinc-800 bg-[#141620] p-2.5 transition-all hover:border-purple-500/50 hover:bg-[#1a1c28]"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-900">
              <AnimeImage
                src={item.poster}
                alt={item.animeTitle}
                fallbackTitle={item.animeTitle}
                fill
                sizes="120px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white shadow-md">
                  <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col min-w-0 flex-1 justify-center">
              <h4 className="text-xs font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                {item.animeTitle}
              </h4>
              <p className="text-[11px] text-purple-400 font-medium truncate mt-0.5">
                {item.episodeTitle || `Episode ${item.episodeNumber || 1}`}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-zinc-500">
                <span>Resume playback</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
