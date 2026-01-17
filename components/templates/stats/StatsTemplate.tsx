
import React from 'react';

export interface StatsData {
    commits: string;
    prs: string;
    issues: string;
    stars: string;
    contribs: string;
    rank?: string;
}

export interface StatsTemplateProps {
    data: StatsData;
    theme: any;
    style: 'compact' | 'card' | 'dashboard';
    title?: string;
    showIcons?: boolean;
}

export const StatsTemplate: React.FC<StatsTemplateProps> = ({
    data,
    theme,
    style,
    title = 'GitHub Stats',
    showIcons = true
}) => {
    const {
        bg,
        text,
        border,
        accent,
        secondary,
        surface
    } = theme;

    // Icons (standard SVG paths for Satori)
    const Icons = {
        commits: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <line x1="3" y1="12" x2="9" y2="12" />
                <line x1="15" y1="12" x2="21" y2="12" />
            </svg>
        ),
        prs: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="18" r="3" />
                <circle cx="6" cy="6" r="3" />
                <path d="M13 6h3a2 2 0 0 1 2 2v7" />
                <line x1="6" y1="9" x2="6" y2="21" />
            </svg>
        ),
        issues: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
        ),
        stars: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ),
        contribs: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 2v20" />
                <circle cx="12" cy="12" r="2" />
                <path d="M20 2v20" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
            </svg>
        )
    };

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        fontFamily: '"Inter", sans-serif',
        background: bg,
        color: text,
        borderRadius: '12px',
        border: `1px solid ${border}`,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    };

    // Compact Layout (Horizontal Row)
    if (style === 'compact') {
        return (
            <div style={{ ...containerStyle, flexDirection: 'row', alignItems: 'center', padding: '12px 20px', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ color: accent }}>{Icons.stars}</div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{data.stars}</div>
                </div>
                <div style={{ width: '1px', height: '16px', background: border }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ color: secondary }}>{Icons.commits}</div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{data.commits}</div>
                </div>
                <div style={{ width: '1px', height: '16px', background: border }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ color: accent }}>{Icons.prs}</div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{data.prs}</div>
                </div>
            </div>
        );
    }

    // Card Layout (Vertical List with Header)
    if (style === 'card') {
        return (
            <div style={{ ...containerStyle, flexDirection: 'column', width: '300px', padding: '20px' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', background: `linear-gradient(to right, ${accent}, ${secondary})`, backgroundClip: 'text', color: 'transparent' }}>
                    {title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <StatRow label="Total Stars" value={data.stars} icon={Icons.stars} color={accent} theme={theme} />
                    <StatRow label="Commits" value={data.commits} icon={Icons.commits} color={secondary} theme={theme} />
                    <StatRow label="Pull Requests" value={data.prs} icon={Icons.prs} color={accent} theme={theme} />
                    <StatRow label="Issues" value={data.issues} icon={Icons.issues} color={secondary} theme={theme} />
                </div>
                {data.rank && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', opacity: 0.7 }}>Rank</span>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: accent }}>{data.rank}</span>
                    </div>
                )}
            </div>
        );
    }

    // Dashboard Layout (Grid)
    if (style === 'dashboard') {
        return (
            <div style={{ ...containerStyle, flexDirection: 'column', padding: '24px', width: '500px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800 }}>{title}</div>
                    {data.rank && <div style={{ background: surface, padding: '4px 8px', borderRadius: '4px', fontSize: '12px', border: `1px solid ${border}` }}>{data.rank}</div>}
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    <StatBox label="Total Stars" value={data.stars} icon={Icons.stars} color={accent} theme={theme} />
                    <StatBox label="Commits" value={data.commits} icon={Icons.commits} color={secondary} theme={theme} />
                    <StatBox label="PRs" value={data.prs} icon={Icons.prs} color={accent} theme={theme} />
                    <StatBox label="Issues" value={data.issues} icon={Icons.issues} color={secondary} theme={theme} />
                </div>

                <div style={{ marginTop: '24px', height: '4px', background: surface, borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '65%', height: '100%', background: `linear-gradient(to right, ${accent}, ${secondary})` }} />
                </div>
            </div>
        );
    }

    return null;
};

const StatRow = ({ label, value, icon, color, theme }: any) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ color: color }}>{icon}</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>{label}</div>
        </div>
        <div style={{ fontSize: '14px', fontWeight: 600 }}>{value}</div>
    </div>
);

const StatBox = ({ label, value, icon, color, theme }: any) => (
    <div style={{ 
        flex: '1 1 40%', 
        background: theme.surface, 
        padding: '16px', 
        borderRadius: '8px', 
        border: `1px solid ${theme.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>{label}</div>
            <div style={{ color: color }}>{icon}</div>
        </div>
        <div style={{ fontSize: '24px', fontWeight: 700 }}>{value}</div>
    </div>
);
