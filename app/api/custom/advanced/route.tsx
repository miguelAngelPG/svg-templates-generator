import { NextRequest } from 'next/server';
import satori from 'satori';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Parámetros
        const content = searchParams.get('content') || 'Hello World';
        const title = searchParams.get('title') || '';
        const subtitle = searchParams.get('subtitle') || '';
        const width = parseInt(searchParams.get('width') || '800');
        const height = parseInt(searchParams.get('height') || '400');
        const theme = searchParams.get('theme') || 'dark';
        const layout = searchParams.get('layout') || 'center'; // center, left, card

        // Colores personalizables
        const bgColor = searchParams.get('bg') || '';
        const textColor = searchParams.get('color') || '';
        const accentColor = searchParams.get('accent') || '';

        // Temas predefinidos
        const themes = {
            dark: {
                bg: '#050505',
                text: '#ffffff',
                accent: '#00f2ff',
                secondary: '#666666',
                border: 'rgba(255, 255, 255, 0.1)',
            },
            light: {
                bg: '#ffffff',
                text: '#000000',
                accent: '#0066ff',
                secondary: '#999999',
                border: 'rgba(0, 0, 0, 0.1)',
            },
            purple: {
                bg: '#0f0a1f',
                text: '#ffffff',
                accent: '#bd00ff',
                secondary: '#8855ff',
                border: 'rgba(189, 0, 255, 0.2)',
            },
            cyan: {
                bg: '#041421',
                text: '#ffffff',
                accent: '#00f2ff',
                secondary: '#4d47c3',
                border: 'rgba(0, 242, 255, 0.2)',
            },
            orange: {
                bg: '#1a0f05',
                text: '#ffffff',
                accent: '#ffaa40',
                secondary: '#ff6b35',
                border: 'rgba(255, 170, 64, 0.2)',
            },
        };

        const currentTheme = themes[theme as keyof typeof themes] || themes.dark;

        // Override con colores custom si se proporcionan
        if (bgColor) currentTheme.bg = bgColor;
        if (textColor) currentTheme.text = textColor;
        if (accentColor) currentTheme.accent = accentColor;

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
                    color: currentTheme.text,
                    fontFamily: 'Inter, sans-serif',
                    position: 'relative',
                }
                }
            >
                {/* Gradiente de fondo opcional */}
                < div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        background: `radial-gradient(circle at 30% 20%, ${currentTheme.accent}15 0%, transparent 50%)`,
                    }
                    }
                />

                {/* Contenido principal */}
                <div
                    style={
                        {
                            ...currentLayout,
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                            zIndex: 1,
                        }
                    }
                >
                    {/* Título */}
                    {
                        title && (
                            <div
                                style={
                                    {
                                        fontSize: '48px',
                                        fontWeight: 'bold',
                                        marginBottom: '20px',
                                        background: `linear-gradient(135deg, ${currentTheme.text} 0%, ${currentTheme.secondary} 100%)`,
                                        backgroundClip: 'text',
                                        color: 'transparent',
                                    }
                                }
                            >
                                {title}
                            </div>
                        )
                    }

                    {/* Contenido principal */}
                    <div
                        style={
                            {
                                fontSize: '32px',
                                fontWeight: '600',
                                marginBottom: subtitle ? '15px' : '0',
                                color: currentTheme.text,
                            }
                        }
                    >
                        {content}
                    </div>

                    {/* Subtítulo */}
                    {
                        subtitle && (
                            <div
                                style={
                                    {
                                        fontSize: '20px',
                                        color: currentTheme.secondary,
                                        fontWeight: '400',
                                    }
                                }
                            >
                                {subtitle}
                            </div>
                        )
                    }

                    {/* Accent line decorativa */}
                    {
                        layout === 'card' && (
                            <div
                                style={
                                    {
                                        width: '100px',
                                        height: '4px',
                                        background: currentTheme.accent,
                                        marginTop: '30px',
                                        borderRadius: '2px',
                                    }
                                }
                            />
                        )
                    }
                </div>

                {/* Border decorativo para layout card */}
                {
                    layout === 'card' && (
                        <div
                            style={
                                {
                                    position: 'absolute',
                                    top: '20px',
                                    left: '20px',
                                    right: '20px',
                                    bottom: '20px',
                                    border: `1px solid ${currentTheme.border}`,
                                    borderRadius: '20px',
                                    pointerEvents: 'none',
                                }
                            }
                        />
                    )
                }
            </div>
        );

        // Convertir a SVG
        const svg = await satori(jsx, {
            width,
            height,
            fonts: [
                {
                    name: 'Inter',
                    data: await fetch('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff').then(res => res.arrayBuffer()),
                    weight: 400,
                    style: 'normal',
                },
                {
                    name: 'Inter',
                    data: await fetch('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff').then(res => res.arrayBuffer()),
                    weight: 600,
                    style: 'normal',
                },
                {
                    name: 'Inter',
                    data: await fetch('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff').then(res => res.arrayBuffer()),
                    weight: 700,
                    style: 'normal',
                },
            ],
        });

        return new Response(svg, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'public, max-age=3600',
            },
        });

    } catch (error) {
        console.error('Error generating custom SVG:', error);

        const errorSvg = `
                                <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <style>
                                            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&amp;display=swap');
                                        </style>
                                    </defs>
                                    <rect width="800" height="400" fill="#1a1a1a" />
                                    <text x="400" y="180" text-anchor="middle" fill="#ff4444" font-size="28" font-family="Inter, sans-serif" font-weight="700">
                                        ⚠️ Error Generating SVG
                                    </text>
                                    <text x="400" y="220" text-anchor="middle" fill="#ffffff" font-size="16" font-family="Inter, sans-serif">
                                        ${error instanceof Error ? error.message.substring(0, 60) : 'Unknown error'}
                                    </text>
                                    <text x="400" y="250" text-anchor="middle" fill="#888888" font-size="12" font-family="Inter, sans-serif">
                                        Check your parameters and try again
                                    </text>
                                </svg>
                                `;

        return new Response(errorSvg, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'no-cache',
            },
        });
    }
}