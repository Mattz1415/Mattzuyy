import { AnimeDetail, AnimeListItem, EpisodeStreamData, HomeData } from '@/types/anime';

export const FALLBACK_ONGOING: AnimeListItem[] = [
  {
    title: 'Solo Leveling: Arise from the Shadow',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    episodes: 12,
    releaseDay: 'Saturday',
    latestReleaseDate: 'Today',
    score: 8.9,
    animeId: 'solo-leveling-season-2',
    type: 'TV Series',
    status: 'Ongoing'
  },
  {
    title: 'Jujutsu Kaisen: Culling Game Arc',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    episodes: 24,
    releaseDay: 'Thursday',
    latestReleaseDate: 'Yesterday',
    score: 8.8,
    animeId: 'jujutsu-kaisen-s3',
    type: 'TV Series',
    status: 'Ongoing'
  },
  {
    title: 'Demon Slayer: Infinity Castle',
    poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    episodes: 8,
    releaseDay: 'Sunday',
    latestReleaseDate: '3 days ago',
    score: 9.1,
    animeId: 'demon-slayer-infinity-castle',
    type: 'TV Series',
    status: 'Ongoing'
  },
  {
    title: 'Dandadan: Occult & Spirit',
    poster: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    episodes: 12,
    releaseDay: 'Friday',
    latestReleaseDate: '2 days ago',
    score: 8.7,
    animeId: 'dandadan',
    type: 'TV Series',
    status: 'Ongoing'
  },
  {
    title: 'Frieren: Beyond Journey\'s End',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    episodes: 28,
    releaseDay: 'Friday',
    latestReleaseDate: 'This week',
    score: 9.3,
    animeId: 'frieren-beyond-journeys-end',
    type: 'TV Series',
    status: 'Ongoing'
  },
  {
    title: 'Bleach: Thousand-Year Blood War - The Conflict',
    poster: 'https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=600&auto=format&fit=crop&q=80',
    episodes: 13,
    releaseDay: 'Saturday',
    latestReleaseDate: 'Last week',
    score: 8.9,
    animeId: 'bleach-thousand-year-blood-war',
    type: 'TV Series',
    status: 'Ongoing'
  }
];

export const FALLBACK_COMPLETED: AnimeListItem[] = [
  {
    title: 'Attack on Titan: Final Season Part 3',
    poster: 'https://images.unsplash.com/photo-1541562232579-512a21360020?w=600&auto=format&fit=crop&q=80',
    episodes: 28,
    score: 9.2,
    animeId: 'shingeki-no-kyojin-the-final-season',
    type: 'TV Series',
    status: 'Completed'
  },
  {
    title: 'Chainsaw Man',
    poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    episodes: 12,
    score: 8.6,
    animeId: 'chainsaw-man',
    type: 'TV Series',
    status: 'Completed'
  },
  {
    title: 'Cyberpunk: Edgerunners',
    poster: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    episodes: 10,
    score: 8.7,
    animeId: 'cyberpunk-edgerunners',
    type: 'TV Series',
    status: 'Completed'
  },
  {
    title: 'Death Note',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    episodes: 37,
    score: 9.0,
    animeId: 'death-note',
    type: 'TV Series',
    status: 'Completed'
  },
  {
    title: 'Vinland Saga Season 2',
    poster: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=600&auto=format&fit=crop&q=80',
    episodes: 24,
    score: 8.8,
    animeId: 'vinland-saga-season-2',
    type: 'TV Series',
    status: 'Completed'
  },
  {
    title: 'Steins;Gate',
    poster: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=600&auto=format&fit=crop&q=80',
    episodes: 24,
    score: 9.1,
    animeId: 'steins-gate',
    type: 'TV Series',
    status: 'Completed'
  }
];

export const FALLBACK_HOME: HomeData = {
  ongoing: {
    animeList: FALLBACK_ONGOING
  },
  completed: {
    animeList: FALLBACK_COMPLETED
  }
};

export const FALLBACK_GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Isekai', 'Magic', 'Mecha', 'Mystery', 'Psychological', 'Romance',
  'Sci-Fi', 'Seinen', 'Shounen', 'Slice of Life', 'Supernatural', 'Thriller'
];

