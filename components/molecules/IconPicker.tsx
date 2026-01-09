import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../atoms/Input';

interface IconPickerProps {
    selectedIcons: string[];
    onToggleIcon: (slug: string) => void;
}

// Minimal fallback list
const FALLBACK_ICONS = [
    // We start empty and try to fetch. If fetch fails, we show nothing or error.
    // Or we keep a TINY fallback? User hates the big block.
    // Let's keep just the absolute basics: React, TS, JS.
    'react', 'typescript', 'javascript'
];

export const IconPicker: React.FC<IconPickerProps> = ({ selectedIcons, onToggleIcon }) => {
    const [search, setSearch] = useState('');
    const [allIcons, setAllIcons] = useState<string[]>(FALLBACK_ICONS);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch full icon list on mount
    useEffect(() => {
        const fetchIcons = async () => {
            setIsLoading(true);
            try {
                // Try to fetch the latest list key-values from a CDN that exposes the JSON data
                // JSDelivr is reliable for npm packages
                // User request: "Look I found the json... https://github.com/simple-icons/simple-icons/blob/develop/_data/simple-icons.json"
                // We use the RAW version of that file.
                // Note: The structure is a large array of objects: { title: "React", slug: "react", hex: "..." }
                const res = await fetch('https://unpkg.com/simple-icons/icons.json');
                if (!res.ok) throw new Error('Network response was not ok');

                const data = await res.json();
                console.log("🚀 ~ fetchIcons ~ data:", data.filter((i: any) => (i?.aliases || i?.license) && i))
                // simple-icons _data/simple-icons.json is an array: [{ title: "..", slug: "..", ... }]

                if (Array.isArray(data)) {
                    // simple-icons usually has { title, slug, hex } objects
                    const slugs = data.filter((i: any) => (i?.aliases || i?.license) && i).map((i: any) => i.slug || i.title.toLowerCase().replace(/ /g, ''));
                    setAllIcons(slugs);
                }
            } catch (e) {
                console.warn("Could not fetch dynamic icons, using fallback.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchIcons();
    }, []);

    const filteredIcons = useMemo(() => {
        if (!search) return allIcons.slice(0, 50); // Show top 50 by default
        return allIcons.filter(icon => icon.toLowerCase().includes(search.toLowerCase())).slice(0, 50);
    }, [search, allIcons]);

    return (
        <div className="flex flex-col gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search icons (e.g. react)"
                    fullWidth
                    className="pl-9 h-9 text-xs"
                />
            </div>

            <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
                {filteredIcons.map((slug) => {
                    const isSelected = selectedIcons.includes(slug);
                    return (
                        <button
                            key={slug}
                            onClick={() => onToggleIcon(slug)}
                            className={`
                                flex flex-col items-center justify-center p-2 rounded border transition-all
                                ${isSelected
                                    ? 'bg-purple-900/40 border-purple-500 text-white'
                                    : 'bg-[#1a1a1a] border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                                }
                            `}
                            title={slug}
                        >
                            <img
                                src={`https://cdn.simpleicons.org/${slug}/${isSelected ? 'white' : '9ca3af'}`}
                                alt={slug}
                                className="w-5 h-5 mb-1"
                                loading="lazy"
                            />
                            <span className="text-[9px] truncate w-full text-center opacity-80">{slug}</span>

                            {isSelected && (
                                <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-green-500 shadow-custom" />
                            )}
                        </button>
                    );
                })}
            </div>
            <p className="text-[9px] text-gray-600 text-center mt-1">
                Can't find it? Type the slug in the manual box below.
            </p>
        </div>
    );
};
