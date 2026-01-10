/**
 * Escapes special characters for XML/SVG to prevent injection.
 * @param str The input string to escape
 * @returns The escaped string safe for XML content
 */
export function escapeXML(str: string): string {
    if (!str) return '';
    return str.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}
