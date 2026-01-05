import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    // Parámetros
    const company = searchParams.get('company') || 'Grupo Salinas';
    const role = searchParams.get('role') || 'Tech Lead';
    const year = searchParams.get('year') || '2024 - Present';
    const stat = searchParams.get('stat') || '+40%';
    const statDesc = searchParams.get('desc') || 'System Performance';
    const description = searchParams.get('description') || 'Microfrontend architecture for critical banking systems';
    const tech = searchParams.get('tech') || 'React,TypeScript,Jest';
    const logo = searchParams.get('logo') || '🏦';
    const theme = searchParams.get('theme') || 'cyan';

    const techArray = tech.split(',').slice(0, 4); // Max 4 tags

    // Temas
    const themes: Record<string, { primary: string; secondary: string; accent: string }> = {
        cyan: { primary: '#00f2ff', secondary: '#4d47c3', accent: '#00ff9d' },
        purple: { primary: '#bd00ff', secondary: '#7209b7', accent: '#f72585' },
        orange: { primary: '#ffaa40', secondary: '#ff6b35', accent: '#ffd60a' },
        green: { primary: '#00ff9d', secondary: '#06ffa5', accent: '#4d47c3' }
    };

    const currentTheme = themes[theme] || themes.cyan;

    const svg = `
<svg width="380" height="420" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Advanced Filters -->
    <filter id="glass" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
      <feColorMatrix in="blur" mode="matrix" 
        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0" result="glass"/>
      <feBlend in="SourceGraphic" in2="glass" mode="normal"/>
    </filter>
    
    <!-- Multi-layer Shadow with Color -->
    <filter id="cardShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur1"/>
      <feOffset in="blur1" dx="0" dy="6" result="offsetBlur1"/>
      <feFlood flood-color="${currentTheme.primary}" flood-opacity="0.2" result="color1"/>
      <feComposite in="color1" in2="offsetBlur1" operator="in" result="shadow1"/>
      
      <feGaussianBlur in="SourceAlpha" stdDeviation="16" result="blur2"/>
      <feOffset in="blur2" dx="0" dy="12" result="offsetBlur2"/>
      <feFlood flood-color="#000000" flood-opacity="0.4" result="color2"/>
      <feComposite in="color2" in2="offsetBlur2" operator="in" result="shadow2"/>
      
      <feMerge>
        <feMergeNode in="shadow2"/>
        <feMergeNode in="shadow1"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Glow Effect -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Stat Gradient with Animation -->
    <linearGradient id="statGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1">
        <animate attributeName="stop-opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.2">
        <animate attributeName="stop-opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>

    <!-- Accent Gradient -->
    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${currentTheme.primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${currentTheme.secondary};stop-opacity:1" />
    </linearGradient>

    <!-- Background Gradient -->
    <radialGradient id="bgGradient" cx="50%" cy="0%">
      <stop offset="0%" style="stop-color:${currentTheme.primary};stop-opacity:0.15" />
      <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
    </radialGradient>

    <!-- Animated Border Gradient -->
    <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${currentTheme.primary};stop-opacity:0.3">
        <animate attributeName="offset" values="0%;20%;0%" dur="3s" repeatCount="indefinite"/>
      </stop>
      <stop offset="50%" style="stop-color:${currentTheme.accent};stop-opacity:0.5">
        <animate attributeName="offset" values="50%;70%;50%" dur="3s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" style="stop-color:${currentTheme.secondary};stop-opacity:0.3">
        <animate attributeName="offset" values="100%;80%;100%" dur="3s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&amp;display=swap');
      
      .outfit { font-family: 'Outfit', sans-serif; }
      
      .card-bg {
        fill: url(#bgGradient);
        stroke: rgba(255, 255, 255, 0.08);
        stroke-width: 1.5;
      }
      
      .stat-stroke {
        fill: none;
        stroke: rgba(255, 255, 255, 0.8);
        stroke-width: 2;
      }
      
      .tag {
        fill: rgba(255, 255, 255, 0.05);
        stroke: rgba(255, 255, 255, 0.1);
        stroke-width: 1;
      }
      
      /* Glow Line Animation */
      @keyframes glowPulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.8; }
      }
      
      @keyframes slideIn {
        from { stroke-dashoffset: 600; }
        to { stroke-dashoffset: 0; }
      }
      
      .glow-line {
        animation: glowPulse 3s ease-in-out infinite;
      }
      
      .animated-border {
        stroke-dasharray: 600;
        animation: slideIn 2s ease-out forwards;
      }
      
      /* Stat Counter Animation */
      @keyframes countUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .stat-number {
        animation: countUp 0.8s ease-out forwards;
      }
      
      /* Tag Fade In */
      @keyframes fadeInTag {
        from { opacity: 0; transform: translateX(-10px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      .tag-animated {
        animation: fadeInTag 0.5s ease-out forwards;
      }
    </style>
  </defs>

  <!-- Background -->
  <rect width="380" height="420" fill="#050505"/>
  
  <!-- Card Container with Advanced Shadow -->
  <rect x="20" y="20" width="340" height="380" rx="16" class="card-bg" filter="url(#cardShadow)"/>
  
  <!-- Animated Border Overlay -->
  <rect x="20" y="20" width="340" height="380" rx="16" 
        fill="none" stroke="url(#borderGradient)" stroke-width="2" class="animated-border"/>
  
  <!-- Accent Glow Line (top) -->
  <line x1="40" y1="40" x2="340" y2="40" stroke="url(#accentGradient)" stroke-width="2" class="glow-line" filter="url(#glow)"/>
  
  <!-- Header Section -->
  <g class="outfit">
    <!-- Company Logo with Pulse -->
    <text x="45" y="75" font-size="32">
      ${logo}
      <animateTransform attributeName="transform" type="scale" 
        values="1;1.1;1" dur="2s" repeatCount="indefinite" additive="sum"/>
    </text>
    
    <!-- Year Badge -->
    <g transform="translate(280, 50)">
      <rect width="70" height="24" rx="4" fill="rgba(255,255,255,0.08)" filter="url(#glass)"/>
      <text x="35" y="16" font-size="10" fill="#aaaaaa" text-anchor="middle" font-weight="600">
        ${year}
      </text>
    </g>
    
    <!-- Company Name with Glow -->
    <text x="45" y="110" font-size="11" fill="${currentTheme.primary}" font-weight="700" letter-spacing="2" filter="url(#glow)">
      ${company.toUpperCase()}
    </text>
    
    <!-- Role Title -->
    <text x="45" y="135" font-size="18" fill="#ffffff" font-weight="700">
      ${role}
    </text>
  </g>
  
  <!-- Stats Section -->
  <g transform="translate(45, 160)" class="stat-number">
    <!-- Big Stat with Stroke Effect -->
    <text x="0" y="0" font-size="64" class="stat-stroke" font-weight="800" class="outfit">
      ${stat}
    </text>
    <text x="0" y="0" font-size="64" fill="url(#statGradient)" font-weight="800" class="outfit">
      ${stat}
    </text>
    
    <!-- Stat Description with Glow -->
    <text x="0" y="25" font-size="11" fill="${currentTheme.accent}" font-weight="700" letter-spacing="1.5" class="outfit" filter="url(#glow)">
      ${statDesc.toUpperCase()}
    </text>
  </g>
  
  <!-- Description -->
  <text x="45" y="255" font-size="13" fill="rgba(255,255,255,0.75)" font-weight="300" class="outfit">
    <tspan x="45" dy="0">${description.substring(0, 36)}</tspan>
    ${description.length > 36 ? `<tspan x="45" dy="18">${description.substring(36, 72)}</tspan>` : ''}
    ${description.length > 72 ? `<tspan x="45" dy="18">${description.substring(72, 108)}...</tspan>` : ''}
  </text>
  
  <!-- Tech Stack Tags with Animation -->
  <g transform="translate(45, 320)">
    ${techArray.map((tag, index) => `
      <g transform="translate(${index * 75}, 0)" class="tag-animated" style="animation-delay: ${index * 0.1}s">
        <rect width="${tag.trim().length * 7 + 16}" height="24" rx="4" class="tag" filter="url(#glass)"/>
        <text x="${(tag.trim().length * 7 + 16) / 2}" y="16" 
              font-size="9" fill="#888888" text-anchor="middle" font-weight="500" class="outfit">
          ${tag.trim()}
        </text>
      </g>
    `).join('')}
  </g>
  
  <!-- Bottom Accent Line -->
  <line x1="45" y1="370" x2="335" y2="370" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  
  <!-- Decorative Corner Dots -->
  <circle cx="335" cy="50" r="2" fill="${currentTheme.accent}" opacity="0.5">
    <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="45" cy="370" r="2" fill="${currentTheme.primary}" opacity="0.4">
    <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite"/>
  </circle>
  
</svg>
  `.trim();

    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=86400',
        },
    });
}