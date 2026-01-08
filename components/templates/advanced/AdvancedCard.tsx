import React from 'react';

interface AdvancedCardProps {
    title: string;
    content: string;
    subtitle: string;
    width: number;
    height: number;
    theme: any; // Theme object from getTheme
    layout: string;
}

export const AdvancedCard: React.FC<AdvancedCardProps> = ({
    title, content, subtitle, width, height, theme, layout
}) => {

    // Local Theme Mapping (simulating route logic)
    const currentTheme = {
        bg: theme.bg,
        bgGradient: theme.bgGradient,
        text: '#ffffff',
        accent: theme.accent,
        secondary: 'rgba(255, 255, 255, 0.6)',
        border: theme.border || 'rgba(255, 255, 255, 0.1)',
    };

    const layouts: Record<string, any> = {
        center: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
        },
        left: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            textAlign: 'left',
            paddingLeft: '60px',
        },
        card: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            padding: '40px',
        },
    };

    const currentLayout = layouts[layout] || layouts.center;

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                backgroundColor: currentTheme.bg,
                backgroundImage: currentTheme.bgGradient,
                color: currentTheme.text,
                fontFamily: 'Inter, sans-serif',
                position: 'relative',
                overflow: 'hidden' // Ensure blobs don't overflow in preview
            }}
        >
            {/* Background Blobs */}
            <div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: `radial-gradient(circle at 30% 20%, ${theme.blob1}20 0%, transparent 50%)`,
                    zIndex: 0
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '80%',
                    height: '80%',
                    background: `radial-gradient(circle at 80% 80%, ${theme.blob2}15 0%, transparent 50%)`,
                    zIndex: 0
                }}
            />

            {/* Main Content */}
            <div
                style={{
                    ...currentLayout,
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Title */}
                {title && (
                    <div
                        style={{
                            fontSize: '48px',
                            fontWeight: 'bold',
                            marginBottom: '20px',
                            background: theme.gradient,
                            backgroundClip: 'text',
                            color: 'transparent',
                            // Fallback for backgroundClip text in some contexts if needed, but standard browsers support it
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        {title}
                    </div>
                )}

                {/* Content */}
                <div
                    style={{
                        fontSize: '32px',
                        fontWeight: '600',
                        marginBottom: subtitle ? '15px' : '0',
                        color: currentTheme.text,
                    }}
                >
                    {content}
                </div>

                {/* Subtitle */}
                {subtitle && (
                    <div
                        style={{
                            fontSize: '20px',
                            color: currentTheme.secondary,
                            fontWeight: '400',
                        }}
                    >
                        {subtitle}
                    </div>
                )}

                {/* Accent Line (Card Layout) */}
                {layout === 'card' && (
                    <div
                        style={{
                            width: '100px',
                            height: '4px',
                            background: currentTheme.accent,
                            marginTop: '30px',
                            borderRadius: '2px',
                        }}
                    />
                )}
            </div>

            {/* Border (Card Layout) */}
            {layout === 'card' && (
                <div
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        right: '20px',
                        bottom: '20px',
                        border: `1px solid ${currentTheme.border}`,
                        borderRadius: '20px',
                        pointerEvents: 'none',
                    }}
                />
            )}
        </div>
    );
};
