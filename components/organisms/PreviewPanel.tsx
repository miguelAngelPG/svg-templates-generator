import React from 'react';
import { Download, Layers, Play, AlertCircle } from 'lucide-react';

interface PreviewPanelProps {
    width: number;
    height: number;
    previewSrc: string;
    gifUrl: string | null;
    isLoading: boolean;
    status: string;
    progress: number;
    error: string | null;
}

export function PreviewPanel({
    width,
    height,
    previewSrc,
    gifUrl,
    isLoading,
    status,
    progress,
    error
}: PreviewPanelProps) {
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

            {/* GIF Result Section */}
            <div className="flex-1 flex flex-col gap-2 relative bg-[#151515] border border-gray-800 rounded-lg overflow-hidden">
                <div className="absolute top-0 left-0 right-0 p-2 bg-[#111] border-b border-gray-800 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                        <Play className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-mono text-gray-400">GENERATED GIF</span>
                    </div>
                    {gifUrl && (
                        <a href={gifUrl} download="studio-animation.gif" className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300">
                            <Download className="w-3 h-3" /> Download
                        </a>
                    )}
                </div>
                <div className="flex-1 flex items-center justify-center p-8 pt-12 bg-black/50">

                    {isLoading && (
                        <div className="flex flex-col items-center gap-4 text-gray-500 w-1/2">
                            <div className="flex justify-between w-full text-xs text-purple-400 font-mono">
                                <span>RENDER_JOB: {status.toUpperCase()}</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-purple-600 h-full transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {!isLoading && !gifUrl && !error && (
                        <div className="text-gray-600 text-sm">Waiting for generation...</div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 text-red-500">
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {!isLoading && gifUrl && (
                        <img src={gifUrl} alt="Generated GIF" className="max-w-full max-h-full shadow-2xl" />
                    )}
                </div>
            </div>
        </div>
    );
}
