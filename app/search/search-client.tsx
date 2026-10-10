'use client';

import { useState, useEffect, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, SlidersHorizontal, X, Film, Sparkles } from 'lucide-react';
import { AnimeListItem } from '@/types/anime';
import AnimeCard from '@/components/anime/anime-card';
import { searchAnime } from '@/lib/api';

interface SearchClientProps {
  initialQuery?: string;
  initialResults: AnimeListItem[];
  allGenres: string[];
}

export default function SearchClient({
  initialQuery = '',
  initialResults,
  allGenres
}: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery || searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'completed'>(
    (searchParams.get('status') as any) || 'all'
  );
  const [selectedGenre, setSelectedGenre] = useState<string>(
    searchParams.get('genre') || ''
  );
  const [results, setResults] = useState<AnimeListItem[]>(initialResults);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 300ms debounce for search input
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!query.trim()) {
        setResults(initialResults);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await searchAnime(query.trim());
        setResults(data);
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query, initialResults]);

  // Filter results client-side by status if applicable
  const filteredResults = results.filter((anime) => {
    if (statusFilter === 'ongoing') {
      const isOngoing = anime.status?.toLowerCase().includes('ongoing') || !!anime.episodes;
      if (!isOngoing) return false;
    }
    if (statusFilter === 'completed') {
      const isCompleted = anime.status?.toLowerCase().includes('complete');
      if (!isCompleted) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by anime title (e.g. Solo Leveling, Jujutsu, Titan...)"
          className="w-full rounded-2xl border border-zinc-700/80 bg-[#141620] py-3.5 pl-12 pr-12 text-sm text-zinc-100 placeholder-zinc-500 shadow-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-800/80 bg-[#12141d] p-3 text-xs">
        {/* Status segmented buttons */}
        <div className="flex items-center gap-1">
          <span className="text-zinc-500 mr-1.5 font-medium">Status:</span>
          {(['all', 'ongoing', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-3 py-1.5 font-medium capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="text-zinc-400 tabular-nums">
          {isLoading ? (
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping" />
              Searching...
            </span>
          ) : (
            <span>Showing {filteredResults.length} anime results</span>
          )}
        </div>
      </div>

      {/* Results Grid or Empty State */}
      {filteredResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredResults.map((anime, idx) => (
            <AnimeCard key={anime.animeId || idx} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800/80 bg-[#12141d]/50 p-12 text-center">
          <div className="relative h-40 w-40 mb-4 overflow-hidden rounded-2xl">
            <Image
              src="/empty-cat.jpg"
              alt="No results found"
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-base font-semibold text-white">No Anime Found</h3>
          <p className="mt-1 text-xs text-zinc-400 max-w-sm">
            We couldn&apos;t find any anime matching &quot;{query}&quot;. Try adjusting your keywords or browse popular titles.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setStatusFilter('all');
            }}
            className="mt-4 rounded-lg bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-700 hover:text-white"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
