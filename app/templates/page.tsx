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
        ultraParams, setUltraParams,
        stackParams, setStackParams,
        socialParams, setSocialParams,
        philosophyParams, setPhilosophyParams
    } = useTemplateGenerator();

    return (
        <div className="h-full bg-black text-white p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans overflow-hidden">

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

                stackParams={stackParams}
                setStackParams={setStackParams}

                socialParams={socialParams}
                setSocialParams={setSocialParams}

                philosophyParams={philosophyParams}
                setPhilosophyParams={setPhilosophyParams}
            />

            {/* Preview Panel */}
            <TemplatePreview
                generatedUrl={generatedUrl}
                isLoading={isLoading}
                templateName={selectedTemplate}
                advancedParams={advancedParams}
                heroParams={heroParams}
                ultraParams={ultraParams}
                stackParams={stackParams}
                socialParams={socialParams}
                philosophyParams={philosophyParams}
            />

        </div>
    );
}
