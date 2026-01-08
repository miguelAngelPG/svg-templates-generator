import React from 'react';

interface UltraStatProps {
    value: string;
    label: string;
    icon: string;
    content?: string;
    theme: any;
}

export const UltraStat: React.FC<UltraStatProps> = ({ value, label, icon, content, theme }) => {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            background: theme.bg,
            alignItems: 'center', // Vertically center
            justifyContent: 'center', // Horizontally center
            position: 'relative',
            fontFamily: 'Outfit, sans-serif'
        }}>
            {/* Ambient Background Blobs (Behind Glass) */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%', background: theme.blob1, filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '-20%', right: '-20%', width: '120%', height: '120%', background: theme.blob2, filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%' }} />

            {/* Full Size Glass Container */}
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                background: 'rgba(255, 255, 255, 0.03)', // Subtle surface
                backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)`, // Gradient surface
                border: `1px solid ${theme.border}`,
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)', // Inner shadow for depth
                textAlign: 'center',
                position: 'relative',
                zIndex: 10
            }}>
                <div style={{
                    fontSize: '48px',
                    marginBottom: '16px',
                    filter: `drop-shadow(0 0 20px ${theme.accent}60)`
                }}>
                    {icon}
                </div>

                <div style={{
                    fontSize: '96px',
                    fontWeight: 800,
                    lineHeight: 0.9,
                    color: theme.text,
                    letterSpacing: '-4px',
                    marginBottom: '8px',
                    textShadow: `0 10px 30px rgba(0,0,0,0.5)`
                }}>
                    {value}
                </div>

                <div style={{
                    fontSize: '20px',
                    color: theme.accent,
                    fontWeight: 700,
                    letterSpacing: '4px',
                    textTransform: 'uppercase',
                    marginBottom: content ? '20px' : '0'
                }}>
                    {label}
                </div>

                {content && (
                    <div style={{
                        fontSize: '16px',
                        color: theme.secondary,
                        maxWidth: '400px',
                        lineHeight: 1.5,
                        fontWeight: 400
                    }}>
                        {content}
                    </div>
                )}
            </div>
        </div>
    );
};
