import { NextRequest } from 'next/server';
import satori from 'satori';
import { getTheme } from '@/utils/themes';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Parse Params
        const platformsStr = searchParams.get('platforms') || 'github:github,twitter:twitter';
        const style = searchParams.get('style') || 'badge'; // 'icon-only' | 'badge' | 'card' | 'block' | 'minimal' | 'glass-grid'
        const themeName = searchParams.get('theme') || 'purple-cyan';
        const customColor = searchParams.get('customColor');
        const customColor2 = searchParams.get('customColor2');

        const t = getTheme(themeName, customColor || undefined, customColor2 || undefined);

        // Parse Platforms
        const platforms = platformsStr.split(',').map(p => {
            const [provider, username] = p.split(':');
            return { provider: provider.trim().toLowerCase(), username: username?.trim() };
        }).filter(p => p.provider);

        // Fetch Icons with multiple fallback strategies
        const iconPromises = platforms.map(async (p) => {
            try {
                let slug = p.provider;

                // Manual Corrections for common mistakes
                const slugMap: Record<string, string> = {
                    'github': 'github',
                    'twitter': 'twitter',
                    'x': 'x',
                    'linkedin': 'linkedin',
                    'instagram': 'instagram',
                    'facebook': 'facebook',
                    'youtube': 'youtube',
                    'twitch': 'twitch',
                    'discord': 'discord',
                    'tiktok': 'tiktok',
                    'medium': 'medium',
                    'dev.to': 'devdotto',
                    'devdotto': 'devdotto',
                    'dribbble': 'dribbble',
                    'behance': 'behance',
                    'stackoverflow': 'stackoverflow',
                    'reddit': 'reddit',
                    'email': 'gmail',
                    'gmail': 'gmail',
                    'mail': 'gmail'
                };

                const cleanSlug = slugMap[slug] || slug;

                // Strategy 1: Try jsdelivr first (more reliable than simpleicons CDN)
                try {
                    const res1 = await fetch(`https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/${cleanSlug}.svg`);
                    if (res1.ok) {
                        let svgText = await res1.text();
                        // Ensure white fill for dark backgrounds
                        if (!svgText.includes('fill=')) {
                            svgText = svgText.replace('<svg', '<svg fill="white"');
                        } else {
                            svgText = svgText.replace(/fill="[^"]*"/g, 'fill="white"');
                        }
                        return { ...p, svg: svgText };
                    }
                } catch (e) {
                    console.log(`Strategy 1 failed for ${cleanSlug}`);
                }

                // Strategy 2: Try simpleicons CDN
                try {
                    const res2 = await fetch(`https://cdn.simpleicons.org/${cleanSlug}`);
                    if (res2.ok) {
                        let svgText = await res2.text();
                        // Make it white
                        if (!svgText.includes('fill=')) {
                            svgText = svgText.replace('<svg', '<svg fill="white"');
                        } else {
                            svgText = svgText.replace(/fill="[^"]*"/g, 'fill="white"');
                        }
                        return { ...p, svg: svgText };
                    }
                } catch (e) {
                    console.log(`Strategy 2 failed for ${cleanSlug}`);
                }

                // Strategy 3: Try unpkg
                try {
                    const res3 = await fetch(`https://unpkg.com/simple-icons@latest/icons/${cleanSlug}.svg`);
                    if (res3.ok) {
                        let svgText = await res3.text();
                        if (!svgText.includes('fill=')) {
                            svgText = svgText.replace('<svg', '<svg fill="white"');
                        } else {
                            svgText = svgText.replace(/fill="[^"]*"/g, 'fill="white"');
                        }
                        return { ...p, svg: svgText };
                    }
                } catch (e) {
                    console.log(`Strategy 3 failed for ${cleanSlug}`);
                }

                console.error(`All strategies failed for ${p.provider}`);
                return null;
            } catch (e) {
                console.error(`Error fetching icon for ${p.provider}:`, e);
                return null;
            }
        });

        const loadedPlatforms = (await Promise.all(iconPromises)).filter(Boolean) as { provider: string, username: string, svg: string }[];

        // Layout Dimensions
        let width = 800; // default container width
        let height = 100;

        // Content Construction
        let jsx;

        if (style === 'badge') {
            // Badge Style: [ Icon | Username ] pills
            const gap = 12;
            const padding = 20;
            const badgeHeight = 40;

            // Calculate width based on content if needed, or wrap. 
            // Satori supports flex wrap.

            jsx = (
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    gap: `${gap}px`,
                    padding: `${padding}px`,
                    background: 'transparent'
                }}>
                    {loadedPlatforms.map((p, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '6px 12px',
                            background: t.bgGradient ? 'rgba(255,255,255,0.1)' : `${t.accent}20`,
                            border: `1px solid ${t.border || t.accent}`,
                            borderRadius: '8px',
                            gap: '8px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                        }}>
                            <div style={{
                                display: 'flex',
                                width: '20px',
                                height: '20px'
                            }}>
                                <img
                                    src={`data:image/svg+xml;base64,${Buffer.from(p.svg).toString('base64')}`}
                                    width={20}
                                    height={20}
                                />
                            </div>
                            <span style={{
                                color: '#fff',
                                fontSize: '14px',
                                fontFamily: 'Inter',
                                fontWeight: 500
                            }}>
                                {p.username || p.provider}
                            </span>
                        </div>
                    ))}
                </div>
            );
            // Adjust height maybe if wrapping?
            height = 100; // fixed for now
        } else if (style === 'card') {
            // Card Style: A nice box listing them vertically
            width = 400;
            height = loadedPlatforms.length * 50 + 60; // Dynamic height
            jsx = (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    background: t.bgGradient || '#1a1a1a',
                    borderRadius: '16px',
                    padding: '24px',
                    border: `1px solid ${t.border || '#333'}`,
                    boxShadow: `0 10px 40px ${t.accent}40`,
                    color: '#fff'
                }}>
                    <div style={{ fontSize: '12px', color: t.accent, marginBottom: '16px', fontWeight: 600, letterSpacing: '1px' }}>
                        CONNECT WITH ME
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {loadedPlatforms.map((p, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '8px'
                            }}>
                                <div style={{ width: '24px', height: '24px', display: 'flex' }}>
                                    <img
                                        src={`data:image/svg+xml;base64,${Buffer.from(p.svg).toString('base64')}`}
                                        width={24}
                                        height={24}
                                    />
                                </div>
                                <span style={{ fontFamily: 'Inter', fontSize: '14px' }}>
                                    {p.username || p.provider}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        } else if (style === 'block') {
            // Block / Linktree Style
            width = 400;
            height = loadedPlatforms.length * 60 + 40;
            jsx = (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    gap: '12px'
                }}>
                    {loadedPlatforms.map((p, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '48px',
                            background: t.bgGradient ? 'rgba(255,255,255,0.08)' : `${t.accent}15`,
                            border: `1px solid ${t.accent}40`,
                            borderRadius: '50px', // Full pill
                            gap: '12px',
                            cursor: 'pointer',
                            position: 'relative' // for pseudo effect
                        }}>
                            <div style={{ width: '20px', height: '20px', display: 'flex' }}>
                                <img src={`data:image/svg+xml;base64,${Buffer.from(p.svg).toString('base64')}`} width={20} height={20} />
                            </div>
                            <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600, fontFamily: 'Inter' }}>
                                {p.username || p.provider}
                            </span>
                        </div>
                    ))}
                </div>
            );
        } else if (style === 'minimal') {
            // Minimal list: just text and small icon, no bg
            width = 300;
            height = loadedPlatforms.length * 30 + 20;
            jsx = (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    gap: '16px',
                    padding: '20px'
                }}>
                    {loadedPlatforms.map((p, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}>
                            <div style={{ width: '18px', height: '18px', display: 'flex', opacity: 0.8 }}>
                                <img src={`data:image/svg+xml;base64,${Buffer.from(p.svg).toString('base64')}`} width={18} height={18} />
                            </div>
                            <span style={{ color: t.accent || '#ccc', fontSize: '14px', fontFamily: 'Inter', fontWeight: 500 }}>
                                / {p.username || p.provider}
                            </span>
                        </div>
                    ))}
                </div>
            );
        } else if (style === 'glass-grid') {
            // Glass Grid: 2 columns
            width = 500;
            const rows = Math.ceil(loadedPlatforms.length / 2);
            height = rows * 100 + 40; // approx height
            jsx = (
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: '100%',
                    height: '100%',
                    padding: '20px',
                    gap: '16px',
                    justifyContent: 'center'
                }}>
                    {loadedPlatforms.map((p, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '210px',
                            height: '90px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            gap: '8px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                        }}>
                            <div style={{ width: '28px', height: '28px', display: 'flex' }}>
                                <img src={`data:image/svg+xml;base64,${Buffer.from(p.svg).toString('base64')}`} width={28} height={28} />
                            </div>
                            <span style={{ color: '#aaa', fontSize: '12px', fontFamily: 'Inter' }}>
                                {p.username || p.provider}
                            </span>
                        </div>
                    ))}
                </div>
            );
        } else {
            // Icon Only
            const iconSize = 40;
            const gap = 16;
            jsx = (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    gap: `${gap}px`
                }}>
                    {loadedPlatforms.map((p, i) => (
                        <div key={i} style={{
                            width: `${iconSize}px`,
                            height: `${iconSize}px`,
                            display: 'flex',
                            color: t.accent // Filter? Satori doesn't support CSS filter: color easily without inline SVG manipulation.
                            // We fetched white icons.
                        }}>
                            <img
                                src={`data:image/svg+xml;base64,${Buffer.from(p.svg).toString('base64')}`}
                                width={iconSize}
                                height={iconSize}
                            />
                        </div>
                    ))}
                </div>
            );
        }


        // Fonts
        const fonts = [
            {
                name: 'Inter',
                data: await fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-400-normal.woff').then(res => res.arrayBuffer()),
                weight: 400 as const,
                style: 'normal' as const,
            },
            {
                name: 'Inter',
                data: await fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-600-normal.woff').then(res => res.arrayBuffer()),
                weight: 600 as const,
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
