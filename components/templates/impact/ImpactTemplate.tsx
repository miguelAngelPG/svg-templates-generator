import React from 'react';

interface ImpactTemplateProps {
    company: string;
    role: string;
    year: string;
    stat: string;
    statDesc: string;
    description: string;
    techArray: string[];
    logo: string;
    theme: {
        primary: string;
        secondary: string;
        accent: string;
    };
}

export const ImpactTemplate = ({
    company,
    role,
    year,
    stat,
    statDesc,
    description,
    techArray,
    logo,
    theme
}: ImpactTemplateProps) => {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            position: 'relative',
            backgroundColor: '#050505',
            padding: '20px',
            fontFamily: 'Outfit',
        }}>
            {/* Card Container - mimic rect with card-bg class */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '340px',
                height: '380px',
                borderRadius: '16px',
                border: '1.5px solid rgba(255, 255, 255, 0.08)',
                // Satori supports simple linear gradients in background
                background: `radial-gradient(circle at 50% 0%, ${theme.primary}26, #000000)`,
                position: 'relative',
                overflow: 'hidden' // Clip content
            }}>
                {/* Border Overlay (Animated via CSS class in route) - emulated here as static for layout */}

                {/* Header Section */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '25px', width: '100%' }}>
                    {/* Top Row: Logo & Year */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div style={{ fontSize: '32px' }}>{logo}</div>

                        {/* Year Badge */}
                        <div style={{
                            display: 'flex',
                            padding: '4px 12px',
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            borderRadius: '4px',
                            fontSize: '10px',
                            color: '#aaaaaa',
                            fontWeight: 600,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {year}
                        </div>
                    </div>

                    {/* Company & Role */}
                    <div style={{
                        fontSize: '11px',
                        color: theme.primary,
                        fontWeight: 700,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        marginBottom: '4px'
                    }}>
                        {company}
                    </div>
                    <div style={{ fontSize: '18px', color: '#ffffff', fontWeight: 700 }}>
                        {role}
                    </div>
                </div>

                {/* Glow Line (Top) - Visual separator */}
                <div style={{
                    width: 'calc(100% - 40px)',
                    height: '2px',
                    margin: '0 20px',
                    background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
                    opacity: 0.8
                }} />

                {/* Stats Section */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '25px', paddingTop: '10px' }}>

                    {/* Big Stat */}
                    <div style={{
                        display: 'flex',
                        fontSize: '64px',
                        fontWeight: 800,
                        // Fallback color removed, using transparent for gradient text
                        // We will use mask/gradient in the inject CSS to make it look cool
                        backgroundImage: `linear-gradient(180deg, #ffffff, rgba(255,255,255,0.2))`,
                        backgroundClip: 'text',
                        color: 'transparent'
                    }}>
                        {stat}
                    </div>

                    <div style={{
                        fontSize: '11px',
                        color: theme.accent,
                        fontWeight: 700,
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase'
                    }}>
                        {statDesc}
                    </div>

                    {/* Description - Satori handles wrapping automatically! */}
                    <div style={{
                        marginTop: '20px',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.75)',
                        fontWeight: 300,
                        lineHeight: '1.4'
                    }}>
                        {description}
                    </div>

                    {/* Tech Stack Tags */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '20px' }}>
                        {techArray.map((tag, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                padding: '4px 10px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '4px',
                                fontSize: '9px',
                                color: '#888888',
                                fontWeight: 500
                            }}>
                                {tag.trim()}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom line */}
                <div style={{
                    position: 'absolute',
                    bottom: '25px',
                    left: '25px',
                    width: '290px',
                    height: '1px',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                }} />

            </div>
        </div>
    );
};
