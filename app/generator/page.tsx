'use client';

import { useState } from 'react';

// Helper to extract text from HTML
function extractTextFromHtml(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
}

export default function GifGeneratorPage() {
    const [html, setHtml] = useState('<div style="color: white; font-size: 48px; text-align: center; padding-top: 150px;">✨ Hello World ✨</div>');
    const [css, setCss] = useState('@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }\n\ndiv { animation: pulse 2s infinite; }');
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(400);
    const [duration, setDuration] = useState(3);
    const [fps, setFps] = useState(30);
    const [bg, setBg] = useState('#050505');

    const [loadingSvg, setLoadingSvg] = useState(false);
    const [loadingGif, setLoadingGif] = useState(false);

    // Only used for global errors or GIF results
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    // SVG Proposals
    const [svgUrl, setSvgUrl] = useState('');
    const [advancedUrl, setAdvancedUrl] = useState('');
    const [basicUrl, setBasicUrl] = useState('');

    const handleGenerateSvg = async () => {
        setLoadingSvg(true);
        setError('');

        try {
            // 1. Generate SVG via POST
            const response = await fetch('/api/custom/html', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    html,
                    css,
                    width,
                    height,
                    bg
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("🚀 ~ handleGenerateSvg ~ data:", data)
                if (data.svg) {
                    const blob = new Blob([data.svg], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    setSvgUrl(url);
                }
            } else {
                console.error("Failed to generate SVG preview");
                setError('Failed to generate SVG preview');
            }

            const textContent = extractTextFromHtml(html);

            // Advanced Proposal
            const advancedParams = new URLSearchParams({
                content: textContent || 'Hello World',
                title: 'Generated',
                subtitle: 'SVG Proposal',
                width: width.toString(),
                height: height.toString(),
                theme: 'purple',
                layout: 'card'
            });
            setAdvancedUrl(`/api/custom/advanced?${advancedParams.toString()}`);

            // Basic Proposal
            const basicParams = new URLSearchParams({
                content: textContent || 'Hello World',
                width: width.toString(),
                height: height.toString(),
                theme: 'light'
            });
            setBasicUrl(`/api/custom/basic?${basicParams.toString()}`);

        } catch (e) {
            console.error("Error generating SVG URLs", e);
            setError('Error generating SVG');
        } finally {
            setLoadingSvg(false);
        }
    };

    const handleGenerateGif = async () => {
        setLoadingGif(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('/api/generate-gif', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ html, css, width, height, duration, fps, bg }),
            });

            const data = await response.json();

            if (data.success) {
                setResult(data);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate GIF');
        } finally {
            setLoadingGif(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#050505', color: 'white', padding: '40px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>🎨 GIF & SVG Generator</h1>
                <p style={{ color: '#999', marginBottom: '40px' }}>Create animated GIFs and get SVG proposals automatically</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    {/* Left: Inputs */}
                    <div>
                        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Configuration</h2>

                        <label style={{ display: 'block', marginBottom: '15px' }}>
                            <span style={{ display: 'block', marginBottom: '5px', color: '#999' }}>HTML</span>
                            <textarea
                                value={html}
                                onChange={(e) => setHtml(e.target.value)}
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    background: '#1a1a1a',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    color: 'white',
                                    fontFamily: 'monospace',
                                }}
                            />
                        </label>

                        <label style={{ display: 'block', marginBottom: '15px' }}>
                            <span style={{ display: 'block', marginBottom: '5px', color: '#999' }}>CSS (with @keyframes)</span>
                            <textarea
                                value={css}
                                onChange={(e) => setCss(e.target.value)}
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    background: '#1a1a1a',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    color: 'white',
                                    fontFamily: 'monospace',
                                }}
                            />
                        </label>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                            <label>
                                <span style={{ display: 'block', marginBottom: '5px', color: '#999' }}>Width</span>
                                <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '10px', color: 'white' }} />
                            </label>

                            <label>
                                <span style={{ display: 'block', marginBottom: '5px', color: '#999' }}>Height</span>
                                <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '10px', color: 'white' }} />
                            </label>

                            <label>
                                <span style={{ display: 'block', marginBottom: '5px', color: '#999' }}>Duration (s)</span>
                                <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '10px', color: 'white' }} />
                            </label>

                            <label>
                                <span style={{ display: 'block', marginBottom: '5px', color: '#999' }}>FPS</span>
                                <input type="number" value={fps} onChange={(e) => setFps(Number(e.target.value))} style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '10px', color: 'white' }} />
                            </label>
                        </div>

                        <label style={{ display: 'block', marginBottom: '20px' }}>
                            <span style={{ display: 'block', marginBottom: '5px', color: '#999' }}>Background</span>
                            <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} placeholder="#050505" style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '10px', color: 'white' }} />
                        </label>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button
                                onClick={handleGenerateSvg}
                                disabled={loadingSvg}
                                style={{
                                    flex: 1,
                                    background: loadingSvg ? '#333' : 'linear-gradient(135deg, #FF6B6B, #556270)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    color: 'white',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: loadingSvg ? 'not-allowed' : 'pointer',
                                    opacity: loadingSvg ? 0.7 : 1,
                                }}
                            >
                                {loadingSvg ? '🖌️ Generating SVG...' : '✨ Create SVG Preview'}
                            </button>

                            <button
                                onClick={handleGenerateGif}
                                disabled={loadingGif}
                                style={{
                                    flex: 1,
                                    background: loadingGif ? '#333' : 'linear-gradient(135deg, #4316db, #00d4ff)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    color: 'white',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: loadingGif ? 'not-allowed' : 'pointer',
                                    opacity: loadingGif ? 0.7 : 1,
                                }}
                            >
                                {loadingGif ? '⏳ Generating GIF... (30s)' : '🎥 Create Animated GIF'}
                            </button>
                        </div>
                    </div>

                    {/* Right: Result */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                        {/* Error Message */}
                        {error && (
                            <div style={{ background: '#3d1a1a', border: '1px solid #ff4444', borderRadius: '8px', padding: '20px' }}>
                                <p style={{ color: '#ff4444' }}>❌ {error}</p>
                            </div>
                        )}

                        {/* Main Result: GIFs */}
                        <div>
                            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>🎥 Animated GIF</h2>

                            {loadingGif && !result ? (
                                <div style={{
                                    background: '#1a1a1a',
                                    border: '1px dashed #333',
                                    borderRadius: '8px',
                                    height: '300px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '15px',
                                    color: '#666'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        border: '4px solid rgba(255,255,255,0.1)',
                                        borderTopColor: '#00d4ff',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }} />
                                    <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                    <p>Rendering Frames & Encoding GIF...</p>
                                    <p style={{ fontSize: '12px', opacity: 0.5 }}>This can take up to 30 seconds</p>
                                </div>
                            ) : result ? (
                                /* ... result block ... */
                                <div>
                                    <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
                                        <img src={result.url} alt="Generated GIF" style={{ width: '100%', borderRadius: '8px' }} />
                                    </div>
                                    <div style={{ background: '#0a0a0a', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <span style={{ color: '#00ff9d' }}>✅ Generated Successfully</span>
                                            <span style={{ color: '#666' }}>{result.sizeKB} KB</span>
                                        </div>
                                        <input type="text" readOnly value={result.url} onClick={(e) => e.currentTarget.select()} style={{ width: '100%', background: '#1a1a1a', border: 'none', color: '#00d4ff', fontSize: '12px', padding: '5px' }} />
                                    </div>
                                </div>
                            ) : (
                                !svgUrl && (
                                    <div style={{ background: '#1a1a1a', border: '1px dashed #333', borderRadius: '8px', padding: '40px 20px', textAlign: 'center' }}>
                                        <p style={{ color: '#666', fontSize: '14px' }}>Click Generate to create assets</p>
                                    </div>
                                )
                            )}
                        </div>


                        {/* SVG Proposals */}
                        {svgUrl && (
                            <div>
                                <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>✨ SVG Export</h2>

                                {/* 1. Direct SVG */}
                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#999' }}>Vector SVG (Native)</h3>
                                    <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px', marginBottom: '10px' }}>
                                        <img src={svgUrl} alt="Generated SVG" style={{ width: '100%', borderRadius: '8px' }} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <a href={svgUrl} target="_blank" rel="noreferrer" style={{ color: '#00d4ff', fontSize: '14px', textDecoration: 'none' }}>⬇️ Open SVG</a>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const res = await fetch(svgUrl);
                                                    const text = await res.text();
                                                    navigator.clipboard.writeText(text);
                                                    alert('SVG Code copied to clipboard!');
                                                } catch (e) {
                                                    console.error("Failed to copy SVG", e);
                                                    alert('Failed to copy SVG code');
                                                }
                                            }}
                                            style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '14px' }}
                                        >
                                            📋 Copy SVG Code
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!result && !error && !loadingSvg && !loadingGif && (
                            <div style={{ background: '#1a1a1a', border: '1px dashed #333', borderRadius: '8px', padding: '60px 20px', textAlign: 'center' }}>
                                <p style={{ color: '#666', fontSize: '14px' }}>Assets will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}