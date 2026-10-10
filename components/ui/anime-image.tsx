'use client';

import { useState } from 'react';
import { Film } from 'lucide-react';

interface AnimeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt: string;
  fallbackTitle?: string;
  fill?: boolean;
  priority?: boolean;
}

export default function AnimeImage({
  src,
  alt,
  fallbackTitle,
  fill = false,
  className = '',
  priority = false,
  ...props
}: AnimeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-[#141622] to-zinc-950 p-3 text-center select-none ${
          fill ? 'absolute inset-0' : ''
        } ${className}`}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400 mb-2 border border-purple-500/20">
          <Film className="h-5 w-5" />
        </div>
        <span className="text-xs font-semibold text-zinc-200 line-clamp-2 px-1">
          {fallbackTitle || alt}
        </span>
        <span className="text-[10px] text-purple-400/80 uppercase tracking-wider mt-1">
          KuroStream
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`${fill ? 'absolute inset-0 h-full w-full' : ''} ${className}`}
      {...props}
    />
  );
}
