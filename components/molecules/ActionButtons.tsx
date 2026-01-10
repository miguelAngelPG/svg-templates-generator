import React, { useState } from 'react';
import { Copy, Download, Check, Code } from 'lucide-react';

interface ActionButtonsProps {
    generatedUrl: string;
    templateName: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ generatedUrl, templateName }) => {
    const [copiedMd, setCopiedMd] = useState(false);
    const [copiedHtml, setCopiedHtml] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const handleCopyMarkdown = () => {
        const key = templateName.charAt(0).toUpperCase() + templateName.slice(1);
        const md = `![${key} Metrics](${generatedUrl})`;
        navigator.clipboard.writeText(md);
        setCopiedMd(true);
        setTimeout(() => setCopiedMd(false), 2000);
    };

    const handleCopyHtml = () => {
        const key = templateName.charAt(0).toUpperCase() + templateName.slice(1);
        const html = `<img src="${generatedUrl}" alt="${key} Metrics" />`;
        navigator.clipboard.writeText(html);
        setCopiedHtml(true);
        setTimeout(() => setCopiedHtml(false), 2000);
    };

    const handleDownload = async () => {
        try {
            setDownloading(true);
            const response = await fetch(generatedUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${templateName}-metrics.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleCopyMarkdown}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#222] hover:bg-[#333] border border-gray-700 rounded text-xs text-gray-300 transition-all font-mono"
            >
                {copiedMd ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                {copiedMd ? 'Copied MD' : 'Markdown'}
            </button>

            <button
                onClick={handleCopyHtml}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#222] hover:bg-[#333] border border-gray-700 rounded text-xs text-gray-300 transition-all font-mono"
            >
                {copiedHtml ? <Check className="w-3 h-3 text-green-400" /> : <Code className="w-3 h-3" />}
                {copiedHtml ? 'Copied HTML' : 'HTML'}
            </button>

            <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-800 rounded text-xs text-blue-300 transition-all"
                disabled={downloading}
            >
                <Download className="w-3 h-3" />
                {downloading ? 'Saving...' : 'Download SVG'}
            </button>
        </div>
    );
};
