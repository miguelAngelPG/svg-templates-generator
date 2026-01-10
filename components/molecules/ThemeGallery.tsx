import React, { useRef, useEffect } from 'react';
import { THEME_PRESETS } from '@/utils/themes';
import { Label } from '../atoms/Label';

interface ThemeGalleryProps {
    selectedTheme: string;
    onSelect: (theme: string) => void;
}

export const ThemeGallery: React.FC<ThemeGalleryProps> = ({ selectedTheme, onSelect }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const selectedRef = useRef<HTMLButtonElement>(null);

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

    return (
        <div className="mb-4">
            <div className="flex justify-between items-baseline mb-2">
                <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Theme Gallery
                </Label>
                <span className="text-[10px] text-gray-600">
                    {THEME_PRESETS.length} presets
                </span>
            </div>

            {/* Horizontal Scrollable Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent snap-x"
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
                            className={`
                                group relative w-10 h-10 rounded-full border-2 transition-all duration-200 shrink-0 snap-center
                                ${isSelected
                                    ? 'border-cyan-400 scale-110 shadow-[0_0_8px_rgba(34,211,238,0.5)] z-10'
                                    : 'border-transparent hover:border-white/30 hover:scale-105'
                                }
                            `}
                            style={{
                                background: isCustom
                                    ? `conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)`
                                    : `linear-gradient(135deg, ${theme.colors[0]} 0%, ${theme.colors[1]} 100%)`
                            }}
                            title={theme.label}
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

                            {/* Tooltip on Hover - Improved positioning */}
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 border border-gray-700 shadow-xl hidden sm:block">
                                {theme.label}
                                {/* Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
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
