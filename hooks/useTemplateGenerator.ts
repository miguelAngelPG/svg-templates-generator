import { useState, useEffect } from 'react';

export type TemplateType = 'advanced' | 'hero' | 'ultra' | 'stack' | 'social' | 'retro' | 'stats';

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
    style: 'modern' | 'minimal' | 'cyber' | 'terminal';
    theme: string;
    customColor: string;
    customColor2: string;
}


export interface UltraParams {
    component: 'stat' | 'quote' | 'card' | 'badge';
    title: string;
    content: string; // Used for quote text or card description
    icon: string;
    value: string; // For stat
    label: string; // For stat
    progress: number; // For stat (0-100)
    footer: string; // For quote or card footer
    theme: string;
    customColor: string;
    customColor2: string;
    // New fields for Ultra Card & Quote variations
    cardVariation: 'marketing' | 'profile' | 'code' | 'impact'; // Added impact
    quoteVariation: 'classic' | 'modern' | 'minimal' | 'philosophy';
    author: string; // For quote
    role: string; // For quote or profile card
    badgeText: string;
    // Legacy / Specific fields
    company?: string;
    year?: string;
    tech?: string;
}

export interface StackParams {
    style: 'grid' | 'carousel' | 'minimal';
    technologies: string[];
    theme: string;
    iconStyle: 'original' | 'monochrome' | 'custom' | 'glass';
    iconColor?: string;
    customColor: string;
    customColor2: string;
    gap: number;
    bgTransparent: boolean;
}

export interface SocialParams {
    platforms: { provider: string; username: string }[];
    style: 'badge' | 'card' | 'icon-only' | 'block' | 'minimal' | 'glass-grid';
    theme: string;
    customColor: string;
    customColor2: string;
}

export interface RetroParams {
    style: 'gameboy' | 'rpg';
    txt_1: string; // Player Name / Title
    txt_2: string; // Level / Description
    img_1: string; // Avatar URL
    theme: string;
    customColor: string;
    customColor2: string;
}

export interface StatsParams {
    style: 'compact' | 'card' | 'dashboard';
    title: string;
    commits: string;
    prs: string;
    issues: string;
    stars: string;
    contribs: string;
    rank: string;
    theme: string;
    customColor: string;
    customColor2: string;
}

