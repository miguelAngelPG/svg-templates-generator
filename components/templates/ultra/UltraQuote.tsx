import React from 'react';

interface UltraQuoteProps {
    content: string;
    title: string; // Author
    label?: string; // Role
    icon: string; // Author Icon/Avatar substitute
    theme: any;
}

export const UltraQuote: React.FC<UltraQuoteProps> = ({ content, title, label, icon, theme }) => {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            background: theme.bg,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            fontFamily: 'Outfit, sans-serif'
        }}>
            {/* Background Texture */}
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 100% 0%, ${theme.blob1}10, transparent 50%)` }} />

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '50px',
                width: '90%',
                maxWidth: '700px',
                position: 'relative'
            }}>
                {/* Giant Quote Mark */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    fontSize: '120px',
                    color: theme.accent,
                    opacity: 0.1,
                    fontFamily: 'serif',
                    lineHeight: 0.5
                }}>
                    “
                </div>

                {/* Quote Text */}
                <div style={{
                    fontSize: '32px',
                    fontWeight: 500,
                    color: theme.text,
                    lineHeight: 1.3,
                    marginBottom: '30px',
                    position: 'relative',
                    zIndex: 1,
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                }}>
                    {content}
                </div>

                {/* Author Block */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', paddingLeft: '10px' }}>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.accent}, ${theme.blob1})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        boxShadow: `0 4px 15px ${theme.accent}40`,
                        color: '#000'
                    }}>
                        {icon}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '18px', color: theme.text, fontWeight: 700 }}>
                            {title}
                        </div>
                        {label && (
                            <div style={{ fontSize: '14px', color: theme.secondary, fontWeight: 400 }}>
                                {label}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Decorative bottom line */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: '20%',
                right: '20%',
                height: '1px',
                background: `linear-gradient(90deg, transparent, ${theme.border}, transparent)`
            }} />
        </div>
    );
};
