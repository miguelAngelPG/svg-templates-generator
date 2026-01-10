import React, { useMemo, useState, useEffect } from 'react';
import { Download, Copy, ExternalLink, Github, Eye } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';

// Template Imports
import { AdvancedCard } from '../templates/advanced/AdvancedCard';
import { ModernTemplate } from '../templates/hero/ModernTemplate';
import { MinimalTemplate } from '../templates/hero/MinimalTemplate';
import { CyberTemplate } from '../templates/hero/CyberTemplate';
import { TerminalTemplate } from '../templates/hero/TerminalTemplate';
import { UltraStat } from '../templates/ultra/UltraStat';
import { UltraQuote } from '../templates/ultra/UltraQuote';
import { ActionButtons } from '../molecules/ActionButtons';
import { UltraCard } from '../templates/ultra/UltraCard';
import { UltraBadge } from '../templates/ultra/UltraBadge';
import { TechStackRow } from '../templates/stack/TechStackRow';
import { PhilosophyTemplate } from '../templates/philosophy/PhilosophyTemplate';
import { ImpactTemplate } from '../templates/impact/ImpactTemplate';

import { getTheme } from '@/utils/themes';
import { TemplateType, AdvancedParams, HeroParams, UltraParams, StackParams, SocialParams } from '@/hooks/useTemplateGenerator';
import { fetchSocialIcons, SocialPlatform } from '@/utils/social-icons';
import { SocialTemplate } from '../templates/social/SocialTemplate';

interface TemplatePreviewProps {
    generatedUrl: string;
    isLoading: boolean;
    templateName: TemplateType;

    // Params for Live Rendering
    advancedParams: AdvancedParams;
    heroParams: HeroParams;
    ultraParams: UltraParams;
    stackParams: StackParams;
    socialParams: SocialParams;


}

