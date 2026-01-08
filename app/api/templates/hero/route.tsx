import { NextRequest } from 'next/server';
import satori from 'satori';
import React from 'react';

// FONT LOADERS
async function getFonts() {
  const [outfitRegular, outfitBold, interBold, spaceMono] = await Promise.all([
    fetch('https://cdn.jsdelivr.net/npm/@fontsource/outfit@5.0.13/files/outfit-latin-400-normal.woff').then(res => res.arrayBuffer()),
    fetch('https://cdn.jsdelivr.net/npm/@fontsource/outfit@5.0.13/files/outfit-latin-700-normal.woff').then(res => res.arrayBuffer()),
    fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-900-normal.woff').then(res => res.arrayBuffer()),
    fetch('https://cdn.jsdelivr.net/npm/@fontsource/space-mono@5.0.18/files/space-mono-latin-700-normal.woff').then(res => res.arrayBuffer()),
  ]);
  return { outfitRegular, outfitBold, interBold, spaceMono };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // PARAMS
    const name = searchParams.get('name') || 'Miguel Pacheco';
    const title = searchParams.get('title') || 'Full Stack Developer';
    const subtitle = searchParams.get('subtitle') || 'Building digital experiences.';
    const location = searchParams.get('location') || 'Mexico';
    const style = searchParams.get('style') || 'modern'; // modern | minimal | cyber
    const theme = searchParams.get('theme') || 'purple-cyan';

    const fonts = await getFonts();

    // THEME CONFIG
    const colors: Record<string, any> = {
      'purple-cyan': {
        bg: '#0f0a1e',
        bgGradient: 'linear-gradient(135deg, #0f0a1e 0%, #000 100%)',
        accent: '#00f2ff',
        gradient: 'linear-gradient(to right, #00f2ff, #bd00ff)',
        blob1: '#4316db',
        blob2: '#00d4ff'
      },
      'orange-pink': {
        bg: '#1f0f0a',
        bgGradient: 'linear-gradient(135deg, #1f0f0a 0%, #000 100%)',
        accent: '#ffaa40',
        gradient: 'linear-gradient(to right, #ffaa40, #f72585)',
        blob1: '#ff6b35',
        blob2: '#ffaa40'
      },
      'green-blue': {
        bg: '#05140f',
        bgGradient: 'linear-gradient(135deg, #05140f 0%, #000 100%)',
        accent: '#00ff9d',
        gradient: 'linear-gradient(to right, #00ff9d, #00b4d8)',
        blob1: '#06ffa5',
        blob2: '#00ff9d'
      },
    };
    const c = colors[theme] || colors['purple-cyan'];

    // RENDER LOGIC
    let jsx;

    // --- STYLE 1: MODERN (Glassmorphism + Gradient) ---
    if (style === 'modern') {
      jsx = (
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          backgroundColor: '#000',
          backgroundImage: c.bgGradient,
          position: 'relative',
          fontFamily: 'Outfit'
        }}>
          {/* Blobs Layer */}
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', backgroundColor: c.blob1, filter: 'blur(80px)', opacity: 0.3, borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', backgroundColor: c.blob2, filter: 'blur(80px)', opacity: 0.3, borderRadius: '50%' }} />

          {/* Content Card */}
          <div style={{
            position: 'relative',
            display: 'flex', flexDirection: 'column',
            padding: '60px',
            width: '700px', height: '320px',
            borderRadius: '32px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            justifyContent: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '24px', height: '2px', backgroundColor: c.accent }} />
              <span style={{ color: c.accent, fontSize: '14px', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700 }}>PROFILE</span>
            </div>

            <h1 style={{ fontSize: '64px', fontWeight: 800, margin: 0, lineHeight: 1, backgroundImage: c.gradient, backgroundClip: 'text', color: 'transparent' }}>{name}</h1>
            <div style={{ fontSize: '24px', color: '#e5e7eb', marginTop: '12px' }}>{title}</div>
            <div style={{ fontSize: '16px', color: '#9ca3af', marginTop: '8px' }}>{subtitle}</div>

            <div style={{
              position: 'absolute', bottom: '40px', right: '40px',
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 16px', borderRadius: '100px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              fontSize: '12px', color: '#d1d5db'
            }}>
              <span>📍 {location}</span>
            </div>
          </div>
        </div>
      );
    }
    // --- STYLE 2: MINIMAL (High Contrast, Bold, Themed) ---
    else if (style === 'minimal') {
      jsx = (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: c.bg, fontFamily: 'Inter', padding: '60px', color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {/* NOW COLORFUL: Name uses Theme Accent */}
            <h1 style={{ fontSize: '72px', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-2px', textTransform: 'uppercase', maxWidth: '600px', color: c.accent }}>{name}</h1>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: `2px solid ${c.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: c.accent }}>👋</div>
          </div>

          <div style={{ width: '100%', height: '4px', backgroundColor: c.accent, margin: '40px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>{title}</span>
              <span style={{ fontSize: '16px', color: '#888' }}>{subtitle}</span>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, opacity: 0.5, color: c.accent }}>{location.toUpperCase()}</div>
          </div>
        </div>
      );
    }
    // --- STYLE 3: CYBER (Grid, Monospace, Glitch, Themed BG) ---
    else {
      const gridColor = `${c.accent}40`; // Increased opacity for visibility
      jsx = (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: c.bg, fontFamily: 'Space Mono', color: c.accent, overflow: 'hidden', position: 'relative' }}>
          {/* Grid Background */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', border: `2px solid ${c.accent}`, padding: '40px', backgroundColor: 'rgba(0,0,0,0.85)', boxShadow: `10px 10px 0px ${c.accent}40`, position: 'relative', zIndex: 10 }}>
            <div style={{ position: 'absolute', top: '-12px', left: '20px', backgroundColor: c.bg, padding: '0 10px', fontSize: '12px', fontWeight: 700, border: `1px solid ${c.accent}`, color: c.accent }}>SYSTEM.USER_PROFILE</div>

            <h1 style={{ fontSize: '48px', fontWeight: 700, margin: '0 0 20px 0', textShadow: `2px 2px 0px ${c.accent}80` }}>{'>'} {name}</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '16px' }}>
              <div style={{ display: 'flex' }}>
                <span style={{ opacity: 0.5, marginRight: '16px' }}>ROLE::</span>
                <span>{title}</span>
              </div>
              <div style={{ display: 'flex' }}>
                <span style={{ opacity: 0.5, marginRight: '16px' }}>LOC::</span>
                <span>{location}</span>
              </div>
              <div style={{ display: 'flex' }}>
                <span style={{ opacity: 0.5, marginRight: '16px' }}>STATUS::</span>
                <span style={{ color: c.blob1 }}>ONLINE</span>
              </div>
            </div>

            <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '20px', height: '20px', backgroundColor: c.accent }} />
          </div>
        </div>
      );
    }

    const svg = await satori(jsx, {
      width: 800,
      height: 400,
      fonts: [
        { name: 'Outfit', data: fonts.outfitRegular, weight: 400, style: 'normal' },
        { name: 'Outfit', data: fonts.outfitBold, weight: 700, style: 'normal' },
        { name: 'Inter', data: fonts.interBold, weight: 900, style: 'normal' },
        { name: 'Space Mono', data: fonts.spaceMono, weight: 700, style: 'normal' },
      ],
    });

    return new Response(svg, {
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(`<svg><text>Error</text></svg>`, { headers: { 'Content-Type': 'image/svg+xml' } });
  }
}