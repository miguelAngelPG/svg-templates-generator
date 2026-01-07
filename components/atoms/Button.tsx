import React, { ButtonHTMLAttributes } from 'react';
import { RefreshCw } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost' | 'outline';
    isLoading?: boolean;
    loadingText?: string;
    icon?: React.ReactNode;
}

export function Button({
    children,
    variant = 'primary',
    isLoading,
    loadingText,
    icon,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = "py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-900/20 text-white",
        ghost: "bg-transparent hover:bg-white/5 text-gray-400 hover:text-white",
        outline: "border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading && <RefreshCw className="animate-spin w-5 h-5" />}
            {!isLoading && icon}
            {isLoading && loadingText ? loadingText : children}
        </button>
    );
}
