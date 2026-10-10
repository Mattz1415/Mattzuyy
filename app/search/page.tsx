import { Suspense } from 'react';
import { getHome, getGenres } from '@/lib/api';
import SearchClient from './search-client';

export default async function SearchPage() {
  const home = await getHome();
  const allGenres = await getGenres();
  const initialList = [...home.ongoing.animeList, ...home.completed.animeList];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Explore & Search
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Search over 50,000 anime series, films, and ongoing simulcasts.
        </p>
      </div>

      <Suspense fallback={<div className="py-20 text-center text-zinc-500">Loading catalog...</div>}>
        <SearchClient
          initialResults={initialList}
          allGenres={allGenres}
        />
      </Suspense>
    </div>
  );
}
