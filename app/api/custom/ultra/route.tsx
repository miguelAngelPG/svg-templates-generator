import { NextRequest } from 'next/server';
import satori from 'satori';
import React from 'react';

async function getFonts() {
  const [regular, bold] = await Promise.all([
    fetch('https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@5.0.18/files/noto-sans-latin-400-normal.woff').then((res) => res.arrayBuffer()),
    fetch('https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@5.0.18/files/noto-sans-latin-700-normal.woff').then((res) => res.arrayBuffer()),
  ]);

  return { regular, bold };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const component = searchParams.get('component') || 'card';
    const width = parseInt(searchParams.get('width') || '600');
    const height = parseInt(searchParams.get('height') || '300');
    const theme = searchParams.get('theme') || 'purple-cyan';

    const title = searchParams.get('title') || 'Title';
    const content = searchParams.get('content') || 'Content';
    const icon = searchParams.get('icon') || '✨';
    const value = searchParams.get('value') || '100';
    const label = searchParams.get('label') || 'Label';

    const themes: Record<string, any> = {
      'purple-cyan': {
        bg: '#050505',
        glass: 'rgba(255, 255, 255, 0.03)',
        border: 'rgba(255, 255, 255, 0.1)',
        text: '#ffffff',
        secondary: '#999999',
        accent: '#00f2ff',
        gradient1: '#4316db',
        gradient2: '#00d4ff',
      },
      'orange-warm': {
        bg: '#0a0505',
        glass: 'rgba(255, 170, 64, 0.05)',
        border: 'rgba(255, 170, 64, 0.15)',
        text: '#ffffff',
        secondary: '#b89968',
        accent: '#ffaa40',
        gradient1: '#ff6b35',
        gradient2: '#ffaa40',
      },
      'green-fresh': {
        bg: '#030a08',
        glass: 'rgba(0, 255, 157, 0.03)',
        border: 'rgba(0, 255, 157, 0.1)',
        text: '#ffffff',
        secondary: '#66b894',
        accent: '#00ff9d',
        gradient1: '#06ffa5',
        gradient2: '#00ff9d',
      },
    };

    const t = themes[theme] || themes['purple-cyan'];

    const components: Record<string, any> = {
      card: (
        <div style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: t.bg, position: 'relative' }}>
          <div style={{ position: 'absolute', width: '300px', height: '300px', background: `radial-gradient(circle, ${t.gradient1}40 0%, transparent 70%)`, top: '-50px', left: '-50px', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', width: '250px', height: '250px', background: `radial-gradient(circle, ${t.gradient2}30 0%, transparent 70%)`, bottom: '-30px', right: '-30px', filter: 'blur(60px)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', margin: '30px', padding: '40px', background: t.glass, border: `1px solid ${t.border}`, borderRadius: '20px', position: 'relative' }}>
            <div style={{ display: 'flex', fontSize: '48px', marginBottom: '20px' }}>{icon}</div>
            <div style={{ display: 'flex', fontSize: '32px', fontWeight: 'bold', color: t.text, marginBottom: '15px' }}>{title}</div>
            <div style={{ display: 'flex', fontSize: '18px', color: t.secondary, lineHeight: 1.6 }}>{content}</div>
            <div style={{ display: 'flex', width: '80px', height: '3px', background: t.accent, marginTop: '25px', borderRadius: '2px' }} />
          </div>
        </div>
      ),

      quote: (
        <div style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', background: `radial-gradient(ellipse at center, ${t.accent}10 0%, transparent 60%)` }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '50px', maxWidth: '90%', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '0', top: '40px', bottom: '40px', width: '4px', background: t.accent, borderRadius: '2px' }} />
            <div style={{ display: 'flex', fontSize: '64px', color: t.accent, opacity: 0.3, marginBottom: '20px', marginLeft: '20px' }}>"</div>
            <div style={{ display: 'flex', fontSize: '28px', fontStyle: 'italic', color: t.text, lineHeight: 1.5, marginLeft: '20px' }}>{content}</div>
            <div style={{ display: 'flex', fontSize: '16px', color: t.secondary, marginTop: '20px', marginLeft: '20px' }}>— {title}</div>
          </div>
        </div>
      ),

      stat: (
        <div style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', background: `linear-gradient(135deg, ${t.gradient1}15 0%, ${t.gradient2}08 100%)` }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
            <div style={{ display: 'flex', fontSize: '56px', marginBottom: '25px' }}>{icon}</div>
            <div style={{ display: 'flex', fontSize: '96px', fontWeight: 'bold', color: t.text, marginBottom: '10px' }}>{value}</div>
            <div style={{ display: 'flex', fontSize: '24px', color: t.accent, fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase' }}>{label}</div>
            {content && <div style={{ display: 'flex', fontSize: '16px', color: t.secondary, marginTop: '15px' }}>{content}</div>}
          </div>
        </div>
      ),

      badge: (
        <div style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '25px 40px', background: t.glass, border: `2px solid ${t.border}`, borderRadius: '50px' }}>
            <div style={{ display: 'flex', fontSize: '40px' }}>{icon}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: t.text }}>{title}</div>
              <div style={{ display: 'flex', fontSize: '16px', color: t.accent }}>{content}</div>
            </div>
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
        { name: 'Noto Sans', data: fonts.regular, weight: 400, style: 'normal' },
        { name: 'Noto Sans', data: fonts.bold, weight: 700, style: 'normal' },
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

    const errorSvg = `
<svg width="600" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="300" fill="#1a1a1a"/>
  <text x="300" y="150" text-anchor="middle" fill="#ff4444" font-size="20">
    Error: ${error instanceof Error ? error.message.substring(0, 40) : 'Unknown'}
  </text>
</svg>
    `;

    return new Response(errorSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  }
}