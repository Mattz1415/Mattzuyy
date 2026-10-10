import { getHome, getGenres } from '@/lib/api';
import HeroSlider from '@/components/anime/hero-slider';
import AnimeCard from '@/components/anime/anime-card';
import ContinueWatchingRow from '@/components/anime/continue-watching-row';
import Link from 'next/link';
import { Flame, CheckCircle, Sparkles, ArrowRight, Compass } from 'lucide-react';

export default async function HomePage() {
  const homeData = await getHome();
  const genres = await getGenres();

  const ongoing = homeData.ongoing.animeList;
  const completed = homeData.completed.animeList;
  const featured = ongoing.slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-10">
      {/* 1. Hero Featured Carousel */}
      <HeroSlider featured={featured} />

      {/* 2. Continue Watching Row (Client state from LocalStorage) */}
      <ContinueWatchingRow />

      {/* Quick Genre Chips for navigation */}
      <section className="rounded-xl border border-zinc-800/80 bg-[#12141d]/70 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Browse Categories
            </h3>
          </div>
          <Link
            href="/genres"
            className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <span>All Genres</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {genres.slice(0, 10).map((genre) => (
            <Link
              key={genre}
              href={`/genres?genre=${encodeURIComponent(genre.toLowerCase())}`}
              className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-purple-500/50 hover:bg-zinc-800 hover:text-white transition-all whitespace-nowrap shrink-0"
            >
              {genre}
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Latest Ongoing Episodes Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-500/10 text-rose-400">
              <Flame className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Latest Ongoing Releases
            </h2>
            <span className="text-xs text-zinc-500 tabular-nums">
              ({ongoing.length})
            </span>
          </div>

          <Link
            href="/search?status=ongoing"
            className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            <span>Explore All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {ongoing.map((anime, index) => (
            <AnimeCard key={anime.animeId || index} anime={anime} priority={index < 6} />
          ))}
        </div>
      </section>

      {/* 4. Popular / Completed Anime Carousel */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/10 text-purple-400">
              <CheckCircle className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Completed Classics & Favorites
            </h2>
            <span className="text-xs text-zinc-500 tabular-nums">
              ({completed.length})
            </span>
          </div>

          <Link
            href="/search?status=completed"
            className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {completed.map((anime, index) => (
            <AnimeCard key={anime.animeId || index} anime={anime} />
          ))}
        </div>
      </section>
    </div>
  );
}
