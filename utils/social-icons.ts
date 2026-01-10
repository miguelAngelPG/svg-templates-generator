
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
 * Fetches the SVG icon for a given provider or tech slug using simple-icons.
 * Works in both Node.js (Server) and Browser (Client) environments.
 */
export async function fetchIcon(slug: string, color?: string): Promise<string | null> {
    const cleanSlug = (SLUG_MAP[slug.toLowerCase().trim()] || slug.toLowerCase().trim());

    // Construct URL based on source
    // Primary: simpleicons.org
    let url = `https://cdn.simpleicons.org/${cleanSlug}`;
    if (color) {
        url += `/${color.replace('#', '')}`;
    }

    try {
        const res = await fetch(url);
        if (res.ok) {
            let svg = await res.text();
            // Ensure compatibility (replace fill if needed/generic)
            if (!color && !svg.includes('fill=')) {
                svg = svg.replace('<svg', '<svg fill="white"');
            }
            return svg;
        }
    } catch (e) {
        console.warn(`Failed to fetch icon: ${cleanSlug}`, e);
    }
    return null;
}

/**
 * Legacy wrapper for compatibility
 */
export const fetchSocialIcon = (provider: string) => fetchIcon(provider);

/**
 * Batch fetches icons.
 */
export async function fetchIcons(slugs: string[], color?: string): Promise<{ slug: string; svg: string }[]> {
    const promises = slugs.map(async (slug) => {
        const svg = await fetchIcon(slug, color);
        if (svg) return { slug, svg };
        return null;
    });
    return (await Promise.all(promises)).filter(Boolean) as { slug: string; svg: string }[];
}


export async function fetchSocialIcons(platforms: { provider: string; username: string }[]): Promise<SocialPlatform[]> {
    const promises = platforms.map(async (p) => {
        if (!p.provider) return null;
        try {
            const svg = await fetchIcon(p.provider);
            if (svg) {
                return { ...p, svg };
            }
            // Fallback: continue without SVG if fetch fails, but best to have it
        } catch (e) {
            console.error(`Failed to fetch icon for ${p.provider}`, e);
        }
        return null;
    });

    return (await Promise.all(promises)).filter(Boolean) as SocialPlatform[];
}
