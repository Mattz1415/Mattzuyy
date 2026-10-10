import { getAnimeDetails } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Play,
  Bookmark,
  Star,
  Film,
  Calendar,
  Clock,
  Tv,
  Building2,
  Share2,
  Sparkles
} from 'lucide-react';
import EpisodeList from '@/components/anime/episode-list';
import AnimeCard from '@/components/anime/anime-card';
import BookmarkDetailButton from './bookmark-detail-button';
import AnimeImage from '@/components/ui/anime-image';
import { formatSynopsis } from '@/lib/utils';

interface AnimeDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  const { slug } = await params;
  const anime = await getAnimeDetails(slug);

  if (!anime || !anime.title) {
    notFound();
  }

  const firstEpisodeSlug = anime.episodeList?.[0]?.episodeId;

  return (
    <div className="min-h-screen">
      {/* Blurred Backdrop Banner */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-zinc-950">
        <AnimeImage
          src={anime.poster || '/hero-banner.jpg'}
          alt={anime.title}
          fallbackTitle={anime.title}
          fill
          priority
          className="object-cover object-center filter blur-xl opacity-25 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/80 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-44 sm:-mt-60 relative z-10 pb-16 space-y-10">
        {/* Top Info Header Grid */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Poster */}
          <div className="relative aspect-[3/4] w-48 sm:w-60 md:w-64 shrink-0 overflow-hidden rounded-2xl border-2 border-zinc-700/80 bg-zinc-900 shadow-2xl">
            <AnimeImage
              src={anime.poster}
              alt={anime.title}
              fallbackTitle={anime.title}
              fill
              priority
              sizes="(max-width: 768px) 240px, 280px"
              className="object-cover"
            />
          </div>

          {/* Metadata & Actions */}
          <div className="flex flex-col flex-1 space-y-4">
            {/* Clean unboxed metadata according to Zero-Pill rule */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-zinc-300">
              {anime.score && (
                <span className="flex items-center gap-1 font-bold text-amber-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="tabular-nums">{anime.score}</span>
                </span>
              )}
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>{anime.type || 'TV Series'}</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="text-purple-400 font-semibold">{anime.status}</span>
              {anime.episodes && (
                <>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span>{anime.episodes} Episodes</span>
                </>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {anime.title}
              </h1>
              {anime.japanese && (
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
                  {anime.japanese}
                </p>
              )}
            </div>

            {/* Genres list - unboxed with subtle separator buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {anime.genreList?.map((g) => (
                <Link
                  key={g.title}
                  href={`/genres?genre=${encodeURIComponent(g.title.toLowerCase())}`}
                  className="rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:border-purple-500/50 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  {g.title}
                </Link>
              ))}
            </div>

            {/* Synopsis */}
            <p className="text-xs sm:text-sm text-zinc-300/90 leading-relaxed max-w-3xl whitespace-pre-line">
              {formatSynopsis(anime.synopsis, 'No synopsis available for this title.')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {firstEpisodeSlug ? (
                <Link
                  href={`/watch/${firstEpisodeSlug}`}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-600/30 hover:brightness-110 active:scale-95 transition-all"
                >
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                  <span>Start Watching Ep 1</span>
                </Link>
              ) : null}

              <BookmarkDetailButton
                anime={{
                  animeSlug: slug,
                  title: anime.title,
                  poster: anime.poster,
                  score: anime.score,
                  status: anime.status
                }}
              />
            </div>

            {/* Metadata specs table strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-800/80 text-xs">
              {anime.studios && (
                <div>
                  <span className="text-zinc-500 block">Studios</span>
                  <span className="text-zinc-200 font-medium">{anime.studios}</span>
                </div>
              )}
              {anime.duration && (
                <div>
                  <span className="text-zinc-500 block">Duration</span>
                  <span className="text-zinc-200 font-medium">{anime.duration}</span>
                </div>
              )}
              {anime.aired && (
                <div>
                  <span className="text-zinc-500 block">Aired</span>
                  <span className="text-zinc-200 font-medium">{anime.aired}</span>
                </div>
              )}
              {anime.producers && (
                <div>
                  <span className="text-zinc-500 block">Producers</span>
                  <span className="text-zinc-200 font-medium truncate block">{anime.producers}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Episode List Section */}
        <section className="pt-4">
          <EpisodeList
            episodes={anime.episodeList || []}
            animeTitle={anime.title}
          />
        </section>

        {/* Recommended Anime Section */}
        {anime.recommendedAnimeList && anime.recommendedAnimeList.length > 0 && (
          <section className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <h3 className="text-lg font-bold tracking-tight text-white">
                You Might Also Like
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {anime.recommendedAnimeList.map((rec) => (
                <AnimeCard key={rec.animeId} anime={rec} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
