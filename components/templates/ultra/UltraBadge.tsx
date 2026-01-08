import React from 'react';

interface UltraBadgeProps {
    title: string;
    content?: string;
    icon: string;
    value: string;
    theme: any;
}

// Helper for basic text wrapping
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

export const UltraBadge: React.FC<UltraBadgeProps> = ({ title, content, icon, value, theme }) => {
    const width = 600;
    const height = 300;
    const cx = width / 2;
    const cy = height / 2;

    const truncate = (str: string, max: number) => str.length > max ? str.substring(0, max) + '...' : str;
    const displayTitle = truncate(title, 15);
    const displayValue = truncate(value, 10);

    // Wrap content into max 2 lines
    const contentLines = content ? wrapText(content, 20).slice(0, 2) : [];

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <style>
                    {`
                    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800');
                    text { font-family: 'Outfit', sans-serif; }
                    `}
                </style>
            </defs>

            <g transform={`translate(${cx}, ${cy})`}>
                {/* Main Pill Background - slightly wider */}
                <rect x="-190" y="-45" width="380" height="90" rx="45" fill="#09090b" stroke={theme.border} style={{ filter: `drop-shadow(0 10px 20px rgba(0,0,0,0.5))` }} />

                {/* Icon Circle */}
                <circle cx="-140" cy="0" r="28" fill={theme.accent} />
                <text x="-140" y="10" fontSize="28" textAnchor="middle" fill="#000">{icon}</text>

                {/* Text Info */}
                <text x="-100" y="-8" fontSize="14" fill={theme.secondary} fontWeight="700" letterSpacing="1">{displayTitle.toUpperCase()}</text>
                <text x="-100" y="24" fontSize="28" fill={theme.text} fontWeight="800">{displayValue}</text>

                {contentLines.length > 0 && (
                    <>
                        <line x1="0" y1="-20" x2="0" y2="20" stroke={theme.border} />
                        {contentLines.map((line, i) => (
                            <text
                                key={i}
                                x="50"
                                y={contentLines.length === 1 ? 5 : -4 + (i * 18)}
                                fontSize="14"
                                fill={theme.secondary}
                            >
                                {line}
                            </text>
                        ))}
                    </>
                )}
            </g>
        </svg>
    );
};
