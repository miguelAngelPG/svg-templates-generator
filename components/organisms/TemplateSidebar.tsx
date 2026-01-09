import React from 'react';
import { LayoutTemplate, Settings } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { Select } from '../atoms/Select';
import { TemplateType, AdvancedParams, HeroParams, UltraParams, StackParams } from '@/hooks/useTemplateGenerator';
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
}

export function TemplateSidebar({
    selectedTemplate, setSelectedTemplate,
    advancedParams, setAdvancedParams,
    heroParams, setHeroParams,
    ultraParams, setUltraParams,
    stackParams, setStackParams
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

                        {/* Layout for Badge: Icon + Value + Title in one row */}
                        {ultraParams.component === 'badge' ? (
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
                            /* Standard Layout for others */
                            <div className="flex gap-2 mb-2">
                                <div className="w-1/4">
                                    <ConfigField label="Icon" value={ultraParams.icon} onChange={v => setUltraParams({ ...ultraParams, icon: v })} maxLength={2} />
                                </div>
                                <div className="flex-1">
                                    <ConfigField label="Title" value={ultraParams.title} onChange={v => setUltraParams({ ...ultraParams, title: v })} maxLength={25} />
                                </div>
                            </div>
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

            </div>
        </div >
    );
}
