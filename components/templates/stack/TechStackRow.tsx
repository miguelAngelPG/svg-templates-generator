import React, { useEffect, useState } from 'react';

interface TechStackRowProps {
    technologies: string[];
    theme: any; // Theme object
    themeName?: string;
    iconStyle: 'original' | 'monochrome' | 'glass' | 'custom';
    iconColor?: string; // Hex code with hash
    gap: number;
    bgTransparent?: boolean;
}

export const TechStackRow: React.FC<TechStackRowProps> = ({
    technologies,
    theme,
    themeName,
    iconStyle,
    iconColor,
    gap,
    bgTransparent
}) => {
    // We need to fetch the SVG content for the icons to render them properly
    // mirroring the API behavior.
    const [icons, setIcons] = useState<{ slug: string; svg: string }[]>([]);

    useEffect(() => {
        let isMounted = true;
        const fetchIcons = async () => {
            const promises = technologies.map(async (slug) => {
                const cleanSlug = slug.trim().toLowerCase();
                let url = `https://cdn.simpleicons.org/${cleanSlug}`;
                if (iconStyle === 'monochrome') url += '/white';
                if (iconStyle === 'custom' && iconColor) url += `/${iconColor.replace('#', '')}`;

                try {
                    const res = await fetch(url);
                    if (!res.ok) return null;
                    const text = await res.text();
                    return { slug: cleanSlug, svg: text };
                } catch {
                    return null;
                }
            });

            const results = (await Promise.all(promises)).filter(Boolean) as { slug: string; svg: string }[];
            if (isMounted) setIcons(results);
        };

        fetchIcons();

        return () => { isMounted = false; };
    }, [technologies, iconStyle, iconColor]);

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: `${gap}px`,
                padding: '20px',
                position: 'relative',
                width: '100%', // Fit container
                height: '100%'
            }}
        >
            {/* Glass Background (Optional) */}
            {/* Glass Background or Custom Theme BG */}
            {/* Glass Background or Custom Theme BG */}
            {/* Render background UNLESS transparent mode is requested */}
            {!bgTransparent && (iconStyle === 'glass' || theme.bgGradient) && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 'calc(100% - 20px)',
                        height: '80px',
                        // Logic mirroring API:
                        // Glass = transparent accent tint
                        // Custom/Themed = Full gradient or solid
                        background: iconStyle === 'glass'
                            ? (theme.accent ? `${theme.accent}15` : 'rgba(255, 255, 255, 0.05)')
                            : (theme.bgGradient || theme.bg),

                        borderRadius: '50px',
                        border: iconStyle === 'glass' ? `1px solid ${theme.border || 'rgba(255,255,255,0.1)'}` : 'none',
                        boxShadow: iconStyle === 'glass' ? `0 4px 30px ${theme.accent}20` : 'none',
                        backdropFilter: iconStyle === 'glass' ? 'blur(10px)' : 'none',
                        zIndex: 0
                    }}
                />
            )}

            {icons.map((icon, index) => (
                <div
                    key={`${icon.slug}-${index}`}
                    style={{
                        width: '40px',
                        height: '40px',
                        zIndex: 1,
                        filter: iconStyle === 'glass' ? 'drop-shadow(0 0 5px rgba(255,255,255,0.3))' : 'none',
                        // If standard, we just show the SVG.
                        // We use dangerouslySetInnerHTML to render the fetched SVG string
                    }}
                    dangerouslySetInnerHTML={{ __html: icon.svg }}
                />
            ))}
        </div>
    );
};
