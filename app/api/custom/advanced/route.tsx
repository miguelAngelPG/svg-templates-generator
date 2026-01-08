import { NextRequest } from 'next/server';
import satori from 'satori';
import React from 'react';
import { getTheme } from '@/utils/themes';

export async function GET(request: NextRequest) {
    try {
        console.log('API Hit: /api/custom/advanced');
        const searchParams = request.nextUrl.searchParams;

        // Parámetros
        const content = searchParams.get('content') || 'Hello World';
        const title = searchParams.get('title') || '';
        const subtitle = searchParams.get('subtitle') || '';
        const width = parseInt(searchParams.get('width') || '800');
        const height = parseInt(searchParams.get('height') || '400');
        const layout = searchParams.get('layout') || 'center'; // center, left, card

        // Theme Params
        const themeName = searchParams.get('theme') || 'purple-cyan';
        const customColor = searchParams.get('customColor') || undefined;

        // Shared Theme Logic
        const t = getTheme(themeName, customColor);

        // Map to Advanced Local Theme Structure
        const currentTheme = {
            bg: t.bg,
            // Use gradient if defined, otherwise generic hex
            bgGradient: t.bgGradient,
            text: '#ffffff',
            accent: t.accent,
            secondary: 'rgba(255, 255, 255, 0.6)',
            border: customColor ? `${t.accent}40` : 'rgba(255, 255, 255, 0.1)',
        };


        // Layouts diferentes
        const layouts: Record<string, any> = {
            center: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
            },
            left: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                textAlign: 'left',
                paddingLeft: '60px',
            },
            card: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                padding: '40px',
            },
        };

        const currentLayout = layouts[layout] || layouts.center;

        // JSX para Satori
        const jsx = (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    backgroundColor: currentTheme.bg,
                    backgroundImage: currentTheme.bgGradient, // Support Gradient
                    color: currentTheme.text,
                    fontFamily: 'Inter, sans-serif',
                    position: 'relative',
                }}
            >
                {/* Gradiente de fondo opcional (Blobs from theme) */}
                <div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        background: `radial-gradient(circle at 30% 20%, ${t.blob1}20 0%, transparent 50%)`,
                        zIndex: 0
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: '80%',
                        height: '80%',
                        background: `radial-gradient(circle at 80% 80%, ${t.blob2}15 0%, transparent 50%)`,
                        zIndex: 0
                    }}
                />

                {/* Contenido principal */}
                <div
                    style={{
                        ...currentLayout,
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    {/* Título */}
                    {title && (
                        <div
                            style={{
                                fontSize: '48px',
                                fontWeight: 'bold',
                                marginBottom: '20px',
                                background: t.gradient, // Use theme gradient for title
                                backgroundClip: 'text',
                                color: 'transparent',
                            }}
                        >
                            {title}
                        </div>
                    )}

                    {/* Contenido principal */}
                    <div
                        style={{
                            fontSize: '32px',
                            fontWeight: '600',
                            marginBottom: subtitle ? '15px' : '0',
                            color: currentTheme.text,
                        }}
                    >
                        {content}
                    </div>

                    {/* Subtítulo */}
                    {subtitle && (
                        <div
                            style={{
                                fontSize: '20px',
                                color: currentTheme.secondary,
                                fontWeight: '400',
                            }}
                        >
                            {subtitle}
                        </div>
                    )}

                    {/* Accent line decorativa */}
                    {layout === 'card' && (
                        <div
                            style={{
                                width: '100px',
                                height: '4px',
                                background: currentTheme.accent,
                                marginTop: '30px',
                                borderRadius: '2px',
                            }}
                        />
                    )}
                </div>

                {/* Border decorativo para layout card */}
                {layout === 'card' && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            right: '20px',
                            bottom: '20px',
                            border: `1px solid ${currentTheme.border}`,
                            borderRadius: '20px',
                            pointerEvents: 'none',
                        }}
                    />
                )}
            </div>
        );

        console.log('Fetching fonts...');
        // Convertir a SVG
        const svg = await satori(jsx, {
            width,
            height,
            fonts: [
                {
                    name: 'Inter',
                    data: await fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-400-normal.woff').then(res => res.arrayBuffer()),
                    weight: 400,
                    style: 'normal',
                },
                {
                    name: 'Inter',
                    data: await fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-600-normal.woff').then(res => res.arrayBuffer()),
                    weight: 600,
                    style: 'normal',
                },
                {
                    name: 'Inter',
                    data: await fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-700-normal.woff').then(res => res.arrayBuffer()),
                    weight: 700,
                    style: 'normal',
                },
            ],
        });
        console.log('SVG Generated successfully');

        return new Response(svg, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'public, max-age=3600',
            },
        });

    } catch (error) {
        console.error('Error generating custom SVG:', error);
        const errorSvg = `<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="400" fill="#111"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#f87171" font-family="sans-serif">Error: ${(error as any).message}</text></svg>`;

        return new Response(errorSvg, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'no-cache',
            },
        });
    }
}