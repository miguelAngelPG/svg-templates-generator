import React from 'react';
import { ThemeColors } from '@/utils/themes';

interface TerminalTemplateProps {
    name: string;
    title: string;
    subtitle: string;
    location: string;
    theme: ThemeColors;
}

export const TerminalTemplate: React.FC<TerminalTemplateProps> = ({ name, title, subtitle, location, theme }) => {
    // Terminal constants
    const windowHeaderHeight = 30;
    const width = 800;
    const height = 400;

    return (
        <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: theme.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Courier New', Courier, monospace", // Monospace fallback
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Gradient/Noise placeholder */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: `radial-gradient(circle at 80% 80%, ${theme.blob2}20 0%, transparent 40%), radial-gradient(circle at 20% 20%, ${theme.blob1}20 0%, transparent 40%)`
            }} />

            {/* Terminal Window */}
            <div style={{
                width: '600px',
                height: '320px',
                backgroundColor: '#1a1b26', // Deep terminal dark (Tokyo Night style or similar)
                borderRadius: '8px',
                boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px ${theme.border || 'rgba(255,255,255,0.1)'}`,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 10
            }}>
                {/* Window Header */}
                <div style={{
                    height: `${windowHeaderHeight}px`,
                    backgroundColor: '#1f2937', // Slightly lighter header
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    gap: '8px'
                }}>
                    {/* Traffic Lights */}
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} /> {/* Close */}
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} /> {/* Minimize */}
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} /> {/* Maximize */}

                    {/* Title */}
                    <div style={{
                        flex: 1,
                        textAlign: 'center',
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: '12px',
                        fontFamily: 'sans-serif',
                        marginTop: '-2px' // Visual optical adjustment
                    }}>bash — 80x24</div>
                </div>

                {/* Terminal Content */}
                <div style={{
                    padding: '20px',
                    color: '#a9b1d6',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }}>
                    {/* Line 1: Whoami */}
                    <div style={{ display: 'flex' }}>
                        <span style={{ color: theme.blob1 || '#7aa2f7' }}>visitor@portfolio</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 8px' }}>:</span>
                        <span style={{ color: theme.accent || '#bb9af7' }}>~</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 8px' }}>$</span>
                        <span style={{ color: '#fff' }}>whoami</span>
                    </div>
                    <div style={{ color: theme.accent, fontWeight: 'bold', marginLeft: '0px' }}>
                        {name}
                    </div>

                    {/* Line 2: Role */}
                    <div style={{ display: 'flex', marginTop: '10px' }}>
                        <span style={{ color: theme.blob1 || '#7aa2f7' }}>visitor@portfolio</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 8px' }}>:</span>
                        <span style={{ color: theme.accent || '#bb9af7' }}>~</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 8px' }}>$</span>
                        <span style={{ color: '#fff' }}>cat current_role.txt</span>
                    </div>
                    <div style={{ color: '#fff', marginLeft: '0px' }}>
                        {title}
                        {subtitle && <span style={{ opacity: 0.7 }}> // {subtitle}</span>}
                    </div>

                    {/* Line 3: Location */}
                    <div style={{ display: 'flex', marginTop: '10px' }}>
                        <span style={{ color: theme.blob1 || '#7aa2f7' }}>visitor@portfolio</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 8px' }}>:</span>
                        <span style={{ color: theme.accent || '#bb9af7' }}>~</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 8px' }}>$</span>
                        <span style={{ color: '#fff' }}>echo $LOCATION</span>
                    </div>
                    <div>
                        "{location}"
                    </div>

                    {/* Cursor */}
                    <div style={{ display: 'flex', marginTop: '10px' }}>
                        <span style={{ color: theme.blob1 || '#7aa2f7' }}>visitor@portfolio</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 8px' }}>:</span>
                        <span style={{ color: theme.accent || '#bb9af7' }}>~</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 8px' }}>$</span>

                        {/* Blinking Cursor Block */}
                        <div style={{
                            width: '10px',
                            height: '20px',
                            backgroundColor: '#fff',
                            marginLeft: '8px',
                            animation: 'blink 1s step-end infinite'
                        }} />
                        <style>
                            {`
                                @keyframes blink {
                                    0%, 100% { opacity: 1; }
                                    50% { opacity: 0; }
                                }
                            `}
                        </style>
                    </div>
                </div>
            </div>
        </div>
    );
};
