import { Check, ChevronsUpDown, X } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface MultiSelectOption {
    label: string;
    value: string;
    category?: string;
}

interface MultiSelectProps {
    options: MultiSelectOption[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    className?: string;
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = 'Select options...',
    className,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');

    const handleUnselect = (value: string) => {
        onChange(selected.filter((s) => s !== value));
    };

    const handleSelect = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((s) => s !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const handleClearAll = () => {
        onChange([]);
    };

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase()),
    );

    // Group options by category
    const groupedOptions = filteredOptions.reduce(
        (acc, option) => {
            const category = option.category || 'Other';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(option);
            return acc;
        },
        {} as Record<string, MultiSelectOption[]>,
    );

    // Category display names
    const categoryNames: Record<string, string> = {
        skills: 'Skills',
        techStack: 'Tech Stack',
        profession: 'Profession',
        Other: 'Other',
    };

    const selectedOptions = options.filter((option) =>
        selected.includes(option.value),
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        'w-full justify-between',
                        !selected.length && 'text-muted-foreground',
                        className,
                    )}
                >
                    <div className="flex flex-1 flex-wrap gap-1">
                        {selected.length > 0 ? (
                            <>
                                {selectedOptions.slice(0, 2).map((option) => (
                                    <Badge
                                        key={option.value}
                                        variant="secondary"
                                        className="mr-1"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUnselect(option.value);
                                        }}
                                    >
                                        {option.label}
                                        <button
                                            className="ml-1 rounded-full ring-offset-background outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleUnselect(
                                                        option.value,
                                                    );
                                                }
                                            }}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleUnselect(option.value);
                                            }}
                                        >
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        </button>
                                    </Badge>
                                ))}
                                {selected.length > 2 && (
                                    <Badge variant="secondary" className="mr-1">
                                        +{selected.length - 2} more
                                    </Badge>
                                )}
                            </>
                        ) : (
                            placeholder
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput
                        placeholder="Search skills..."
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        {search && filteredOptions.length === 0 && (
                            <CommandEmpty>No skills found.</CommandEmpty>
                        )}
                        {Object.entries(groupedOptions).map(
                            ([category, categoryOptions]) => (
                                <CommandGroup
                                    key={category}
                                    heading={
                                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                            {categoryNames[category] ||
                                                category}
                                        </span>
                                    }
                                >
                                    {categoryOptions.map((option) => {
                                        const isSelected = selected.includes(
                                            option.value,
                                        );
                                        return (
                                            <CommandItem
                                                key={option.value}
                                                onSelect={() =>
                                                    handleSelect(option.value)
                                                }
                                            >
                                                <div
                                                    className={cn(
                                                        'mr-2 flex h-4 w-4 items-center justify-center rounded border',
                                                        isSelected
                                                            ? 'border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100'
                                                            : 'border-zinc-300 dark:border-zinc-600',
                                                    )}
                                                >
                                                    {isSelected && (
                                                        <Check className="h-3 w-3 text-white dark:text-zinc-900" />
                                                    )}
                                                </div>
                                                <span>{option.label}</span>
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            ),
                        )}
                    </CommandList>
                    {selected.length > 0 && (
                        <div className="flex items-center justify-between border-t p-2">
                            <span className="text-sm text-muted-foreground">
                                {selected.length} selected
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearAll}
                                className="h-8"
                            >
                                Clear all
                            </Button>
                        </div>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
}
