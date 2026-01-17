
import { NextRequest } from 'next/server';
import satori from 'satori';
import { getTheme } from '@/utils/themes';
import { StatsTemplate } from '@/components/templates/stats/StatsTemplate';
import { getFonts } from '@/services/fonts';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Parse Params
        const title = searchParams.get('title') || 'GitHub Stats';
        const style = searchParams.get('style') || 'dashboard'; // compact | card | dashboard
        const themeName = searchParams.get('theme') || 'purple-cyan';
        const customColor = searchParams.get('customColor');
        const customColor2 = searchParams.get('customColor2');

        const commits = searchParams.get('commits') || '1,234';
        const prs = searchParams.get('prs') || '56';
        const issues = searchParams.get('issues') || '23';
        const stars = searchParams.get('stars') || '89';
        const contribs = searchParams.get('contribs') || '450';
        const rank = searchParams.get('rank') || 'A+';

        const t = getTheme(themeName, customColor || undefined, customColor2 || undefined);

        // Layout Dimensions
        let width = 500;
        let height = 300;

        if (style === 'compact') {
            width = 450;
            height = 60;
        } else if (style === 'card') {
            width = 300;
            height = 350;
        } else if (style === 'dashboard') {
            width = 500;
            height = 300;
        }

        // Fonts
        const fontsData = await getFonts();
        const fonts = [
            {
                name: 'Inter',
                data: fontsData.interRegular,
                weight: 400 as const,
                style: 'normal' as const,
            },
            {
                name: 'Inter',
                data: fontsData.interSemiBold,
                weight: 600 as const,
                style: 'normal' as const,
            },
            {
                name: 'Inter',
                data: fontsData.interBold,
                weight: 700 as const,
                style: 'normal' as const,
            }
        ];

        const svg = await satori(
            <StatsTemplate
                data={{
                    commits,
                    prs,
                    issues,
                    stars,
                    contribs,
                    rank
                }}
                style={style as any}
                theme={t}
                title={title}
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
                'Cache-Control': 'public, max-age=0, must-revalidate',
            },
        });

    } catch (error) {
        console.error(error);
        return new Response('<svg><text>Error</text></svg>', { headers: { 'Content-Type': 'image/svg+xml' } });
    }
}
