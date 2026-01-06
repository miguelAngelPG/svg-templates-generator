'use client';

import { useState, useEffect } from 'react';

export default function TemplatesPage() {
    const [selectedTemplate, setSelectedTemplate] = useState('advanced'); // advanced, hero, basic
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // --- Template Configs ---

    // 1. Advanced Card
    const [advancedParams, setAdvancedParams] = useState({
        content: 'Building the future with Next.js',
        title: 'Project Update',
        subtitle: 'Q1 2026 Roadmap',
        width: 800,
        height: 400,
        theme: 'dark', // dark, light, purple, cyan, orange
        layout: 'center' // center, left, card
    });

    // 2. Hero Section
    const [heroParams, setHeroParams] = useState({
        name: 'Miguel A. Pacheco',
        title: 'Tech Lead & Architect',
        subtitle: 'Human first, Engineer second',
        location: 'Hidalgo, MX',
        theme: 'purple-cyan', // purple-cyan, orange-pink, green-blue
        lang: 'en' // es, en
    });

    // 3. Ultra Template (New)
    const [ultraParams, setUltraParams] = useState({
        component: 'stat', // card, quote, stat, badge
        title: 'Total Users',
        content: 'Active monthly users growing steadily',
        icon: '🚀',
        value: '12.5k',
        label: 'Growth',
        theme: 'purple-cyan', // purple-cyan, orange-warm, green-fresh
    });

    // Generate URL based on selection
    const generate = () => {
        let url = '';
        if (selectedTemplate === 'advanced') {
            const params = new URLSearchParams(advancedParams as any);
            url = `/api/custom/advanced?${params.toString()}`;
        } else if (selectedTemplate === 'hero') {
            const params = new URLSearchParams(heroParams as any);
            url = `/api/templates/hero?${params.toString()}`;
        } else if (selectedTemplate === 'ultra') {
            const params = new URLSearchParams(ultraParams as any);
            url = `/api/custom/ultra?${params.toString()}`;
        }
        setGeneratedUrl(url);
    };

    // Auto-generate on changes with debounce
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            generate();
        }, 500);
        return () => clearTimeout(timer);
    }, [selectedTemplate, advancedParams, heroParams, ultraParams]);

    return (
        <div style={{ minHeight: '100vh', background: '#050505', color: 'white', padding: '40px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>🧩 Template Generator</h1>
                <p style={{ color: '#999', marginBottom: '40px' }}>Generate specialized SVGs using parameterized templates</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>

                    {/* LEFT: Controls */}
                    <div>
                        {/* Selector */}
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', color: '#999' }}>Select Template</label>
                            <select
                                value={selectedTemplate}
                                onChange={(e) => { setSelectedTemplate(e.target.value); setGeneratedUrl(''); }}
                                style={{ width: '100%', padding: '12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '16px' }}
                            >
                                <option value="advanced">Advanced Card (Marketing)</option>
                                <option value="hero">Hero Section (Profile)</option>
                                <option value="ultra">Ultra Components (Stats/Quotes)</option>
                            </select>
                        </div>

                        {/* Dynamic Inputs */}
                        <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222' }}>
                            <h2 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                                Parameters
                            </h2>

                            {selectedTemplate === 'advanced' && (
                                <div style={{ display: 'grid', gap: '15px' }}>
                                    <label>
                                        <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>TITLE</span>
                                        <input type="text" value={advancedParams.title} onChange={e => setAdvancedParams({ ...advancedParams, title: e.target.value })}
                                            style={inputStyle} />
                                    </label>
                                    <label>
                                        <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>CONTENT</span>
                                        <input type="text" value={advancedParams.content} onChange={e => setAdvancedParams({ ...advancedParams, content: e.target.value })}
                                            style={inputStyle} />
                                    </label>
                                    <label>
                                        <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>SUBTITLE</span>
                                        <input type="text" value={advancedParams.subtitle} onChange={e => setAdvancedParams({ ...advancedParams, subtitle: e.target.value })}
                                            style={inputStyle} />
                                    </label>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <label>
                                            <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>THEME</span>
                                            <select value={advancedParams.theme} onChange={e => setAdvancedParams({ ...advancedParams, theme: e.target.value })} style={inputStyle}>
                                                <option value="dark">Dark</option>
                                                <option value="light">Light</option>
                                                <option value="purple">Purple</option>
                                                <option value="cyan">Cyan</option>
                                                <option value="orange">Orange</option>
                                            </select>
                                        </label>
                                        <label>
                                            <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>LAYOUT</span>
                                            <select value={advancedParams.layout} onChange={e => setAdvancedParams({ ...advancedParams, layout: e.target.value })} style={inputStyle}>
                                                <option value="center">Center</option>
                                                <option value="left">Left Aligned</option>
                                                <option value="card">Card Style</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {selectedTemplate === 'hero' && (
                                <div style={{ display: 'grid', gap: '15px' }}>
                                    <label>
                                        <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>NAME</span>
                                        <input type="text" value={heroParams.name} onChange={e => setHeroParams({ ...heroParams, name: e.target.value })}
                                            style={inputStyle} />
                                    </label>
                                    <label>
                                        <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>TITLE</span>
                                        <input type="text" value={heroParams.title} onChange={e => setHeroParams({ ...heroParams, title: e.target.value })}
                                            style={inputStyle} />
                                    </label>
                                    <label>
                                        <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>SUBTITLE</span>
                                        <input type="text" value={heroParams.subtitle} onChange={e => setHeroParams({ ...heroParams, subtitle: e.target.value })}
                                            style={inputStyle} />
                                    </label>
                                    <label>
                                        <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>LOCATION</span>
                                        <input type="text" value={heroParams.location} onChange={e => setHeroParams({ ...heroParams, location: e.target.value })}
                                            style={inputStyle} />
                                    </label>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <label>
                                            <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>THEME</span>
                                            <select value={heroParams.theme} onChange={e => setHeroParams({ ...heroParams, theme: e.target.value })} style={inputStyle}>
                                                <option value="purple-cyan">Purple & Cyan</option>
                                                <option value="orange-pink">Orange & Pink</option>
                                                <option value="green-blue">Green & Blue</option>
                                            </select>
                                        </label>
                                        <label>
                                            <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>LANGUAGE</span>
                                            <select value={heroParams.lang} onChange={e => setHeroParams({ ...heroParams, lang: e.target.value })} style={inputStyle}>
                                                <option value="en">English</option>
                                                <option value="es">Español</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {selectedTemplate === 'ultra' && (
                                <div style={{ display: 'grid', gap: '15px' }}>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <label>
                                            <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>COMPONENT</span>
                                            <select value={ultraParams.component} onChange={e => setUltraParams({ ...ultraParams, component: e.target.value })} style={inputStyle}>
                                                <option value="stat">Statistic</option>
                                                <option value="quote">Quote</option>
                                                <option value="card">Card</option>
                                                <option value="badge">Badge</option>
                                            </select>
                                        </label>
                                        <label>
                                            <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>THEME</span>
                                            <select value={ultraParams.theme} onChange={e => setUltraParams({ ...ultraParams, theme: e.target.value })} style={inputStyle}>
                                                <option value="purple-cyan">Purple/Cyan</option>
                                                <option value="orange-warm">Warm Orange</option>
                                                <option value="green-fresh">Fresh Green</option>
                                            </select>
                                        </label>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '10px' }}>
                                        <label>
                                            <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>ICON</span>
                                            <input type="text" value={ultraParams.icon} onChange={e => setUltraParams({ ...ultraParams, icon: e.target.value })}
                                                style={inputStyle} />
                                        </label>
                                        <label>
                                            <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>TITLE</span>
                                            <input type="text" value={ultraParams.title} onChange={e => setUltraParams({ ...ultraParams, title: e.target.value })}
                                                style={inputStyle} />
                                        </label>
                                    </div>

                                    {(ultraParams.component === 'stat') && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            <label>
                                                <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>VALUE</span>
                                                <input type="text" value={ultraParams.value} onChange={e => setUltraParams({ ...ultraParams, value: e.target.value })}
                                                    style={inputStyle} />
                                            </label>
                                            <label>
                                                <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>LABEL</span>
                                                <input type="text" value={ultraParams.label} onChange={e => setUltraParams({ ...ultraParams, label: e.target.value })}
                                                    style={inputStyle} />
                                            </label>
                                        </div>
                                    )}

                                    <label>
                                        <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>CONTENT / QUOTE</span>
                                        <textarea value={ultraParams.content} onChange={e => setUltraParams({ ...ultraParams, content: e.target.value })}
                                            style={{ ...inputStyle, height: '80px', fontFamily: 'sans-serif' }} />
                                    </label>

                                </div>
                            )}


                        </div>
                    </div>

                    {/* RIGHT: Preview */}
                    <div>
                        <div style={{ position: 'sticky', top: '40px' }}>
                            <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#999' }}>Live Preview</h2>

                            {generatedUrl || isLoading ? (
                                <div>
                                    <div style={{
                                        border: '1px solid #333',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        background: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzIyMiIgZmlsbC1vcGFjaXR5PSIwLjEiPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgLz48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgLz48L3N2Zz4=') #111`,
                                        marginBottom: '20px',
                                        position: 'relative',
                                        minHeight: '200px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {isLoading && (
                                            <div style={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: 'rgba(0,0,0,0.5)',
                                                backdropFilter: 'blur(5px)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                zIndex: 10
                                            }}>
                                                <div style={{
                                                    width: '30px',
                                                    height: '30px',
                                                    border: '3px solid rgba(255,255,255,0.3)',
                                                    borderTopColor: '#00f2ff',
                                                    borderRadius: '50%',
                                                    animation: 'spin 1s linear infinite'
                                                }} />
                                                <style jsx>{`
                                                    @keyframes spin {
                                                        to { transform: rotate(360deg); }
                                                    }
                                                `}</style>
                                            </div>
                                        )}
                                        {generatedUrl && (
                                            <img
                                                src={generatedUrl}
                                                alt="Preview"
                                                style={{ width: '100%', display: 'block', opacity: isLoading ? 0.5 : 1, transition: 'opacity 0.3s' }}
                                                onLoad={() => setIsLoading(false)}
                                                onError={() => setIsLoading(false)}
                                            />
                                        )}
                                    </div>

                                    <div style={{ background: '#111', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
                                        <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>IMAGE URL (Use in README/Web)</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input
                                                readOnly
                                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}${generatedUrl}`}
                                                style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '12px', color: '#00f2ff' }}
                                            />
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`${window.location.origin}${generatedUrl}`);
                                                    alert('Copied!');
                                                }}
                                                style={{ background: '#222', border: '1px solid #333', color: 'white', padding: '0 15px', borderRadius: '6px', cursor: 'pointer' }}
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    border: '1px dashed #333',
                                    borderRadius: '12px',
                                    height: '300px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#444'
                                }}>
                                    Select template and click Update
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    background: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: '6px',
    padding: '10px',
    color: 'white',
    fontSize: '14px',
    outline: 'none'
};
