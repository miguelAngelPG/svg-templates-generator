import React, { ReactNode } from 'react';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: ReactNode;
    href: string;
    color?: string;
}

export function FeatureCard({ title, description, icon, href, color = 'purple' }: FeatureCardProps) {
    const colorClasses = {
        purple: 'text-purple-400 border-purple-900/50 hover:border-purple-500/50 hover:shadow-purple-900/20',
        pink: 'text-pink-400 border-pink-900/50 hover:border-pink-500/50 hover:shadow-pink-900/20',
        cyan: 'text-cyan-400 border-cyan-900/50 hover:border-cyan-500/50 hover:shadow-cyan-900/20',
    };

    return (
        <a
            href={href}
            className={`flex flex-col gap-4 p-6 rounded-xl border border-gray-800 bg-[#111] transition-all hover:-translate-y-1 hover:shadow-xl ${colorClasses[color as keyof typeof colorClasses] || colorClasses.purple}`}
        >
            <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center text-3xl">
                {icon}
            </div>
            <div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </div>
        </a>
    );
}
