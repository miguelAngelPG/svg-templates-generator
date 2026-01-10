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
            position: 'relative',
            backgroundColor: theme.bg,
            // Mimic warm gradient background roughly for Satori (visual fallback)
            background: theme.bgGradient,
            fontFamily: 'Outfit',
            overflow: 'hidden'
        }}>
            {/* Glass Panel Container */}
            <div style={{
                position: 'absolute',
                top: '30px',
                left: '30px',
                width: '740px',
                height: '190px',
                borderRadius: '24px',
                border: `1.5px solid ${theme.primary}1a`, // 10% opacity
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                alignItems: 'center'
            }}>
                {/* Top Border Accent (Visual) */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    right: '20px',
                    height: '1px',
                    background: `${theme.primary}4d` // 30% opacity
                }} />

                {/* Content Container */}
                <div style={{ display: 'flex', width: '100%', padding: '0 60px', marginTop: '10px' }}>

                    {/* Icon Section */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '50px',
                        width: '80px',
                        height: '80px',
                        position: 'relative'
                    }}>
                        {/* Glow Circle Behind Icon */}
                        <div style={{
                            position: 'absolute',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: `${theme.primary}33`, // 20% opacity
                            filter: 'blur(10px)'
                        }} />
                        <div style={{ fontSize: '40px' }}>{icon}</div>
                    </div>

                    {/* Text Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div style={{
                            fontSize: '20px',
                            color: theme.primary,
                            fontWeight: 600,
                            letterSpacing: '1px',
                            marginBottom: '15px'
                        }}>
                            {title}
                        </div>

                        {/* Quote Box */}
                        <div style={{ display: 'flex', position: 'relative' }}>
                            {/* Vertical Line */}
                            <div style={{
                                width: '4px',
                                minHeight: '60px',
                                backgroundColor: theme.primary,
                                borderRadius: '2px',
                                marginRight: '20px',
                                height: '100%'
                            }} />

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{
                                    fontSize: '22px', // Slightly larger for readability
                                    color: '#ffffff',
                                    fontWeight: 400,
                                    fontStyle: 'italic',
                                    marginBottom: '10px',
                                    lineHeight: '1.4'
                                }}>
                                    "{quote}"
                                </div>

                                <div style={{
                                    fontSize: '12px',
                                    color: `${theme.primary}99`, // 60% opacity
                                    fontWeight: 300
                                }}>
                                    — {footer || (lang === 'es' ? 'Filosofía Personal' : 'Personal Philosophy')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Accent Line */}
            <div style={{
                position: 'absolute',
                bottom: '50px',
                left: '60px',
                right: '60px',
                height: '1px',
                backgroundColor: `${theme.primary}1a`
            }} />
        </div>
    );
};
