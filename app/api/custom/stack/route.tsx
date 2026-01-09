import { NextRequest } from 'next/server';
import satori from 'satori';
import { getTheme } from '@/utils/themes';

// Force Node.js runtime for buffer handling if needed, though Edge is often preferred. 
// For now, Node.js is safer for reliable Satori usage with external fetches in some environments.
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Params
        const technologies = (searchParams.get('technologies') || 'react,typescript,nextdotjs').split(',');
        const themeName = searchParams.get('theme') || 'purple-cyan';
        const iconStyle = searchParams.get('iconStyle') || 'original'; // original | monochrome | glass
        const gap = parseInt(searchParams.get('gap') || '16');
        const bgTransparent = searchParams.get('bgTransparent') === 'true';

        const iconColorParam = searchParams.get('iconColor');
        const customColor = searchParams.get('customColor');
        const customColor2 = searchParams.get('customColor2');

        // Theme logic
        const t = getTheme(themeName, customColor || undefined, customColor2 || undefined);
        const iconColor = iconStyle === 'monochrome' ? '#ffffff' : undefined;

        // Fetch Icons Logic
        const iconPromises = technologies.map(async (slug) => {
            const cleanSlug = slug.trim().toLowerCase();
            let url = `https://cdn.simpleicons.org/${cleanSlug}`;

            if (iconStyle === 'monochrome') {
                url += '/white';
            } else if (iconStyle === 'custom' && iconColorParam) {
                url += `/${iconColorParam}`;
            }

            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error('Failed to fetch');
                const svgText = await res.text();
                return { slug: cleanSlug, svg: svgText };
            } catch (e) {
                console.error(`Failed to fetch icon: ${cleanSlug}`);
                return null;
            }
        });

        const loadedIcons = (await Promise.all(iconPromises)).filter(Boolean);

        // Layout Dimensions
        const iconSize = 40;
        const padding = 20;
        const width = (loadedIcons.length * iconSize) + ((loadedIcons.length - 1) * gap) + (padding * 2);
        const height = iconSize + (padding * 2);

        // JSX Construction
        const jsx = (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    background: 'transparent',
                    gap: `${gap}px`,
                    padding: `${padding}px`
                }}
            >
                {/* Background */}
                {!bgTransparent && (iconStyle === 'glass' || (themeName !== 'transparent')) && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: iconStyle === 'glass'
                                ? (t.accent ? `${t.accent}15` : 'rgba(255, 255, 255, 0.05)')
                                : (themeName === 'custom' ? t.bgGradient : 'transparent'),
                            borderRadius: '50px',
                            border: iconStyle === 'glass' ? `1px solid ${t.bgGradient ? 'rgba(255,255,255,0.1)' : t.accent + '30'}` : 'none',
                            boxShadow: iconStyle === 'glass' ? `0 4px 30px ${t.accent}20` : 'none',
                        }}
                    />
                )}

                {
                    loadedIcons.map((icon, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                width: `${iconSize}px`,
                                height: `${iconSize}px`,
                                // For glass effect on icons themselves:
                                filter: iconStyle === 'glass' ? 'drop-shadow(0 0 5px rgba(255,255,255,0.3))' : 'none'
                            }}
                        // We inject the SVG content. Note: Satori might need careful handling of string SVGs.
                        // Satori doesn't support 'dangerouslySetInnerHTML' purely. 
                        // It prefers standard img tags with src="data:image/svg..." or raw fetching.
                        // A robust way for Satori is putting the SVG source as a data URI image.
                        >
                            <img
                                src={`data:image/svg+xml;base64,${Buffer.from(icon?.svg || '').toString('base64')}`}
                                width={iconSize}
                                height={iconSize}
                                style={{
                                    objectFit: 'contain'
                                }}
                            />
                        </div>
                    ))
                }
            </div >
        );

        // Fonts (Standard set)
        const fonts = [
            {
                name: 'Inter',
                data: await fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-400-normal.woff').then(res => res.arrayBuffer()),
                weight: 400 as const,
                style: 'normal' as const,
            }
        ];

        const svg = await satori(jsx, {
            width,
            height,
            fonts,
        });

        return new Response(svg, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'public, max-age=3600',
            },
        });

    } catch (error) {
        console.error(error);
        return new Response('<svg><text>Error</text></svg>', { headers: { 'Content-Type': 'image/svg+xml' } });
    }
}
