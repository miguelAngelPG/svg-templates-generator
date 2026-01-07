'use client';

import { useState, useEffect } from 'react';
import { Play, Download, Code, Layers, FileVideo, RefreshCw } from 'lucide-react';

export default function GifStudioPage() {
    const [html, setHtml] = useState('<div class="container">\n  <div class="blob"></div>\n  <div class="text">Hello GIF</div>\n</div>');
    const [css, setCss] = useState(`body {
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blob {
  width: 150px;
  height: 150px;
  background: linear-gradient(45deg, #ff00cc, #3333ff);
  border-radius: 50%;
  animation: blob-bounce 2s infinite ease-in-out;
}

.text {
  position: absolute;
  color: white;
  font-size: 24px;
  font-weight: bold;
  font-family: sans-serif;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

@keyframes blob-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}`);

    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(400);
    const [duration, setDuration] = useState(3);
    const [fps, setFps] = useState(30);
    const [bg, setBg] = useState('#050505');

    const [loading, setLoading] = useState(false);
    const [gifUrl, setGifUrl] = useState<string | null>(null);
    const [previewSrc, setPreviewSrc] = useState('');

    // Update Live Preview
    useEffect(() => {
        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        width: 100vw; 
                        height: 100vh; 
                        background: ${bg}; 
                        overflow: hidden; 
                        display: flex;
                    }
                    /* Container fit logic for preview */
                    #preview-root {
                        width: ${width}px;
                        height: ${height}px;
                        position: relative;
                        overflow: hidden;
                        margin: auto;
                    }
                    ${css}
                </style>
            </head>
            <body>
                 <div id="preview-root">
                    ${html}
                 </div>
            </body>
            </html>
        `;
        setPreviewSrc(fullHtml);
    }, [html, css, width, height, bg]);

    const handleGenerate = async () => {
        setLoading(true);
        setGifUrl(null);
        try {
            const response = await fetch('/api/custom/gif', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ html, css, width, height, duration, fps, bg })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setGifUrl(url);
            } else {
                alert('Error generating GIF');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to connect to generator');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
            {/* Editor Console */}
            <div className="flex flex-col gap-4 h-[calc(100vh-3rem)]">
                <div className="flex items-center gap-2 mb-2">
                    <Code className="text-purple-400" />
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        GIF Studio
                    </h1>
                </div>

                {/* HTML Editor */}
                <div className="flex-1 flex flex-col gap-2 bg-[#111] border border-gray-800 rounded-lg p-4">
                    <label className="text-xs text-gray-500 font-mono">HTML</label>
                    <textarea
                        value={html}
                        onChange={(e) => setHtml(e.target.value)}
                        className="flex-1 bg-transparent resize-none focus:outline-none font-mono text-sm text-gray-300"
                        spellCheck={false}
                    />
                </div>

                {/* CSS Editor */}
                <div className="flex-1 flex flex-col gap-2 bg-[#111] border border-gray-800 rounded-lg p-4">
                    <label className="text-xs text-gray-500 font-mono">CSS (Animations supported)</label>
                    <textarea
                        value={css}
                        onChange={(e) => setCss(e.target.value)}
                        className="flex-1 bg-transparent resize-none focus:outline-none font-mono text-sm text-gray-300"
                        spellCheck={false}
                    />
                </div>

                {/* Settings Row */}
                <div className="grid grid-cols-3 gap-4 bg-[#111] p-4 rounded-lg border border-gray-800">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Dimensions</label>
                        <div className="flex gap-2">
                            <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} className="w-full bg-[#222] rounded px-2 py-1 text-sm border border-gray-700" title="Width" />
                            <span className="text-gray-600">x</span>
                            <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full bg-[#222] rounded px-2 py-1 text-sm border border-gray-700" title="Height" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Timing (Sec / FPS)</label>
                        <div className="flex gap-2">
                            <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full bg-[#222] rounded px-2 py-1 text-sm border border-gray-700" title="Duration (s)" />
                            <input type="number" value={fps} onChange={e => setFps(Number(e.target.value))} className="w-full bg-[#222] rounded px-2 py-1 text-sm border border-gray-700" title="FPS" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Background</label>
                        <div className="flex gap-2 items-center">
                            <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="h-full bg-transparent cursor-pointer" />
                            <input type="text" value={bg} onChange={e => setBg(e.target.value)} className="w-full bg-[#222] rounded px-2 py-1 text-sm border border-gray-700" />
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 transition-all shadow-lg shadow-purple-900/20"
                >
                    {loading ? <RefreshCw className="animate-spin w-5 h-5" /> : <FileVideo className="w-5 h-5" />}
                    {loading ? 'Rendering GIF...' : 'Generate GIF'}
                </button>
            </div>

            {/* Preview Console */}
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
                        {loading && (
                            <div className="flex flex-col items-center gap-4 text-gray-500">
                                <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
                                <span className="text-sm">Processing Frames...</span>
                            </div>
                        )}
                        {!loading && !gifUrl && (
                            <div className="text-gray-600 text-sm">Waiting for generation...</div>
                        )}
                        {!loading && gifUrl && (
                            <img src={gifUrl} alt="Generated GIF" className="max-w-full max-h-full shadow-2xl" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
