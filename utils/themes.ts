export type ThemeColors = {
    bg: string;
    bgGradient: string;
    accent: string;
    gradient: string;
    blob1: string;
    blob2: string;
    border?: string;
};

export const HERO_THEMES: Record<string, ThemeColors> = {
    // --- POPULAR ---
    'purple-cyan': {
        bg: '#0f0a1e',
        bgGradient: 'linear-gradient(135deg, #0f0a1e 0%, #000 100%)',
        accent: '#00f2ff',
        gradient: 'linear-gradient(to right, #00f2ff, #bd00ff)',
        blob1: '#bd00ff',
        blob2: '#00f2ff'
    },
    'orange-pink': {
        bg: '#140505',
        bgGradient: 'linear-gradient(135deg, #140505 0%, #000 100%)',
        accent: '#ffaa40',
        gradient: 'linear-gradient(to right, #ffaa40, #f72585)',
        blob1: '#f72585',
        blob2: '#ffaa40'
    },
    'green-blue': {
        bg: '#02120b',
        bgGradient: 'linear-gradient(135deg, #02120b 0%, #000 100%)',
        accent: '#00ff9d',
        gradient: 'linear-gradient(to right, #00ff9d, #00b4d8)',
        blob1: '#00b4d8',
        blob2: '#00ff9d'
    },

    // --- NEON / CYBER ---
    'neon-red': {
        bg: '#1a0505',
        bgGradient: 'linear-gradient(135deg, #1a0505 0%, #000 100%)',
        accent: '#ff003c',
        gradient: 'linear-gradient(to right, #ff003c, #ff8a00)',
        blob1: '#ff003c',
        blob2: '#ff8a00'
    },
    'cyber-yellow': {
        bg: '#121200',
        bgGradient: 'linear-gradient(135deg, #0f0f00 0%, #1a1a00 100%)',
        accent: '#fcee0a',
        gradient: 'linear-gradient(to right, #fcee0a, #00f0ff)',
        blob1: '#fcee0a',
        blob2: '#00f0ff'
    },
    'matrix': {
        bg: '#001a00',
        bgGradient: 'linear-gradient(135deg, #000 0%, #001a00 100%)',
        accent: '#00ff41',
        gradient: 'linear-gradient(to right, #00ff41, #008f11)',
        blob1: '#008f11',
        blob2: '#003b00'
    },
    'synthwave': {
        bg: '#12001f',
        bgGradient: 'linear-gradient(135deg, #12001f 0%, #2d004d 100%)',
        accent: '#ff00ff',
        gradient: 'linear-gradient(to right, #ff00ff, #00ffff)',
        blob1: '#ff00ff',
        blob2: '#00ffff'
    },

    // --- DARK & ELEGANT ---
    'gold-dark': {
        bg: '#0f0f08',
        bgGradient: 'linear-gradient(135deg, #0f0f08 0%, #000 100%)',
        accent: '#ffd700',
        gradient: 'linear-gradient(to right, #ffd700, #ffaa00)',
        blob1: '#ffaa00',
        blob2: '#ffd700'
    },
    'monochrome': {
        bg: '#000000',
        bgGradient: 'linear-gradient(135deg, #111 0%, #000 100%)',
        accent: '#ffffff',
        gradient: 'linear-gradient(to right, #ffffff, #666666)',
        blob1: '#333333',
        blob2: '#999999'
    },
    'midnight-blue': {
        bg: '#020412',
        bgGradient: 'linear-gradient(135deg, #020412 0%, #050a2e 100%)',
        accent: '#7df9ff',
        gradient: 'linear-gradient(to right, #7df9ff, #2bff88)',
        blob1: '#1c1cff',
        blob2: '#00ff9d'
    },

    // --- NATURE & SOFT ---
    'oceanic': {
        bg: '#00151f',
        bgGradient: 'linear-gradient(135deg, #00151f 0%, #002f45 100%)',
        accent: '#00e0ff',
        gradient: 'linear-gradient(to right, #00e0ff, #0066ff)',
        blob1: '#0066ff',
        blob2: '#00e0ff'
    },
    'sunset': {
        bg: '#1f0a0a',
        bgGradient: 'linear-gradient(135deg, #1f0a0a 0%, #3d0c0c 100%)',
        accent: '#ff4d4d',
        gradient: 'linear-gradient(to right, #ff4d4d, #f9cb28)',
        blob1: '#f9cb28',
        blob2: '#ff4d4d'
    },
    'forest': {
        bg: '#051405',
        bgGradient: 'linear-gradient(135deg, #051405 0%, #000 100%)',
        accent: '#55ff55',
        gradient: 'linear-gradient(to right, #55ff55, #00aa00)',
        blob1: '#00aa00',
        blob2: '#55ff55'
    },
    'lavender': {
        bg: '#11051c',
        bgGradient: 'linear-gradient(135deg, #11051c 0%, #240a3d 100%)',
        accent: '#d6b4fc',
        gradient: 'linear-gradient(to right, #d6b4fc, #9d4edd)',
        blob1: '#9d4edd',
        blob2: '#d6b4fc'
    },

    // --- VIBRANT ---
    'blue-indigo': {
        bg: '#050a1a',
        bgGradient: 'linear-gradient(135deg, #050a1a 0%, #000 100%)',
        accent: '#4361ee',
        gradient: 'linear-gradient(to right, #4361ee, #3a0ca3)',
        blob1: '#3a0ca3',
        blob2: '#4cc9f0'
    },
    'candy': {
        bg: '#1f0d16',
        bgGradient: 'linear-gradient(135deg, #1f0d16 0%, #3d0820 100%)',
        accent: '#ff00cc',
        gradient: 'linear-gradient(to right, #ff00cc, #3333ff)',
        blob1: '#3333ff',
        blob2: '#ff00cc'
    },
    'electric-violet': {
        bg: '#14001f',
        bgGradient: 'linear-gradient(135deg, #14001f 0%, #290040 100%)',
        accent: '#bf00ff',
        gradient: 'linear-gradient(to right, #bf00ff, #ff007f)',
        blob1: '#bf00ff',
        blob2: '#ff007f'
    },
    'heatmap': {
        bg: '#1a0000',
        bgGradient: 'linear-gradient(135deg, #1a0000 0%, #330000 100%)',
        accent: '#ff3300',
        gradient: 'linear-gradient(to right, #ff3300, #ffff00)',
        blob1: '#ff0000',
        blob2: '#ffcc00'
    },
    'mint-chocolate': {
        bg: '#1a120b',
        bgGradient: 'linear-gradient(135deg, #1a120b 0%, #2e2014 100%)',
        accent: '#00ffc8',
        gradient: 'linear-gradient(to right, #00ffc8, #00ff80)',
        blob1: '#3c2f2f',
        blob2: '#00ffc8'
    },
    'dracula': {
        bg: '#282a36',
        bgGradient: 'linear-gradient(135deg, #282a36 0%, #44475a 100%)',
        accent: '#ff79c6',
        gradient: 'linear-gradient(to right, #ff79c6, #bd93f9)',
        blob1: '#bd93f9',
        blob2: '#ff79c6'
    }
};

