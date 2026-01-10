import React, { useRef, useEffect, useState } from 'react';
import { THEME_PRESETS } from '@/utils/themes';
import { Label } from '../atoms/Label';

interface ThemeGalleryProps {
    selectedTheme: string;
    onSelect: (theme: string) => void;
}

export const ThemeGallery: React.FC<ThemeGalleryProps> = ({ selectedTheme, onSelect }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const selectedRef = useRef<HTMLButtonElement>(null);
    const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

    // Auto-scroll to selected theme on mount/change
    useEffect(() => {
        if (selectedRef.current && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const element = selectedRef.current;

            const containerWidth = container.offsetWidth;
            const elementLeft = element.offsetLeft;
            const elementWidth = element.offsetWidth;

            // Center the selected item
            container.scrollTo({
                left: elementLeft - (containerWidth / 2) + (elementWidth / 2),
                behavior: 'smooth'
            });
        }
    }, [selectedTheme]);

    // Find current label
    const currentThemeLabel = THEME_PRESETS.find(t => t.id === selectedTheme)?.label || 'Custom';

    return (
        <div className="mb-4">
            <div className="flex justify-between items-baseline mb-1">
                <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Theme Gallery
                </Label>
                <span className="text-[10px] text-gray-600">
                    {currentThemeLabel}
                </span>
            </div>

            {/* Horizontal Scrollable Container 
                Increased vertical padding to accommodate tooltips and scaling without clipping.
                pt-12 gives room for the top tooltip.
                pb-6 gives room for the bottom shadow and potential scaling.
            */}
            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pt-12 pb-6 px-4 items-center scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent snap-x -mx-2"
                style={{ scrollbarWidth: 'thin' }}
            >
                {THEME_PRESETS.map((theme: { id: string; label: string; colors: string[] }) => {
                    const isSelected = selectedTheme === theme.id;
                    const isCustom = theme.id === 'custom';

                    return (
                        <button
                            key={theme.id}
                            ref={isSelected ? selectedRef : null}
                            onClick={() => onSelect(theme.id)}
                            onMouseEnter={() => setHoveredLabel(theme.label)}
                            onMouseLeave={() => setHoveredLabel(null)}
                            className={`
                                group relative w-10 h-10 rounded-full border-2 transition-all duration-300 shrink-0 snap-center outline-none
                                ${isSelected
                                    ? 'border-cyan-400 scale-125 shadow-[0_0_15px_rgba(34,211,238,0.6)] z-10'
                                    : 'border-white/10 hover:border-white/60 hover:scale-110 hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                                }
                            `}
                            style={{
                                background: isCustom
                                    ? `conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)`
                                    : `linear-gradient(135deg, ${theme.colors[0]} 0%, ${theme.colors[1]} 100%)`
                            }}
                        >
                            {/* Inner Accent Dot / Icon */}
                            {!isCustom && theme.colors[2] && (
                                <div
                                    className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-black/20 shadow-sm"
                                    style={{ backgroundColor: theme.colors[2] }}
                                />
                            )}

                            {isCustom && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                                    <span className="text-[8px] font-bold text-white tracking-tighter">MIX</span>
                                </div>
                            )}

                            {/* Floating Tooltip - Now contained in the padding area */}
                            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl z-20">
                                {theme.label}
                                {/* Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-700"></div>
                            </div>
                        </button>
                    );
                })}
            </div>
            <div className="text-[10px] text-gray-600 text-center mt-1">
                Scroll for more themes &rarr;
            </div>
        </div>
    );
};
