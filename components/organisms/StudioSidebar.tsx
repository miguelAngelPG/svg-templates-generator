import React from 'react';
import { Code, FileVideo, Settings, Image as ImageIcon } from 'lucide-react';
import { Button } from '../atoms/Button';
import { CodeEditor } from '../molecules/CodeEditor';
import { Input } from '../atoms/Input';

interface StudioSidebarProps {
    mode?: 'gif' | 'svg'; // NEW PROP

    html: string;
    setHtml: (val: string) => void;
    css: string;
    setCss: (val: string) => void;
    width: number;
    setWidth: (val: number) => void;
    height: number;
    setHeight: (val: number) => void;
    bg: string;
    setBg: (val: string) => void;

    // GIF Specific (Optional in SVG mode)
    duration?: number;
    setDuration?: (val: number) => void;
    fps?: number;
    setFps?: (val: number) => void;

    onGenerate: () => void;
    isLoading: boolean;
    status: string;
    progress: number;
}

const QUALITY_PRESETS = [
    { label: 'Cinema Quality (5s @ 60fps)', duration: 5, fps: 60, desc: 'Ultra smooth, heavy file' },
    { label: 'Standard TV (10s @ 30fps)', duration: 10, fps: 30, desc: 'Balanced' },
    { label: 'Anime Style (20s @ 15fps)', duration: 20, fps: 15, desc: 'Choppy artist style' },
    { label: 'Long Duration (30s @ 10fps)', duration: 30, fps: 10, desc: 'Maximum length' }
];

export function StudioSidebar({
    mode = 'gif',
    html, setHtml,
    css, setCss,
    width, setWidth,
    height, setHeight,
    duration = 3, setDuration,
    fps = 30, setFps,
    bg, setBg,
    onGenerate,
    isLoading,
    status,
    progress
}: StudioSidebarProps) {

    // Derived state for the select value
    const currentPreset = QUALITY_PRESETS.find(p => p.duration === duration && p.fps === fps);
    const isCustom = !currentPreset;

    const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const idx = Number(e.target.value);
        if (idx >= 0 && setDuration && setFps) {
            const preset = QUALITY_PRESETS[idx];
            setDuration(preset.duration);
            setFps(preset.fps);
        }
    };

    const getButtonLabel = () => {
        if (mode === 'svg') {
            return isLoading ? 'Generating SVG...' : 'Generate SVG';
        }
        if (status === 'starting') return 'Starting Engine...';
        if (status === 'processing') return `Rendering ${progress}%`;
        return 'Generate GIF';
    };

    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-3rem)]">
            <div className="flex items-center gap-2 mb-2">
                {mode === 'gif' ? <Code className="text-purple-400" /> : <ImageIcon className="text-pink-400" />}
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    {mode === 'gif' ? 'GIF Studio' : 'SVG Generator'}
                </h1>
            </div>

            <CodeEditor label="HTML" value={html} onChange={setHtml} className="flex-1" />
            <CodeEditor label="CSS (Animations supported)" value={css} onChange={setCss} className="flex-1" />

            {/* Settings Row */}
            <div className="grid grid-cols-3 gap-4 bg-[#111] p-4 rounded-lg border border-gray-800">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Dimensions</label>
                    <div className="flex gap-2">
                        <Input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} fullWidth />
                        <span className="text-gray-600 self-center">x</span>
                        <Input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} fullWidth />
                    </div>
                </div>

                {/* TIMING CONTROL (ONLY FOR GIF) */}
                {mode === 'gif' && setDuration && setFps ? (
                    <div>
                        <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <Settings className="w-3 h-3" /> Duration & Quality
                        </label>
                        <div className="flex flex-col gap-1">
                            <select
                                className="bg-[#222] rounded px-2 py-1 text-sm border border-gray-700 focus:border-purple-500 focus:outline-none text-white w-full"
                                onChange={handlePresetChange}
                                value={currentPreset ? QUALITY_PRESETS.indexOf(currentPreset) : -1}
                            >
                                {isCustom && <option value={-1}>Custom ({duration}s / {fps}fps)</option>}
                                {QUALITY_PRESETS.map((p, i) => (
                                    <option key={i} value={i}>{p.label}</option>
                                ))}
                            </select>
                            <div className="text-[10px] text-gray-500 font-mono text-center">
                                ~{duration * fps} frames total
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center text-gray-600 text-xs italic">
                        Static SVG (No Timing)
                    </div>
                )}

                <div>
                    <label className="block text-xs text-gray-500 mb-1">Background</label>
                    <div className="flex gap-2 items-center">
                        <Input type="color" value={bg} onChange={e => setBg(e.target.value)} className="h-full bg-transparent cursor-pointer w-10 p-0" />
                        <Input type="text" value={bg} onChange={e => setBg(e.target.value)} fullWidth />
                    </div>
                </div>
            </div>

            <Button
                onClick={onGenerate}
                isLoading={isLoading}
                loadingText={getButtonLabel()}
                icon={mode === 'gif' ? <FileVideo className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                className="w-full"
                variant={mode === 'svg' ? 'primary' : 'primary'} // can customize color later
            >
                {getButtonLabel()}
            </Button>
        </div>
    );
}
