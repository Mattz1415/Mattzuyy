export interface AnimeListItem {
  title: string;
  poster: string;
  episodes?: number | string;
  releaseDay?: string;
  latestReleaseDate?: string;
  score?: string | number;
  animeId: string; // The slug identifier
  href?: string;
  type?: string;
  status?: string;
}

export interface AnimeGenre {
  title: string;
  genreId?: string;
  href?: string;
}

export interface AnimeEpisodeListItem {
  title: string;
  eps?: number | string;
  date?: string;
  episodeId: string; // The episode slug
  href?: string;
  otakudesuUrl?: string;
}

export interface AnimeDetail {
  title: string;
  japanese?: string;
  poster: string;
  score?: string | number;
  producers?: string;
  type?: string;
  status: string;
  episodes?: number | string;
  duration?: string;
  aired?: string;
  studios?: string;
  batch?: any;
  synopsis: string;
  genreList: AnimeGenre[];
  episodeList: AnimeEpisodeListItem[];
  recommendedAnimeList?: AnimeListItem[];
}

export interface ServerOption {
  title: string;
  serverId: string;
  href?: string;
}

export interface StreamQuality {
  title: string; // e.g. "360p", "480p", "720p"
  serverList: ServerOption[];
}

export interface EpisodeNavigation {
  title?: string;
  episodeId?: string;
  href?: string;
}

export interface EpisodeStreamData {
  title: string;
  animeId?: string;
  releaseTime?: string;
  defaultStreamingUrl?: string;
  hasPrevEpisode?: boolean;
  prevEpisode?: EpisodeNavigation | null;
  hasNextEpisode?: boolean;
  nextEpisode?: EpisodeNavigation | null;
  server?: {
    qualities: StreamQuality[];
  };
  downloadUrl?: any;
  info?: any;
}

export interface HomeData {
  ongoing: {
    animeList: AnimeListItem[];
  };
  completed: {
    animeList: AnimeListItem[];
  };
}

export interface WatchHistoryItem {
  animeSlug: string;
  animeTitle: string;
  episodeSlug: string;
  episodeTitle: string;
  episodeNumber?: number | string;
  poster: string;
  timestamp: number; // Unix ms
  progressSeconds?: number;
  durationSeconds?: number;
}

export interface BookmarkItem {
  animeSlug: string;
  title: string;
  poster: string;
  score?: string | number;
  status?: string;
  genres?: string[];
  addedAt?: number;
}
