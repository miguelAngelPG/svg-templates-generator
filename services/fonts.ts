// Simple in-memory cache
let cachedFonts: {
    outfitRegular: ArrayBuffer;
    outfitBold: ArrayBuffer;
    interBold: ArrayBuffer;
    interRegular: ArrayBuffer;
    interSemiBold: ArrayBuffer;
    spaceMono: ArrayBuffer;
    notoEmoji: ArrayBuffer;
} | null = null;

export async function getFonts() {
    if (cachedFonts) {
        return cachedFonts;
    }

    const [outfitRegular, outfitBold, interBold, interRegular, interSemiBold, spaceMono, notoEmoji] = await Promise.all([
        fetch('https://cdn.jsdelivr.net/npm/@fontsource/outfit@5.0.13/files/outfit-latin-400-normal.woff').then(res => res.arrayBuffer()),
        fetch('https://cdn.jsdelivr.net/npm/@fontsource/outfit@5.0.13/files/outfit-latin-700-normal.woff').then(res => res.arrayBuffer()),
        fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-900-normal.woff').then(res => res.arrayBuffer()),
        fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-400-normal.woff').then(res => res.arrayBuffer()),
        fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-600-normal.woff').then(res => res.arrayBuffer()),
        fetch('https://cdn.jsdelivr.net/npm/@fontsource/space-mono@5.0.18/files/space-mono-latin-700-normal.woff').then(res => res.arrayBuffer()),
        // Fallback for Emojis (Monochrome/Flat version is lighter and works better with coloring flexibility)
        fetch('https://cdn.jsdelivr.net/npm/@fontsource/noto-emoji@5.0.12/files/noto-emoji-latin-400-normal.woff').then(res => res.arrayBuffer()),
    ]);

    cachedFonts = { outfitRegular, outfitBold, interBold, interRegular, interSemiBold, spaceMono, notoEmoji };
    return cachedFonts;
}
