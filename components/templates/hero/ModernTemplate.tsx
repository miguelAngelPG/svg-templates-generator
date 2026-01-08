import React from 'react';
import { ThemeColors } from '@/utils/themes';

interface TemplateProps {
    name: string;
    title: string;
    subtitle: string;
    location: string;
    theme: ThemeColors;
}

export const ModernTemplate = ({ name, title, subtitle, location, theme: c }: TemplateProps) => (
    <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#000',
        backgroundImage: c.bgGradient,
        position: 'relative',
        fontFamily: 'Outfit'
    }}>
        {/* Blobs Layer */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', backgroundColor: c.blob1, filter: 'blur(80px)', opacity: 0.3, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', backgroundColor: c.blob2, filter: 'blur(80px)', opacity: 0.3, borderRadius: '50%' }} />

        {/* Content Card */}
        <div style={{
            position: 'relative',
            display: 'flex', flexDirection: 'column',
            padding: '60px',
            width: '700px', height: '320px',
            borderRadius: '32px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            justifyContent: 'center'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '24px', height: '2px', backgroundColor: c.accent }} />
                <span style={{ color: c.accent, fontSize: '14px', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700 }}>PROFILE</span>
            </div>

            <h1 style={{
                fontSize: name.length > 15 ? '48px' : '64px',
                fontWeight: 800, margin: 0, lineHeight: 1, backgroundImage: c.gradient, backgroundClip: 'text', color: 'transparent'
            }}>{name}</h1>
            <div style={{ fontSize: '24px', color: '#e5e7eb', marginTop: '12px' }}>{title}</div>
            <div style={{ fontSize: '16px', color: '#9ca3af', marginTop: '8px' }}>{subtitle}</div>

            <div style={{
                position: 'absolute', bottom: '40px', right: '40px',
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 16px', borderRadius: '100px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                fontSize: '12px', color: '#d1d5db'
            }}>
                <span>📍 {location}</span>
            </div>
        </div>
    </div>
);
