import { useState, useEffect } from 'react';

export type TemplateType = 'advanced' | 'hero' | 'ultra';

export interface AdvancedParams {
    content: string;
    title: string;
    subtitle: string;
    width: number;
    height: number;
    theme: string;
    layout: string;
}

export interface HeroParams {
    name: string;
    title: string;
    subtitle: string;
    location: string;
    theme: string;

    style: string;
}

export interface UltraParams {
    component: string;
    title: string;
    content: string;
    icon: string;
    value: string;
    label: string;
    theme: string;
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
        theme: 'dark',
        layout: 'center'
    });

    const [heroParams, setHeroParams] = useState<HeroParams>({
        name: 'Miguel A. Pacheco',
        title: 'Tech Lead & Architect',
        subtitle: 'Human first, Engineer second',
        location: 'Hidalgo, MX',
        theme: 'purple-cyan',

        style: 'modern'
    });

    const [ultraParams, setUltraParams] = useState<UltraParams>({
        component: 'stat',
        title: 'Total Users',
        content: 'Active monthly users growing steadily',
        icon: '🚀',
        value: '12.5k',
        label: 'Growth',
        theme: 'purple-cyan',
    });

    // Debounced Generation
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            let url = '';
            let params = new URLSearchParams();

            if (selectedTemplate === 'advanced') {
                params = new URLSearchParams(advancedParams as any);
                url = `/api/custom/advanced?${params.toString()}&t=${Date.now()}`;
            } else if (selectedTemplate === 'hero') {
                params = new URLSearchParams(heroParams as any);
                url = `/api/templates/hero?${params.toString()}&t=${Date.now()}`;
            } else if (selectedTemplate === 'ultra') {
                params = new URLSearchParams(ultraParams as any);
                url = `/api/custom/ultra?${params.toString()}&t=${Date.now()}`;
            }

            setGeneratedUrl(url);
            // Artificial delay to show loading state implies "processing" even if instant
            setTimeout(() => setIsLoading(false), 300);
        }, 500);

        return () => clearTimeout(timer);
    }, [selectedTemplate, advancedParams, heroParams, ultraParams]);

    return {
        selectedTemplate,
        setSelectedTemplate,
        generatedUrl,
        isLoading,
        // State Accessors
        advancedParams, setAdvancedParams,
        heroParams, setHeroParams,
        ultraParams, setUltraParams
    };
}
