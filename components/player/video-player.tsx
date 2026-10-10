'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Play,
  SkipBack,
  SkipForward,
  Maximize2,
  Minimize2,
  Tv,
  List,
  RotateCcw,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { EpisodeStreamData, AnimeEpisodeListItem } from '@/types/anime';
import { getServerStream } from '@/lib/api';
import { saveWatchHistory } from '@/lib/storage';

interface VideoPlayerProps {
  episodeData: EpisodeStreamData;
  episodeSlug: string;
  allEpisodes?: AnimeEpisodeListItem[];
  animeSlug?: string;
  posterImage?: string;
}

export default function VideoPlayer({
  episodeData,
  episodeSlug,
  allEpisodes = [],
  animeSlug = '',
  posterImage = ''
}: VideoPlayerProps) {
  const qualities = episodeData.server?.qualities || [];
  const initialQuality = qualities[0]?.title || '';

  // Use Desustream (defaultStreamingUrl) as the direct primary stream
  const desustreamUrl = episodeData.defaultStreamingUrl || '';

  const [selectedQuality, setSelectedQuality] = useState<string>(initialQuality);
  const [selectedServerId, setSelectedServerId] = useState<string>('desustream-default');
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>(desustreamUrl);
  const [isCinemaMode, setIsCinemaMode] = useState<boolean>(false);
  const [autoNext, setAutoNext] = useState<boolean>(true);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isLoadingServer, setIsLoadingServer] = useState<boolean>(false);
  const [serverNotice, setServerNotice] = useState<string | null>(null);

  // Extract episode number from slug
  const epMatch = episodeSlug.match(/episode-(\d+)/i);
  const epNum = epMatch ? epMatch[1] : '1';

  // Save to Watch History on mount
  useEffect(() => {
    if (episodeSlug) {
      const derivedAnimeSlug = animeSlug || episodeData.animeId || episodeSlug.split('-episode-')[0];
      const derivedAnimeTitle = derivedAnimeSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

      saveWatchHistory({
        animeSlug: derivedAnimeSlug,
        animeTitle: derivedAnimeTitle,
        episodeSlug,
        episodeTitle: episodeData.title || `Episode ${epNum}`,
        episodeNumber: epNum,
        poster: posterImage || '/hero-banner.jpg',
        timestamp: Date.now()
      });
    }
  }, [episodeSlug, animeSlug, episodeData.title, episodeData.animeId, epNum, posterImage]);

  // When user switches server
  const handleServerChange = async (serverId: string, directUrl?: string) => {
    setSelectedServerId(serverId);
    setServerNotice(null);

    if (serverId === 'desustream-default') {
      setCurrentStreamUrl(desustreamUrl);
      return;
    }

    if (directUrl) {
      setCurrentStreamUrl(directUrl);
      return;
    }

    setIsLoadingServer(true);
    try {
      const streamUrl = await getServerStream(serverId);
      if (streamUrl) {
        setCurrentStreamUrl(streamUrl);
      } else {
        // Fallback to desustream
        setCurrentStreamUrl(desustreamUrl);
        setServerNotice('Server mirror offline, kembali ke Desustream default.');
      }
    } catch {
      setServerNotice('Gagal terhubung ke server alternatif, menggunakan Desustream.');
      setCurrentStreamUrl(desustreamUrl);
    } finally {
      setIsLoadingServer(false);
    }
  };

  // Reload current stream
  const handleReload = () => {
    const url = currentStreamUrl;
    setCurrentStreamUrl('');
    setTimeout(() => setCurrentStreamUrl(url), 100);
  };

  const currentQualityObj = qualities.find((q) => q.title === selectedQuality) || qualities[0];
  const servers = currentQualityObj?.serverList || [];

  return (
    <>
      {/* Cinema Mode Backdrop Dimmer */}
      {isCinemaMode && (
        <div
          onClick={() => setIsCinemaMode(false)}
          className="fixed inset-0 z-40 bg-black/95 backdrop-blur-sm transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      <div className={`relative ${isCinemaMode ? 'z-50 max-w-6xl mx-auto' : 'w-full'}`}>
        {/* Helper bar for Desustream */}
        <div className="mb-2 flex items-center justify-between text-xs text-zinc-400 px-1">
          <div className="flex items-center gap-1.5 text-purple-400 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Desustream Stream Server Aktif</span>
          </div>

          {currentStreamUrl && (
            <a
              href={currentStreamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5"
            >
              <span>Buka Desustream di Tab Baru</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {/* Main 16:9 Video Frame */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-zinc-800 shadow-2xl">
          {isLoadingServer ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-white z-10">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
              <p className="mt-3 text-xs text-zinc-400">Menghubungkan ke server stream...</p>
            </div>
          ) : null}

          {currentStreamUrl ? (
            <iframe
              key={currentStreamUrl}
              src={currentStreamUrl}
              title={episodeData.title || `Episode ${epNum}`}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-900 p-6 text-center text-zinc-400">
              <AlertCircle className="h-12 w-12 text-zinc-600 mb-2" />
              <p className="text-sm font-medium">Stream Desustream sedang dimuat...</p>
              <button
                onClick={handleReload}
                className="mt-3 text-xs text-purple-400 hover:underline"
              >
                Muat ulang player
              </button>
            </div>
          )}
        </div>

        {/* Video Player Action Bar */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800/80 bg-[#12141d] p-3 text-xs">
          {/* Left: Previous / Next & Auto-Next Toggle */}
          <div className="flex items-center gap-2">
            {episodeData.hasPrevEpisode && episodeData.prevEpisode?.episodeId ? (
              <Link
                href={`/watch/${episodeData.prevEpisode.episodeId}`}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-800/60 px-3 py-1.5 font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                title="Episode Sebelumnya"
              >
                <SkipBack className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </Link>
            ) : (
              <button
                disabled
                className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 font-medium text-zinc-600 cursor-not-allowed"
              >
                <SkipBack className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>
            )}

            {episodeData.hasNextEpisode && episodeData.nextEpisode?.episodeId ? (
              <Link
                href={`/watch/${episodeData.nextEpisode.episodeId}`}
                className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-1.5 font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
                title="Episode Selanjutnya"
              >
                <span>Next</span>
                <SkipForward className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <button
                disabled
                className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 font-medium text-zinc-600 cursor-not-allowed"
              >
                <span>Next</span>
                <SkipForward className="h-3.5 w-3.5" />
              </button>
            )}

            {/* Auto Next Toggle */}
            <button
              onClick={() => setAutoNext(!autoNext)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-colors ${
                autoNext
                  ? 'bg-purple-950/60 text-purple-300 border border-purple-800/60'
                  : 'bg-zinc-800/60 text-zinc-400 border border-zinc-800'
              }`}
              title="Otomatis ke episode berikutnya"
            >
              <CheckCircle className={`h-3 w-3 ${autoNext ? 'text-purple-400' : 'text-zinc-500'}`} />
              <span className="text-[11px]">Auto-Next</span>
            </button>
          </div>

          {/* Right: Drawer, Cinema Mode & Reload */}
          <div className="flex items-center gap-2">
            {allEpisodes.length > 0 && (
              <button
                onClick={() => setDrawerOpen(!drawerOpen)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium transition-colors ${
                  drawerOpen
                    ? 'border-purple-500 bg-purple-950/60 text-purple-200'
                    : 'border-zinc-700/80 bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                <List className="h-3.5 w-3.5" />
                <span>Episodes ({allEpisodes.length})</span>
              </button>
            )}

            <button
              onClick={() => setIsCinemaMode(!isCinemaMode)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium transition-colors ${
                isCinemaMode
                  ? 'border-purple-500 bg-purple-600 text-white'
                  : 'border-zinc-700/80 bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700 hover:text-white'
              }`}
              title={isCinemaMode ? 'Keluar Mode Bioskop' : 'Mode Bioskop'}
            >
              {isCinemaMode ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Normal</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Bioskop</span>
                </>
              )}
            </button>

            <button
              onClick={handleReload}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700/80 bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
              title="Muat ulang player"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Server & Quality Switcher Panel */}
        <div className="mt-4 rounded-xl border border-zinc-800/80 bg-[#12141d] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Tv className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Pilih Server
              </span>
              <span className="text-xs text-zinc-500">· Desustream / Mirror</span>
            </div>

            {/* Quality Selector if multiple exist */}
            {qualities.length > 1 && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-400 mr-1">Kualitas:</span>
                {qualities.map((q) => (
                  <button
                    key={q.title}
                    onClick={() => setSelectedQuality(q.title)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      selectedQuality === q.title
                        ? 'bg-purple-600 text-white'
                        : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {q.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Server buttons grid */}
          <div className="flex flex-wrap gap-2">
            {/* Primary Desustream Button */}
            <button
              onClick={() => handleServerChange('desustream-default')}
              className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium transition-all ${
                selectedServerId === 'desustream-default'
                  ? 'border-purple-500 bg-purple-950/60 text-purple-200 shadow-sm shadow-purple-600/30 font-semibold'
                  : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  selectedServerId === 'desustream-default' ? 'bg-purple-400 animate-pulse' : 'bg-zinc-600'
                }`}
              />
              <span>Desustream (Default Server)</span>
            </button>

            {/* Other Mirrors from Scraper */}
            {servers.map((srv) => {
              const isActive = selectedServerId === srv.serverId;
              return (
                <button
                  key={srv.serverId}
                  onClick={() => handleServerChange(srv.serverId)}
                  className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? 'border-purple-500 bg-purple-950/60 text-purple-200 shadow-sm shadow-purple-600/30 font-semibold'
                      : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isActive ? 'bg-purple-400' : 'bg-zinc-600'
                    }`}
                  />
                  <span>{srv.title}</span>
                </button>
              );
            })}
          </div>

          {serverNotice && (
            <p className="mt-2 text-xs text-amber-400">{serverNotice}</p>
          )}
        </div>

        {/* Drawer for episodes if opened */}
        {drawerOpen && allEpisodes.length > 0 && (
          <div className="mt-4 rounded-xl border border-zinc-800 bg-[#12141d] p-4 max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
              <span className="text-xs font-semibold text-white">Daftar Semua Episode</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Tutup
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {allEpisodes.map((ep) => {
                const isCurrent = ep.episodeId === episodeSlug;
                return (
                  <Link
                    key={ep.episodeId}
                    href={`/watch/${ep.episodeId}`}
                    onClick={() => setDrawerOpen(false)}
                    className={`rounded-lg border px-2.5 py-2 text-center text-xs font-medium transition-colors ${
                      isCurrent
                        ? 'border-purple-500 bg-purple-600 text-white font-semibold'
                        : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    {ep.eps ? `Ep ${ep.eps}` : ep.title.slice(0, 15)}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
