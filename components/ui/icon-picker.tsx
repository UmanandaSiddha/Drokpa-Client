"use client";

import { icons, Search, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState, ComponentType, UIEvent } from "react";

const ICON_NAMES = Object.keys(icons);
const INITIAL_ICON_BATCH = 100;
const ICON_BATCH_SIZE = 100;
const SCROLL_THRESHOLD = 120;

interface IconPickerProps {
    value: string;
    onChange: (iconName: string) => void;
    className?: string;
}

export function IconPicker({ value, onChange, className = "" }: IconPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [visibleCount, setVisibleCount] = useState(INITIAL_ICON_BATCH);
    const iconComponentCache = useRef(
        new Map<string, ComponentType<{ size?: number; className?: string }>>()
    );

    const getDynamicIcon = useCallback((iconName: string) => {
        const cachedIcon = iconComponentCache.current.get(iconName);
        if (cachedIcon) return cachedIcon;

        const DynamicIcon = dynamic(async () => {
            const mod = await import("lucide-react");
            return (mod as any)[iconName] ?? mod.Tag;
        }, { ssr: false }) as ComponentType<{ size?: number; className?: string }>;

        iconComponentCache.current.set(iconName, DynamicIcon);
        return DynamicIcon;
    }, []);

    const filteredIcons = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return ICON_NAMES;

        return ICON_NAMES.filter((name) => name.toLowerCase().includes(q));
    }, [search]);

    const displayedIcons = useMemo(() => {
        return filteredIcons.slice(0, visibleCount);
    }, [filteredIcons, visibleCount]);

    useEffect(() => {
        if (!isOpen) return;
        setVisibleCount(INITIAL_ICON_BATCH);
    }, [search, isOpen]);

    const loadMoreIcons = useCallback(() => {
        setVisibleCount((prev) => {
            if (prev >= filteredIcons.length) return prev;
            return Math.min(prev + ICON_BATCH_SIZE, filteredIcons.length);
        });
    }, [filteredIcons.length]);

    const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        const nearBottom = scrollHeight - scrollTop - clientHeight <= SCROLL_THRESHOLD;

        if (nearBottom) {
            loadMoreIcons();
        }
    }, [loadMoreIcons]);

    const SelectedIcon = useMemo(() => {
        return getDynamicIcon(value);
    }, [getDynamicIcon, value]);

    return (
        <div className={`relative ${className}`}>
            {/* Selected Icon Display */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-10 px-3 border border-gray-300 rounded-lg flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
                <div className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center bg-white">
                    <SelectedIcon size={18} className="text-gray-700" />
                </div>
                <span className="flex-1 text-left text-sm text-gray-700">{value}</span>
                {isOpen ? <X size={16} className="text-gray-400" /> : <Search size={16} className="text-gray-400" />}
            </button>

            {/* Dropdown Modal */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full mt-2 left-0 w-full md:w-120 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-120 flex flex-col">
                        {/* Search Input */}
                        <div className="p-3 border-b border-gray-200">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search icons (e.g. home, user, calendar...)"
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#005246] focus:border-transparent"
                                    autoFocus
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Showing {displayedIcons.length} of {filteredIcons.length} icons {search && `for "${search}"`}
                            </p>
                        </div>

                        {/* Icon Grid */}
                        <div className="flex-1 overflow-y-auto p-3" onScroll={handleScroll}>
                            <div className="grid grid-cols-6 gap-2">
                                {displayedIcons.map((name) => {
                                    const Icon = getDynamicIcon(name);

                                    const isSelected = name === value;

                                    return (
                                        <button
                                            key={name}
                                            type="button"
                                            onClick={() => {
                                                onChange(name);
                                                setIsOpen(false);
                                                setSearch("");
                                            }}
                                            className={`
                                                aspect-square flex flex-col items-center justify-center gap-1.5 
                                                rounded-lg border transition-all hover:bg-gray-50
                                                ${isSelected
                                                    ? 'border-[#005246] bg-[#005246]/5 ring-2 ring-[#005246]/20'
                                                    : 'border-gray-200'
                                                }
                                            `}
                                            title={name}
                                        >
                                            <Icon size={20} />
                                            <span className="text-[10px] text-gray-600 truncate w-full px-1 text-center leading-tight">
                                                {name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
