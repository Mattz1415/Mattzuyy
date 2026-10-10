'use client';

import { useState } from 'react';
import { AnimeListItem } from '@/types/anime';
import AnimeCard from '@/components/anime/anime-card';
import { getByGenre } from '@/lib/api';
import { Compass, Sparkles } from 'lucide-react';

interface GenresClientProps {
  genres: string[];
  initialGenre: string;
  initialAnime: AnimeListItem[];
}

export default function GenresClient({
  genres,
  initialGenre,
  initialAnime
}: GenresClientProps) {
  const [selectedGenre, setSelectedGenre] = useState(initialGenre || genres[0] || 'Action');
  const [animeList, setAnimeList] = useState<AnimeListItem[]>(initialAnime);
  const [loading, setLoading] = useState(false);

  const handleSelectGenre = async (genre: string) => {
    setSelectedGenre(genre);
    setLoading(true);
    try {
      const data = await getByGenre(genre.toLowerCase());
      setAnimeList(data);
    } catch (e) {
      console.error('Error fetching genre:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Genre Filter Chips */}
      <div className="rounded-2xl border border-zinc-800/80 bg-[#12141d] p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          <Compass className="h-4 w-4 text-purple-400" />
          <span>Select Genre</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => {
            const isSelected = selectedGenre.toLowerCase() === g.toLowerCase();
            return (
              <button
                key={g}
                onClick={() => handleSelectGenre(g)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-semibold'
                    : 'border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl font-bold tracking-tight text-white capitalize">
            {selectedGenre} Anime
          </h2>
          <span className="text-xs text-zinc-500 tabular-nums">
            ({animeList.length})
          </span>
        </div>
      </div>

      {/* Anime Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          <p className="mt-2 text-xs text-zinc-400">Loading {selectedGenre} series...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {animeList.map((anime, idx) => (
            <AnimeCard key={anime.animeId || idx} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
}
