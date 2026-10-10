'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Search, Bookmark, History, Film, Menu, X, Flame } from 'lucide-react';
import { useBookmarks } from '@/lib/storage';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { bookmarks } = useBookmarks();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Explore', href: '/search' },
    { label: 'Genres', href: '/genres' },
    { label: 'Bookmarks', href: '/bookmarks', badge: bookmarks.length > 0 ? bookmarks.length : null },
    { label: 'History', href: '/history' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#0b0c10]/90 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Brand Wordmark (Single Element) */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 transition-opacity hover:opacity-90"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 via-rose-500 to-amber-400 text-white shadow-lg shadow-purple-500/20">
              <Film className="h-4.5 w-4.5" />
            </span>
            <span>
              Kuro<span className="text-purple-400">Stream</span>
            </span>
          </Link>

          {/* Zone 2: 4-5 Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative py-1 whitespace-nowrap shrink-0 transition-colors ${
                    isActive ? 'text-white font-semibold' : 'hover:text-white'
                  }`}
                >
                  {link.label}
                  {link.badge ? (
                    <span className="ml-1.5 text-xs text-purple-400 tabular-nums">
                      ({link.badge})
                    </span>
                  ) : null}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-purple-500 to-rose-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/search"
              aria-label="Search anime"
              className="flex items-center gap-2 rounded-lg border border-zinc-700/80 bg-zinc-900/80 px-3.5 py-1.5 text-xs font-medium text-zinc-300 shadow-sm transition-all hover:border-purple-500/60 hover:bg-zinc-800 hover:text-white whitespace-nowrap shrink-0"
            >
              <Search className="h-3.5 w-3.5 text-zinc-400 group-hover:text-purple-400" />
              <span className="hidden sm:inline">Search Anime...</span>
              <kbd className="hidden lg:inline-block rounded border border-zinc-700 bg-zinc-800/80 px-1.5 py-0.5 text-[10px] text-zinc-400">
                ⌘K
              </kbd>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 md:hidden hover:text-white hover:border-zinc-700"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-30 border-b border-zinc-800 bg-[#0d0e15]/95 p-5 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-950/40 text-purple-300 font-semibold'
                      : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge ? (
                    <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs font-mono text-purple-300">
                      {link.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
