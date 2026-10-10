'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Play, CheckCircle2, Calendar } from 'lucide-react';
import { AnimeEpisodeListItem } from '@/types/anime';
import { useWatchHistory } from '@/lib/storage';

interface EpisodeListProps {
  episodes: AnimeEpisodeListItem[];
  currentEpisodeSlug?: string;
  animeTitle?: string;
}

export default function EpisodeList({
  episodes,
  currentEpisodeSlug,
  animeTitle
}: EpisodeListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchIndex, setSelectedBatchIndex] = useState(0);
  const { history } = useWatchHistory();

  // Create a Set of watched episode slugs for O(1) lookups
  const watchedSlugs = useMemo(() => {
    return new Set(history.map((h) => h.episodeSlug));
  }, [history]);

  // Batch chunking: 25 episodes per batch (for 100+ episode anime support)
  const BATCH_SIZE = 25;
  const totalBatches = Math.ceil(episodes.length / BATCH_SIZE);

  const batches = useMemo(() => {
    const res: Array<{ label: string; start: number; end: number }> = [];
    for (let i = 0; i < totalBatches; i++) {
      const start = i * BATCH_SIZE + 1;
      const end = Math.min((i + 1) * BATCH_SIZE, episodes.length);
      res.push({
        label: `${start} - ${end}`,
        start: i * BATCH_SIZE,
        end
      });
    }
    return res;
  }, [episodes.length, totalBatches]);

  // Filter episodes by search query or current batch
  const displayedEpisodes = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return episodes.filter(
        (ep) =>
          ep.title.toLowerCase().includes(q) ||
          ep.eps?.toString().includes(q) ||
          ep.episodeId.toLowerCase().includes(q)
      );
    }

    if (batches.length > 0 && batches[selectedBatchIndex]) {
      const { start, end } = batches[selectedBatchIndex];
      return episodes.slice(start, end);
    }

    return episodes;
  }, [episodes, searchQuery, batches, selectedBatchIndex]);

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-[#12141d] p-4 sm:p-6">
      {/* Header with Title and Search Input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Episodes</span>
            <span className="text-xs font-normal text-zinc-400 tabular-nums">
              ({episodes.length} Total)
            </span>
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Select an episode to begin streaming
          </p>
        </div>

        {/* Search within episodes */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter episode..."
            className="w-full rounded-lg border border-zinc-700/80 bg-zinc-900/80 py-1.5 pl-8 pr-3 text-xs text-zinc-200 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
          />
        </div>
      </div>

      {/* Batch Selectors (if anime has more than 25 episodes) */}
      {!searchQuery && batches.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar border-b border-zinc-800/60 mb-3">
          <span className="text-xs text-zinc-500 mr-2 shrink-0">Episode Range:</span>
          {batches.map((batch, index) => (
            <button
              key={batch.label}
              onClick={() => setSelectedBatchIndex(index)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                selectedBatchIndex === index
                  ? 'bg-purple-600 text-white'
                  : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
              }`}
            >
              {batch.label}
            </button>
          ))}
        </div>
      )}

      {/* Episodes Grid */}
      {displayedEpisodes.length === 0 ? (
        <div className="py-12 text-center text-xs text-zinc-500">
          No episodes matched your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 mt-4">
          {displayedEpisodes.map((ep) => {
            const isCurrent = currentEpisodeSlug === ep.episodeId;
            const isWatched = watchedSlugs.has(ep.episodeId);

            return (
              <Link
                key={ep.episodeId}
                href={`/watch/${ep.episodeId}`}
                className={`group flex items-center justify-between rounded-xl border p-3 transition-all ${
                  isCurrent
                    ? 'border-purple-500 bg-purple-950/40 text-purple-200 shadow-sm'
                    : 'border-zinc-800/80 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold tabular-nums transition-colors ${
                      isCurrent
                        ? 'bg-purple-600 text-white'
                        : 'bg-zinc-800 text-zinc-300 group-hover:bg-purple-600 group-hover:text-white'
                    }`}
                  >
                    {ep.eps || <Play className="h-3 w-3 fill-current ml-0.5" />}
                  </span>

                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium truncate group-hover:text-white">
                      {ep.title.replace(animeTitle || '', '').trim() || ep.title}
                    </span>
                    {ep.date && (
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="h-2.5 w-2.5" />
                        <span>{ep.date}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Watched Indicator */}
                {isWatched && (
                  <span
                    title="Watched"
                    className="shrink-0 text-emerald-400 pl-2"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
