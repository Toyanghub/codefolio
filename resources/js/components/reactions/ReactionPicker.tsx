import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '🎉', '🔥', '😍', '👏'];

interface ReactionPickerProps {
    onSelect: (emoji: string) => void;
    onClose: () => void;
}

export default function ReactionPicker({
    onSelect,
    onClose,
}: ReactionPickerProps) {
    const [open, setOpen] = useState(false);

    const setPopoverOpen = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) onClose();
    };

    const selectEmoji = (emoji: string) => {
        onSelect(emoji);
        setPopoverOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label="Add reaction"
                    className="h-9 rounded-full px-3 text-xs text-muted-foreground"
                >
                    <Plus aria-hidden="true" />
                    <span>Add reaction</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-auto max-w-[calc(100vw-2rem)] p-2"
                aria-label="Choose a reaction"
            >
                <div className="grid grid-cols-7 gap-1">
                    {EMOJI_OPTIONS.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => selectEmoji(emoji)}
                            className="flex size-10 items-center justify-center rounded-md text-xl transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                            aria-label={`React with ${emoji}`}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
