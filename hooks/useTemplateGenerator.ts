import { useState, useEffect } from 'react';

export type TemplateType = 'advanced' | 'hero' | 'ultra' | 'stack' | 'social' | 'philosophy';

export interface AdvancedParams {
    content: string;
    title: string;
    subtitle: string;
    width: number;
    height: number;
    theme: string;
    customColor: string;
    customColor2: string;
    layout: string;
}

export interface HeroParams {
    name: string;
    title: string;
    subtitle: string;
    location: string;
    style: string;
    theme: string;
    customColor: string;
    customColor2: string;
}

export interface UltraParams {
    component: 'stat' | 'quote' | 'card' | 'badge';
    title: string;
    content: string;
    icon: string;
    value: string;
    label: string;
    theme: string;
    customColor: string;
    customColor2: string;
}

export interface StackParams {
    technologies: string[];
    theme: string;
    customColor: string;
    customColor2: string;
    iconStyle: 'original' | 'monochrome' | 'glass' | 'custom';
    iconColor: string;
    gap: number;
    bgTransparent?: boolean;
}

export interface SocialParams {
    platforms: { provider: string; username: string }[];
    style: 'icon-only' | 'badge' | 'card' | 'block' | 'minimal' | 'glass-grid';
    theme: string;
    customColor: string;
    customColor2: string;
}

export interface PhilosophyParams {
    title: string;
    quote: string;
    icon: string;
    lang: 'en' | 'es';
    theme: string;
    customColor: string;
    customColor2: string;
}

