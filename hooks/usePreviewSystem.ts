import { useState, useEffect } from 'react';

interface UsePreviewSystemParams {
    html: string;
    css: string;
    width: number;
    height: number;
    bg: string;
}

export function usePreviewSystem({ html, css, width, height, bg }: UsePreviewSystemParams) {
    const [previewSrc, setPreviewSrc] = useState('');

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
                        margin: 0;
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

    return { previewSrc };
}
