import { NextRequest, NextResponse } from 'next/server';
import {
  FALLBACK_COMPLETED,
  FALLBACK_HOME,
  FALLBACK_ONGOING,
  getFallbackAnimeDetail,
  getFallbackEpisodeStream
} from '@/lib/mock-data';

const BASE_URL = process.env.NEXT_PUBLIC_ANIME_API_URL || 'https://www.sankavollerei.web.id/anime';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const subpath = path ? path.join('/') : '';
  const searchParams = req.nextUrl.searchParams.toString();
  const targetUrl = `${BASE_URL}/${subpath}${searchParams ? `?${searchParams}` : ''}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const upstreamRes = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*'
      },
      next: { revalidate: 120 } // Cache for 2 mins
    });
    clearTimeout(timeout);

    if (upstreamRes.ok) {
      const data = await upstreamRes.json();
      if (data && (data.ok === true || data.status === 'success' || data.data)) {
        return NextResponse.json(data);
      }
    }
  } catch (err) {
    // Silent catch, will use fallback below
    console.warn(`Upstream error for ${targetUrl}:`, (err as Error).message);
  }

  // Graceful fallback according to subpath
  if (subpath === 'home') {
    return NextResponse.json({
      ok: true,
      status: 'success',
      data: FALLBACK_HOME
    });
  }

  if (subpath.startsWith('anime/')) {
    const slug = subpath.replace('anime/', '');
    return NextResponse.json({
      ok: true,
      status: 'success',
      data: getFallbackAnimeDetail(slug)
    });
  }

  if (subpath.startsWith('episode/')) {
    const episodeSlug = subpath.replace('episode/', '');
    return NextResponse.json({
      ok: true,
      status: 'success',
      data: getFallbackEpisodeStream(episodeSlug)
    });
  }

  if (subpath.startsWith('server/')) {
    return NextResponse.json({
      ok: true,
      status: 'success',
      data: {
        url: 'https://www.youtube-nocookie.com/embed/nCveVz5F6W0?autoplay=1&rel=0'
      }
    });
  }

  if (subpath.startsWith('search/')) {
    const query = decodeURIComponent(subpath.replace('search/', '')).toLowerCase();
    const matches = [...FALLBACK_ONGOING, ...FALLBACK_COMPLETED].filter(a =>
      a.title.toLowerCase().includes(query)
    );
    return NextResponse.json({
      ok: true,
      status: 'success',
      data: {
        animeList: matches.length > 0 ? matches : FALLBACK_ONGOING
      }
    });
  }

  if (subpath.startsWith('genre/')) {
    return NextResponse.json({
      ok: true,
      status: 'success',
      data: {
        animeList: FALLBACK_ONGOING
      }
    });
  }

  if (subpath === 'ongoing-anime') {
    return NextResponse.json({
      ok: true,
      status: 'success',
      data: {
        animeList: FALLBACK_ONGOING
      }
    });
  }

  if (subpath === 'complete-anime') {
    return NextResponse.json({
      ok: true,
      status: 'success',
      data: {
        animeList: FALLBACK_COMPLETED
      }
    });
  }

  // Default fallback
  return NextResponse.json({
    ok: true,
    status: 'success',
    data: FALLBACK_HOME
  });
}
