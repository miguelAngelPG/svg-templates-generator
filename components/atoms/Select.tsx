import React, { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    fullWidth?: boolean;
}

export function Select({ className = '', fullWidth, children, ...props }: SelectProps) {
    return (
        <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
            <select
                className={`bg-[#222] appearance-none rounded px-3 py-2 pr-8 text-sm border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors text-white ${fullWidth ? 'w-full' : ''} ${className}`}
                {...props}
            >
                {children}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
    );
}
