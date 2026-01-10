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
            alignItems: 'center', // Center vertically
            justifyContent: 'center', // Center horizontally
            position: 'relative',
            backgroundColor: '#050505',
            padding: '20px',
            fontFamily: 'Outfit',
        }}>
            {/* Background Glow */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                right: '-20%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.primary}20 0%, transparent 70%)`,
                filter: 'blur(60px)'
            }} />

            {/* Card Container */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '340px',
                height: '380px',
                borderRadius: '20px',
                // Glass border effect
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                // Subtle gradient bg
                background: `linear-gradient(160deg, rgba(20,20,20,0.8) 0%, rgba(10,10,10,0.95) 100%)`,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                {/* Header Section */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '24px', width: '100%' }}>
                    {/* Top Row: Logo & Year */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{
                            fontSize: '28px',
                            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))'
                        }}>
                            {logo}
                        </div>

                        {/* Year Badge */}
                        <div style={{
                            display: 'flex',
                            padding: '4px 10px',
                            backgroundColor: `${theme.primary}15`,
                            border: `1px solid ${theme.primary}20`,
                            borderRadius: '12px',
                            fontSize: '10px',
                            color: theme.primary, // Color matched to theme
                            fontWeight: 700,
                            letterSpacing: '0.5px'
                        }}>
                            {year}
                        </div>
                    </div>

                    {/* Company & Role */}
                    <div style={{
                        fontSize: '10px',
                        color: theme.secondary,
                        fontWeight: 700,
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        marginBottom: '4px'
                    }}>
                        {company}
                    </div>
                    <div style={{
                        fontSize: '20px',
                        color: '#ffffff',
                        fontWeight: 700,
                        lineHeight: '1.2'
                    }}>
                        {role}
                    </div>
                </div>

                {/* Separator - Gradient Line */}
                <div style={{
                    width: '100%',
                    height: '1px',
                    background: `linear-gradient(90deg, transparent 0%, ${theme.primary}40 50%, transparent 100%)`,
                }} />

                {/* Stats Section */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '24px', paddingTop: '16px', flex: 1 }}>

                    {/* Big Stat */}
                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
                        <div style={{
                            fontSize: '56px',
                            fontWeight: 800,
                            color: '#fff', // Solid fallback
                            // Create text gradient effect with mask
                            // Note: Satori mask support is limited, simplified to color
                            textShadow: `0 0 30px ${theme.primary}40`,
                            lineHeight: '1',
                            letterSpacing: '-2px'
                        }}>
                            {stat}
                        </div>
                        <div style={{
                            fontSize: '10px',
                            color: theme.accent,
                            fontWeight: 700,
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            marginTop: '4px'
                        }}>
                            {statDesc}
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{
                        marginTop: 'auto', // Push to bottom if needed, or use margin
                        marginBottom: '20px',
                        fontSize: '13px',
                        color: '#b0b0b0',
                        fontWeight: 400,
                        lineHeight: '1.5'
                    }}>
                        {description}
                    </div>

                    {/* Tech Stack Tags */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'auto' }}>
                        {techArray.map((tag, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                padding: '4px 8px',
                                backgroundColor: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '6px',
                                fontSize: '10px',
                                color: '#999',
                                fontWeight: 500
                            }}>
                                {tag.trim()}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
