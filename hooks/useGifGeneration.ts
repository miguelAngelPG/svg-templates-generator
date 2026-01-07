import { useState } from 'react';

export type GenerationStatus = 'idle' | 'starting' | 'processing' | 'completed' | 'error';

interface UseGifGenerationParams {
    workerUrl?: string;
}

export interface GenerateParams {
    html: string;
    css: string;
    width: number;
    height: number;
    duration: number;
    fps: number;
    bg: string;
}

export function useGifGeneration({ workerUrl }: UseGifGenerationParams) {
    const [status, setStatus] = useState<GenerationStatus>('idle');
    const [progress, setProgress] = useState(0);
    const [gifUrl, setGifUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const generate = async (params: GenerateParams) => {
        if (!workerUrl) {
            const msg = "Worker URL is not configured (NEXT_PUBLIC_RAILWAY_URL)";
            console.error(msg);
            setError(msg);
            setStatus('error');
            return;
        }

        setStatus('starting');
        setProgress(0);
        setGifUrl(null);
        setError(null);

        try {
            // 1. Start Job
            const response = await fetch(`${workerUrl}/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            });

            if (!response.ok) {
                throw new Error(`Failed to start job: ${response.statusText}`);
            }

            const { jobId } = await response.json();

            // 2. Listen for Events
            setStatus('processing');
            const eventSource = new EventSource(`${workerUrl}/events/${jobId}`);

            eventSource.onmessage = async (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.status === 'processing') {
                        setProgress(data.progress);
                    } else if (data.status === 'completed') {
                        eventSource.close();
                        
                        // Fetch the final blob to display locally
                        const finalRes = await fetch(`${workerUrl}${data.url}`);
                        const blob = await finalRes.blob();
                        const objectUrl = URL.createObjectURL(blob);
                        
                        setGifUrl(objectUrl);
                        setStatus('completed');
                        setProgress(100);
                    } else if (data.status === 'error') {
                        eventSource.close();
                        throw new Error(data.message || 'Worker reported an error');
                    }
                } catch (err) {
                    eventSource.close();
                    console.error("Event processing error:", err);
                    setStatus('error');
                    setError(err instanceof Error ? err.message : 'Unknown error during processing');
                }
            };

            eventSource.onerror = (e) => {
                console.error("EventSource connection error:", e);
                eventSource.close();
                if (status !== 'completed') {
                    setStatus('error');
                    setError('Connection to worker lost');
                }
            };

        } catch (err) {
            console.error("Generation start error:", err);
            setStatus('error');
            setError(err instanceof Error ? err.message : 'Failed to start generation');
        }
    };

    return {
        status,
        progress,
        gifUrl,
        error,
        generate,
        isLoading: status === 'starting' || status === 'processing'
    };
}
