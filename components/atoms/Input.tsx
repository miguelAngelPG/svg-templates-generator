import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    fullWidth?: boolean;
}

export function Input({ className = '', fullWidth, ...props }: InputProps) {
    return (
        <input
            className={`bg-[#222] rounded px-2 py-1 text-sm border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors text-white ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        />
    );
}
