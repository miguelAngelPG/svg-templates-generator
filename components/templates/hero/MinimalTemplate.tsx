import React from 'react';
import { ThemeColors } from '@/utils/themes';

interface TemplateProps {
    name: string;
    title: string;
    subtitle: string;
    location: string;
    theme: ThemeColors;
}

export const MinimalTemplate = ({ name, title, subtitle, location, theme: c }: TemplateProps) => (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: c.bg, fontFamily: 'Inter', padding: '60px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {/* NOW COLORFUL: Name uses Theme Accent */}
            <h1 style={{
                fontSize: name.length > 12 ? '48px' : '72px',
                fontWeight: 900, lineHeight: 0.9, letterSpacing: '-2px', textTransform: 'uppercase', maxWidth: '600px', color: c.accent
            }}>{name}</h1>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: `2px solid ${c.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: c.accent }}>👋</div>
        </div>

        <div style={{ width: '100%', height: '4px', backgroundColor: c.accent, margin: '40px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>{title}</span>
                <span style={{ fontSize: '16px', color: '#888' }}>{subtitle}</span>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, opacity: 0.5, color: c.accent }}>{location.toUpperCase()}</div>
        </div>
    </div>
);
