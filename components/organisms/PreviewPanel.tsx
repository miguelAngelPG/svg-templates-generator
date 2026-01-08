import React from 'react';
import { Download, Layers, Play, AlertCircle, Image as ImageIcon, Copy } from 'lucide-react';

interface PreviewPanelProps {
    mode?: 'gif' | 'svg'; // NEW PROP

    width: number;
    height: number;
    previewSrc: string;

    // Result URLs
    gifUrl?: string | null;
    svgUrl?: string | null;

    isLoading: boolean;
    status?: string;
    progress?: number;
    error: string | null;
}

export function PreviewPanel({
    mode = 'gif',
    width,
    height,
    previewSrc,
    gifUrl,
    svgUrl,
    isLoading,
    status,
    progress = 0,
    error
}: PreviewPanelProps) {

    const handleCopySvg = async () => {
        if (!svgUrl) return;
        try {
            const res = await fetch(svgUrl);
            const text = await res.text();
            await navigator.clipboard.writeText(text);
            alert('SVG Code copied to clipboard!');
        } catch (e) {
            console.error("Failed to copy SVG", e);
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-3rem)]">

            {/* Live Preview Section */}
            <div className="flex-1 flex flex-col gap-2 relative bg-[#151515] border border-gray-800 rounded-lg overflow-hidden">
                <div className="absolute top-0 left-0 right-0 p-2 bg-[#111] border-b border-gray-800 flex items-center gap-2 z-10">
                    <Layers className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-mono text-gray-400">LIVE PREVIEW</span>
                </div>
                <div className="flex-1 flex items-center justify-center p-8 pt-12 overflow-hidden bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5">
                    <iframe
                        srcDoc={previewSrc}
                        title="Live Preview"
                        className="border-0 shadow-2xl shadow-black"
                        style={{
                            width: `${width}px`,
                            height: `${height}px`,
                            maxWidth: '100%',
                            maxHeight: '100%',
                            transition: 'all 0.3s ease'
                        }}
                    />
                </div>
            </div>

            {/* Result Section (GIF or SVG) */}
            <div className="flex-1 flex flex-col gap-2 relative bg-[#151515] border border-gray-800 rounded-lg overflow-hidden">
                <div className="absolute top-0 left-0 right-0 p-2 bg-[#111] border-b border-gray-800 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                        {mode === 'gif' ? <Play className="w-4 h-4 text-green-500" /> : <ImageIcon className="w-4 h-4 text-pink-500" />}
                        <span className="text-xs font-mono text-gray-400">
                            {mode === 'gif' ? 'GENERATED GIF' : 'GENERATED SVG'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* SVG Specific Actions */}
                        {mode === 'svg' && svgUrl && (
                            <button onClick={handleCopySvg} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors mr-2">
                                <Copy className="w-3 h-3" /> Copy Code
                            </button>
                        )}

                        {(gifUrl || svgUrl) && (
                            <a
                                href={gifUrl || svgUrl || '#'}
                                download={mode === 'gif' ? "animation.gif" : "image.svg"}
                                className={`flex items-center gap-1 text-xs ${mode === 'gif' ? 'text-purple-400 hover:text-purple-300' : 'text-pink-400 hover:text-pink-300'}`}
                            >
                                <Download className="w-3 h-3" /> Download
                            </a>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-8 pt-12 bg-black/50">

                    {/* LOADING STATE */}
                    {isLoading && (
                        <div className="flex flex-col items-center gap-4 text-gray-500 w-1/2">
                            {mode === 'gif' ? (
                                <>
                                    <div className="flex justify-between w-full text-xs text-purple-400 font-mono">
                                        <span>RENDER_JOB: {status?.toUpperCase()}</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-purple-600 h-full transition-all duration-300 ease-out"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </>
                            ) : (
                                <div className="animate-pulse text-pink-400 text-sm font-mono">
                                    Generating Vector Graphics...
                                </div>
                            )}
                        </div>
                    )}

                    {/* WAITING STATE */}
                    {!isLoading && !gifUrl && !svgUrl && !error && (
                        <div className="text-gray-600 text-sm">
                            {mode === 'gif' ? 'Waiting for generation...' : 'Ready to create SVG'}
                        </div>
                    )}

                    {/* ERROR STATE */}
                    {error && (
                        <div className="flex items-center gap-2 text-red-500">
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* RESULT DISPLAY */}
                    {!isLoading && (gifUrl || svgUrl) && (
                        <img
                            src={gifUrl || svgUrl || ''}
                            alt="Result"
                            className="max-w-full max-h-full shadow-2xl"
                            style={mode === 'svg' ? { minWidth: '50%' } : {}}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
