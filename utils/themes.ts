export type ThemeColors = {
    bg: string;
    bgGradient: string;
    accent: string;
    gradient: string;
    blob1: string;
    blob2: string;
};

export const HERO_THEMES: Record<string, ThemeColors> = {
    'purple-cyan': {
        bg: '#0f0a1e',
        bgGradient: 'linear-gradient(135deg, #0f0a1e 0%, #000 100%)',
        accent: '#00f2ff',
        gradient: 'linear-gradient(to right, #00f2ff, #bd00ff)',
        blob1: '#4316db',
        blob2: '#00d4ff'
    },
    'orange-pink': {
        bg: '#1f0f0a',
        bgGradient: 'linear-gradient(135deg, #1f0f0a 0%, #000 100%)',
        accent: '#ffaa40',
        gradient: 'linear-gradient(to right, #ffaa40, #f72585)',
        blob1: '#ff6b35',
        blob2: '#ffaa40'
    },
    'green-blue': {
        bg: '#05140f',
        bgGradient: 'linear-gradient(135deg, #05140f 0%, #000 100%)',
        accent: '#00ff9d',
        gradient: 'linear-gradient(to right, #00ff9d, #00b4d8)',
        blob1: '#06ffa5',
        blob2: '#00ff9d'
    },
};

export function getTheme(themeName: string): ThemeColors {
    return HERO_THEMES[themeName] || HERO_THEMES['purple-cyan'];
}
