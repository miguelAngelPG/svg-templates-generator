import React from 'react';

interface UltraCardProps {
    title: string;
    content: string;
    icon: string;
    theme: any;
}

export const UltraCard: React.FC<UltraCardProps> = ({ title, content, icon, theme }) => {
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
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: `linear-gradient(90deg, ${theme.accent}, ${theme.blob1})` }} />

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '50px',
                width: '85%',
                height: '80%',
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${theme.border}`,
                borderRadius: '20px',
                justifyContent: 'space-between',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '20px'
                    }}>
                        <div style={{
                            width: '56px', height: '56px',
                            background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))`,
                            borderRadius: '14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '28px',
                            border: `1px solid ${theme.border}`,
                            color: theme.accent
                        }}>
                            {icon}
                        </div>
                        <div style={{
                            padding: '6px 12px',
                            background: `${theme.accent}15`,
                            borderRadius: '20px',
                            fontSize: '12px',
                            color: theme.accent,
                            fontWeight: 700,
                            border: `1px solid ${theme.accent}30`
                        }}>
                            FEATURE
                        </div>
                    </div>

                    <div style={{ fontSize: '32px', fontWeight: 800, color: theme.text, marginBottom: '12px', lineHeight: 1.2 }}>
                        {title}
                    </div>

                    <div style={{ fontSize: '18px', color: theme.secondary, lineHeight: 1.5, fontWeight: 400 }}>
                        {content}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: theme.text, opacity: 0.8, fontWeight: 600 }}>
                    Export now <span style={{ color: theme.accent }}>→</span>
                </div>
            </div>
        </div>
    );
};