export function getFallbackAnimeDetail(slug: string): AnimeDetail {
  const match = [...FALLBACK_ONGOING, ...FALLBACK_COMPLETED].find(a => a.animeId === slug);
  const title = match ? match.title : slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const poster = match ? match.poster : 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80';
  
  const episodesCount = typeof match?.episodes === 'number' ? match.episodes : 12;
  const episodeList = Array.from({ length: Math.min(episodesCount, 24) }, (_, i) => {
    const epNum = i + 1;
    return {
      title: `${title} Episode ${epNum}`,
      eps: epNum,
      date: `2026-10-${Math.max(1, 20 - i)}`,
      episodeId: `${slug}-episode-${epNum}`
    };
  });

  return {
    title,
    japanese: `${title} (オリジナル)`,
    poster,
    score: match?.score || 8.6,
    producers: 'Aniplex, Shueisha, TOHO animation',
    type: 'TV Series',
    status: match?.status || 'Ongoing',
    episodes: episodesCount,
    duration: '24 min / episode',
    aired: '2024 - Present',
    studios: 'MAPPA, Ufotable, CloverWorks',
    synopsis: `${title} follows an extraordinary odyssey where ancient powers and modern heroes clash. Facing unprecedented challenges across dimensions, the characters must push past their mortal boundaries to safeguard everything they hold dear. Experience high-octane battles, emotional storytelling, and peak animation artistry.`,
    genreList: [
      { title: 'Action', genreId: 'action' },
      { title: 'Fantasy', genreId: 'fantasy' },
      { title: 'Shounen', genreId: 'shounen' },
      { title: 'Supernatural', genreId: 'supernatural' }
    ],
    episodeList,
    recommendedAnimeList: FALLBACK_ONGOING.filter(a => a.animeId !== slug).slice(0, 4)
  };
}

const ANIME_TRAILERS: Record<string, string> = {
  'solo-leveling-season-2': 'https://www.youtube-nocookie.com/embed/nCveVz5F6W0?autoplay=0&rel=0',
  'jujutsu-kaisen-s3': 'https://www.youtube-nocookie.com/embed/O6qVieflwqs?autoplay=0&rel=0',
  'demon-slayer-infinity-castle': 'https://www.youtube-nocookie.com/embed/VQGCKyvzIM4?autoplay=0&rel=0',
  'dandadan': 'https://www.youtube-nocookie.com/embed/G6gD4L40zD4?autoplay=0&rel=0',
  'frieren-beyond-journeys-end': 'https://www.youtube-nocookie.com/embed/qgQunxD0qLk?autoplay=0&rel=0',
  'bleach-thousand-year-blood-war': 'https://www.youtube-nocookie.com/embed/e8YBesRKq_U?autoplay=0&rel=0',
  'shingeki-no-kyojin-the-final-season': 'https://www.youtube-nocookie.com/embed/M_OauHnAFc8?autoplay=0&rel=0',
  'chainsaw-man': 'https://www.youtube-nocookie.com/embed/v4yLeNt-kCU?autoplay=0&rel=0',
  'cyberpunk-edgerunners': 'https://www.youtube-nocookie.com/embed/JtqIas3bYhg?autoplay=0&rel=0',
  'death-note': 'https://www.youtube-nocookie.com/embed/NlJZ-YgAt-c?autoplay=0&rel=0',
  'vinland-saga-season-2': 'https://www.youtube-nocookie.com/embed/7U7BDn-gU18?autoplay=0&rel=0',
  'steins-gate': 'https://www.youtube-nocookie.com/embed/uMYhjVwp0Fk?autoplay=0&rel=0'
};

export function getFallbackEpisodeStream(episodeSlug: string): EpisodeStreamData {
  // extract anime slug and episode number
  const parts = episodeSlug.split('-episode-');
  const animeSlug = parts[0] || 'anime';
  const epNum = parseInt(parts[1] || '1', 10);
  const animeTitle = animeSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const trailerUrl = ANIME_TRAILERS[animeSlug] || 'https://www.youtube-nocookie.com/embed/nCveVz5F6W0?autoplay=0&rel=0';

  return {
    title: `${animeTitle} Episode ${epNum}`,
    animeId: animeSlug,
    releaseTime: 'Recently aired',
    defaultStreamingUrl: trailerUrl,
    hasPrevEpisode: epNum > 1,
    prevEpisode: epNum > 1 ? {
      title: `${animeTitle} Episode ${epNum - 1}`,
      episodeId: `${animeSlug}-episode-${epNum - 1}`
    } : null,
    hasNextEpisode: epNum < 24,
    nextEpisode: epNum < 24 ? {
      title: `${animeTitle} Episode ${epNum + 1}`,
      episodeId: `${animeSlug}-episode-${epNum + 1}`
    } : null,
    server: {
      qualities: [
        {
          title: '1080p Full HD',
          serverList: [
            { title: 'Desustream Server (Default)', serverId: `desustream-default` },
            { title: 'VidHide Alpha', serverId: `srv-1080-vh-${episodeSlug}` },
            { title: 'StreamTape Pro', serverId: `srv-1080-st-${episodeSlug}` },
            { title: 'MegaCloud Fast', serverId: `srv-1080-mc-${episodeSlug}` }
          ]
        },
        {
          title: '720p HD',
          serverList: [
            { title: 'Direct Fast 720p', serverId: `srv-direct-720-${episodeSlug}` },
            { title: 'VidHide Standard', serverId: `srv-720-vh-${episodeSlug}` },
            { title: 'ODCDN Mirror', serverId: `srv-720-od-${episodeSlug}` }
          ]
        },
        {
          title: '480p SD',
          serverList: [
            { title: 'Direct Data Saver', serverId: `srv-direct-480-${episodeSlug}` }
          ]
        }
      ]
    }
  };
}
