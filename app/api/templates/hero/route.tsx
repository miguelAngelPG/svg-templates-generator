import { NextRequest } from 'next/server';
import satori from 'satori';
import React from 'react';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parámetros personalizables
    const name = searchParams.get('name') || 'Miguel A. Pacheco';
    const title = searchParams.get('title') || 'Tech Lead and Architect';
    const subtitle = searchParams.get('subtitle') || 'Human first, Engineer second';
    const location = searchParams.get('location') || 'Hidalgo, MX';
    const lang = searchParams.get('lang') || 'es';
    const theme = searchParams.get('theme') || 'purple-cyan';

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

    const fontData = await fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-700-normal.woff').then(res => res.arrayBuffer());
    const fontDataRegular = await fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-400-normal.woff').then(res => res.arrayBuffer());

    const jsx = (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#050505',
          color: '#fff',
          fontFamily: 'Inter',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Blobs (Restored) */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: currentTheme.blob1, borderRadius: '50%', filter: 'blur(80px)', opacity: 0.4 }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px', background: currentTheme.blob2, borderRadius: '50%', filter: 'blur(80px)', opacity: 0.4 }} />

        {/* Content Card (Restored Glass Effect) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          margin: '40px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.05)', // Glass background
          width: '720px',
          height: '320px',
          position: 'relative',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Restored shadow
        }}>
          {/* Label */}
          <div style={{ display: 'flex', fontSize: '12px', letterSpacing: '3px', color: '#888', marginBottom: '20px', textTransform: 'uppercase' }}>
            {lang === 'es' ? 'PERFIL PERSONAL' : 'PERSONAL PROFILE'}
          </div>

          {/* Name */}
          <div style={{
            fontSize: '56px',
            fontWeight: 700,
            lineHeight: '1.1',
            marginBottom: '20px',
            // color: '#fff', 
            backgroundImage: `linear-gradient(90deg, #fff, #999)`, // Restored gradient
            backgroundClip: 'text', // Restored text clip
            color: 'transparent',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <span>{name.split(' ')[0]}</span>
            <span>{name.split(' ').slice(1).join(' ')}</span>
          </div>

          {/* Title */}
          <div style={{ display: 'flex', fontSize: '20px', color: currentTheme.accent, fontWeight: 600, marginBottom: '10px' }}>
            {title}
          </div>

          {/* Subtitle */}
          <div style={{ display: 'flex', fontSize: '16px', color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>
            {subtitle}
          </div>

          {/* Accent Line */}
          <div style={{ position: 'absolute', left: '40px', bottom: '100px', width: '150px', height: '2px', background: `linear-gradient(90deg, ${currentTheme.accent}, transparent)` }} />

          {/* Location Badge */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.8)'
          }}>
            📍 {location}
          </div>
        </div>
      </div>
    );

    const svg = await satori(jsx, {
      width: 800,
      height: 400,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: fontDataRegular,
          weight: 400,
          style: 'normal',
        },
      ],
    });

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating Hero SVG:', error);

    // Return Error SVG
    const errorSvg = `
      <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="400" fill="#111"/>
        <text x="400" y="200" text-anchor="middle" fill="#ff4444" font-family="monospace" font-size="16">
          Error: ${error instanceof Error ? error.message : 'Unknown Error'}
        </text>
      </svg>
    `;

    return new Response(errorSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-store',
      },
    });
  }
}