export function useTemplateGenerator() {
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('advanced');
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeField, setActiveField] = useState<string | null>(null);

    const [advancedParams, setAdvancedParams] = useState<AdvancedParams>({
        content: 'This is an advanced SVG template with highly customizable properties.',
        title: 'Advanced Template',
        subtitle: 'Created with Next.js',
        width: 800,
        height: 400,
        theme: 'dark',
        customColor: '#8855ff',
        customColor2: '#ffffff',
        layout: 'standard'
    });

    const [heroParams, setHeroParams] = useState<HeroParams>({
        name: 'John Doe',
        title: 'Full Stack Developer',
        subtitle: 'Building digital experiences',
        location: 'New York, USA',
        style: 'modern',
        theme: 'dark',
        customColor: '#00f2ff',
        customColor2: '#ffffff'
    });

    const [ultraParams, setUltraParams] = useState<UltraParams>({
        component: 'card',
        title: 'Project Alpha',
        content: 'A revolutionary new way to build web apps.',
        icon: 'rocket',
        value: '99%',
        label: 'Performance',
        progress: 75,
        footer: 'Last updated 2 days ago',
        theme: 'dark',
        customColor: '#8855ff',
        customColor2: '#ff0088',
        cardVariation: 'profile',
        quoteVariation: 'classic',
        author: 'Albert Einstein',
        role: 'Physicist',
        badgeText: 'v2.0.0',
        company: 'Acme Corp',
        year: '2024',
        tech: 'React, Next.js, Tailwind'
    });

    const [stackParams, setStackParams] = useState<StackParams>({
        style: 'grid',
        technologies: ['react', 'nextjs', 'typescript', 'tailwindcss'],
        theme: 'dark',
        iconStyle: 'original',
        customColor: '#8855ff',
        customColor2: '#ffffff',
        gap: 12,
        bgTransparent: false
    });

    const [socialParams, setSocialParams] = useState<SocialParams>({
        platforms: [
            { provider: 'github', username: 'github' },
            { provider: 'twitter', username: 'twitter' }
        ],
        style: 'badge',
        theme: 'dark',
        customColor: '#8855ff',
        customColor2: '#ffffff'
    });

    const [retroParams, setRetroParams] = useState<RetroParams>({
        style: 'gameboy',
        txt_1: 'Player 1',
        txt_2: 'Level 99',
        img_1: '', // Optional avatar
        theme: 'custom',
        customColor: '#8b8b8b', // Default GB grey/green
        customColor2: '#ffffff'
    });

    const [statsParams, setStatsParams] = useState<StatsParams>({
        style: 'dashboard',
        title: 'GitHub Stats',
        commits: '1,234',
        prs: '56',
        issues: '23',
        stars: '150',
        contribs: '800',
        rank: 'A+',
        theme: 'dark',
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
                // ... existing advanced logic ...
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
                // ... existing hero logic ...
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
                // ... existing ultra logic ...
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

                if (ultraParams.component === 'card' && ultraParams.cardVariation === 'impact') {
                    // Impact Logic
                    const pImp = new URLSearchParams();
                    pImp.append('company', ultraParams.company || 'Tech Corp');
                    pImp.append('role', ultraParams.title);
                    pImp.append('year', ultraParams.year || '2024');
                    pImp.append('stat', ultraParams.value);
                    pImp.append('desc', ultraParams.label);
                    pImp.append('description', ultraParams.content);
                    pImp.append('tech', ultraParams.tech || '');
                    pImp.append('logo', ultraParams.icon);
                    pImp.append('theme', ultraParams.theme);

                    if (ultraParams.theme === 'custom') {
                        pImp.append('customColor', ultraParams.customColor || '#00f2ff');
                        const c2 = ultraParams.customColor2 || '#ffffff';
                        pImp.append('customColor2', c2);
                    }
                    url = `/api/templates/impact?${pImp.toString()}&t=${Date.now()}`;

                } else if (ultraParams.component === 'quote' && ultraParams.quoteVariation === 'philosophy') {
                    // Philosophy Logic
                    const pPhil = new URLSearchParams();
                    pPhil.append('title', ultraParams.title);
                    pPhil.append('quote', ultraParams.content);
                    pPhil.append('icon', ultraParams.icon);
                    pPhil.append('footer', ultraParams.label);
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
                // ... existing stack logic ...
                const p = new URLSearchParams();
                p.append('technologies', stackParams.technologies.join(','));
                p.append('theme', stackParams.theme);
                p.append('iconStyle', stackParams.iconStyle);
                if (stackParams.iconColor) {
                    p.append('iconColor', stackParams.iconColor.replace('#', ''));
                }
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
                // ... existing social logic ...
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

            } else if (selectedTemplate === 'retro') {
                // Retro Logic
                const p = new URLSearchParams();
                p.append('style', retroParams.style);
                p.append('txt_1', retroParams.txt_1);
                p.append('txt_2', retroParams.txt_2);
                p.append('img_1', retroParams.img_1);
                p.append('theme', retroParams.theme);

                if (retroParams.theme === 'custom') {
                    p.append('customColor', retroParams.customColor || '#8b8b8b');
                    const c2 = retroParams.customColor2 || '#ffffff';
                    p.append('customColor2', c2);
                }
                url = `/api/templates/retro?${p.toString()}&t=${Date.now()}`;
            } else if (selectedTemplate === 'stats') {
                const p = new URLSearchParams();
                p.append('style', statsParams.style);
                p.append('title', statsParams.title);
                p.append('commits', statsParams.commits);
                p.append('prs', statsParams.prs);
                p.append('issues', statsParams.issues);
                p.append('stars', statsParams.stars);
                p.append('contribs', statsParams.contribs);
                p.append('rank', statsParams.rank);
                p.append('theme', statsParams.theme);

                if (statsParams.theme === 'custom') {
                    p.append('customColor', statsParams.customColor || '#8855ff');
                    const c2 = statsParams.customColor2 || '#ffffff';
                    p.append('customColor2', c2);
                }
                url = `/api/custom/stats?${p.toString()}&t=${Date.now()}`;
            }

            setGeneratedUrl(url);
            setTimeout(() => setIsLoading(false), 300);
        }, 500);

        return () => clearTimeout(timer);
    }, [selectedTemplate, advancedParams, heroParams, ultraParams, stackParams, socialParams, retroParams, statsParams]);

    return {
        selectedTemplate,
        setSelectedTemplate,
        generatedUrl,
        isLoading,
        advancedParams, setAdvancedParams,
        heroParams, setHeroParams,
        ultraParams, setUltraParams,
        stackParams, setStackParams,
        socialParams, setSocialParams,
        retroParams, setRetroParams,
        statsParams, setStatsParams,
        activeField, setActiveField
    };
}
