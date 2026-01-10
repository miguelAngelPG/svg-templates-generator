import { NextRequest } from 'next/server';
import satori from 'satori';
import { getTheme } from '@/utils/themes';
import { fetchSocialIcons } from '@/utils/social-icons';
import { SocialTemplate } from '@/components/templates/social/SocialTemplate';

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
        const rawPlatforms = platformsStr.split(',').map(p => {
            const [provider, username] = p.split(':');
            return { provider: provider.trim().toLowerCase(), username: username?.trim() };
        }).filter(p => p.provider);

        // Fetch Icons via Utility
        const loadedPlatforms = await fetchSocialIcons(rawPlatforms);

        // Layout Dimensions logic
        let width = 800;
        let height = 100;

        // Dynamic Height Calculation (simplified, ideally shared or calculated)
        if (style === 'card') {
            width = 400;
            height = loadedPlatforms.length * 50 + 60;
        } else if (style === 'block') {
            width = 400;
            height = loadedPlatforms.length * 60 + 40;
        } else if (style === 'minimal') {
            width = 300;
            height = loadedPlatforms.length * 30 + 20;
        } else if (style === 'glass-grid') {
            width = 500;
            const rows = Math.ceil(loadedPlatforms.length / 2);
            height = rows * 100 + 40;
        } else if (style === 'badge') {
            // flexible height?
            height = 100;
        } else {
            // icon only
            height = 100;
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

        const svg = await satori(
            <SocialTemplate
                platforms={loadedPlatforms}
                style={style as any}
                theme={t}
            />,
            {
                width,
                height,
                fonts,
            }
        );

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
