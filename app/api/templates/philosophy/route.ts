import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    // Parámetros
    const title = searchParams.get('title') || 'The Person Behind the Code';
    const quote = searchParams.get('quote') || 'Technology is the tool, empathy is the engine.';
    const icon = searchParams.get('icon') || '⚛';
    const lang = searchParams.get('lang') || 'en';

    const svg = `
<svg width="800" height="250" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Warm Gradient Background -->
    <linearGradient id="warmGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffaa40;stop-opacity:0.08" />
      <stop offset="100%" style="stop-color:#000000;stop-opacity:0" />
    </linearGradient>

    <!-- Icon Glow Gradient -->
    <radialGradient id="iconGlow">
      <stop offset="0%" style="stop-color:#ffaa40;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#ffaa40;stop-opacity:0" />
    </radialGradient>

    <!-- Quote Border Gradient -->
    <linearGradient id="quoteBorder" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffaa40;stop-opacity:0.8">
        <animate attributeName="stop-opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" style="stop-color:#ff6b35;stop-opacity:0.4">
        <animate attributeName="stop-opacity" values="0.4;0.6;0.4" dur="2s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>

    <!-- Glass Filter -->
    <filter id="glass" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur"/>
      <feColorMatrix in="blur" mode="matrix" 
        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.08 0" result="glass"/>
      <feBlend in="SourceGraphic" in2="glass" mode="normal"/>
    </filter>

    <!-- Glow Filter -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Shadow -->
    <filter id="shadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="10"/>
      <feOffset dx="0" dy="4" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.3"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600;700&amp;display=swap');
      
      .outfit { font-family: 'Outfit', sans-serif; }
      
      .glass-panel {
        fill: rgba(255, 255, 255, 0.02);
        stroke: rgba(255, 170, 64, 0.1);
        stroke-width: 1.5;
      }

      /* Icon Pulse */
      @keyframes iconPulse {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.1); opacity: 1; }
      }

      /* Warmth Glow */
      @keyframes warmthGlow {
        0%, 100% { opacity: 0.15; }
        50% { opacity: 0.25; }
      }

      /* Quote Fade In */
      @keyframes quoteFadeIn {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }

      .icon-animated {
        animation: iconPulse 3s ease-in-out infinite;
        transform-origin: center;
      }

      .warmth-glow {
        animation: warmthGlow 4s ease-in-out infinite;
      }

      .quote-text {
        animation: quoteFadeIn 1s ease-out forwards;
      }
    </style>
  </defs>

  <!-- Background -->
  <rect width="800" height="250" fill="#050505"/>

  <!-- Warm Gradient Overlay -->
  <rect width="800" height="250" fill="url(#warmGradient)"/>

  <!-- Glass Panel -->
  <rect x="30" y="30" width="740" height="190" rx="24" class="glass-panel" filter="url(#shadow)"/>

  <!-- Top Border Accent -->
  <line x1="50" y1="50" x2="750" y2="50" stroke="url(#quoteBorder)" stroke-width="2" opacity="0.6"/>

  <!-- Content -->
  <g class="outfit">
    <!-- Icon with Glow -->
    <g transform="translate(60, 90)">
      <circle cx="0" cy="0" r="25" fill="url(#iconGlow)" opacity="0.3" class="warmth-glow"/>
      <text x="0" y="0" font-size="40" text-anchor="middle" dominant-baseline="middle" class="icon-animated" filter="url(#glow)">
        ${icon}
      </text>
    </g>

    <!-- Title -->
    <text x="110" y="85" font-size="20" fill="#ffaa40" font-weight="600" letter-spacing="1" filter="url(#glow)">
      ${title}
    </text>

    <!-- Quote Box -->
    <g transform="translate(60, 130)" class="quote-text">
      <!-- Border Line -->
      <rect x="0" y="0" width="4" height="60" fill="url(#quoteBorder)" rx="2"/>

      <!-- Quote Text -->
      <text x="25" y="20" font-size="18" fill="#ffffff" font-weight="400" font-style="italic">
        "${quote}"
      </text>

      <!-- Attribution Line (optional) -->
      <text x="25" y="45" font-size="12" fill="rgba(255,170,64,0.6)" font-weight="300">
        — ${lang === 'es' ? 'Filosofía Personal' : 'Personal Philosophy'}
      </text>
    </g>
  </g>

  <!-- Decorative Elements -->
  <circle cx="730" cy="70" r="3" fill="#ffaa40" opacity="0.5">
    <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="750" cy="90" r="2" fill="#ff6b35" opacity="0.4">
    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite"/>
  </circle>

  <!-- Bottom Accent -->
  <line x1="60" y1="200" x2="740" y2="200" stroke="rgba(255,170,64,0.1)" stroke-width="1"/>
</svg>
  `.trim();

    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=86400',
        },
    });
}