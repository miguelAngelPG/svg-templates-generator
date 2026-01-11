import { NextRequest } from 'next/server';
import satori from 'satori';
import React from 'react';
import { getTheme } from '@/utils/themes';
import { getFonts } from '@/services/fonts';

export async function GET(request: NextRequest) {
    try {
        console.log('API Hit: /api/custom/advanced');
        const searchParams = request.nextUrl.searchParams;

        // Parámetros
        const title = searchParams.get('title') || '';
        const content = searchParams.get('content') || searchParams.get('description') || 'No content provided';
        const subtitle = searchParams.get('subtitle') || '';
        const layout = searchParams.get('layout') || 'center'; // center | left | card
        const width = parseInt(searchParams.get('width') || '800');
        const height = parseInt(searchParams.get('height') || '400');

        // Theme Params
        const themeName = searchParams.get('theme') || 'purple-cyan';
        const customColor = searchParams.get('customColor') || undefined;
        const customColor2 = searchParams.get('customColor2') || searchParams.get('secColor') || undefined;

        // Shared Theme Logic
        const t = getTheme(themeName, customColor, customColor2);

        // Map to Advanced Local Theme Structure
        const currentTheme = {
            bg: t.bg,
            bgGradient: t.bgGradient,
            text: '#ffffff',
            accent: t.accent,
            secondary: 'rgba(255, 255, 255, 0.6)',
            border: customColor ? `${t.accent}40` : 'rgba(255, 255, 255, 0.1)',
        };

        // Layout Logic
        const layouts: Record<string, any> = {
            center: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '40px',
            },
            left: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                textAlign: 'left',
                paddingLeft: '60px',
                paddingRight: '60px',
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
                        background: `radial-gradient(circle at 30% 20%, ${t.blob1}40 0%, transparent 50%)`,
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
                        background: `radial-gradient(circle at 80% 80%, ${t.blob2}40 0%, transparent 50%)`,
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
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    } as React.CSSProperties}
                >
                    {/* Título */}
                    {title && (
                        <div
                            style={{
                                fontSize: '64px',
                                fontWeight: 'bold',
                                marginBottom: '20px',
                                backgroundImage: t.gradient, // Use backgroundImage
                                backgroundClip: 'text',
                                color: 'transparent',
                                textAlign: 'center',
                                paddingRight: '10px'
                            }}
                        >
                            {title}
                        </div>
                    )}

                    {/* Content (Main Text) */}
                    {content && (
                        <div
                            style={{
                                fontSize: '28px',
                                fontWeight: '500',
                                color: currentTheme.text,
                                textAlign: layout === 'center' ? 'center' : 'left',
                                maxWidth: '80%',
                                lineHeight: '1.4',
                                opacity: 0.9,
                                marginBottom: subtitle ? '16px' : '0'
                            }}
                        >
                            {content}
                        </div>
                    )}

                    {/* Subtitle */}
                    {subtitle && (
                        <div
                            style={{
                                fontSize: '20px',
                                fontWeight: '400',
                                color: currentTheme.secondary,
                                textAlign: layout === 'center' ? 'center' : 'left',
                                maxWidth: '80%',
                                opacity: 0.8,
                            }}
                        >
                            {subtitle}
                        </div>
                    )}

                    {/* Accent Line (Card Layout) */}
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
            </div>
        );

        const fonts = await getFonts();
        console.log('Fetching fonts... (cached)');

        // Convertir a SVG
        const svg = await satori(jsx, {
            width,
            height,
            fonts: [
                {
                    name: 'Inter',
                    data: fonts.interRegular,
                    weight: 400,
                    style: 'normal',
                },
                {
                    name: 'Inter',
                    data: fonts.interSemiBold,
                    weight: 600,
                    style: 'normal',
                },
                {
                    name: 'Inter',
                    data: fonts.interSemiBold, // Reuse 600 for 700 request
                    weight: 700,
                    style: 'normal',
                },
            ],
        });
        console.log('SVG Generated successfully');

        return new Response(svg, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'public, max-age=0, must-revalidate',
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