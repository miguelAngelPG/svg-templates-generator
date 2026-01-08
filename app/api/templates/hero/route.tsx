import { NextRequest } from 'next/server';
import satori from 'satori';
import React from 'react';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parameters
    const name = searchParams.get('name') || 'Miguel A. Pacheco';
    const title = searchParams.get('title') || 'Tech Lead & Architect';
    const subtitle = searchParams.get('subtitle') || 'Building digital experiences that matter.';
    const location = searchParams.get('location') || 'Hidalgo, MX';
    const lang = searchParams.get('lang') || 'es';
    const theme = searchParams.get('theme') || 'purple-cyan';

    // Theme Configuration
    const gradients: Record<string, { bg: string; accent: string; textGradient: string }> = {
      'purple-cyan': {
        bg: 'linear-gradient(135deg, #1a0b2e 0%, #050511 100%)',
        accent: '#00f2ff',
        textGradient: 'linear-gradient(90deg, #fff, #b084ff)'
      },
      'orange-pink': {
        bg: 'linear-gradient(135deg, #2e120b 0%, #110505 100%)',
        accent: '#ffaa40',
        textGradient: 'linear-gradient(90deg, #fff, #ff8484)'
      },
      'green-blue': {
        bg: 'linear-gradient(135deg, #051814 0%, #020c0f 100%)',
        accent: '#00ff9d',
        textGradient: 'linear-gradient(90deg, #fff, #84ffcd)'
      }
    };

    const t = gradients[theme] || gradients['purple-cyan'];

    // Fonts
    const fontData = await fetch('https://cdn.jsdelivr.net/npm/@fontsource/outfit@5.0.13/files/outfit-latin-700-normal.woff').then(res => res.arrayBuffer());
    const fontRegular = await fetch('https://cdn.jsdelivr.net/npm/@fontsource/outfit@5.0.13/files/outfit-latin-400-normal.woff').then(res => res.arrayBuffer());

    const jsx = (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: t.bg,
          fontFamily: 'Outfit',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Abstract Background Shapes */}
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: t.accent, opacity: 0.15, filter: 'blur(120px)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px', background: 'white', opacity: 0.05, filter: 'blur(100px)', borderRadius: '50%' }} />

        {/* Glass Card */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: '720px',
          height: '320px',
          padding: '60px',
          borderRadius: '32px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}>

          {/* Top Label */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
            opacity: 0.8
          }}>
            <div style={{ width: '24px', height: '2px', background: t.accent }} />
            <span style={{ color: t.accent, fontSize: '14px', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
              {lang === 'es' ? 'Perfil Profesional' : 'Professional Profile'}
            </span>
          </div>

          {/* Name */}
          <h1 style={{
            margin: 0,
            fontSize: '64px',
            fontWeight: 800,
            lineHeight: 1.1,
            backgroundImage: t.textGradient,
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: '12px'
          }}>
            {name}
          </h1>

          {/* Title */}
          <div style={{ fontSize: '24px', color: '#e5e7eb', fontWeight: 400, marginBottom: '8px' }}>
            {title}
          </div>

          {/* Subtitle */}
          <div style={{ fontSize: '16px', color: '#9ca3af', fontWeight: 400, maxWidth: '500px' }}>
            {subtitle}
          </div>

          {/* Location Badge (Bottom Right) */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '100px',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '12px',
            color: '#d1d5db'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color={t.accent}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {location}
          </div>

        </div>
      </div>
    );

    const svg = await satori(jsx, {
      width: 800,
      height: 400,
      fonts: [
        { name: 'Outfit', data: fontData, weight: 700, style: 'normal' },
        { name: 'Outfit', data: fontRegular, weight: 400, style: 'normal' },
      ],
    });

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });

  } catch (error) {
    console.error('Error generating Hero SVG:', error);
    return new Response(`<svg><text>Error</text></svg>`, { headers: { 'Content-Type': 'image/svg+xml' } });
  }
}