
// Common slug corrections
const SLUG_MAP: Record<string, string> = {
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

export interface SocialPlatform {
    provider: string;
    username: string;
    svg?: string;
}

/**
 * Fetches the SVG icon for a given provider slug using multiple strategies.
 * Works in both Node.js (Server) and Browser (Client) environments.
 */
export async function fetchSocialIcon(provider: string): Promise<string | null> {
    const slug = provider.toLowerCase().trim();
    const cleanSlug = SLUG_MAP[slug] || slug;

    // Helper to ensure white fill for dark backgrounds
    const generalizeSvg = (svgText: string) => {
        if (!svgText.includes('fill=')) {
            return svgText.replace('<svg', '<svg fill="white"');
        } else {
            return svgText.replace(/fill="[^"]*"/g, 'fill="white"');
        }
    };

    // Strategy 1: jsdelivr (npm mirror)
    try {
        const res = await fetch(`https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/${cleanSlug}.svg`);
        if (res.ok) {
            return generalizeSvg(await res.text());
        }
    } catch (e) {
        // Continue to next strategy
    }

    // Strategy 2: simpleicons.org CDN
    try {
        const res = await fetch(`https://cdn.simpleicons.org/${cleanSlug}`);
        if (res.ok) {
            return generalizeSvg(await res.text());
        }
    } catch (e) {
        // Continue
    }

    // Strategy 3: unpkg
    try {
        const res = await fetch(`https://unpkg.com/simple-icons@latest/icons/${cleanSlug}.svg`);
        if (res.ok) {
            return generalizeSvg(await res.text());
        }
    } catch (e) {
        // Continue
    }

    return null;
}

/**
 * Batch fetches icons for multiple platforms.
 */
export async function fetchSocialIcons(platforms: { provider: string; username: string }[]): Promise<SocialPlatform[]> {
    const promises = platforms.map(async (p) => {
        if (!p.provider) return null;
        try {
            const svg = await fetchSocialIcon(p.provider);
            if (svg) {
                return { ...p, svg };
            }
        } catch (e) {
            console.error(`Failed to fetch icon for ${p.provider}`, e);
        }
        return null; // Don't return platforms without icons to avoid broken images
    });

    return (await Promise.all(promises)).filter(Boolean) as SocialPlatform[];
}
