import React from 'react';

// Reuse helper locally or import from shared utility if preferred, keeping local for now per strict component isolation
function wrapText(text: string, maxCharsPerLine: number = 30): string[] {
    if (!text) return [];
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];
    for (let i = 1; i < words.length; i++) {
        if ((currentLine + " " + words[i]).length < maxCharsPerLine) currentLine += " " + words[i];
        else { lines.push(currentLine); currentLine = words[i]; }
    }
    lines.push(currentLine);
    return lines;
}

interface UltraQuoteProps {
    content: string;
    title: string;
    label?: string;
    icon: string;
    theme: any;
}

export const UltraQuote: React.FC<UltraQuoteProps> = ({ content, title, label, icon, theme }) => {
    const width = 600;
    const height = 300;
    const lines = wrapText(content, 35);

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <style>
                    {`
                    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700');
                    text { font-family: 'Outfit', sans-serif; }
                    `}
                </style>
                <radialGradient id="blob1_q" cx="0.2" cy="0.2" r="0.8">
                    <stop offset="0%" stopColor={theme.blob1} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={theme.blob1} stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill={theme.bg} />
            <rect width="100%" height="100%" fill="url(#blob1_q)" />

            {/* Glass Card */}
            <rect x="20" y="20" width={width - 40} height={height - 40} rx="20" fill="rgba(255,255,255,0.02)" stroke={theme.border} />

            {/* Quote Mark */}
            <text x="50" y="100" fontSize="120" fill={theme.accent} opacity="0.1" fontFamily="serif">“</text>

            <g transform="translate(80, 120)">
                {lines.map((line, i) => (
                    <text key={i} x="0" y={i * 35} fontSize="28" fontWeight="500" fill={theme.text}>{line}</text>
                ))}
            </g>

            {/* Author */}
            <g transform="translate(80, 240)">
                <circle cx="20" cy="0" r="20" fill={theme.accent} opacity="0.8" />
                <text x="20" y="8" textAnchor="middle" fontSize="20" fill="#000">{icon}</text>
                <text x="50" y="5" fontSize="18" fontWeight="700" fill={theme.text}>{title}</text>
                {label && <text x="50" y="25" fontSize="14" fill={theme.secondary}>{label}</text>}
            </g>
        </svg>
    );
};
