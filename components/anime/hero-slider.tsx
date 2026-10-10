'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Bookmark, Star, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { AnimeListItem } from '@/types/anime';
import { useBookmarks } from '@/lib/storage';
import AnimeImage from '@/components/ui/anime-image';

interface HeroSliderProps {
  featured: AnimeListItem[];
}

export default function HeroSlider({ featured }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const items = featured && featured.length > 0 ? featured.slice(0, 5) : [];

  // Auto cycle every 8 seconds
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const current = items[currentIndex];
  const cleanSlug = current.animeId.replace(/^\/anime\//, '').replace(/^anime\//, '');
  const bookmarked = isBookmarked(cleanSlug);

  const handleBookmark = () => {
    toggleBookmark({
      animeSlug: cleanSlug,
      title: current.title,
      poster: current.poster,
      score: current.score,
      status: current.status
    });
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800/80 shadow-2xl">
      {/* Background Banner with Real REST API Anime Poster (Blurred and Styled) */}
      <div className="relative min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] w-full overflow-hidden flex items-center">
        {/* Ambient Backdrop */}
        <div className="absolute inset-0 overflow-hidden">
          {current.poster ? (
            <AnimeImage
              src={current.poster}
              alt={current.title}
              fallbackTitle={current.title}
              fill
              priority
              className="object-cover object-center filter blur-2xl brightness-50 scale-125 transition-all duration-700"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-purple-950/40 via-zinc-950 to-zinc-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/80 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/70 to-transparent" />
        </div>

        {/* Content Container (Two-column layout on Desktop for Hero) */}
        <div className="relative z-10 w-full p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: Text & Info */}
          <div className="flex flex-col max-w-2xl">
            {/* Metadata line without pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-zinc-300 mb-2.5">
              <span className="text-purple-400 font-bold uppercase tracking-wider text-[11px]">
                Featured Release
              </span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              {current.score && (
                <>
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="tabular-nums">{current.score}</span>
                  </span>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                </>
              )}
              <span>{current.status || (current.episodes ? 'Ongoing' : 'Anime')}</span>
              {current.episodes && (
                <>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span className="text-purple-300 font-medium">Ep {current.episodes}</span>
                </>
              )}
              {current.latestReleaseDate && (
                <>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span className="text-zinc-400">{current.latestReleaseDate}</span>
                </>
              )}
            </div>

            {/* Hero Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 text-balance leading-tight drop-shadow-md">
              {current.title}
            </h1>

            {/* Synopsis Teaser */}
            <p className="text-xs sm:text-sm text-zinc-300/90 line-clamp-3 mb-6 leading-relaxed max-w-xl">
              Streaming now in high-definition quality with multiple server choices and subtitle tracks directly on KuroStream.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/anime/${cleanSlug}`}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-600/30 transition-all hover:brightness-110 active:scale-95 whitespace-nowrap"
              >
                <Play className="h-4 w-4 fill-current ml-0.5" />
                <span>Watch Now</span>
              </Link>

              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium transition-all active:scale-95 whitespace-nowrap backdrop-blur-md ${
                  bookmarked
                    ? 'border-purple-500 bg-purple-950/60 text-purple-200'
                    : 'border-zinc-700 bg-zinc-900/70 text-zinc-200 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current text-purple-400' : ''}`} />
                <span>{bookmarked ? 'Bookmarked' : 'Add to List'}</span>
              </button>

              <Link
                href={`/anime/${cleanSlug}`}
                className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-colors"
              >
                <Info className="h-4 w-4" />
                <span>Details</span>
              </Link>
            </div>
          </div>

          {/* Right: Actual Anime Poster Thumbnail from REST API */}
          <div className="hidden md:flex shrink-0">
            <Link
              href={`/anime/${cleanSlug}`}
              className="group relative aspect-[3/4] w-48 lg:w-56 overflow-hidden rounded-2xl border-2 border-zinc-700/80 bg-zinc-900 shadow-2xl transition-transform duration-300 hover:scale-105 hover:border-purple-500"
            >
              <AnimeImage
                src={current.poster}
                alt={current.title}
                fallbackTitle={current.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-3 inset-x-3 text-center">
                <span className="text-xs font-semibold text-white drop-shadow truncate block">
                  {current.title}
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        {items.length > 1 && (
          <div className="absolute bottom-4 right-6 sm:bottom-6 sm:right-10 flex items-center gap-2 z-20">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
              aria-label="Previous featured anime"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-300 backdrop-blur-md hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5 px-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    currentIndex === i ? 'w-6 bg-purple-500' : 'w-1.5 bg-zinc-600 hover:bg-zinc-400'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
              aria-label="Next featured anime"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-300 backdrop-blur-md hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
