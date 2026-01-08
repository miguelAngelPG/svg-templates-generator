import React from 'react';

interface UltraBadgeProps {
    title: string;
    content?: string;
    icon: string;
    value: string;
    theme: any;
}

export const UltraBadge: React.FC<UltraBadgeProps> = ({ title, content, icon, value, theme }) => {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            background: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Outfit, sans-serif'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '12px 16px 12px 12px',
                background: '#09090b',
                border: `1px solid ${theme.border}`,
                borderRadius: '100px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
            }}>
                {/* Icon Circle */}
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: theme.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    color: '#000',
                    flexShrink: 0
                }}>
                    {icon}
                </div>

                {/* Text Block */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingRight: '12px' }}>
                    <div style={{
                        fontSize: '13px',
                        color: theme.secondary,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        {title}
                    </div>
                    <div style={{
                        fontSize: '20px',
                        fontWeight: 800,
                        color: theme.text,
                        lineHeight: 1
                    }}>
                        {value}
                    </div>
                </div>

                {content && (
                    <>
                        <div style={{ width: '1px', height: '32px', background: theme.border }} />
                        <div style={{
                            fontSize: '14px',
                            color: theme.secondary,
                            paddingRight: '12px',
                            maxWidth: '120px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {content}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
