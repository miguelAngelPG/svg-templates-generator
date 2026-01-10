import React from 'react';
import { LayoutTemplate, Settings } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { Select } from '../atoms/Select';
import { TemplateType, AdvancedParams, HeroParams, UltraParams, StackParams, SocialParams } from '@/hooks/useTemplateGenerator';
import { ConfigField } from '../molecules/ConfigField';
import { IconPicker } from '../molecules/IconPicker';
import { HERO_THEMES } from '@/utils/themes';

interface TemplateSidebarProps {
    selectedTemplate: TemplateType;
    setSelectedTemplate: (val: TemplateType) => void;

    advancedParams: AdvancedParams;
    setAdvancedParams: (val: AdvancedParams) => void;

    heroParams: HeroParams;
    setHeroParams: (val: HeroParams) => void;

    ultraParams: UltraParams;
    setUltraParams: (val: UltraParams) => void;

    stackParams: StackParams;
    setStackParams: (val: StackParams) => void;

    socialParams: SocialParams;
    setSocialParams: (val: SocialParams) => void;




}

export function TemplateSidebar({
    selectedTemplate, setSelectedTemplate,
    advancedParams, setAdvancedParams,
    heroParams, setHeroParams,
    ultraParams, setUltraParams,
    stackParams, setStackParams,
    socialParams, setSocialParams
}: TemplateSidebarProps) {

    // Helper to render theme options dynamically
    const renderThemeOptions = () => (
        <>
            {Object.keys(HERO_THEMES).map(key => (
                <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ')}
                </option>
            ))}
            <option value="custom">Custom Color</option>
        </>
    );

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center gap-2 mb-2">
                <LayoutTemplate className="text-cyan-400" />
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                    Templates
                </h1>
            </div>

            {/* Template Selector */}
            <div className="bg-[#111] p-4 rounded-lg border border-gray-800">
                <Label>SELECT TEMPLATE</Label>
                <Select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value as TemplateType)}
                    fullWidth
                    className="mt-1"
                >
                    <option value="advanced">Advanced Card (Marketing)</option>
                    <option value="hero">Hero Section (Profile)</option>
                    <option value="ultra">Ultra Components (Stats)</option>
                    <option value="stack">Tech Stack (By Readme Forge)</option>
                    <option value="social">Social Hub (Connect)</option>
                </Select>
            </div>

            {/* Dynamic Forms */}
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">

                {selectedTemplate === 'advanced' && (
                    <>
                        <ConfigField label="Title" value={advancedParams.title} onChange={v => setAdvancedParams({ ...advancedParams, title: v })} maxLength={40} />
                        <div>
                            <Label>Description</Label>
                            <textarea
                                value={advancedParams.content}
                                onChange={(e) => setAdvancedParams({ ...advancedParams, content: e.target.value })}
                                maxLength={120}
                                className="bg-[#222] rounded px-3 py-2 text-sm border border-gray-700 focus:border-purple-500 focus:outline-none text-white w-full h-20 resize-none mt-1"
                            />
                        </div>

                        <div className="mt-2">
                            <Label>Theme</Label>
                            <Select value={advancedParams.theme} onChange={e => setAdvancedParams({ ...advancedParams, theme: e.target.value })} fullWidth>
                                {renderThemeOptions()}
                            </Select>
                        </div>

                        {advancedParams.theme === 'custom' && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <Label>Primary Acc.</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={advancedParams.customColor || '#8855ff'}
                                            onChange={e => setAdvancedParams({ ...advancedParams, customColor: e.target.value })}
                                            className="w-8 h-8 p-1 cursor-pointer shrink-0"
                                        />
                                        <Input
                                            type="text"
                                            value={advancedParams.customColor || '#8855ff'}
                                            onChange={e => setAdvancedParams({ ...advancedParams, customColor: e.target.value })}
                                            fullWidth
                                            maxLength={7}
                                            className="text-xs"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Secondary Acc.</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={advancedParams.customColor2 || '#ffffff'}
                                            onChange={e => {
                                                setAdvancedParams({ ...advancedParams, customColor2: e.target.value })
                                                console.log(e.target.value)
                                            }}
                                            className="w-8 h-8 p-1 cursor-pointer shrink-0"
                                        />
                                        <Input
                                            type="text"
                                            value={advancedParams.customColor2 || '#ffffff'}
                                            onChange={e => setAdvancedParams({ ...advancedParams, customColor2: e.target.value })}
                                            fullWidth
                                            maxLength={7}
                                            className="text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {selectedTemplate === 'hero' && (
                    <>
                        <ConfigField label="Name" value={heroParams.name} onChange={v => setHeroParams({ ...heroParams, name: v })} maxLength={20} />
                        <ConfigField label="Title" value={heroParams.title} onChange={v => setHeroParams({ ...heroParams, title: v })} maxLength={30} />
                        <ConfigField label="Subtitle" value={heroParams.subtitle} onChange={v => setHeroParams({ ...heroParams, subtitle: v })} maxLength={40} />
                        <ConfigField label="Location" value={heroParams.location} onChange={v => setHeroParams({ ...heroParams, location: v })} maxLength={20} />


                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label>Style</Label>
                                <Select value={heroParams.style} onChange={e => setHeroParams({ ...heroParams, style: e.target.value })} fullWidth>
                                    <option value="modern">Modern (Glass)</option>
                                    <option value="minimal">Minimal (B&W)</option>
                                    <option value="cyber">Cyber (Tech)</option>
                                    <option value="terminal">Terminal (Dev)</option>
                                </Select>
                            </div>
                            <div>
                                <Label>Theme</Label>
                                <Select value={heroParams.theme} onChange={e => setHeroParams({ ...heroParams, theme: e.target.value })} fullWidth>
                                    {renderThemeOptions()}
                                </Select>
                            </div>
                        </div>

                        {heroParams.theme === 'custom' && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <Label>Primary Acc.</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={heroParams.customColor || '#00f2ff'}
                                            onChange={e => setHeroParams({ ...heroParams, customColor: e.target.value })}
                                            className="w-8 h-8 p-1 cursor-pointer shrink-0"
                                        />
                                        <Input
                                            type="text"
                                            value={heroParams.customColor}
                                            onChange={e => setHeroParams({ ...heroParams, customColor: e.target.value })}
                                            fullWidth
                                            maxLength={7}
                                            className="text-xs"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Secondary Acc.</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={heroParams.customColor2 || '#ffffff'}
                                            onChange={e => setHeroParams({ ...heroParams, customColor2: e.target.value })}
                                            className="w-8 h-8 p-1 cursor-pointer shrink-0"
                                        />
                                        <Input
                                            type="text"
                                            value={heroParams.customColor2 || '#ffffff'}
                                            onChange={e => setHeroParams({ ...heroParams, customColor2: e.target.value })}
                                            fullWidth
                                            maxLength={7}
                                            className="text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {selectedTemplate === 'ultra' && (
                    <>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label>Component</Label>
                                <Select value={ultraParams.component} onChange={e => setUltraParams({ ...ultraParams, component: e.target.value as any })} fullWidth>
                                    <option value="stat">Statistic</option>
                                    <option value="quote">Quote</option>
                                    <option value="card">Card</option>
                                    <option value="badge">Badge</option>
                                </Select>
                            </div>

                            {/* Card Variation Selector */}
                            {ultraParams.component === 'card' && (
                                <div className="col-span-2">
                                    <Label>Card Style</Label>
                                    <Select
                                        value={ultraParams.cardVariation || 'default'}
                                        onChange={e => setUltraParams({ ...ultraParams, cardVariation: e.target.value as any })}
                                        fullWidth
                                    >
                                        <option value="default">Standard Ultra</option>
                                        <option value="impact">Impact (Resume Highlighting)</option>
                                    </Select>
                                </div>
                            )}

                            {/* Quote Variation Selector */}
                            {ultraParams.component === 'quote' && (
                                <div className="col-span-2">
                                    <Label>Quote Style</Label>
                                    <Select
                                        value={ultraParams.quoteVariation || 'default'}
                                        onChange={e => setUltraParams({ ...ultraParams, quoteVariation: e.target.value as any })}
                                        fullWidth
                                    >
                                        <option value="default">Standard Ultra Quote</option>
                                        <option value="philosophy">Philosophy (Glass/Duotone)</option>
                                    </Select>
                                </div>
                            )}

                            <div>
                                <Label>Theme</Label>
                                <Select value={ultraParams.theme} onChange={e => setUltraParams({ ...ultraParams, theme: e.target.value })} fullWidth>
                                    {renderThemeOptions()}
                                </Select>
                            </div>
                        </div>

                        {ultraParams.theme === 'custom' && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <Label>Primary Acc.</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={ultraParams.customColor || '#00f2ff'}
                                            onChange={e => setUltraParams({ ...ultraParams, customColor: e.target.value })}
                                            className="w-8 h-8 p-1 cursor-pointer shrink-0"
                                        />
                                        <Input
                                            type="text"
                                            value={ultraParams.customColor || '#00f2ff'}
                                            onChange={e => setUltraParams({ ...ultraParams, customColor: e.target.value })}
                                            fullWidth
                                            maxLength={7}
                                            className="text-xs"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Secondary Acc.</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={ultraParams.customColor2 || '#ffffff'}
                                            onChange={e => setUltraParams({ ...ultraParams, customColor2: e.target.value })}
                                            className="w-8 h-8 p-1 cursor-pointer shrink-0"
                                        />
                                        <Input
                                            type="text"
                                            value={ultraParams.customColor2 || '#ffffff'}
                                            onChange={e => setUltraParams({ ...ultraParams, customColor2: e.target.value })}
                                            fullWidth
                                            maxLength={7}
                                            className="text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Layout for Quote (Standard & Philosophy) */}
                        {ultraParams.component === 'quote' ? (
                            <>
                                <div className="flex gap-2 mb-2">
                                    <div className="w-1/4">
                                        <ConfigField
                                            label="Icon"
                                            value={ultraParams.icon}
                                            onChange={v => setUltraParams({ ...ultraParams, icon: v })}
                                            maxLength={2}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <ConfigField
                                            label={ultraParams.quoteVariation === 'philosophy' ? 'Title / Author' : 'Title / Author'}
                                            value={ultraParams.title}
                                            onChange={v => setUltraParams({ ...ultraParams, title: v })}
                                            maxLength={30}
                                        />
                                    </div>
                                </div>
                                {/* Footer / Label for Quote */}
                                <div className="mb-2">
                                    <ConfigField
                                        label={ultraParams.quoteVariation === 'philosophy' ? 'Footer (e.g. Personal Philosophy)' : 'Footer / Caption'}
                                        value={ultraParams.label}
                                        onChange={v => setUltraParams({ ...ultraParams, label: v })}
                                        maxLength={30}
                                    />
                                </div>
                            </>
                        ) : ultraParams.component === 'badge' ? (
                            <div className="flex gap-2 mb-2">
                                <div className="w-[15%]">
                                    <ConfigField label="Icon" value={ultraParams.icon} onChange={v => setUltraParams({ ...ultraParams, icon: v })} maxLength={2} />
                                </div>
                                <div className="w-[25%]">
                                    <ConfigField label="Value" value={ultraParams.value} onChange={v => setUltraParams({ ...ultraParams, value: v })} maxLength={8} />
                                </div>
                                <div className="flex-1">
                                    <ConfigField label="Title" value={ultraParams.title} onChange={v => setUltraParams({ ...ultraParams, title: v })} maxLength={15} />
                                </div>
                            </div>
                        ) : (
                            /* Standard Layout for others (Stat, Card-Default) */
                            ultraParams.component !== 'card' || ultraParams.cardVariation !== 'impact' ? (
                                <div className="flex gap-2 mb-2">
                                    <div className="w-1/4">
                                        <ConfigField label="Icon" value={ultraParams.icon} onChange={v => setUltraParams({ ...ultraParams, icon: v })} maxLength={2} />
                                    </div>
                                    <div className="flex-1">
                                        <ConfigField label="Title" value={ultraParams.title} onChange={v => setUltraParams({ ...ultraParams, title: v })} maxLength={25} />
                                    </div>
                                </div>
                            ) : null
                        )}

                        {/* Extra fields for Stat only */}
                        {ultraParams.component === 'stat' && (
                            <div className="grid grid-cols-2 gap-2">
                                <ConfigField label="Value" value={ultraParams.value} onChange={v => setUltraParams({ ...ultraParams, value: v })} maxLength={10} />
                                <ConfigField label="Label" value={ultraParams.label} onChange={v => setUltraParams({ ...ultraParams, label: v })} maxLength={15} />
                            </div>
                        )}

                        <div>
                            <Label>Content / Quote</Label>
                            <textarea
                                value={ultraParams.content}
                                onChange={(e) => setUltraParams({ ...ultraParams, content: e.target.value })}
                                maxLength={100}
                                placeholder={
                                    ultraParams.component === 'badge' ? 'Ex: Verified Developer (Optional detail)' :
                                        ultraParams.component === 'stat' ? 'Ex: +24% increase vs last month' :
                                            ultraParams.component === 'quote' ? 'Ex: "The only way to do great work is to love what you do."' :
                                                'Ex: Include a brief description of the featured item here.'
                                }
                                className="bg-[#222] rounded px-3 py-2 text-sm border border-gray-700 focus:border-purple-500 focus:outline-none text-white w-full h-24 resize-none mt-1 placeholder-gray-600"
                            />
                        </div>
                    </>
                )}

                {/* Impact Variation inside Ultra */}
                {selectedTemplate === 'ultra' && ultraParams.component === 'card' && ultraParams.cardVariation === 'impact' && (
                    <div className="mt-4 border-t border-gray-800 pt-4">
                        <Label className="text-cyan-400 mb-2 block">Impact Card Details</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {/* Company stored in specialized optional field */}
                            <ConfigField label="Company" value={ultraParams.company || ''} onChange={v => setUltraParams({ ...ultraParams, company: v })} maxLength={20} />
                            {/* Role matches Title */}
                            <ConfigField label="Role" value={ultraParams.title} onChange={v => setUltraParams({ ...ultraParams, title: v })} maxLength={25} />
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {/* Year stored in specialized optional field */}
                            <ConfigField label="Year/Badge" value={ultraParams.year || ''} onChange={v => setUltraParams({ ...ultraParams, year: v })} maxLength={15} />
                            {/* Logo matches Icon */}
                            <ConfigField label="Logo/Emoji" value={ultraParams.icon} onChange={v => setUltraParams({ ...ultraParams, icon: v })} maxLength={2} />
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {/* Stat matches Value */}
                            <ConfigField label="Big Stat" value={ultraParams.value} onChange={v => setUltraParams({ ...ultraParams, value: v })} maxLength={8} />
                            {/* Stat Label matches Label */}
                            <ConfigField label="Stat Label" value={ultraParams.label} onChange={v => setUltraParams({ ...ultraParams, label: v })} maxLength={20} />
                        </div>

                        <div className="mt-2">
                            {/* Description matches Content */}
                            <Label>Description</Label>
                            <textarea
                                value={ultraParams.content}
                                onChange={(e) => setUltraParams({ ...ultraParams, content: e.target.value })}
                                maxLength={120}
                                className="bg-[#222] rounded px-3 py-2 text-sm border border-gray-700 focus:border-purple-500 focus:outline-none text-white w-full h-16 resize-none mt-1"
                            />
                        </div>

                        <div className="mt-2">
                            {/* Tech stored in specialized optional field */}
                            <ConfigField label="Tech Stack (comma sep)" value={ultraParams.tech || ''} onChange={v => setUltraParams({ ...ultraParams, tech: v })} maxLength={50} />
                        </div>
                    </div>
                )}

                {/* Stack Configuration */}
                {selectedTemplate === 'stack' && (
                    <>
                        <div className="bg-[#111] p-3 rounded border border-gray-800 mb-4">
                            <Label>Technologies</Label>
                            <div className="mb-2">
                                <IconPicker
                                    selectedIcons={stackParams.technologies}
                                    onToggleIcon={(slug) => {
                                        const current = stackParams.technologies;
                                        const exists = current.includes(slug);
                                        let newTechs;
                                        if (exists) {
                                            newTechs = current.filter(t => t !== slug);
                                        } else {
                                            newTechs = [...current, slug];
                                        }
                                        setStackParams({ ...stackParams, technologies: newTechs });
                                    }}
                                />
                            </div>

                            <div className="mt-2 pt-2 border-t border-gray-800">
                                <Label className="text-[10px] text-gray-500 mb-1">Manual Entry (Comma separated)</Label>
                                <textarea
                                    value={stackParams.technologies.join(', ')}
                                    onChange={(e) => setStackParams({ ...stackParams, technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                    className="bg-[#1a1a1a] rounded px-2 py-1 text-xs border border-gray-700 focus:border-purple-500 focus:outline-none text-gray-400 w-full h-12 resize-none font-mono"
                                    placeholder="react, typescript..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label>Icon Style</Label>
                                <Select value={stackParams.iconStyle} onChange={e => setStackParams({ ...stackParams, iconStyle: e.target.value as any })} fullWidth>
                                    <option value="original">Original Colors</option>
                                    <option value="monochrome">Monochrome (White)</option>
                                    <option value="glass">Glassmorphism</option>
                                    <option value="custom">Custom Color</option>
                                </Select>
                            </div>
                            <div>
                                <ConfigField label="Gap (px)" value={String(stackParams.gap)} onChange={v => setStackParams({ ...stackParams, gap: Number(v) })} maxLength={3} />
                            </div>
                        </div>

                        <div className="mt-2">
                            <Label>Theme (For Background/Glass)</Label>
                            <Select value={stackParams.theme} onChange={e => setStackParams({ ...stackParams, theme: e.target.value })} fullWidth>
                                {renderThemeOptions()}
                            </Select>

                            <div className="flex items-center justify-between mt-3 p-2 bg-[#1a1a1a] rounded border border-gray-800">
                                <span className="text-xs text-gray-300 font-medium">Fondo Transparente</span>
                                <button
                                    onClick={() => setStackParams({ ...stackParams, bgTransparent: !stackParams.bgTransparent })}
                                    className={`
                                        w-10 h-5 rounded-full relative transition-colors duration-200 focus:outline-none
                                        ${stackParams.bgTransparent ? 'bg-purple-600' : 'bg-gray-700'}
                                    `}
                                >
                                    <div
                                        className={`
                                            w-3 h-3 rounded-full bg-white absolute top-1 transition-transform duration-200
                                            ${stackParams.bgTransparent ? 'left-6' : 'left-1'}
                                        `}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Custom Icon Color */}
                        {stackParams.iconStyle === 'custom' && (
                            <div className="mt-2">
                                <Label>Icon Color Hex</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        value={stackParams.iconColor || '#ffffff'}
                                        onChange={e => setStackParams({ ...stackParams, iconColor: e.target.value })}
                                        className="w-8 h-8 p-1 cursor-pointer shrink-0"
                                    />
                                    <Input
                                        type="text"
                                        value={stackParams.iconColor || '#ffffff'}
                                        onChange={e => setStackParams({ ...stackParams, iconColor: e.target.value })}
                                        fullWidth
                                        maxLength={7}
                                        className="text-xs"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Custom Theme Colors */}
                        {stackParams.theme === 'custom' && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <Label>Primary Acc.</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={stackParams.customColor || '#8855ff'}
                                            onChange={e => setStackParams({ ...stackParams, customColor: e.target.value })}
                                            className="w-8 h-8 p-1 cursor-pointer shrink-0"
                                        />
                                        <Input
                                            type="text"
                                            value={stackParams.customColor || '#8855ff'}
                                            onChange={e => setStackParams({ ...stackParams, customColor: e.target.value })}
                                            fullWidth
                                            maxLength={7}
                                            className="text-xs"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Secondary Acc.</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={stackParams.customColor2 || '#ffffff'}
                                            onChange={e => setStackParams({ ...stackParams, customColor2: e.target.value })}
                                            className="w-8 h-8 p-1 cursor-pointer shrink-0"
                                        />
                                        <Input
                                            type="text"
                                            value={stackParams.customColor2 || '#ffffff'}
                                            onChange={e => setStackParams({ ...stackParams, customColor2: e.target.value })}
                                            fullWidth
                                            maxLength={7}
                                            className="text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Social Configuration */}
                {selectedTemplate === 'social' && (
                    <>
                        <div className="bg-[#111] p-3 rounded border border-gray-800 mb-4">
                            <Label>Platforms & Usernames</Label>
                            <p className="text-[10px] text-gray-500 mb-2">
                                Uses <a href="https://simpleicons.org/" target="_blank" className="underline hover:text-white">Simple Icons</a> slugs (e.g. twitter, github, linkedin).
                            </p>

                            <datalist id="social-providers">
                                <option value="github" />
                                <option value="twitter" />
                                <option value="x" />
                                <option value="linkedin" />
                                <option value="instagram" />
                                <option value="facebook" />
                                <option value="youtube" />
                                <option value="twitch" />
                                <option value="discord" />
                                <option value="tiktok" />
                                <option value="medium" />
                                <option value="devdotto" />
                                <option value="dribbble" />
                                <option value="behance" />
                                <option value="stackoverflow" />
                                <option value="reddit" />
                                <option value="mailto" />
                            </datalist>

                            <div className="flex flex-col gap-2 mb-2">
                                {socialParams.platforms.map((p, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <div className="w-1/3">
                                            <Input
                                                value={p.provider}
                                                onChange={(e) => {
                                                    const newPlatforms = [...socialParams.platforms];
                                                    newPlatforms[index].provider = e.target.value;
                                                    setSocialParams({ ...socialParams, platforms: newPlatforms });
                                                }}
                                                placeholder="Provider"
                                                className="h-8 text-[11px]"
                                                fullWidth
                                                list="social-providers"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <Input
                                                value={p.username}
                                                onChange={(e) => {
                                                    const newPlatforms = [...socialParams.platforms];
                                                    newPlatforms[index].username = e.target.value;
                                                    setSocialParams({ ...socialParams, platforms: newPlatforms });
                                                }}
                                                placeholder="Username"
                                                className="h-8 text-[11px]"
                                                fullWidth
                                            />
                                        </div>
                                        <button
                                            // Delete specific index
                                            onClick={() => {
                                                const newPlatforms = socialParams.platforms.filter((_, i) => i !== index);
                                                setSocialParams({ ...socialParams, platforms: newPlatforms });
                                            }}
                                            className="text-red-500 hover:text-red-400 p-1"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    setSocialParams({
                                        ...socialParams,
                                        platforms: [...socialParams.platforms, { provider: '', username: '' }]
                                    });
                                }}
                                className="w-full py-1 text-xs bg-[#1a1a1a] border border-gray-700 rounded text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
                            >
                                + Add Platform
                            </button>
                        </div>

                        <div className="mb-4">
                            <Label>Style</Label>
                            <Select value={socialParams.style} onChange={e => setSocialParams({ ...socialParams, style: e.target.value as any })} fullWidth>
                                <option value="badge">Badge Pills</option>
                                <option value="card">Profile Card</option>
                                <option value="icon-only">Icon Only Row</option>
                                <option value="block">Link Block (Linktree)</option>
                                <option value="minimal">Minimal List</option>
                                <option value="glass-grid">Glass Grid</option>
                            </Select>
                        </div>

                        <div className="mt-2">
                            <Label>Theme</Label>
                            <Select value={socialParams.theme} onChange={e => setSocialParams({ ...socialParams, theme: e.target.value })} fullWidth>
                                {renderThemeOptions()}
                            </Select>
                        </div>

                        {socialParams.theme === 'custom' && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <Label>Primary Acc.</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={socialParams.customColor || '#8855ff'}
                                            onChange={e => setSocialParams({ ...socialParams, customColor: e.target.value })}
                                            className="w-8 h-8 p-1 cursor-pointer shrink-0"
                                        />
                                        <Input
                                            type="text"
                                            value={socialParams.customColor || '#8855ff'}
                                            onChange={e => setSocialParams({ ...socialParams, customColor: e.target.value })}
                                            fullWidth
                                            maxLength={7}
                                            className="text-xs"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Secondary Acc.</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={socialParams.customColor2 || '#ffffff'}
                                            onChange={e => setSocialParams({ ...socialParams, customColor2: e.target.value })}
                                            className="w-8 h-8 p-1 cursor-pointer shrink-0"
                                        />
                                        <Input
                                            type="text"
                                            value={socialParams.customColor2 || '#ffffff'}
                                            onChange={e => setSocialParams({ ...socialParams, customColor2: e.target.value })}
                                            fullWidth
                                            maxLength={7}
                                            className="text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}





            </div>
        </div >
    );
}
