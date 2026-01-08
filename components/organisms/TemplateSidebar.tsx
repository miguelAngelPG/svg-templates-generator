import React from 'react';
import { LayoutTemplate, Settings } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { Select } from '../atoms/Select';
import { TemplateType, AdvancedParams, HeroParams, UltraParams } from '@/hooks/useTemplateGenerator';
import { ConfigField } from '../molecules/ConfigField';

interface TemplateSidebarProps {
    selectedTemplate: TemplateType;
    setSelectedTemplate: (val: TemplateType) => void;

    advancedParams: AdvancedParams;
    setAdvancedParams: (val: AdvancedParams) => void;

    heroParams: HeroParams;
    setHeroParams: (val: HeroParams) => void;

    ultraParams: UltraParams;
    setUltraParams: (val: UltraParams) => void;
}

export function TemplateSidebar({
    selectedTemplate, setSelectedTemplate,
    advancedParams, setAdvancedParams,
    heroParams, setHeroParams,
    ultraParams, setUltraParams
}: TemplateSidebarProps) {

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-3rem)]">
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
                </Select>
            </div>

            {/* Dynamic Forms */}
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">

                {selectedTemplate === 'advanced' && (
                    <>
                        <ConfigField label="Title" value={advancedParams.title} onChange={v => setAdvancedParams({ ...advancedParams, title: v })} />
                        <ConfigField label="Content" value={advancedParams.content} onChange={v => setAdvancedParams({ ...advancedParams, content: v })} />
                        <ConfigField label="Subtitle" value={advancedParams.subtitle} onChange={v => setAdvancedParams({ ...advancedParams, subtitle: v })} />

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label>Theme</Label>
                                <Select value={advancedParams.theme} onChange={e => setAdvancedParams({ ...advancedParams, theme: e.target.value })} fullWidth>
                                    <option value="dark">Dark</option>
                                    <option value="light">Light</option>
                                    <option value="purple">Purple</option>
                                    <option value="cyan">Cyan</option>
                                    <option value="orange">Orange</option>
                                </Select>
                            </div>
                            <div>
                                <Label>Layout</Label>
                                <Select value={advancedParams.layout} onChange={e => setAdvancedParams({ ...advancedParams, layout: e.target.value })} fullWidth>
                                    <option value="center">Center</option>
                                    <option value="left">Left Aligned</option>
                                    <option value="card">Card Style</option>
                                </Select>
                            </div>
                        </div>
                    </>
                )}

                {selectedTemplate === 'hero' && (
                    <>
                        <ConfigField label="Name" value={heroParams.name} onChange={v => setHeroParams({ ...heroParams, name: v })} />
                        <ConfigField label="Title" value={heroParams.title} onChange={v => setHeroParams({ ...heroParams, title: v })} />
                        <ConfigField label="Subtitle" value={heroParams.subtitle} onChange={v => setHeroParams({ ...heroParams, subtitle: v })} />
                        <ConfigField label="Location" value={heroParams.location} onChange={v => setHeroParams({ ...heroParams, location: v })} />


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
                                    <option value="purple-cyan">Purple & Cyan</option>
                                    <option value="orange-pink">Orange & Pink</option>
                                    <option value="green-blue">Green & Blue</option>
                                </Select>
                            </div>
                        </div>


                    </>
                )}

                {selectedTemplate === 'ultra' && (
                    <>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label>Component</Label>
                                <Select value={ultraParams.component} onChange={e => setUltraParams({ ...ultraParams, component: e.target.value })} fullWidth>
                                    <option value="stat">Statistic</option>
                                    <option value="quote">Quote</option>
                                    <option value="card">Card</option>
                                    <option value="badge">Badge</option>
                                </Select>
                            </div>
                            <div>
                                <Label>Theme</Label>
                                <Select value={ultraParams.theme} onChange={e => setUltraParams({ ...ultraParams, theme: e.target.value })} fullWidth>
                                    <option value="purple-cyan">Purple/Cyan</option>
                                    <option value="orange-warm">Warm Orange</option>
                                    <option value="green-fresh">Fresh Green</option>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="w-1/4">
                                <ConfigField label="Icon" value={ultraParams.icon} onChange={v => setUltraParams({ ...ultraParams, icon: v })} />
                            </div>
                            <div className="flex-1">
                                <ConfigField label="Title" value={ultraParams.title} onChange={v => setUltraParams({ ...ultraParams, title: v })} />
                            </div>
                        </div>

                        {ultraParams.component === 'stat' && (
                            <div className="grid grid-cols-2 gap-2">
                                <ConfigField label="Value" value={ultraParams.value} onChange={v => setUltraParams({ ...ultraParams, value: v })} />
                                <ConfigField label="Label" value={ultraParams.label} onChange={v => setUltraParams({ ...ultraParams, label: v })} />
                            </div>
                        )}

                        <div>
                            <Label>Content / Quote</Label>
                            <textarea
                                value={ultraParams.content}
                                onChange={(e) => setUltraParams({ ...ultraParams, content: e.target.value })}
                                className="bg-[#222] rounded px-3 py-2 text-sm border border-gray-700 focus:border-purple-500 focus:outline-none text-white w-full h-24 resize-none mt-1"
                            />
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}