export function getTheme(themeName: string, customColor?: string, customColor2?: string): ThemeColors {
    const baseTheme = HERO_THEMES[themeName] || HERO_THEMES['purple-cyan'];

    // Security: Validate hex colors to prevent CSS injection
    const isValidColor = (color: string) => /^#([0-9A-F]{3}){1,2}$/i.test(color);

    if (themeName === 'custom' && customColor) {
        // Validate customColor. If invalid, fallback to base theme accent or a safe default.
        const safePrimary = isValidColor(customColor) ? customColor : '#000000';

        // If second color is provided, validate it. Otherwise, default to white.
        let safeSecondary = '#ffffff';
        if (customColor2 && isValidColor(customColor2)) {
            safeSecondary = customColor2;
        }

        return {
            bg: '#0a0a0a',
            bgGradient: `linear-gradient(135deg, ${safePrimary}40 0%, ${safeSecondary}40 100%)`, // Gradient between both custom colors
            accent: safePrimary,
            gradient: `linear-gradient(135deg, ${safePrimary} 0%, ${safeSecondary} 100%)`,
            blob1: safePrimary,
            blob2: safeSecondary
        };
    }

    return baseTheme;
}

// Helper to extract dominant colors for the preview
const getPreviewColors = (theme: ThemeColors): string[] => {
    // We try to extract 3 colors: bg, accent, and a gradient/secondary part
    // Regex to extract colors from gradient strings if needed, but for now simplistic:
    return [theme.bg, theme.accent, theme.blob1 || theme.blob2 || theme.accent];
};

export const THEME_PRESETS = [
    // Map all defined themes dynamically
    ...Object.keys(HERO_THEMES).map(key => ({
        id: key,
        label: key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        colors: getPreviewColors(HERO_THEMES[key])
    })),
    // Append Custom manually
    { id: 'custom', label: 'Custom', colors: ['#333', '#fff', '#888'] }
];
