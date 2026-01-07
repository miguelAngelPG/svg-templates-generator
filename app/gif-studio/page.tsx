'use client';

import { useState } from 'react';
import { StudioSidebar } from '@/components/organisms/StudioSidebar';
import { PreviewPanel } from '@/components/organisms/PreviewPanel';
import { useGifGeneration } from '@/hooks/useGifGeneration';
import { usePreviewSystem } from '@/hooks/usePreviewSystem';

const WORKER_URL = process.env.NEXT_PUBLIC_RAILWAY_URL || 'https://tu-proyecto.up.railway.app';

export default function GifStudioPage() {
    // 1. Local State (Form Data)
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

    // 2. Custom Hooks (Logic Logic Logic)
    const { status, progress, gifUrl, error, generate, isLoading } = useGifGeneration({
        workerUrl: WORKER_URL
    });

    const { previewSrc } = usePreviewSystem({ html, css, width, height, bg });

    // 3. Handlers
    const handleGenerate = () => {
        generate({ html, css, width, height, duration, fps, bg });
    };

    // 4. Render (Clean Composition)
    return (
        <div className="min-h-screen bg-black text-white p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
            <StudioSidebar
                html={html} setHtml={setHtml}
                css={css} setCss={setCss}
                width={width} setWidth={setWidth}
                height={height} setHeight={setHeight}
                duration={duration} setDuration={setDuration}
                fps={fps} setFps={setFps}
                bg={bg} setBg={setBg}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                status={status}
                progress={progress}
            />

            <PreviewPanel
                width={width}
                height={height}
                previewSrc={previewSrc}
                gifUrl={gifUrl}
                isLoading={isLoading}
                status={status}
                progress={progress}
                error={error}
            />
        </div>
    );
}