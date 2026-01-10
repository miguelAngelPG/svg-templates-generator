import { useState, useEffect } from 'react';

export type TemplateType = 'advanced' | 'hero' | 'ultra' | 'stack' | 'social';

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
    cardVariation?: 'default' | 'impact';
    quoteVariation?: 'default' | 'philosophy';
    title: string;
    content: string;
    icon: string;
    value: string;
    label: string;
    theme: string;
    customColor: string;
    customColor2: string;

    // Optional fields for 'impact' variation
    company?: string;
    year?: string;
    tech?: string;
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
        cardVariation: 'default',
        quoteVariation: 'default',
        title: '750+',
        content: 'Commits in 2024',
        icon: '🚀',
        value: '12.5k',
        label: 'Growth',
        theme: 'purple-cyan',
        customColor: '#00f2ff',
        customColor2: '#ffffff',
        // Defaults for impact
        company: 'Tech Corp',
        year: '2024',
        tech: 'React,Next.js,AWS'
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

                // If it's the specific "Impact" variation of card, we route to the impact API 
                // but map UltraParams to what Impact expects
                if (ultraParams.component === 'card' && ultraParams.cardVariation === 'impact') {
                    // Re-clean params for proper query string
                    const pImp = new URLSearchParams();
                    pImp.append('company', ultraParams.company || 'Tech Corp');
                    pImp.append('role', ultraParams.title); // Title = Role
                    pImp.append('year', ultraParams.year || '2024');
                    pImp.append('stat', ultraParams.value); // Value = Stat
                    pImp.append('desc', ultraParams.label); // Label = Stat Label
                    pImp.append('description', ultraParams.content); // Content = Description
                    pImp.append('tech', ultraParams.tech || '');
                    pImp.append('logo', ultraParams.icon); // Icon = Logo
                    pImp.append('theme', ultraParams.theme);

                    if (ultraParams.theme === 'custom') {
                        pImp.append('customColor', ultraParams.customColor || '#00f2ff');
                        const c2 = ultraParams.customColor2 || '#ffffff';
                        pImp.append('customColor2', c2);
                    }

                    url = `/api/templates/impact?${pImp.toString()}&t=${Date.now()}`;

                } else if (ultraParams.component === 'quote' && ultraParams.quoteVariation === 'philosophy') {
                    // Route to Philosophy API
                    const pPhil = new URLSearchParams();
                    pPhil.append('title', ultraParams.title);
                    pPhil.append('quote', ultraParams.content); // Content = Quote
                    pPhil.append('icon', ultraParams.icon);
                    pPhil.append('footer', ultraParams.label); // Label = Footer
                    pPhil.append('theme', ultraParams.theme);

                    if (ultraParams.theme === 'custom') {
                        pPhil.append('customColor', ultraParams.customColor || '#ffaa40');
                        const c2 = ultraParams.customColor2 || '#ffffff';
                        pPhil.append('customColor2', c2);
                    }

                    url = `/api/templates/philosophy?${pPhil.toString()}&t=${Date.now()}`;
                } else {
                    url = `/api/custom/ultra?${p.toString()}&t=${Date.now()}`;
                }

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
            }

            setGeneratedUrl(url);
            // Artificial delay
            setTimeout(() => setIsLoading(false), 300);
        }, 500);

        return () => clearTimeout(timer);
    }, [selectedTemplate, advancedParams, heroParams, ultraParams, stackParams, socialParams]);

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

    };
}