export function TemplatePreview({
    generatedUrl,
    isLoading,
    templateName,
    advancedParams,
    heroParams,
    ultraParams,
    stackParams,
    socialParams,
}: TemplatePreviewProps) {

    const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${generatedUrl}` : generatedUrl;

    // --- Social Icons Fetching (Client Side) ---
    const [socialPlatforms, setSocialPlatforms] = useState<SocialPlatform[]>([]);
    const [isFetchingIcons, setIsFetchingIcons] = useState(false);

    useEffect(() => {
        if (templateName === 'social') {
            setIsFetchingIcons(true);
            const rawPlatforms = socialParams.platforms.filter(p => p.provider);
            fetchSocialIcons(rawPlatforms).then(icons => {
                setSocialPlatforms(icons);
                setIsFetchingIcons(false);
            });
        }
    }, [templateName, socialParams.platforms]);

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
            const theme = getTheme(advancedParams.theme, advancedParams.customColor, advancedParams.customColor2);
            component = <AdvancedCard {...advancedParams} theme={theme} />;
        }
        else if (templateName === 'hero') {
            width = 800;
            height = 400; // Hero default
            const theme = getTheme(heroParams.theme, heroParams.customColor, heroParams.customColor2);

            if (heroParams.style === 'modern') component = <ModernTemplate {...heroParams} theme={theme} />;
            else if (heroParams.style === 'minimal') component = <MinimalTemplate {...heroParams} theme={theme} />;
            else if (heroParams.style === 'cyber') component = <CyberTemplate {...heroParams} theme={theme} />;
            else if (heroParams.style === 'terminal') component = <TerminalTemplate {...heroParams} theme={theme} />;
        }
        else if (templateName === 'ultra') {
            width = 600;
            height = 300;
            const theme = getTheme(ultraParams.theme, ultraParams.customColor, ultraParams.customColor2);

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
            else if (ultraParams.component === 'quote') {
                if (ultraParams.quoteVariation === 'philosophy') {
                    // Philosophy uses specific dimensions
                    width = 800;
                    height = 250; // Increased height for better fit (was potentially clipping)
                    const philosophyTheme = {
                        bg: ultraTheme.bg,
                        bgGradient: theme.bgGradient, // Fix: Use 'theme' source directly
                        primary: ultraTheme.accent, // Map Ultra accent to Philosophy primary
                        secondary: ultraTheme.blob1
                    };

                    component = (
                        <PhilosophyTemplate
                            title={ultraParams.title || 'Stoicism'}
                            quote={ultraParams.content || 'The obstacle is the way.'}
                            icon={ultraParams.icon || '🏛️'}
                            footer={ultraParams.label}
                            theme={philosophyTheme}
                        />
                    );
                } else {
                    // Standard Ultra Quote is 600x300
                    width = 600;
                    height = 300;
                    component = <UltraQuote {...ultraParams} theme={ultraTheme} />;
                }
            }
            else if (ultraParams.component === 'card') {
                if (ultraParams.cardVariation === 'impact') {
                    // Impact uses vertical dimensions
                    width = 380;
                    height = 420;

                    const impactTheme = {
                        primary: ultraTheme.accent,
                        secondary: ultraTheme.blob1,
                        accent: ultraTheme.blob2
                    };

                    component = (
                        <ImpactTemplate
                            company={ultraParams.company || 'Tech Corp'}
                            role={ultraParams.title}
                            year={ultraParams.year || '2024'}
                            stat={ultraParams.value}
                            statDesc={ultraParams.label}
                            description={ultraParams.content}
                            techArray={(ultraParams.tech || '').split(',').map(t => t.trim()).slice(0, 4)}
                            logo={ultraParams.icon}
                            theme={impactTheme}
                        />
                    );
                } else {
                    // Standard Ultra Card is determined by UltraCard.tsx (600x300)
                    width = 600;
                    height = 300;
                    component = <UltraCard {...ultraParams} theme={ultraTheme} />;
                }
            }
            else if (ultraParams.component === 'badge') {
                // UltraBadge is 600x300
                width = 600;
                height = 300;
                component = <UltraBadge {...ultraParams} theme={ultraTheme} />;
            }
        }
        else if (templateName === 'stack') {
            width = 800; // flexible container
            height = 200; // Increased height to prevent cutoff
            const theme = getTheme(stackParams.theme, stackParams.customColor, stackParams.customColor2);

            component = (
                <TechStackRow
                    technologies={stackParams.technologies}
                    theme={theme}
                    themeName={stackParams.theme}
                    iconStyle={stackParams.iconStyle}
                    iconColor={stackParams.iconColor}
                    gap={stackParams.gap}
                    bgTransparent={stackParams.bgTransparent}
                />
            );
        }
        else if (templateName === 'social') {
            const theme = getTheme(socialParams.theme, socialParams.customColor, socialParams.customColor2);

            // Dimensions Logic matching API
            if (socialParams.style === 'card') {
                width = 400;
                height = socialPlatforms.length * 50 + 60;
            } else if (socialParams.style === 'block') {
                width = 400;
                height = socialPlatforms.length * 60 + 40;
            } else if (socialParams.style === 'minimal') {
                width = 300;
                height = socialPlatforms.length * 30 + 20;
            } else if (socialParams.style === 'glass-grid') {
                width = 500;
                const rows = Math.ceil(socialPlatforms.length / 2);
                height = rows * 100 + 40;
            } else {
                width = 800;
                height = 100;
            }

            // Adjust dimensions for preview container if needed, 
            // but rely on 'maxWidth: 100%' in parent to handle scaling.

            component = (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isFetchingIcons ? (
                        <span className="text-gray-500 text-xs animate-pulse">Fetching Icons...</span>
                    ) : (
                        /* Wrap in a container to simulate the SVG root for Satori-like behavior */
                        <div style={{ width: width, height: height, display: 'flex' }}>
                            <SocialTemplate
                                platforms={socialPlatforms}
                                style={socialParams.style}
                                theme={theme}
                            />
                        </div>
                    )}
                </div>
            );
        }



        return { component, width, height };

    }, [templateName, advancedParams, heroParams, ultraParams, stackParams, socialParams, generatedUrl, isLoading]);

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

                    {/* Action Buttons */}
                    <ActionButtons generatedUrl={generatedUrl} templateName={templateName} />
                </div>
                {/* Preview Area */}
                <div className="flex-1 flex items-center justify-center p-8 pt-12 overflow-hidden bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5 relative">
                    <div
                        style={{
                            width: renderPreview.width,
                            height: renderPreview.height,
                            maxWidth: '100%',
                            maxHeight: '100%',
                            transformOrigin: 'center center',
                            boxShadow: '0 0 50px rgba(0,0,0,0.5)'
                        }}
                        className="transition-all duration-300 relative"
                    >
                        {renderPreview.component}
                    </div>
                </div>
            </div>

            {/* Bottom Panel */}
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
    );
}

