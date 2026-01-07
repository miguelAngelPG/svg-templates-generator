import React from 'react';
import { Label } from '../atoms/Label';

interface CodeEditorProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function CodeEditor({ label, value, onChange, className = '' }: CodeEditorProps) {
    return (
        <div className={`flex flex-col gap-2 bg-[#111] border border-gray-800 rounded-lg p-4 ${className}`}>
            <Label>{label}</Label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 bg-transparent resize-none focus:outline-none font-mono text-sm text-gray-300 min-h-[150px]"
                spellCheck={false}
            />
        </div>
    );
}
