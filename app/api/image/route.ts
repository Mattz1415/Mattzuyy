export const dynamic = 'force-static';

const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1035"/>
      <stop offset="50%" stop-color="#0f111a"/>
      <stop offset="100%" stop-color="#161824"/>
    </linearGradient>
    <linearGradient id="blade" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#9333ea"/>
      <stop offset="100%" stop-color="#f43f5e"/>
    </linearGradient>
  </defs>
  <rect width="400" height="600" fill="url(#bg)"/>
  <circle cx="200" cy="220" r="110" fill="#2e1065" opacity="0.3"/>
  <circle cx="200" cy="220" r="70" fill="#4c1d95" opacity="0.25"/>
  <path d="M 170 170 L 230 230 M 230 170 L 170 230" stroke="url(#blade)" stroke-width="6" stroke-linecap="round"/>
  <polygon points="200,140 215,190 200,240 185,190" fill="url(#blade)" opacity="0.8"/>
  <text x="200" y="320" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="900" fill="#c084fc" text-anchor="middle" letter-spacing="4">KUROSTREAM</text>
  <text x="200" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#ffffff" text-anchor="middle">Anime Stream</text>
  <text x="200" y="415" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="500" fill="#71717a" text-anchor="middle">HD STREAM READY</text>
  <rect x="50" y="520" width="300" height="2" fill="url(#blade)" opacity="0.6"/>
</svg>`;

export async function GET() {
  return new Response(fallbackSvg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
