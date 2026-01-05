import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    // Parámetros
    const items = searchParams.get('items') || 'Frontend,Backend,Architecture,DevOps';
    const details = searchParams.get('details') || 'React|Next.js|Tailwind,.NET|Java|Node.js,Microservices|Clean Arch,Docker|CI/CD|Linux';
    const icons = searchParams.get('icons') || '⚛️,⚙️,🏗️,🐳';
    const theme = searchParams.get('theme') || 'cyan';

    const itemsArray = items.split(',');
    const detailsArray = details.split(',');
    const iconsArray = icons.split(',');

    // Temas
    const themes: Record<string, { primary: string; secondary: string; accent: string }> = {
        cyan: { primary: '#00f2ff', secondary: '#4d47c3', accent: '#00ff9d' },
        purple: { primary: '#bd00ff', secondary: '#7209b7', accent: '#f72585' },
        orange: { primary: '#ffaa40', secondary: '#ff6b35', accent: '#ffd60a' },
        green: { primary: '#00ff9d', secondary: '#06ffa5', accent: '#4d47c3' }
    };

    const currentTheme = themes[theme] || themes.cyan;

    const svg = `
<svg width="800" height="220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Glassmorphism Filter -->
    <filter id="glass" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur"/>
      <feColorMatrix in="blur" mode="matrix" 
        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.06 0" result="glass"/>
      <feBlend in="SourceGraphic" in2="glass" mode="normal"/>
    </filter>

    <!-- Item Shadow -->
    <filter id="itemShadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
      <feOffset dx="0" dy="3" result="offsetblur"/>
      <feFlood flood-color="${currentTheme.primary}" flood-opacity="0.2" result="color"/>
      <feComposite in="color" in2="offsetblur" operator="in" result="shadow"/>
      <feMerge>
        <feMergeNode in="shadow"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Glow Effect -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Header Gradient -->
    <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${currentTheme.primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${currentTheme.secondary};stop-opacity:0.6" />
    </linearGradient>

    <!-- Item Border Gradient -->
    <linearGradient id="itemBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${currentTheme.primary};stop-opacity:0.15" />
      <stop offset="100%" style="stop-color:${currentTheme.secondary};stop-opacity:0.05" />
    </linearGradient>

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&amp;display=swap');
      
      .outfit { font-family: 'Outfit', sans-serif; }
      
      .stack-item {
        fill: rgba(255, 255, 255, 0.02);
        stroke: rgba(255, 255, 255, 0.05);
        stroke-width: 1;
      }

      /* Icon Rotation */
      @keyframes iconRotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Glow Pulse */
      @keyframes glowPulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.8; }
      }

      /* Item Fade In */
      @keyframes itemFadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .icon-animated {
        animation: iconRotate 20s linear infinite;
        transform-origin: center;
      }

      .glow-animated {
        animation: glowPulse 3s ease-in-out infinite;
      }

      .item-animated {
        animation: itemFadeIn 0.6s ease-out forwards;
      }
    </style>
  </defs>

  <!-- Background -->
  <rect width="800" height="220" fill="#050505"/>

  <!-- Glass Panel -->
  <rect x="20" y="20" width="760" height="180" rx="20" class="stack-item" filter="url(#itemShadow)"/>

  <!-- Header Section -->
  <g class="outfit">
    <text x="45" y="55" font-size="18" fill="url(#headerGradient)" font-weight="600" letter-spacing="1" filter="url(#glow)">
      🛠️ Tech Arsenal
    </text>
  </g>

  <!-- Grid Items -->
  <g transform="translate(45, 80)">
    ${itemsArray.map((item, index) => {
        const x = (index % 4) * 175;
        const y = Math.floor(index / 4) * 100;
        const icon = iconsArray[index] || '⚡';
        const detail = detailsArray[index] || 'Tech Stack';

        return `
        <g transform="translate(${x}, ${y})" class="item-animated" style="animation-delay: ${index * 0.15}s">
          <!-- Item Container -->
          <rect width="165" height="90" rx="12" class="stack-item" filter="url(#glass)"/>
          <rect width="165" height="90" rx="12" fill="none" stroke="url(#itemBorder)" stroke-width="1.5"/>
          
          <!-- Icon with Glow -->
          <g transform="translate(25, 30)">
            <circle cx="0" cy="0" r="20" fill="${currentTheme.primary}" opacity="0.1" class="glow-animated"/>
            <text x="0" y="0" font-size="28" text-anchor="middle" dominant-baseline="middle" class="icon-animated">
              ${icon}
            </text>
          </g>

          <!-- Label -->
          <text x="60" y="30" font-size="14" fill="#ffffff" font-weight="700" class="outfit">
            ${item.trim()}
          </text>

          <!-- Details -->
          <text x="60" y="48" font-size="10" fill="#666666" font-weight="400" class="outfit">
            ${detail.trim().split('|').join(', ')}
          </text>

          <!-- Accent Dot -->
          <circle cx="155" cy="10" r="2" fill="${currentTheme.accent}" opacity="0.6">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
          </circle>
        </g>
      `;
    }).join('')}
  </g>

  <!-- Decorative Elements -->
  <line x1="45" y1="70" x2="755" y2="70" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
</svg>
  `.trim();

    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=86400',
        },
    });
}