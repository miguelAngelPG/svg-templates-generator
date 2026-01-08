'use client';

import { useTemplateGenerator } from '@/hooks/useTemplateGenerator';
import { TemplateSidebar } from '@/components/organisms/TemplateSidebar';
import { TemplatePreview } from '@/components/organisms/TemplatePreview';

export default function TemplatesPage() {

    // Custom Hook to manage all logic
    const {
        selectedTemplate,
        setSelectedTemplate,
        generatedUrl,
        isLoading,

        advancedParams, setAdvancedParams,
        heroParams, setHeroParams,
        ultraParams, setUltraParams
    } = useTemplateGenerator();

    return (
        <div className="min-h-screen bg-black text-white p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">

            {/* Control Panel */}
            <TemplateSidebar
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}

                advancedParams={advancedParams}
                setAdvancedParams={setAdvancedParams}

                heroParams={heroParams}
                setHeroParams={setHeroParams}

                ultraParams={ultraParams}
                setUltraParams={setUltraParams}
            />

            {/* Preview Panel */}
            <TemplatePreview
                generatedUrl={generatedUrl}
                isLoading={isLoading}
                templateName={selectedTemplate}
            />

        </div>
    );
}
