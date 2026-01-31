import React, { useState, useRef } from 'react';
import { clsx } from 'clsx';
import { User, Sparkles, Bot, Smile, Zap, Loader2 } from 'lucide-react';

interface AvatarSelectorProps {
    onSelect: (file: File) => Promise<void>;
}

const CATEGORIES = [
    { id: '3d', name: '3D Cute', icon: Sparkles, sheet: '/avatars/sheet-3d.png' },
    { id: 'emoji', name: 'Emoji', icon: Smile, sheet: '/avatars/sheet-emoji.png' },
    { id: 'anime', name: 'Anime', icon: Zap, sheet: '/avatars/sheet-anime.png' },
    { id: 'pixel', name: 'Pixel', icon: Bot, sheet: '/avatars/sheet-pixel.png' },
];

const GRID_SIZE = 5; // 5x5 grid
const TOTAL_AVATARS = 25;

export function AvatarSelector({ onSelect }: AvatarSelectorProps) {
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
    const [processing, setProcessing] = useState<number | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleSelect = async (index: number) => {
        if (processing !== null) return;
        setProcessing(index);

        try {
            const category = CATEGORIES.find(c => c.id === activeCategory);
            if (!category) return;

            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = category.sheet;

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Calculate position
            // The sprite sheet is a 5x5 grid.
            // We assume the image is square.
            const spriteWidth = img.width / GRID_SIZE;
            const spriteHeight = img.height / GRID_SIZE;

            const col = index % GRID_SIZE;
            const row = Math.floor(index / GRID_SIZE);

            canvas.width = spriteWidth;
            canvas.height = spriteHeight;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
                img,
                col * spriteWidth, row * spriteHeight, spriteWidth, spriteHeight, // Source
                0, 0, canvas.width, canvas.height // Destination
            );

            canvas.toBlob(async (blob) => {
                if (blob) {
                    const file = new File([blob], `avatar-${category.id}-${index}.png`, { type: 'image/png' });
                    await onSelect(file);
                }
                setProcessing(null);
            }, 'image/png');

        } catch (error) {
            console.error('Error extracting avatar:', error);
            setProcessing(null);
        }
    };

    return (
        <div className="space-y-6">
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Choose a Premium Avatar</h3>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    const isActive = activeCategory === category.id;
                    return (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => setActiveCategory(category.id)}
                            className={clsx(
                                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                                isActive
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            )}
                        >
                            <Icon size={16} />
                            {category.name}
                        </button>
                    );
                })}
            </div>

            {/* Avatar Grid */}
            <div className="grid grid-cols-5 gap-3 max-h-80 overflow-y-auto p-2 scrollbar-thin">
                {Array.from({ length: TOTAL_AVATARS }).map((_, index) => {
                    const category = CATEGORIES.find(c => c.id === activeCategory);
                    if (!category) return null;

                    const col = index % GRID_SIZE;
                    const row = Math.floor(index / GRID_SIZE);

                    // Calculate background position percentages
                    const xPos = (col / (GRID_SIZE - 1)) * 100;
                    const yPos = (row / (GRID_SIZE - 1)) * 100;

                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleSelect(index)}
                            disabled={processing !== null}
                            className={clsx(
                                'relative aspect-square rounded-2xl overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-lg ring-2 ring-transparent hover:ring-indigo-400',
                                processing === index && 'opacity-70 cursor-wait'
                            )}
                            style={{
                                backgroundImage: `url(${category.sheet})`,
                                backgroundSize: '500% 500%',
                                backgroundPosition: `${xPos}% ${yPos}%`,
                            }}
                        >
                            {processing === index && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                                    <Loader2 className="animate-spin text-white" size={20} />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
