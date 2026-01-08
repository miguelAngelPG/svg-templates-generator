'use client';

import { useState } from 'react';
import { StudioSidebar } from '@/components/organisms/StudioSidebar';
import { PreviewPanel } from '@/components/organisms/PreviewPanel';
import { useSvgGeneration } from '@/hooks/useSvgGeneration';
import { usePreviewSystem } from '@/hooks/usePreviewSystem';

export default function GeneratorPage() {
    // 1. Local State
    const [html, setHtml] = useState('<div style="color: white; font-size: 48px; text-align: center; padding-top: 150px;">✨ Hello World ✨</div>');
    const [css, setCss] = useState('@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }\n\ndiv { animation: pulse 2s infinite; }');
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(400);
    const [bg, setBg] = useState('#050505');

    // 2. Custom Hooks
    const { svgUrl, error, isLoading, generate } = useSvgGeneration();
    const { previewSrc } = usePreviewSystem({ html, css, width, height, bg });

    // 3. Handlers
    const handleGenerate = () => {
        generate({ html, css, width, height, bg });
    };

    // 4. Render
    return (
        <div className="h-full bg-black text-white p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans overflow-hidden">
            <StudioSidebar
                mode="svg"
                html={html} setHtml={setHtml}
                css={css} setCss={setCss}
                width={width} setWidth={setWidth}
                height={height} setHeight={setHeight}
                bg={bg} setBg={setBg}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                status="idle"
                progress={0}
            />

            <PreviewPanel
                mode="svg"
                width={width}
                height={height}
                previewSrc={previewSrc}
                svgUrl={svgUrl}
                isLoading={isLoading}
                error={error}
            />
        </div>
    );
}