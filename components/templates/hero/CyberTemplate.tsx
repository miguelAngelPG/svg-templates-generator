import React from 'react';
import { ThemeColors } from '@/utils/themes';

interface TemplateProps {
    name: string;
    title: string;
    subtitle: string;
    location: string;
    theme: ThemeColors;
}

export const CyberTemplate = ({ name, title, subtitle, location, theme: c }: TemplateProps) => {
    const gridColor = `${c.accent}40`; // Increased opacity for visibility
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: c.bg, fontFamily: 'Space Mono', color: c.accent, overflow: 'hidden', position: 'relative' }}>
            {/* Grid Background */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', border: `2px solid ${c.accent}`, padding: '40px', backgroundColor: 'rgba(0,0,0,0.85)', boxShadow: `10px 10px 0px ${c.accent}40`, position: 'relative', zIndex: 10 }}>
                <div style={{ position: 'absolute', top: '-12px', left: '20px', backgroundColor: c.bg, padding: '0 10px', fontSize: '12px', fontWeight: 700, border: `1px solid ${c.accent}`, color: c.accent }}>SYSTEM.USER_PROFILE</div>

                <h1 style={{ fontSize: '48px', fontWeight: 700, margin: '0 0 20px 0', textShadow: `2px 2px 0px ${c.accent}80` }}>{'>'} {name}</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '16px' }}>
                    <div style={{ display: 'flex' }}>
                        <span style={{ opacity: 0.5, marginRight: '16px' }}>ROLE::</span>
                        <span>{title}</span>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <span style={{ opacity: 0.5, marginRight: '16px' }}>LOC::</span>
                        <span>{location}</span>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <span style={{ opacity: 0.5, marginRight: '16px' }}>STATUS::</span>
                        <span style={{ color: c.blob1 }}>ONLINE</span>
                    </div>
                </div>

                <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '20px', height: '20px', backgroundColor: c.accent }} />
            </div>
        </div>
    );
}
