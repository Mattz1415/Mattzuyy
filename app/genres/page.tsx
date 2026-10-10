import { Suspense } from 'react';
import { getGenres, getByGenre } from '@/lib/api';
import GenresClient from './genres-client';

interface GenresPageProps {
  searchParams: Promise<{ genre?: string }>;
}

export default async function GenresPage({ searchParams }: GenresPageProps) {
  const { genre } = await searchParams;
  const genres = await getGenres();
  const activeGenre = genre || genres[0] || 'action';
  const initialAnime = await getByGenre(activeGenre);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Anime Categories & Genres
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Filter and explore thousands of anime titles by themes and genres.
        </p>
      </div>

      <Suspense fallback={<div className="py-20 text-center text-zinc-500">Loading genres...</div>}>
        <GenresClient
          genres={genres}
          initialGenre={activeGenre}
          initialAnime={initialAnime}
        />
      </Suspense>
    </div>
  );
}
