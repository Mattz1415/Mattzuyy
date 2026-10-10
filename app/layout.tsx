import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import QueryProvider from '@/components/providers/query-provider';

export const metadata: Metadata = {
  title: 'KuroStream — Watch Free Anime Online in HD',
  description: 'Stream latest ongoing and completed anime with multi-server playback, bookmarks, watch history, and lightning fast search on KuroStream.',
  openGraph: {
    title: 'KuroStream — Watch Free Anime Online in HD',
    description: 'Stream latest ongoing and completed anime with multi-server playback, bookmarks, and watch history.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KuroStream — Watch Free Anime Online in HD',
    description: 'Stream latest ongoing and completed anime with multi-server playback, bookmarks, and watch history.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0b0c10] text-zinc-100 antialiased selection:bg-purple-600 selection:text-white flex flex-col font-sans">
        <QueryProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
