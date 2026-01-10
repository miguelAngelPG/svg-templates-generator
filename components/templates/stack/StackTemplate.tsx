import React from 'react';

interface StackTemplateProps {
    itemsArray: string[];
    detailsArray: string[];
    iconsArray: string[];
    theme: {
        primary: string;
        secondary: string;
        accent: string;
    };
}

export const StackTemplate = ({
    itemsArray,
    detailsArray,
    iconsArray,
    theme
}: StackTemplateProps) => {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#050505',
            padding: '20px',
            fontFamily: 'Outfit',
            position: 'relative',
        }}>
            {/* Glass Panel Background */}
            <div style={{
                position: 'absolute',
                top: 20, left: 20, right: 20, bottom: 20,
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                // Shadow would be simulated here or via filter injection
            }} />

            {/* Header */}
            <div style={{
                display: 'flex',
                padding: '0 25px',
                marginBottom: '15px',
                zIndex: 10,
                alignItems: 'center'
            }}>
                <div style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    // Gradient text fallback
                    color: theme.primary
                }}>
                    🛠️ Tech Arsenal
                </div>
            </div>

            {/* Grid Items Container */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '15px', // Gap between items
                padding: '0 25px',
                zIndex: 10
            }}>
                {itemsArray.map((item, index) => {
                    const icon = iconsArray[index] || '⚡';
                    const detail = detailsArray[index] || 'Tech Stack';

                    return (
                        <div key={index} style={{
                            display: 'flex',
                            width: '165px',
                            height: '90px',
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            border: `1px solid ${theme.primary}26`, // 0.15 opacity hex approx
                            borderRadius: '12px',
                            padding: '12px',
                            position: 'relative',
                            // The animations (fade in) will be handled by styles injection targeting classes if possible, 
                            // or just implicitly via the static render likely.
                        }}>
                            {/* Icon Section */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                marginRight: '10px'
                            }}>
                                <div style={{ fontSize: '28px' }}>{icon}</div>
                            </div>

                            {/* Text Section */}
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{
                                    fontSize: '14px',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    marginBottom: '4px'
                                }}>
                                    {item.trim()}
                                </div>
                                <div style={{
                                    fontSize: '10px',
                                    color: '#666666',
                                    fontWeight: 400
                                }}>
                                    {detail.trim().split('|').join(', ')}
                                </div>
                            </div>

                            {/* Accent Dot */}
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                width: '4px',
                                height: '4px',
                                borderRadius: '50%',
                                backgroundColor: theme.accent,
                                opacity: 0.6
                            }} />
                        </div>
                    );
                })}
            </div>

            {/* Decorative Line */}
            <div style={{
                position: 'absolute',
                top: '55px',
                left: '45px',
                right: '45px',
                height: '1px',
                backgroundColor: 'rgba(255,255,255,0.05)'
            }} />
        </div>
    );
};
