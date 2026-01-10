import React from 'react';
import { ThemeColors } from '@/utils/themes';

interface RetroTemplateProps {
    style: 'gameboy' | 'rpg';
    txt_1: string;
    txt_2: string;
    img_1?: string;
    theme: ThemeColors;
    onFieldClick?: (field: string) => void;
}

export const RetroTemplate: React.FC<RetroTemplateProps> = ({
    style,
    txt_1,
    txt_2,
    img_1,
    theme,
    onFieldClick
}) => {
    // Fonts (Monospace for retro feel)
    const fontFamily = "'Courier New', Courier, monospace";

    if (style === 'gameboy') {
        const bg = theme.bg || '#8b8b8b'; // Classic Grey/Green
        const screenBg = '#9bbc0f'; // Gameboy Green
        const screenDark = '#0f380f'; // Darkest Green
        const screenLight = '#8bac0f'; // Light Green

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    backgroundColor: bg,
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                    borderBottomRightRadius: '30px',
                    borderBottomLeftRadius: '10px',
                    padding: '20px',
                    boxShadow: 'inset -5px -5px 10px rgba(0,0,0,0.2), 5px 5px 15px rgba(0,0,0,0.5)',
                    position: 'relative',
                    fontFamily
                }}
            >
                {/* Screen Housing */}
                <div style={{
                    backgroundColor: '#555',
                    borderRadius: '10px 10px 30px 10px',
                    padding: '15px 20px',
                    boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '5px',
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: '8px',
                        fontWeight: 'bold'
                    }}>
                        <span>• BATTERY</span>
                    </div>

                    {/* The Screen */}
                    <div style={{
                        width: '100%',
                        height: '140px',
                        backgroundColor: screenBg,
                        boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.2)',
                        display: 'flex',
                        flexDirection: 'row',
                        padding: '10px',
                        gap: '10px',
                        alignItems: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Scanlines / Pixel Grid Effect (CSS Gradient) */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                            backgroundSize: '100% 2px, 3px 100%',
                            pointerEvents: 'none',
                            zIndex: 10
                        }} />

                        {/* Screen Content */}
                        <div style={{
                            flex: 1,
                            backgroundColor: theme.bg,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 20,
                            gap: 15
                        }}>
                            {img_1 && (
                                <img
                                    src={img_1}
                                    width="100"
                                    height="100"
                                    style={{ imageRendering: 'pixelated', cursor: 'pointer' }}
                                    onClick={(e) => { e.stopPropagation(); onFieldClick?.('img_1'); }}
                                />
                            )}
                        </div>
                        <div style={{
                            fontSize: '10px',
                            color: screenDark,
                            fontWeight: 'bold'
                        }}>
                            {txt_2 || 'LVL 1 • READY'}
                        </div>
                    </div>
                </div>
                <div style={{
                    marginTop: '5px',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    letterSpacing: '2px'
                }}>
                    NINTENDO GAME BOY
                </div>


                {/* Controls */}
                <div style={{
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 10px'
                }}>
                    {/* D-Pad */}
                    <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                        <div style={{ position: 'absolute', top: '20px', left: '0', width: '60px', height: '20px', background: '#333', borderRadius: '2px' }}></div>
                        <div style={{ position: 'absolute', top: '0', left: '20px', width: '20px', height: '60px', background: '#333', borderRadius: '2px' }}></div>
                        <div style={{ position: 'absolute', top: '25px', left: '25px', width: '10px', height: '10px', background: '#222', borderRadius: '50%' }}></div>
                    </div>

                    {/* A/B Buttons */}
                    <div style={{ display: 'flex', gap: '10px', transform: 'rotate(-15deg)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '25px', height: '25px', borderRadius: '50%', background: '#8f1c3f', boxShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}></div>
                            <span style={{ fontSize: '8px', color: '#333', fontWeight: 'bold' }}>B</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '-10px' }}>
                            <div style={{ width: '25px', height: '25px', borderRadius: '50%', background: '#8f1c3f', boxShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}></div>
                            <span style={{ fontSize: '8px', color: '#333', fontWeight: 'bold' }}>A</span>
                        </div>
                    </div>
                </div>
            </div >
        );
    }

    // RPG Style
    else if (style === 'rpg') {
        // Classic Blue Box
        const boxBg = 'linear-gradient(180deg, #001144 0%, #0033aa 50%, #001144 100%)';

        return (
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily,
                position: 'relative',
                background: 'transparent' // Outer container transparent
            }}>
                <div style={{
                    width: '95%',
                    height: '90%',
                    background: boxBg,
                    border: '4px solid #ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 0 0 4px #aaaaaa, 0 10px 20px rgba(0,0,0,0.5)',
                    display: 'flex',
                    overflow: 'hidden'
                }}>
                    {/* Portrait */}
                    {img_1 && (
                        <div style={{
                            width: '100px',
                            height: '100%',
                            background: 'rgba(0,0,0,0.2)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRight: '2px solid rgba(255,255,255,0.5)'
                        }}>
                            <img
                                src={img_1}
                                width="80"
                                height="80"
                                style={{
                                    borderRadius: '4px',
                                    border: '2px solid white',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                    )}

                    <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{
                            color: '#aaaaaa',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            textShadow: '2px 2px 0 #000'
                        }}>
                            {txt_1 || 'HERO'}
                        </div>
                        <div style={{
                            color: 'white',
                            fontSize: '18px',
                            lineHeight: '1.4',
                            textShadow: '2px 2px 0 #000'
                        }}>
                            {txt_2 || 'It is dangerous to go alone! Take this.'}
                            <span style={{
                                display: 'inline-block',
                                width: '10px',
                                height: '20px',
                                background: 'white',
                                marginLeft: '5px',
                                animation: 'blink 1s steps(2, start) infinite' // Satori might ignore keyframes but works in browser
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
