import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getTheme } from '@/utils/themes';
import { RetroTemplate } from '@/components/templates/retro/RetroTemplate';

export const runtime = 'edge';

// Font loading (Press Start 2P for retro feel)
const loadFonts = async () => {
    const pressStart2P = await fetch(new URL('https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff', import.meta.url)).then((res) => res.arrayBuffer());

    return [
        {
            name: 'Press Start 2P',
            data: pressStart2P,
            style: 'normal',
            weight: 400,
        },
    ];
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    // Params
    const style = (searchParams.get('style') || 'gameboy') as 'gameboy' | 'rpg';
    const txt_1 = searchParams.get('txt_1') || '';
    const txt_2 = searchParams.get('txt_2') || '';
    const img_1 = searchParams.get('img_1') || '';
    const themeName = searchParams.get('theme') || 'custom';
    const customColor = searchParams.get('customColor') || '';
    const customColor2 = searchParams.get('customColor2') || '';

    // Theme
    const theme = getTheme(themeName, customColor, customColor2);

    // Load Fonts
    const fonts = await loadFonts();

    // Render Component
    // @ts-ignore
    const element = <RetroTemplate
        style={style}
        txt_1={txt_1}
        txt_2={txt_2}
        img_1={img_1}
        theme={theme}
    />;

    // Dimensions
    const width = style === 'gameboy' ? 300 : 600;
    const height = style === 'gameboy' ? 500 : 200;

    return new ImageResponse(element, {
        width,
        height,
        fonts: fonts as any,
        headers: {
            'Cache-Control': 'no-store, no-cache',
            'Access-Control-Allow-Origin': '*',
        },
    });
}
