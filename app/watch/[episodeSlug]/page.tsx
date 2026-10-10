import { getEpisodeStream, getAnimeDetails } from '@/lib/api';
import VideoPlayer from '@/components/player/video-player';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Film, ArrowLeft, Star, Calendar, Bookmark, Info } from 'lucide-react';
import BookmarkDetailButton from '@/app/anime/[slug]/bookmark-detail-button';
import EpisodeList from '@/components/anime/episode-list';
import { formatSynopsis } from '@/lib/utils';

interface WatchPageProps {
  params: Promise<{ episodeSlug: string }>;
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { episodeSlug } = await params;
  const episodeData = await getEpisodeStream(episodeSlug);

  if (!episodeData) {
    notFound();
  }

  // Derive animeSlug from episodeData or episodeSlug (e.g. tani-episode-1-sub-indo or solo-leveling-episode-1)
  const animeSlug = episodeData.animeId || episodeSlug.split('-episode-')[0];
  const animeDetails = await getAnimeDetails(animeSlug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Top Breadcrumb & Series link */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
          <Link
            href="/"
            className="hover:text-white transition-colors"
          >
            Home
          </Link>
          <span className="text-zinc-600">/</span>
          <Link
            href={`/anime/${animeSlug}`}
            className="text-purple-400 hover:text-purple-300 font-medium truncate max-w-[200px] sm:max-w-md transition-colors"
          >
            {animeDetails.title || animeSlug}
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300 truncate font-semibold">
            {episodeData.title}
          </span>
        </div>

        <Link
          href={`/anime/${animeSlug}`}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Anime Details</span>
        </Link>
      </div>

      {/* Main Video Player Suite */}
      <VideoPlayer
        key={episodeSlug}
        episodeData={episodeData}
        episodeSlug={episodeSlug}
        allEpisodes={animeDetails.episodeList || []}
        animeSlug={animeSlug}
        posterImage={animeDetails.poster}
      />

      {/* Episode Header Info */}
      <div className="rounded-2xl border border-zinc-800/80 bg-[#12141d] p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
              {episodeData.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mt-1">
              <span>{animeDetails.title}</span>
              {animeDetails.score && (
                <>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span className="flex items-center gap-1 text-amber-400 font-medium">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{animeDetails.score}</span>
                  </span>
                </>
              )}
              {episodeData.releaseTime && (
                <>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Calendar className="h-3 w-3" />
                    <span>{episodeData.releaseTime}</span>
                  </span>
                </>
              )}
            </div>
          </div>

          <BookmarkDetailButton
            anime={{
              animeSlug,
              title: animeDetails.title,
              poster: animeDetails.poster,
              score: animeDetails.score,
              status: animeDetails.status
            }}
          />
        </div>

        {/* Synopsis snippet */}
        <div className="pt-4 text-xs sm:text-sm text-zinc-300/90 leading-relaxed">
          <p className="whitespace-pre-line">
            {formatSynopsis(animeDetails.synopsis, 'No synopsis available for this title.')}
          </p>
        </div>
      </div>

      {/* Full Series Episode Navigator */}
      <section className="pt-2">
        <EpisodeList
          episodes={animeDetails.episodeList || []}
          currentEpisodeSlug={episodeSlug}
          animeTitle={animeDetails.title}
        />
      </section>
    </div>
  );
}
