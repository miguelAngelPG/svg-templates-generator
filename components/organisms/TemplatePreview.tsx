import React, { useMemo } from 'react';
import { Download, Copy, ExternalLink, Github, Eye } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';

// Template Imports
import { AdvancedCard } from '../templates/advanced/AdvancedCard';
import { ModernTemplate } from '../templates/hero/ModernTemplate';
import { MinimalTemplate } from '../templates/hero/MinimalTemplate';
import { CyberTemplate } from '../templates/hero/CyberTemplate';
import { UltraStat } from '../templates/ultra/UltraStat';
import { UltraQuote } from '../templates/ultra/UltraQuote';
import { UltraCard } from '../templates/ultra/UltraCard';
import { UltraBadge } from '../templates/ultra/UltraBadge';

import { getTheme } from '@/utils/themes';
import { TemplateType, AdvancedParams, HeroParams, UltraParams } from '@/hooks/useTemplateGenerator';

interface TemplatePreviewProps {
    generatedUrl: string;
    isLoading: boolean;
    templateName: TemplateType;

    // Params for Live Rendering
    advancedParams: AdvancedParams;
    heroParams: HeroParams;
    ultraParams: UltraParams;
}

export function TemplatePreview({
    generatedUrl,
    isLoading,
    templateName,
    advancedParams,
    heroParams,
    ultraParams
}: TemplatePreviewProps) {

    const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${generatedUrl}` : generatedUrl;

    const handleCopyMarkdown = () => {
        const markdown = `![${templateName}](${fullUrl})`;
        navigator.clipboard.writeText(markdown);
        alert('Markdown copied to clipboard!');
    };

    // --- Live Rendering Logic ---
    const renderPreview = useMemo(() => {
        let width = 800;
        let height = 400;
        let component = null;

        if (templateName === 'advanced') {
            width = advancedParams.width;
            height = advancedParams.height;
            const theme = getTheme(advancedParams.theme, advancedParams.customColor);
            component = <AdvancedCard {...advancedParams} theme={theme} />;
        }
        else if (templateName === 'hero') {
            width = 800;
            height = 400; // Hero default
            const theme = getTheme(heroParams.theme, heroParams.customColor);

            if (heroParams.style === 'modern') component = <ModernTemplate {...heroParams} theme={theme} />;
            else if (heroParams.style === 'minimal') component = <MinimalTemplate {...heroParams} theme={theme} />;
            else if (heroParams.style === 'cyber') component = <CyberTemplate {...heroParams} theme={theme} />;
        }
        else if (templateName === 'ultra') {
            width = 600;
            height = 300;
            const theme = getTheme(ultraParams.theme, ultraParams.customColor);

            // Map shared theme to Ultra format
            const ultraTheme = {
                bg: theme.bgGradient || theme.bg,
                border: ultraParams.customColor ? `${theme.accent}40` : 'rgba(255, 255, 255, 0.1)',
                text: '#ffffff',
                secondary: '#94a3b8',
                accent: theme.accent,
                blob1: theme.blob1,
                blob2: theme.blob2
            };

            // Render the REACT COMPONENT directly. 
            // It is now a Pure SVG component, so it renders exactly as the server string.
            if (ultraParams.component === 'stat') component = <UltraStat {...ultraParams} theme={ultraTheme} />;
            else if (ultraParams.component === 'quote') component = <UltraQuote {...ultraParams} theme={ultraTheme} />;
            else if (ultraParams.component === 'card') component = <UltraCard {...ultraParams} theme={ultraTheme} />;
            else if (ultraParams.component === 'badge') component = <UltraBadge {...ultraParams} theme={ultraTheme} />;
        }

        return { component, width, height };

    }, [templateName, advancedParams, heroParams, ultraParams]);

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex-1 flex flex-col gap-2 relative bg-[#151515] border border-gray-800 rounded-lg overflow-hidden">
                <div className="absolute top-0 left-0 right-0 p-2 bg-[#111] border-b border-gray-800 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-400">LIVE PREVIEW</span>
                        <span className="flex items-center gap-1 text-[10px] bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full border border-green-800">
                            <Eye className="w-3 h-3" /> Real-time
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="primary"
                            className="py-1 px-3 text-xs h-8"
                            onClick={handleCopyMarkdown}
                            icon={<Github className="w-3 h-3" />}
                        >
                            Copy for GitHub
                        </Button>
                        <Button
                            variant="outline"
                            className="py-1 px-3 text-xs h-8"
                            onClick={() => window.open(fullUrl, '_blank')}
                            icon={<ExternalLink className="w-3 h-3" />}
                        >
                            Open URL
                        </Button>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-8 pt-12 overflow-hidden bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5 relative">

                    {/* Render Container */}
                    <div
                        style={{
                            width: renderPreview.width,
                            height: renderPreview.height,
                            // Scale down if too big for container
                            maxWidth: '100%',
                            maxHeight: '100%',
                            transformOrigin: 'center center',
                            boxShadow: '0 0 50px rgba(0,0,0,0.5)'
                        }}
                        className="transition-all duration-300 relative"
                    >
                        {/* This renders the actual React component! */}
                        {renderPreview.component}
                    </div>

                </div>

                <div className="p-4 bg-[#111] border-t border-gray-800 flex flex-col gap-4">
                    <div>
                        <Label>GitHub Markdown</Label>
                        <div className="flex gap-2">
                            <Input
                                value={`![${templateName}](${fullUrl})`}
                                readOnly
                                fullWidth
                                onClick={(e) => e.currentTarget.select()}
                                className="font-mono text-xs text-cyan-400"
                            />
                            <Button
                                variant="outline"
                                className="w-12 px-0 shrink-0"
                                onClick={handleCopyMarkdown}
                                title="Copy Markdown"
                                icon={<Copy className="w-4 h-4" />}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
