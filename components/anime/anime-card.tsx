'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Star, Bookmark, Play } from 'lucide-react';
import { AnimeListItem } from '@/types/anime';
import { useBookmarks } from '@/lib/storage';
import AnimeImage from '@/components/ui/anime-image';

interface AnimeCardProps {
  anime: AnimeListItem;
  priority?: boolean;
}

export default function AnimeCard({ anime, priority = false }: AnimeCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(anime.animeId);

  const cleanSlug = anime.animeId.replace(/^\/anime\//, '').replace(/^anime\//, '');

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark({
      animeSlug: cleanSlug,
      title: anime.title,
      poster: anime.poster,
      score: anime.score,
      status: anime.status
    });
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-[#141620] border border-zinc-800/80 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-950/20">
      <Link href={`/anime/${cleanSlug}`} className="flex flex-col flex-1">
        {/* Poster Container - 3:4 aspect ratio */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
          <AnimeImage
            src={anime.poster}
            alt={anime.title}
            fallbackTitle={anime.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Scrim Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

          {/* Quick Play Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600/90 text-white shadow-lg shadow-purple-600/50 transform scale-75 group-hover:scale-100 transition-transform">
              <Play className="h-5 w-5 fill-current ml-0.5" />
            </span>
          </div>

          {/* Top Overlays */}
          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
            {/* Episode or Type */}
            {anime.episodes ? (
              <span className="rounded bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-purple-300 backdrop-blur-md">
                Ep {anime.episodes}
              </span>
            ) : anime.type ? (
              <span className="rounded bg-black/70 px-2 py-0.5 text-[11px] font-medium text-zinc-300 backdrop-blur-md">
                {anime.type}
              </span>
            ) : <span />}

            {/* Bookmark Action Button */}
            <button
              onClick={handleBookmarkClick}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark anime'}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark anime'}
              className={`pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-all ${
                bookmarked
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40'
                  : 'bg-black/60 text-zinc-300 hover:bg-black/90 hover:text-white'
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Bottom Poster Info (Rating & Release) */}
          <div className="absolute bottom-2 inset-x-2.5 flex items-center justify-between text-xs text-zinc-300 pointer-events-none">
            {anime.score ? (
              <span className="flex items-center gap-1 font-semibold text-amber-400">
                <Star className="h-3 w-3 fill-current" />
                <span className="tabular-nums">{anime.score}</span>
              </span>
            ) : null}

            {anime.releaseDay && (
              <span className="text-[11px] text-zinc-400">
                {anime.releaseDay}
              </span>
            )}
          </div>
        </div>

        {/* Text details below poster */}
        <div className="flex flex-col p-3 flex-1 justify-between gap-1">
          <h3 className="text-sm font-semibold text-zinc-100 line-clamp-1 group-hover:text-purple-400 transition-colors">
            {anime.title}
          </h3>

          {/* Clean unboxed metadata according to Zero-Pill rule */}
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <span>{anime.status || (anime.episodes ? 'Ongoing' : 'Anime')}</span>
            {anime.latestReleaseDate && (
              <>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span>{anime.latestReleaseDate}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
