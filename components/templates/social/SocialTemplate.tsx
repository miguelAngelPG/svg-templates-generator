import React from 'react';
import { SocialPlatform } from '@/utils/social-icons';
import { ThemeColors } from '@/utils/themes';

export interface SocialTemplateProps {
    platforms: SocialPlatform[];
    style: 'badge' | 'card' | 'block' | 'minimal' | 'glass-grid' | 'icon-only';
    theme: ThemeColors;
}

export const SocialTemplate: React.FC<SocialTemplateProps> = ({ platforms, style, theme: t }) => {

    // NOTE: Satori requires explicit inline styles (flexbox).
    // Avoid short-hand properties like 'flex: 1' if possible, prefer 'display: flex'.
    // Avoid non-standard CSS properties.

    if (style === 'badge') {
        const gap = 12;
        const padding = 20;

        return (
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                gap: `${gap}px`,
                padding: `${padding}px`,
                background: 'transparent'
            }}>
                {platforms.map((p, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px 12px',
                        background: t.bgGradient ? 'rgba(255,255,255,0.1)' : `${t.accent}20`,
                        border: `1px solid ${t.border || t.accent}`,
                        borderRadius: '8px',
                        gap: '8px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{
                            display: 'flex',
                            width: '20px',
                            height: '20px'
                        }}>
                            {/* Safe SVG injection for Satori */}
                            {p.svg && (
                                <img
                                    src={`data:image/svg+xml;base64,${Buffer.from(p.svg).toString('base64')}`}
                                    width={20}
                                    height={20}
                                />
                            )}
                        </div>
                        <span style={{
                            color: '#fff',
                            fontSize: '14px',
                            fontFamily: 'Inter',
                            fontWeight: 500,
                            whiteSpace: 'nowrap'
                        }}>
                            {p.username || p.provider}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    if (style === 'card') {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                background: t.bgGradient || '#1a1a1a',
                borderRadius: '16px',
                padding: '24px',
                border: `1px solid ${t.border || '#333'}`,
                boxShadow: `0 10px 40px ${t.accent}40`,
                color: '#fff'
            }}>
                <div style={{ fontSize: '12px', color: t.accent, marginBottom: '16px', fontWeight: 600, letterSpacing: '1px' }}>
                    CONNECT WITH ME
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {platforms.map((p, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '8px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '8px'
                        }}>
                            <div style={{ width: '24px', height: '24px', display: 'flex' }}>
                                {p.svg && (
                                    <img
                                        src={`data:image/svg+xml;base64,${Buffer.from(p.svg).toString('base64')}`}
                                        width={24}
                                        height={24}
                                    />
                                )}
                            </div>
                            <span style={{ fontFamily: 'Inter', fontSize: '14px' }}>
                                {p.username || p.provider}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (style === 'block') {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                gap: '12px'
            }}>
                {platforms.map((p, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '48px',
                        background: t.bgGradient ? 'rgba(255,255,255,0.08)' : `${t.accent}15`,
                        border: `1px solid ${t.accent}40`,
                        borderRadius: '50px',
                        gap: '12px',
                        // cursor: 'pointer', // No cursor in SVG
                    }}>
                        <div style={{ width: '20px', height: '20px', display: 'flex' }}>
                            {p.svg && <img src={`data:image/svg+xml;base64,${Buffer.from(p.svg).toString('base64')}`} width={20} height={20} />}
                        </div>
                        <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600, fontFamily: 'Inter' }}>
                            {p.username || p.provider}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    if (style === 'minimal') {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                gap: '16px',
                padding: '20px'
            }}>
                {platforms.map((p, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}>
                        <div style={{ width: '18px', height: '18px', display: 'flex', opacity: 0.8 }}>
                            {p.svg && <img src={`data:image/svg+xml;base64,${Buffer.from(p.svg).toString('base64')}`} width={18} height={18} />}
                        </div>
                        <span style={{ color: t.accent || '#ccc', fontSize: '14px', fontFamily: 'Inter', fontWeight: 500 }}>
                            / {p.username || p.provider}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    if (style === 'glass-grid') {
        return (
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                width: '100%',
                height: '100%',
                padding: '20px',
                gap: '16px',
                justifyContent: 'center'
            }}>
                {platforms.map((p, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '210px',
                        height: '90px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ width: '28px', height: '28px', display: 'flex' }}>
                            {p.svg && <img src={`data:image/svg+xml;base64,${Buffer.from(p.svg).toString('base64')}`} width={28} height={28} />}
                        </div>
                        <span style={{ color: '#aaa', fontSize: '12px', fontFamily: 'Inter' }}>
                            {p.username || p.provider}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    // Default: Icon Only
    const iconSize = 40;
    const gap = 16;
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            gap: `${gap}px`
        }}>
            {platforms.map((p, i) => (
                <div key={i} style={{
                    width: `${iconSize}px`,
                    height: `${iconSize}px`,
                    display: 'flex',
                    // Note: 'color' filter is not supported easily for inline base64 images in Satori
                }}>
                    {p.svg && (
                        <img
                            src={`data:image/svg+xml;base64,${Buffer.from(p.svg).toString('base64')}`}
                            width={iconSize}
                            height={iconSize}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};
