import React from 'react';

interface PhilosophyTemplateProps {
    title: string;
    quote: string;
    icon: string;
    lang?: string;
    footer?: string;
    theme: {
        bg: string;
        bgGradient: string;
        primary: string; // Used as main accent
        secondary: string;
    };
}

export const PhilosophyTemplate = ({
    title,
    quote,
    icon,
    lang = 'en',
    footer,
    theme,
}: PhilosophyTemplateProps) => {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center', // Center content
            justifyContent: 'center',
            position: 'relative',
            backgroundColor: theme.bg,
            // Richer background gradient
            background: theme.bgGradient,
            fontFamily: 'Outfit',
            overflow: 'hidden'
        }}>
            {/* Background Blob for depth */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '20%',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.secondary}20 0%, transparent 70%)`,
                filter: 'blur(80px)'
            }} />

            {/* Glass Panel Container */}
            <div style={{
                position: 'relative', // Changed from absolute
                // Removed top/left, Flexbox parent will center it
                width: '750px',
                height: '200px',
                borderRadius: '24px',
                // Glass effect borders
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                backgroundColor: 'rgba(20, 20, 20, 0.4)', // Darker tint for contrast
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
                {/* Content Container */}
                <div style={{ display: 'flex', width: '100%', padding: '0 50px', alignItems: 'center' }}>

                    {/* Icon Section - Left Aligned */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '40px',
                        width: '90px',
                        height: '90px',
                        position: 'relative',
                        flexShrink: 0
                    }}>
                        {/* Glow Circle */}
                        <div style={{
                            position: 'absolute',
                            width: '90px',
                            height: '90px',
                            borderRadius: '50%',
                            background: `conic-gradient(from 0deg, ${theme.primary}00, ${theme.primary}40, ${theme.primary}00)`,
                            opacity: 0.6,
                        }} />
                        {/* Inner Circle */}
                        <div style={{
                            position: 'absolute',
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            backgroundColor: `${theme.primary}15`,
                            border: `1px solid ${theme.primary}30`
                        }} />
                        <div style={{ fontSize: '36px', filter: `drop-shadow(0 0 10px ${theme.primary})` }}>
                            {icon}
                        </div>
                    </div>

                    {/* Text Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>

                        {/* Title pill */}
                        <div style={{ display: 'flex' }}>
                            <div style={{
                                fontSize: '10px',
                                color: theme.primary,
                                fontWeight: 700,
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                marginBottom: '12px',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                backgroundColor: `${theme.primary}15`,
                                border: `1px solid ${theme.primary}25`
                            }}>
                                {title}
                            </div>
                        </div>

                        {/* Quote Text */}
                        <div style={{
                            display: 'flex',
                            fontSize: '24px',
                            color: '#f0f0f0',
                            fontWeight: 400, // Regular weight for elegance
                            letterSpacing: '-0.3px',
                            lineHeight: '1.3',
                            marginBottom: '16px',
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                        }}>
                            “{quote}”
                        </div>

                        {/* Footer / Author */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '11px',
                            color: '#888888',
                            fontWeight: 500,
                            letterSpacing: '0.5px'
                        }}>
                            <div style={{ width: '20px', height: '1px', background: theme.primary, marginRight: '10px', opacity: 0.5 }}></div>
                            {footer || (lang === 'es' ? 'FILOSOFÍA PERSONAL' : 'PERSONAL PHILOSOPHY')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
