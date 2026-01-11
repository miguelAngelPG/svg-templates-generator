// Granular in-memory cache
const fontCache: Record<string, ArrayBuffer> = {};

async function fetchFont(url: string): Promise<ArrayBuffer> {
    if (fontCache[url]) return fontCache[url];
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    fontCache[url] = buffer;
    return buffer;
}

export async function getFonts() {
    // Keep backward compatibility for existing routes that expect everything
    // But we should really move them to individual fetches too.
    // For now, let's optimize the specific ones we need if we can, but since the signature expects returning ALL, 
    // we need to keep fetching all or change the signature/usage everywhere.
    // Changing usage everywhere is safer to avoid breaking "hero", "impact" etc from my previous turn.

    // However, for the "advanced" template, we only need Inter.
    // I'll add a specific method for it or just optimize this one?
    // Let's optimize this one to do parallel fetch but maybe we can delay some?
    // No, if the function returns the object, it awaits all.

    // BETTER FIX: Create a new function `getFontFamily` or similar, 
    // but to save time and complex refactors across 10 files, let's keep `getFonts` but internally optimization?
    // No, if it awaits, it awaits.

    // Strategy: Add a new export `getFont` that takes a name/url, and update `advanced` to use it.
    // Or update `getFonts` to return promises? No, that breaks compatibility.

    // Let's stick to the current plan: optimize `advanced` to use a lighter fetching strategy.
    // But `getFonts` is used by *all* templates I just updated.

    // Fast path: I will just use the `fetchFont` helper internally and export `getFonts` as legacy wrapper,
    // and export `getSpecificFonts` for optimized routes.

    // Actually, I'll just export the load functions directly or a better helper.

    const [outfitRegular, outfitBold, interBold, interRegular, interSemiBold, spaceMono, notoEmoji] = await Promise.all([
        fetchFont('https://cdn.jsdelivr.net/npm/@fontsource/outfit@5.0.13/files/outfit-latin-400-normal.woff'),
        fetchFont('https://cdn.jsdelivr.net/npm/@fontsource/outfit@5.0.13/files/outfit-latin-700-normal.woff'),
        fetchFont('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-900-normal.woff'),
        fetchFont('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-400-normal.woff'),
        fetchFont('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-600-normal.woff'),
        fetchFont('https://cdn.jsdelivr.net/npm/@fontsource/space-mono@5.0.18/files/space-mono-latin-700-normal.woff'),
        fetchFont('https://cdn.jsdelivr.net/npm/@fontsource/noto-emoji@5.0.12/files/noto-emoji-latin-400-normal.woff'),
    ]);

    return { outfitRegular, outfitBold, interBold, interRegular, interSemiBold, spaceMono, notoEmoji };
}

// New optimized method for Advanced template
export async function getInterFonts() {
    const [regular, semiBold, bold] = await Promise.all([
        fetchFont('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-400-normal.woff'),
        fetchFont('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-600-normal.woff'),
        fetchFont('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-900-normal.woff'),
    ]);
    return { regular, semiBold, bold };
}
