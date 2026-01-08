import React from 'react';
import { Label } from '../atoms/Label';
import { Input } from '../atoms/Input';

interface ConfigFieldProps {
    label: string;
    value: number | string;
    onChange: (val: any) => void;
    type?: 'text' | 'number' | 'color';
    suffix?: React.ReactNode;
}

export function ConfigField({ label, value, onChange, type = 'text', suffix }: ConfigFieldProps) {
    return (
        <div className="">
            <Label>{label}</Label>
            <div className="flex gap-2 items-center">
                <Input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
                    fullWidth
                />
                {suffix && <span className="text-gray-600 text-sm">{suffix}</span>}
            </div>
        </div>
    );
}
