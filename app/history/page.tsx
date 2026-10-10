'use client';

import Link from 'next/link';
import Image from 'next/image';
import { History, Trash2, Play, Calendar } from 'lucide-react';
import { useWatchHistory } from '@/lib/storage';
import AnimeImage from '@/components/ui/anime-image';

export default function HistoryPage() {
  const { history, clearHistory, mounted } = useWatchHistory();

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-zinc-500">
        Loading watch history...
      </div>
    );
  }

  const formatDate = (ts: number) => {
    try {
      const d = new Date(ts);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <History className="h-6 w-6 text-purple-400" />
            <span>Watch History</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Tracks anime episodes you have recently played on this browser.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => clearHistory()}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:border-rose-800 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800/80 bg-[#12141d]/50 p-12 text-center my-10">
          <div className="relative h-44 w-44 mb-4 overflow-hidden rounded-2xl">
            <Image
              src="/empty-cat.jpg"
              alt="Empty History"
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-base font-semibold text-white">No Watch History Yet</h3>
          <p className="mt-1 text-xs text-zinc-400 max-w-sm">
            Episodes you start streaming will automatically appear here so you can pick up anytime.
          </p>
          <Link
            href="/"
            className="mt-5 rounded-lg bg-gradient-to-r from-purple-600 to-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:brightness-110 transition-all"
          >
            Start Watching
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {history.map((item) => (
            <Link
              key={item.episodeSlug}
              href={`/watch/${item.episodeSlug}`}
              className="group relative flex flex-col overflow-hidden rounded-xl bg-[#141620] border border-zinc-800/80 transition-all hover:border-purple-500/50 hover:shadow-xl"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                <AnimeImage
                  src={item.poster}
                  alt={item.animeTitle}
                  fallbackTitle={item.animeTitle}
                  fill
                  sizes="(max-width: 640px) 100vw, 30vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg">
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                  </span>
                </div>
              </div>

              <div className="p-3">
                <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
                  {item.animeTitle}
                </h3>
                <p className="text-[11px] text-purple-400 font-medium truncate mt-0.5">
                  {item.episodeTitle || `Episode ${item.episodeNumber}`}
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(item.timestamp)}</span>
                  </span>
                  <span className="text-purple-400/80 font-medium group-hover:underline">Resume</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
