import React from 'react';
import { Download, Copy, ExternalLink, Github } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';

interface TemplatePreviewProps {
    generatedUrl: string;
    isLoading: boolean;
    templateName: string; // To use in alt text
}

export function TemplatePreview({ generatedUrl, isLoading, templateName }: TemplatePreviewProps) {
    const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${generatedUrl}` : generatedUrl;

    const handleCopyMarkdown = () => {
        const markdown = `![${templateName}](${fullUrl})`;
        navigator.clipboard.writeText(markdown);
        alert('Markdown copied: ' + markdown);
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex-1 flex flex-col gap-2 relative bg-[#151515] border border-gray-800 rounded-lg overflow-hidden">
                <div className="absolute top-0 left-0 right-0 p-2 bg-[#111] border-b border-gray-800 flex items-center justify-between z-10">
                    <span className="text-xs font-mono text-gray-400">TEMPLATE PREVIEW</span>
                    <div className="flex gap-2">
                        <Button
                            variant="primary"
                            className="py-1 px-3 text-xs h-8"
                            onClick={handleCopyMarkdown}
                            icon={<Github className="w-3 h-3" />}
                        >
                            Copy for GitHub
                        </Button>
                        <Button
                            variant="outline"
                            className="py-1 px-3 text-xs h-8"
                            onClick={() => window.open(fullUrl, '_blank')}
                            icon={<ExternalLink className="w-3 h-3" />}
                        >
                            Open URL
                        </Button>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-8 pt-12 overflow-auto bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5">

                    {isLoading ? (
                        <div className="animate-spin w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full" />
                    ) : (
                        generatedUrl ? (
                            <img
                                src={generatedUrl}
                                alt="Template Preview"
                                className="max-w-full shadow-2xl rounded-lg border border-white/10"
                            />
                        ) : (
                            <div className="text-gray-600 font-mono text-xs">Waiting for parameters...</div>
                        )
                    )}

                </div>

                <div className="p-4 bg-[#111] border-t border-gray-800 flex flex-col gap-4">
                    <div>
                        <Label>GitHub Markdown</Label>
                        <div className="flex gap-2">
                            <Input
                                value={`![${templateName}](${fullUrl})`}
                                readOnly
                                fullWidth
                                onClick={(e) => e.currentTarget.select()}
                                className="font-mono text-xs text-cyan-400"
                            />
                            <Button
                                variant="outline"
                                className="w-12 px-0 shrink-0"
                                onClick={handleCopyMarkdown}
                                title="Copy Markdown"
                                icon={<Copy className="w-4 h-4" />}
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Direct URL</Label>
                        <div className="flex gap-2">
                            <Input
                                value={fullUrl}
                                readOnly
                                fullWidth
                                onClick={(e) => e.currentTarget.select()}
                                className="font-mono text-xs text-gray-400"
                            />
                            <Button
                                variant="outline"
                                className="w-12 px-0 shrink-0"
                                onClick={() => {
                                    navigator.clipboard.writeText(fullUrl);
                                    alert('URL copied to clipboard!');
                                }}
                                title="Copy URL"
                                icon={<Copy className="w-4 h-4" />}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