export function useTemplateGenerator() {
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('advanced');
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Template Specific States
    const [advancedParams, setAdvancedParams] = useState<AdvancedParams>({
        content: 'Building the future with Next.js',
        title: 'Project Update',
        subtitle: 'Q1 2026 Roadmap',
        width: 800,
        height: 400,
        theme: 'custom', // Default to custom to show color picker potentially or just 'purple-cyan'
        customColor: '#8855ff',
        customColor2: '#ffffff',
        layout: 'center'
    });

    const [heroParams, setHeroParams] = useState<HeroParams>({
        name: 'Miguel A. Pacheco',
        title: 'Tech Lead & Architect',
        subtitle: 'Human first, Engineer second',
        location: 'Hidalgo, MX',
        theme: 'purple-cyan',
        style: 'modern',
        customColor: '#00f2ff',
        customColor2: '#ffffff'
    });

    const [ultraParams, setUltraParams] = useState<UltraParams>({
        component: 'stat',
        title: 'Total Users',
        content: 'Verified Creator 😊',
        icon: '🚀',
        value: '12.5k',
        label: 'Growth',
        theme: 'purple-cyan',
        customColor: '#00f2ff',
        customColor2: '#ffffff'
    });

    const [stackParams, setStackParams] = useState<StackParams>({
        technologies: ['react', 'typescript', 'nextdotjs', 'tailwindcss'],
        theme: 'purple-cyan',
        customColor: '#8855ff',
        customColor2: '#ffffff',
        iconStyle: 'original',
        iconColor: '#ffffff',
        gap: 16,
        bgTransparent: false
    });

    const [socialParams, setSocialParams] = useState<SocialParams>({
        platforms: [
            { provider: 'github', username: 'github' },
            { provider: 'twitter', username: 'twitter' },
            { provider: 'linkedin', username: '' }
        ],
        style: 'badge',
        theme: 'purple-cyan',
        customColor: '#8855ff',
        customColor2: '#ffffff'
    });

    const [philosophyParams, setPhilosophyParams] = useState<PhilosophyParams>({
        title: 'The Person Behind the Code',
        quote: 'Technology is the tool, empathy is the engine.',
        icon: '⚛',
        lang: 'en',
        theme: 'orange-pink',
        customColor: '#ffaa40',
        customColor2: '#ffffff'
    });

    // Debounced Generation
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            let url = '';
            const params = new URLSearchParams();

            if (selectedTemplate === 'advanced') {
                const p = new URLSearchParams();
                p.append('title', advancedParams.title);
                p.append('content', advancedParams.content);
                p.append('subtitle', advancedParams.subtitle);
                p.append('width', String(advancedParams.width));
                p.append('height', String(advancedParams.height));
                p.append('theme', advancedParams.theme);
                p.append('layout', advancedParams.layout);

                if (advancedParams.theme === 'custom') {
                    p.append('customColor', advancedParams.customColor || '#8855ff');
                    const c2 = advancedParams.customColor2 || '#ffffff';
                    p.append('customColor2', c2);
                    p.append('secColor', c2);
                }

                url = `/api/custom/advanced?${p.toString()}&t=${Date.now()}`;

            } else if (selectedTemplate === 'hero') {
                const p = new URLSearchParams();
                p.append('name', heroParams.name);
                p.append('title', heroParams.title);
                p.append('subtitle', heroParams.subtitle);
                p.append('location', heroParams.location);
                p.append('style', heroParams.style);
                p.append('theme', heroParams.theme);

                if (heroParams.theme === 'custom') {
                    p.append('customColor', heroParams.customColor || '#00f2ff');
                    const c2 = heroParams.customColor2 || '#ffffff';
                    p.append('customColor2', c2);
                    p.append('secColor', c2);
                }

                url = `/api/templates/hero?${p.toString()}&t=${Date.now()}`;

            } else if (selectedTemplate === 'ultra') {
                const p = new URLSearchParams();
                p.append('component', ultraParams.component);
                p.append('title', ultraParams.title);
                p.append('content', ultraParams.content);
                p.append('icon', ultraParams.icon);
                p.append('value', ultraParams.value);
                p.append('label', ultraParams.label);
                p.append('theme', ultraParams.theme);

                if (ultraParams.theme === 'custom') {
                    p.append('customColor', ultraParams.customColor || '#00f2ff');
                    const c2 = ultraParams.customColor2 || '#ffffff';
                    p.append('customColor2', c2);
                    p.append('secColor', c2);
                }

                url = `/api/custom/ultra?${p.toString()}&t=${Date.now()}`;

            } else if (selectedTemplate === 'stack') {
                const p = new URLSearchParams();
                p.append('technologies', stackParams.technologies.join(','));
                p.append('theme', stackParams.theme);
                p.append('iconStyle', stackParams.iconStyle);
                p.append('iconColor', stackParams.iconColor.replace('#', '')); // Send without hash
                p.append('gap', String(stackParams.gap));
                if (stackParams.bgTransparent) p.append('bgTransparent', 'true');

                if (stackParams.theme === 'custom') {
                    p.append('customColor', stackParams.customColor || '#8855ff');
                    const c2 = stackParams.customColor2 || '#ffffff';
                    p.append('customColor2', c2);
                    p.append('secColor', c2);
                }

                url = `/api/custom/stack?${p.toString()}&t=${Date.now()}`;
            } else if (selectedTemplate === 'social') {
                const p = new URLSearchParams();
                const validPlatforms = socialParams.platforms.filter(p => p.provider.trim() !== '');
                const platformString = validPlatforms.map(pt => `${pt.provider}:${pt.username}`).join(',');

                p.append('platforms', platformString);
                p.append('style', socialParams.style);
                p.append('theme', socialParams.theme);

                if (socialParams.theme === 'custom') {
                    p.append('customColor', socialParams.customColor || '#8855ff');
                    const c2 = socialParams.customColor2 || '#ffffff';
                    p.append('customColor2', c2);
                    p.append('secColor', c2);
                }

                url = `/api/custom/social?${p.toString()}&t=${Date.now()}`;
            } else if (selectedTemplate === 'philosophy') {
                const p = new URLSearchParams();
                p.append('title', philosophyParams.title);
                p.append('quote', philosophyParams.quote);
                p.append('icon', philosophyParams.icon);
                p.append('lang', philosophyParams.lang);
                p.append('theme', philosophyParams.theme);

                if (philosophyParams.theme === 'custom') {
                    p.append('customColor', philosophyParams.customColor || '#ffaa40');
                    const c2 = philosophyParams.customColor2 || '#ffffff';
                    p.append('customColor2', c2);
                    p.append('secColor', c2);
                }

                url = `/api/templates/philosophy?${p.toString()}&t=${Date.now()}`;
            }

            setGeneratedUrl(url);
            // Artificial delay
            setTimeout(() => setIsLoading(false), 300);
        }, 500);

        return () => clearTimeout(timer);
    }, [selectedTemplate, advancedParams, heroParams, ultraParams, stackParams, socialParams, philosophyParams]);

    return {
        selectedTemplate,
        setSelectedTemplate,
        generatedUrl,
        isLoading,
        // State Accessors
        advancedParams, setAdvancedParams,
        heroParams, setHeroParams,
        ultraParams, setUltraParams,
        stackParams, setStackParams,
        socialParams, setSocialParams,
        philosophyParams, setPhilosophyParams
    };
}
