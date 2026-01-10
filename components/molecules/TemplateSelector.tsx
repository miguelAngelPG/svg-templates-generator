import React from 'react';
import { LayoutTemplate, User, Zap, Layers, Share2, Gamepad2, Check } from 'lucide-react';
import { TemplateType } from '@/hooks/useTemplateGenerator';

interface TemplateOption {
    id: TemplateType;
    label: string;
    icon: React.ElementType;
    color: string;
}

const TEMPLATE_OPTIONS: TemplateOption[] = [
    { id: 'hero', label: 'Perfil Hero', icon: User, color: 'text-blue-400' },
    { id: 'ultra', label: 'Ultra Component', icon: Zap, color: 'text-yellow-400' },
    { id: 'retro', label: 'Retro Gaming', icon: Gamepad2, color: 'text-green-400' },
    { id: 'stack', label: 'Tech Stack', icon: Layers, color: 'text-purple-400' },
    { id: 'social', label: 'Social Hub', icon: Share2, color: 'text-pink-400' },
    { id: 'advanced', label: 'Marketing Card', icon: LayoutTemplate, color: 'text-cyan-400' },
];

interface TemplateSelectorProps {
    selectedTemplate: TemplateType;
    onSelect: (value: TemplateType) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onSelect }) => {
    return (
        <div className="grid grid-cols-2 gap-2 mb-6">
            {TEMPLATE_OPTIONS.map((option) => {
                const isSelected = selectedTemplate === option.id;
                const Icon = option.icon;

                return (
                    <button
                        key={option.id}
                        onClick={() => onSelect(option.id)}
                        className={`
                            relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 group
                            ${isSelected
                                ? 'bg-white/10 border-white/40 shadow-[0_0_15px_rgba(0,0,0,0.3)]'
                                : 'bg-[#1a1a1a] border-white/5 hover:border-white/20 hover:bg-white/5'
                            }
                        `}
                    >
                        <div className={`mb-2 transition-transform duration-200 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                            <Icon className={`w-6 h-6 ${option.color}`} />
                        </div>
                        <span className={`text-[10px] font-medium uppercase tracking-wider ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                            {option.label}
                        </span>

                        {/* Active Indicator Dot */}
                        {isSelected && (
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_white]" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};
