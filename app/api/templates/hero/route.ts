import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    // Parámetros personalizables
    const name = searchParams.get('name') || 'Miguel A. Pacheco';
    const title = searchParams.get('title') || 'Tech Lead & Architect';
    const subtitle = searchParams.get('subtitle') || 'Human first, Engineer second';
    const location = searchParams.get('location') || 'Hidalgo, MX';
    const lang = searchParams.get('lang') || 'es';
    const theme = searchParams.get('theme') || 'purple-cyan';
    const animationSpeed = searchParams.get('speed') || 'normal'; // slow, normal, fast
    const glassIntensity = searchParams.get('glass') || 'medium'; // low, medium, high

    // Temas de gradientes
    const gradients: Record<string, { blob1: string; blob2: string; blob3: string; accent: string }> = {
        'purple-cyan': {
            blob1: '#4316db',
            blob2: '#00d4ff',
            blob3: '#bd00ff',
            accent: '#00f2ff'
        },
        'orange-pink': {
            blob1: '#ff6b35',
            blob2: '#f72585',
            blob3: '#7209b7',
            accent: '#ffaa40'
        },
        'green-blue': {
            blob1: '#06ffa5',
            blob2: '#4d47c3',
            blob3: '#00b4d8',
            accent: '#00ff9d'
        }
    };

    const currentTheme = gradients[theme] || gradients['purple-cyan'];

    // Configuración de velocidades
    const speeds = {
        slow: { blob1: '35s', blob2: '40s', blob3: '38s', glow: '6s' },
        normal: { blob1: '25s', blob2: '30s', blob3: '28s', glow: '4s' },
        fast: { blob1: '15s', blob2: '18s', blob3: '16s', glow: '2s' }
    };
    const speed = speeds[animationSpeed as keyof typeof speeds] || speeds.normal;

    // Configuración de glassmorphism
    const glassConfig = {
        low: { blur: '10', opacity: '0.05' },
        medium: { blur: '20', opacity: '0.08' },
        high: { blur: '30', opacity: '0.12' }
    };
    const glass = glassConfig[glassIntensity as keyof typeof glassConfig] || glassConfig.medium;

    const svg = `
<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- ADVANCED FILTERS -->
    
    <!-- Multi-layer Glassmorphism -->
    <filter id="glass" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="${glass.blur}" result="blur1"/>
      <feGaussianBlur in="SourceGraphic" stdDeviation="${parseInt(glass.blur) / 2}" result="blur2"/>
      <feColorMatrix in="blur1" mode="matrix" 
        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${glass.opacity} 0" result="glass1"/>
      <feColorMatrix in="blur2" mode="matrix" 
        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.05 0" result="glass2"/>
      <feMerge>
        <feMergeNode in="glass1"/>
        <feMergeNode in="glass2"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- Enhanced Drop Shadow with Glow -->
    <filter id="shadowGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="12" result="blur"/>
      <feOffset in="blur" dx="0" dy="6" result="offsetBlur"/>
      <feFlood flood-color="${currentTheme.accent}" flood-opacity="0.3" result="color"/>
      <feComposite in="color" in2="offsetBlur" operator="in" result="shadow"/>
      <feGaussianBlur in="shadow" stdDeviation="4" result="glow"/>
      <feMerge>
        <feMergeNode in="glow"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- Outer Glow Effect -->
    <filter id="outerGlow">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
      <feFlood flood-color="${currentTheme.accent}" flood-opacity="0.5" result="color"/>
      <feComposite in="color" in2="blur" operator="in" result="glow"/>
      <feMerge>
        <feMergeNode in="glow"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- GRADIENTS -->
    
    <!-- Animated Text Gradient -->
    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1">
        <animate attributeName="stop-color" values="#ffffff;#f0f0f0;#ffffff" dur="4s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" style="stop-color:#999999;stop-opacity:1">
        <animate attributeName="stop-color" values="#999999;#cccccc;#999999" dur="4s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>

    <!-- Accent Gradient with Animation -->
    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${currentTheme.accent};stop-opacity:1">
        <animate attributeName="offset" values="0%;10%;0%" dur="${speed.glow}" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" style="stop-color:${currentTheme.blob3};stop-opacity:1">
        <animate attributeName="offset" values="100%;90%;100%" dur="${speed.glow}" repeatCount="indefinite"/>
      </stop>
    </linearGradient>

    <!-- Morphing Blob Gradients -->
    <radialGradient id="blob1Gradient">
      <stop offset="0%" style="stop-color:${currentTheme.blob1};stop-opacity:0.7" />
      <stop offset="50%" style="stop-color:${currentTheme.blob1};stop-opacity:0.4" />
      <stop offset="100%" style="stop-color:${currentTheme.blob1};stop-opacity:0" />
    </radialGradient>
    
    <radialGradient id="blob2Gradient">
      <stop offset="0%" style="stop-color:${currentTheme.blob2};stop-opacity:0.6" />
      <stop offset="50%" style="stop-color:${currentTheme.blob2};stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:${currentTheme.blob2};stop-opacity:0" />
    </radialGradient>
    
    <radialGradient id="blob3Gradient">
      <stop offset="0%" style="stop-color:${currentTheme.blob3};stop-opacity:0.5" />
      <stop offset="50%" style="stop-color:${currentTheme.blob3};stop-opacity:0.25" />
      <stop offset="100%" style="stop-color:${currentTheme.blob3};stop-opacity:0" />
    </radialGradient>

    <!-- MASKS & CLIPS -->
    <clipPath id="panelClip">
      <rect x="40" y="40" width="720" height="320" rx="24"/>
    </clipPath>

    <!-- FONTS & ANIMATIONS -->
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600;700;800&amp;family=Syncopate:wght@700&amp;display=swap');
      
      .syncopate { font-family: 'Syncopate', sans-serif; }
      .outfit { font-family: 'Outfit', sans-serif; }
      
      /* Glass Panel */
      .glass-panel {
        fill: rgba(255, 255, 255, 0.02);
        stroke: rgba(255, 255, 255, 0.08);
        stroke-width: 1.5;
      }
      
      /* Float Animations */
      @keyframes float1 {
        0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
        33% { transform: translate(30px, -20px) scale(1.08) rotate(5deg); }
        66% { transform: translate(-15px, 25px) scale(0.95) rotate(-3deg); }
      }
      
      @keyframes float2 {
        0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
        33% { transform: translate(-25px, 15px) scale(1.05) rotate(-4deg); }
        66% { transform: translate(20px, -18px) scale(1.1) rotate(6deg); }
      }
      
      @keyframes float3 {
        0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
        50% { transform: translate(20px, 25px) scale(1.12) rotate(8deg); }
      }
      
      /* Pulse Glow */
      @keyframes pulseGlow {
        0%, 100% { opacity: 0.4; filter: blur(80px); }
        50% { opacity: 0.7; filter: blur(100px); }
      }
      
      /* Particle Float */
      @keyframes particleFloat {
        0% { transform: translateY(0) scale(0); opacity: 0; }
        20% { opacity: 1; }
        80% { opacity: 0.8; }
        100% { transform: translateY(-400px) scale(1); opacity: 0; }
      }
      
      .blob1 { animation: float1 ${speed.blob1} infinite ease-in-out, pulseGlow ${speed.glow} infinite ease-in-out; }
      .blob2 { animation: float2 ${speed.blob2} infinite ease-in-out, pulseGlow ${speed.glow} infinite ease-in-out; }
      .blob3 { animation: float3 ${speed.blob3} infinite ease-in-out, pulseGlow ${speed.glow} infinite ease-in-out; }
      
      /* Particles */
      .particle {
        animation: particleFloat linear infinite;
        fill: ${currentTheme.accent};
        opacity: 0;
      }
      
      .particle1 { animation-duration: 8s; animation-delay: 0s; }
      .particle2 { animation-duration: 10s; animation-delay: 2s; }
      .particle3 { animation-duration: 12s; animation-delay: 4s; }
      .particle4 { animation-duration: 9s; animation-delay: 1s; }
      .particle5 { animation-duration: 11s; animation-delay: 3s; }
    </style>
  </defs>

  <!-- Background Layer -->
  <rect width="800" height="400" fill="#050505"/>
  
  <!-- Radial Gradient Background -->
  <defs>
    <radialGradient id="bgGradient" cx="50%" cy="10%">
      <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
    </radialGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bgGradient)"/>
  
  <!-- Animated Morphing Blobs -->
  <g opacity="0.6" filter="url(#glass)">
    <ellipse class="blob1" cx="150" cy="100" rx="220" ry="200" fill="url(#blob1Gradient)"/>
    <ellipse class="blob2" cx="650" cy="320" rx="240" ry="220" fill="url(#blob2Gradient)"/>
    <ellipse class="blob3" cx="400" cy="200" rx="180" ry="170" fill="url(#blob3Gradient)"/>
  </g>
  
  <!-- Floating Particles -->
  <g opacity="0.3">
    <circle class="particle particle1" cx="100" cy="400" r="2"/>
    <circle class="particle particle2" cx="300" cy="400" r="3"/>
    <circle class="particle particle3" cx="500" cy="400" r="2"/>
    <circle class="particle particle4" cx="650" cy="400" r="2.5"/>
    <circle class="particle particle5" cx="750" cy="400" r="2"/>
  </g>

  <!-- Main Glass Panel with Enhanced Shadow -->
  <rect x="40" y="40" width="720" height="320" rx="24" class="glass-panel" filter="url(#shadowGlow)"/>
  
  <!-- Inner Glow Border -->
  <rect x="40" y="40" width="720" height="320" rx="24" 
        fill="none" stroke="url(#accentGradient)" stroke-width="0.5" opacity="0.3"/>
  
  <!-- Content Layer -->
  <g class="outfit" clip-path="url(#panelClip)">
    <!-- Label with Glow -->
    <text x="70" y="85" font-size="11" fill="#888888" letter-spacing="3" font-weight="400" filter="url(#outerGlow)">
      ${lang === 'es' ? 'PERFIL PERSONAL' : 'PERSONAL PROFILE'}
    </text>
    
    <!-- Name with Gradient Animation -->
    <text x="70" y="135" font-size="56" fill="url(#textGradient)" font-weight="700" class="syncopate" letter-spacing="-2">
      ${name.split(' ')[0]}
    </text>
    <text x="70" y="185" font-size="56" fill="url(#textGradient)" font-weight="700" class="syncopate" letter-spacing="-2">
      ${name.split(' ').slice(1).join(' ')}
    </text>
    
    <!-- Title with Glow -->
    <text x="70" y="235" font-size="20" fill="${currentTheme.accent}" font-weight="600" letter-spacing="0.5" filter="url(#outerGlow)">
      ${title}
    </text>
    
    <!-- Subtitle -->
    <text x="70" y="270" font-size="15" fill="rgba(255,255,255,0.7)" font-weight="300">
      ${subtitle}
    </text>
    
    <!-- Location Badge with Glass Effect -->
    <g transform="translate(70, 295)">
      <rect width="140" height="32" rx="16" fill="rgba(255,255,255,0.05)" 
            stroke="rgba(255,255,255,0.1)" stroke-width="1" filter="url(#glass)"/>
      <text x="20" y="21" font-size="12" fill="rgba(255,255,255,0.8)" font-weight="400" letter-spacing="1">
        📍 ${location}
      </text>
    </g>
    
    <!-- Animated Accent Line -->
    <line x1="70" y1="215" x2="70" y2="215" stroke="url(#accentGradient)" stroke-width="2" opacity="0.8">
      <animate attributeName="x2" from="70" to="220" dur="1.5s" fill="freeze"/>
    </line>
  </g>
  
  <!-- Decorative Corner Elements -->
  <circle cx="750" cy="50" r="3" fill="${currentTheme.accent}" opacity="0.4">
    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite"/>
  </circle>
  <circle cx="730" cy="65" r="2" fill="${currentTheme.accent}" opacity="0.3">
    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="60" cy="350" r="2.5" fill="${currentTheme.blob2}" opacity="0.4">
    <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3.5s" repeatCount="indefinite"/>
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