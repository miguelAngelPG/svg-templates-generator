import { useState } from 'react';

interface GenerateSvgParams {
    html: string;
    css: string;
    width: number;
    height: number;
    bg: string;
}

export function useSvgGeneration() {
    const [isLoading, setIsLoading] = useState(false);
    const [svgUrl, setSvgUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const generate = async (params: GenerateSvgParams) => {
        setIsLoading(true);
        setError(null);
        setSvgUrl(null);

        try {
            const response = await fetch('/api/custom/html', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            });

            if (!response.ok) {
                throw new Error('Failed to generate SVG');
            }

            const data = await response.json();

            if (data.svg) {
                const blob = new Blob([data.svg], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                setSvgUrl(url);
            } else {
                throw new Error('No SVG data received');
            }

        } catch (err) {
            console.error("SVG Generation error:", err);
            setError(err instanceof Error ? err.message : 'Error generating SVG');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        svgUrl,
        error,
        generate
    };
}
