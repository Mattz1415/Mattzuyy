import {
  AnimeDetail,
  AnimeListItem,
  EpisodeStreamData,
  HomeData
} from '@/types/anime';
import {
  FALLBACK_COMPLETED,
  FALLBACK_GENRES,
  FALLBACK_HOME,
  FALLBACK_ONGOING,
  getFallbackAnimeDetail,
  getFallbackEpisodeStream
} from '@/lib/mock-data';
import { formatSynopsis } from '@/lib/utils';

// If in browser, use our internal Next.js API proxy to avoid CORS issues
// If on server, we can query either internal or upstream directly
const isBrowser = typeof window !== 'undefined';
const INTERNAL_API_BASE = '/api/anime';
const DIRECT_API_BASE = process.env.NEXT_PUBLIC_ANIME_API_URL || 'https://www.sankavollerei.web.id/anime';

async function fetchFromApi<T>(endpoint: string, fallbackData: T): Promise<T> {
  const url = isBrowser ? `${INTERNAL_API_BASE}/${endpoint}` : `${DIRECT_API_BASE}/${endpoint}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 120 }
    });
    clearTimeout(timeout);

    if (!res.ok) {
      // If internal API failed or upstream failed, try internal API if was direct
      if (!isBrowser) {
        return fallbackData;
      }
      return fallbackData;
    }

    const json = await res.json();
    if (json && (json.data || json.ok)) {
      return json.data as T;
    }
    return fallbackData;
  } catch (err) {
    console.warn(`Error fetching ${endpoint}:`, err);
    return fallbackData;
  }
}

/**
 * 1. getHome(): Fetches Ongoing/Latest releases, Popular anime, and Hero banners.
 */
export async function getHome(): Promise<HomeData> {
  const data = await fetchFromApi<HomeData>('home', FALLBACK_HOME);
  
  // Safe null checks
  const ongoingList = data?.ongoing?.animeList || FALLBACK_ONGOING;
  const completedList = data?.completed?.animeList || FALLBACK_COMPLETED;

  return {
    ongoing: {
      animeList: ongoingList.length > 0 ? ongoingList : FALLBACK_ONGOING,
    },
    completed: {
      animeList: completedList.length > 0 ? completedList : FALLBACK_COMPLETED,
    },
  };
}

/**
 * 2. getAnimeDetails(slugOrId): Retrieves metadata (synopsis, genres, score, studios, release status, and episode list).
 */
export async function getAnimeDetails(slugOrId: string): Promise<AnimeDetail> {
  const cleanSlug = slugOrId.replace(/^\/anime\//, '').replace(/^anime\//, '');
  const fallback = getFallbackAnimeDetail(cleanSlug);
  const data = await fetchFromApi<any>(`anime/${cleanSlug}`, fallback);

  if (!data || !data.title) {
    return fallback;
  }

  const safeSynopsis = formatSynopsis(data.synopsis, fallback.synopsis);

  const safeEpisodes =
    typeof data.episodes === 'number' || typeof data.episodes === 'string'
      ? data.episodes
      : (data.episodeList?.length || fallback.episodes);

  return {
    ...data,
    synopsis: safeSynopsis,
    genreList: Array.isArray(data.genreList) && data.genreList.length ? data.genreList : fallback.genreList,
    episodeList: Array.isArray(data.episodeList) && data.episodeList.length ? data.episodeList : fallback.episodeList,
    score: typeof data.score === 'string' || typeof data.score === 'number' ? data.score : fallback.score,
    status: typeof data.status === 'string' ? data.status : fallback.status,
    episodes: safeEpisodes,
    studios: typeof data.studios === 'string' ? data.studios : fallback.studios,
    producers: typeof data.producers === 'string' ? data.producers : fallback.producers,
    duration: typeof data.duration === 'string' ? data.duration : fallback.duration,
    aired: typeof data.aired === 'string' ? data.aired : fallback.aired,
    poster: typeof data.poster === 'string' ? data.poster : fallback.poster,
    recommendedAnimeList: Array.isArray(data.recommendedAnimeList) && data.recommendedAnimeList.length
      ? data.recommendedAnimeList
      : fallback.recommendedAnimeList
  };
}

/**
 * 3. getEpisodeStream(episodeSlugOrId): Retrieves streaming sources (embed links, server options, and next/previous episode IDs).
 */
export async function getEpisodeStream(episodeSlugOrId: string): Promise<EpisodeStreamData> {
  const cleanSlug = episodeSlugOrId.replace(/^\/episode\//, '').replace(/^episode\//, '');
  const fallback = getFallbackEpisodeStream(cleanSlug);
  const data = await fetchFromApi<EpisodeStreamData>(`episode/${cleanSlug}`, fallback);

  if (!data || (!data.defaultStreamingUrl && !data.server)) {
    return fallback;
  }

  return {
    ...data,
    defaultStreamingUrl: data.defaultStreamingUrl || fallback.defaultStreamingUrl,
    server: data.server?.qualities?.length ? data.server : fallback.server,
    hasPrevEpisode: data.hasPrevEpisode ?? fallback.hasPrevEpisode,
    prevEpisode: data.prevEpisode ?? fallback.prevEpisode,
    hasNextEpisode: data.hasNextEpisode ?? fallback.hasNextEpisode,
    nextEpisode: data.nextEpisode ?? fallback.nextEpisode,
  };
}

/**
 * Retrieve direct streaming embed URL for a chosen server ID
 */
export async function getServerStream(serverId: string): Promise<string | null> {
  try {
    const url = isBrowser ? `${INTERNAL_API_BASE}/server/${serverId}` : `${DIRECT_API_BASE}/server/${serverId}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.url || null;
  } catch (err) {
    console.warn(`Error getting server ${serverId}:`, err);
    return null;
  }
}

/**
 * 4. searchAnime(query, page): Performs title searches with pagination.
 */
export async function searchAnime(query: string, page = 1): Promise<AnimeListItem[]> {
  if (!query.trim()) return [];
  const cleanQuery = encodeURIComponent(query.trim());
  const fallbackResults = [...FALLBACK_ONGOING, ...FALLBACK_COMPLETED].filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  const data = await fetchFromApi<{ animeList: AnimeListItem[] }>(
    `search/${cleanQuery}`,
    { animeList: fallbackResults }
  );

  return data?.animeList || fallbackResults;
}

/**
 * 5. getGenres(): Returns list of available genres
 */
export async function getGenres(): Promise<string[]> {
  return FALLBACK_GENRES;
}

/**
 * 6. getByGenre(genreSlug, page): Filters anime by category.
 */
export async function getByGenre(genreSlug: string, page = 1): Promise<AnimeListItem[]> {
  const cleanSlug = genreSlug.toLowerCase();
  const data = await fetchFromApi<{ animeList: AnimeListItem[] }>(
    `genre/${cleanSlug}`,
    { animeList: FALLBACK_ONGOING }
  );

  return data?.animeList || FALLBACK_ONGOING;
}
