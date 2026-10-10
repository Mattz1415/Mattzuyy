import Link from 'next/link';
import { Film, Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800/80 bg-[#08090d] text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400">
              <Film className="h-4 w-4" />
            </span>
            <span className="text-base font-semibold text-white">
              Kuro<span className="text-purple-400">Stream</span>
            </span>
            <span className="text-xs text-zinc-600">·</span>
            <span className="text-xs text-zinc-500">Free Anime Streaming</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400">
            <Link href="/" className="hover:text-zinc-200 transition-colors">
              Home
            </Link>
            <Link href="/search" className="hover:text-zinc-200 transition-colors">
              Explore
            </Link>
            <Link href="/genres" className="hover:text-zinc-200 transition-colors">
              Genres
            </Link>
            <Link href="/bookmarks" className="hover:text-zinc-200 transition-colors">
              Bookmarks
            </Link>
            <Link href="/history" className="hover:text-zinc-200 transition-colors">
              Watch History
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-zinc-900 pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} KuroStream. Powered by SankaVollereii REST API. KuroStream does not store media files on its servers.
          </p>
          <div className="flex items-center gap-4 text-zinc-500">
            <span>Fast Streams</span>
            <span>·</span>
            <span>Zero Ads</span>
            <span>·</span>
            <span>Multi-Server</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
