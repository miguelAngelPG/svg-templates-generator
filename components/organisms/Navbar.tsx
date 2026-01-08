'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Image as ImageIcon, Play, LayoutTemplate } from 'lucide-react';

export function Navbar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { name: 'Home', path: '/', icon: <Home className="w-4 h-4" /> },
        { name: 'GIF Studio', path: '/gif-studio', icon: <Play className="w-4 h-4" /> },
        { name: 'SVG Generator', path: '/generator', icon: <ImageIcon className="w-4 h-4" /> },
        { name: 'Templates', path: '/templates', icon: <LayoutTemplate className="w-4 h-4" /> },
    ];

    return (
        <nav className="border-b border-gray-800 bg-black/80 backdrop-blur-md shrink-0">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-xs">TC</span>
                    </div>
                    <span className="hidden sm:inline">Templates Chonchos</span>
                </div>

                <div className="flex items-center gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                                ${isActive(item.path)
                                    ? 'bg-white/10 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }
                            `}
                        >
                            {item.icon}
                            <span className={`${item.path === '/' ? 'hidden sm:inline' : ''}`}>{item.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
