import React from 'react';

// Helper for basic text wrapping in SVG
function wrapText(text: string, maxCharsPerLine: number): string[] {
    if (!text) return [];
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        if ((currentLine + " " + words[i]).length < maxCharsPerLine) {
            currentLine += " " + words[i];
        } else {
            lines.push(currentLine);
            currentLine = words[i];
        }
    }
    lines.push(currentLine);
    return lines;
}

interface UltraStatProps {
    value: string;
    label: string;
    icon: string;
    content?: string;
    theme: any;
}

export const UltraStat: React.FC<UltraStatProps> = ({ value, label, icon, content, theme }) => {
    const width = 600;
    const height = 300;
    const contentLines = content ? wrapText(content, 40) : [];

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <style>
                    {`
                    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900');
                    text { font-family: 'Outfit', sans-serif; }
                    `}
                </style>
                <linearGradient id="overlay_stat" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
                </linearGradient>
                <radialGradient id={`blob1_stat`} cx="0.2" cy="0.2" r="0.8">
                    <stop offset="0%" stopColor={theme.blob1} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={theme.blob1} stopOpacity="0" />
                </radialGradient>
                <radialGradient id={`blob2_stat`} cx="0.8" cy="0.8" r="0.8">
                    <stop offset="0%" stopColor={theme.blob2} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={theme.blob2} stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Backgrounds */}
            <rect width="100%" height="100%" fill={theme.bg} />
            <rect width="100%" height="100%" fill="url(#blob1_stat)" />
            <rect width="100%" height="100%" fill="url(#blob2_stat)" />

            {/* Glass Card Surface */}
            <rect width="100%" height="100%" fill="url(#overlay_stat)" stroke={theme.border} />

            {/* Content Group (Centered) */}
            <g textAnchor="middle" transform={`translate(${width / 2}, ${height / 2})`}>
                <text y="-50" fontSize="48" fill="#fff" style={{ filter: `drop-shadow(0 0 10px ${theme.accent})` }}>
                    {icon}
                </text>
                <text y="20" fontSize="96" fontWeight="900" fill={theme.text} letterSpacing="-4">
                    {value}
                </text>
                <text y="50" fontSize="20" fontWeight="700" fill={theme.accent} letterSpacing="4">
                    {label.toUpperCase()}
                </text>

                {contentLines.map((line, i) => (
                    <text key={i} y={80 + (i * 20)} fontSize="16" fill={theme.secondary}>
                        {line}
                    </text>
                ))}
            </g>
        </svg>
    );
};
