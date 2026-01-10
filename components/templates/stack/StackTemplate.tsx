import React from 'react';
import { ThemeColors } from '@/utils/themes';

interface StackTemplateProps {
    icons: { slug: string; svg: string }[];
    theme: ThemeColors;
    iconStyle: 'original' | 'monochrome' | 'glass' | 'custom';
    gap: number;
    bgTransparent?: boolean;
}

export const StackTemplate: React.FC<StackTemplateProps> = ({
    icons,
    theme,
    iconStyle,
    gap,
    bgTransparent
}) => {
    // Shared Layout Dimensions
    const iconSize = 40;
    const padding = 20;

    // We calculate width based on content if needed, but for flex container 
    // we often let the parent decide or use 100%. 
    // Here we ensure the inner content fits the requested gap.

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%', // Adjust to parent
                background: 'transparent',
                gap: `${gap}px`,
                padding: `${padding}px`,
                position: 'relative' // For absolute bg
            }}
        >
            {/* Background */}
            {!bgTransparent && (iconStyle === 'glass' || theme.bgGradient) && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 'calc(100% - 20px)', // Slightly smaller than container for visual flair
                        height: '80px',
                        background: iconStyle === 'glass'
                            ? (theme.accent ? `${theme.accent}15` : 'rgba(255, 255, 255, 0.05)')
                            : (theme.bgGradient || theme.bg),
                        borderRadius: '50px',
                        border: iconStyle === 'glass' ? `1px solid ${theme.border || 'rgba(255,255,255,0.1)'}` : 'none',
                        boxShadow: iconStyle === 'glass' ? `0 4px 30px ${theme.accent}20` : 'none',
                        backdropFilter: iconStyle === 'glass' ? 'blur(10px)' : 'none', // Works in Browser, ignored in Satori (Satori needs pure SVG or filter injection)
                        zIndex: 0
                    }}
                />
            )}

            {icons.map((icon, index) => (
                <div
                    key={`${icon.slug}-${index}`}
                    style={{
                        display: 'flex',
                        width: `${iconSize}px`,
                        height: `${iconSize}px`,
                        zIndex: 1,
                        // Drop shadow filter works in some SVG renderers, Satori supports filter prop on elements
                        filter: iconStyle === 'glass' ? 'drop-shadow(0 0 5px rgba(255,255,255,0.3))' : 'none'
                    }}
                >
                    {/* 
                      Satori requires base64 images for reliable external SVGs if they are not simple paths.
                      However, since we have the SVG string, we can try rendering it as a data URI image
                      which provides maximum compatibility for both Browser and Satori.
                    */}
                    <img
                        src={`data:image/svg+xml;base64,${typeof window !== 'undefined' ? btoa(icon.svg) : Buffer.from(icon.svg).toString('base64')}`}
                        width={iconSize}
                        height={iconSize}
                        style={{
                            objectFit: 'contain'
                        }}
                        alt={icon.slug}
                    />
                </div>
            ))}
        </div>
    );
};
