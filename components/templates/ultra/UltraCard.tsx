import React from 'react';

function wrapText(text: string, maxCharsPerLine: number = 35): string[] {
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

interface UltraCardProps {
    title: string;
    content: string;
    icon: string;
    theme: any;
}

export const UltraCard: React.FC<UltraCardProps> = ({ title, content, icon, theme }) => {
    const width = 600;
    const height = 300;
    const lines = wrapText(content, 45);

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <style>
                    {`
                    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;800');
                    text { font-family: 'Outfit', sans-serif; }
                    `}
                </style>
                <radialGradient id="blob1_c" cx="1" cy="0" r="1">
                    <stop offset="0%" stopColor={theme.blob2} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={theme.blob2} stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill={theme.bg} />
            <rect width="100%" height="100%" fill="url(#blob1_c)" />

            <rect x="40" y="40" width={width - 80} height={height - 80} rx="16" fill="rgba(255,255,255,0.02)" stroke={theme.border} />

            <g transform="translate(80, 90)">
                {/* Icon Box */}
                <rect x="0" y="-20" width="48" height="48" rx="12" fill="rgba(255,255,255,0.1)" stroke={theme.border} />
                <text x="24" y="12" textAnchor="middle" fontSize="24">{icon}</text>

                {/* Feature Label */}
                <rect x="350" y="-15" width="80" height="24" rx="12" fill={theme.accent} fillOpacity="0.1" stroke={theme.accent} strokeOpacity="0.3" />
                <text x="390" y="2" textAnchor="middle" fontSize="10" fontWeight="700" fill={theme.accent} letterSpacing="1">FEATURE</text>

                <text x="0" y="60" fontSize="32" fontWeight="800" fill={theme.text}>{title}</text>

                <g transform="translate(0, 90)">
                    {lines.map((line, i) => (
                        <text key={i} x="0" y={i * 25} fontSize="18" fill={theme.secondary}>{line}</text>
                    ))}
                </g>
            </g>
        </svg>
    );
};
