import React from 'react';
import { THEME_PRESETS } from '@/utils/themes';
import { Label } from '../atoms/Label';

interface ThemeGalleryProps {
    selectedTheme: string;
    onSelect: (theme: string) => void;
}

export const ThemeGallery: React.FC<ThemeGalleryProps> = ({ selectedTheme, onSelect }) => {
    return (
        <div className="mb-4">
            <Label>Theme Gallery</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
                {THEME_PRESETS.map((theme: { id: string; label: string; colors: string[] }) => {
                    const isSelected = selectedTheme === theme.id;

                    return (
                        <button
                            key={theme.id}
                            onClick={() => onSelect(theme.id)}
                            className={`
                                group relative w-full aspect-square rounded-full border-2 transition-all duration-200
                                ${isSelected
                                    ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                                    : 'border-transparent hover:border-white/50 hover:scale-105'
                                }
                            `}
                            style={{
                                background: `linear-gradient(135deg, ${theme.colors[0]} 0%, ${theme.colors[1]} 100%)`
                            }}
                            title={theme.label}
                        >
                            {/* Inner Accent Dot */}
                            {theme.colors[2] && (
                                <div
                                    className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-black/20"
                                    style={{ backgroundColor: theme.colors[2] }}
                                />
                            )}

                            {/* Tooltip on Hover */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-white/10">
                                {theme.label}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
