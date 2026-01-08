import { NextRequest } from 'next/server';
import satori from 'satori';
import React from 'react';

async function getFonts() {
  const [regular, bold] = await Promise.all([
    fetch('https://cdn.jsdelivr.net/npm/@fontsource/outfit@5.0.13/files/outfit-latin-400-normal.woff').then((res) => res.arrayBuffer()),
    fetch('https://cdn.jsdelivr.net/npm/@fontsource/outfit@5.0.13/files/outfit-latin-700-normal.woff').then((res) => res.arrayBuffer()),
  ]);

  return { regular, bold };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Params
    const component = searchParams.get('component') || 'card';
    const width = parseInt(searchParams.get('width') || '600');
    const height = parseInt(searchParams.get('height') || '300');
    const theme = searchParams.get('theme') || 'purple-cyan';

    const title = searchParams.get('title') || 'Title';
    const content = searchParams.get('content') || 'Content';
    const icon = searchParams.get('icon') || '✨';
    const value = searchParams.get('value') || '100';
    const label = searchParams.get('label') || 'Label';

    // Enhanced Themes V2
    const themes: Record<string, any> = {
      'purple-cyan': {
        bg: 'linear-gradient(135deg, #0f0a1e 0%, #000000 100%)',
        glass: 'rgba(255, 255, 255, 0.03)',
        border: 'rgba(255, 255, 255, 0.1)',
        text: '#ffffff',
        secondary: '#94a3b8',
        accent: '#00f2ff',
        blob1: '#4316db',
        blob2: '#00d4ff',
      },
      'orange-warm': {
        bg: 'linear-gradient(135deg, #1f0f0a 0%, #000000 100%)',
        glass: 'rgba(255, 255, 255, 0.03)',
        border: 'rgba(255, 170, 64, 0.15)',
        text: '#ffffff',
        secondary: '#d6c0a0',
        accent: '#ffaa40',
        blob1: '#ff6b35',
        blob2: '#ffaa40',
      },
      'green-fresh': {
        bg: 'linear-gradient(135deg, #05140f 0%, #000000 100%)',
        glass: 'rgba(255, 255, 255, 0.03)',
        border: 'rgba(0, 255, 157, 0.1)',
        text: '#ffffff',
        secondary: '#94b8a8',
        accent: '#00ff9d',
        blob1: '#06ffa5',
        blob2: '#00ff9d',
      },
    };

    const t = themes[theme] || themes['purple-cyan'];

    // Common Glass Style
    const glassStyle = {
      background: t.glass,
      border: `1px solid ${t.border}`,
      borderRadius: '24px',
      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
      backdropFilter: 'blur(10px)', // Note: Satori support for blur is limited but good to have
    };

    const components: Record<string, any> = {

      // 1. STAT CARD
      stat: (
        <div style={{ width: '100%', height: '100%', display: 'flex', background: t.bg, alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Background Blobs */}
          <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '500px', height: '500px', background: t.blob1, filter: 'blur(80px)', opacity: 0.2, borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-50%', right: '-20%', width: '500px', height: '500px', background: t.blob2, filter: 'blur(80px)', opacity: 0.2, borderRadius: '50%' }} />

          <div style={{ ...glassStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px', minWidth: '300px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.2))' }}>{icon}</div>
            <div style={{ fontSize: '72px', fontWeight: 800, color: t.text, lineHeight: 1, marginBottom: '8px', letterSpacing: '-2px' }}>{value}</div>
            <div style={{ fontSize: '18px', color: t.accent, fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase' }}>{label}</div>
            {content && <div style={{ fontSize: '14px', color: t.secondary, marginTop: '16px', maxWidth: '250px', textAlign: 'center' }}>{content}</div>}
          </div>
        </div>
      ),

      // 2. QUOTE CARD
      quote: (
        <div style={{ width: '100%', height: '100%', display: 'flex', background: t.bg, alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 0%, ${t.blob1}20, transparent 70%)` }} />

          <div style={{ ...glassStyle, display: 'flex', flexDirection: 'column', padding: '60px', maxWidth: '85%' }}>
            <div style={{ fontSize: '80px', color: t.accent, opacity: 0.2, fontFamily: 'serif', lineHeight: 0.5, marginBottom: '24px' }}>“</div>
            <div style={{ fontSize: '28px', fontWeight: 400, color: t.text, lineHeight: 1.4, marginBottom: '32px' }}>{content}</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '2px', background: t.accent }} />
              <div style={{ fontSize: '16px', color: t.secondary, fontWeight: 700, letterSpacing: '1px' }}>{title}</div>
            </div>
          </div>
        </div>
      ),

      // 3. FEATURE CARD
      card: (
        <div style={{ width: '100%', height: '100%', display: 'flex', background: t.bg, alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '10%', right: '10%', width: '300px', height: '300px', background: t.blob2, filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%' }} />

          <div style={{ ...glassStyle, display: 'flex', flexDirection: 'column', padding: '48px', width: '80%', position: 'relative' }}>
            <div style={{
              position: 'absolute', top: '24px', left: '24px',
              width: '48px', height: '48px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px',
              border: `1px solid ${t.border}`
            }}>
              {icon}
            </div>

            <div style={{ marginTop: '60px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: t.text }}>{title}</div>
              <div style={{ fontSize: '18px', color: t.secondary, lineHeight: 1.5 }}>{content}</div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '32px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: t.accent, fontWeight: 600 }}>
              Learn more <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </div>
          </div>
        </div>
      ),

      // 4. BADGE
      badge: (
        <div style={{ width: '100%', height: '100%', display: 'flex', background: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '20px',
            padding: '16px 32px',
            background: '#111',
            border: `1px solid ${t.border}`,
            borderRadius: '100px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: '28px' }}>{icon}</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: t.text }}>{title}</div>
              {content && <div style={{ fontSize: '13px', color: t.secondary }}>{content}</div>}
            </div>
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />
            <div style={{ fontSize: '16px', fontWeight: 700, color: t.accent }}>{value}</div>
          </div>
        </div>
      ),
    };

    const selectedComponent = components[component] || components.card;
    const fonts = await getFonts();

    const svg = await satori(selectedComponent, {
      width,
      height,
      fonts: [
        { name: 'Outfit', data: fonts.regular, weight: 400, style: 'normal' },
        { name: 'Outfit', data: fonts.bold, weight: 700, style: 'normal' },
      ],
    });

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Error:', error);
    const errorSvg = `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="300" fill="#111"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#f87171" font-family="sans-serif">Error Generating Template</text></svg>`;
    return new Response(errorSvg, { headers: { 'Content-Type': 'image/svg+xml' } });
  }
}