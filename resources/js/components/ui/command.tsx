import { cn } from '@/lib/utils';
import * as React from 'react';

const Command = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'flex h-full w-full flex-col overflow-hidden rounded-md border border-zinc-200 bg-white text-zinc-950 shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50',
            className,
        )}
        {...props}
    />
));
Command.displayName = 'Command';

const CommandInput = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement> & {
        onValueChange?: (value: string) => void;
    }
>(({ className, onValueChange, ...props }, ref) => (
    <div
        className="flex items-center border-b border-zinc-200 px-3 dark:border-zinc-800"
        data-command-input-wrapper=""
    >
        <input
            ref={ref}
            className={cn(
                'flex h-10 w-full rounded-md bg-transparent py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-100 dark:placeholder:text-zinc-400',
                className,
            )}
            onChange={(e) => {
                onValueChange?.(e.target.value);
                props.onChange?.(e);
            }}
            {...props}
        />
    </div>
));
CommandInput.displayName = 'CommandInput';

const CommandList = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'max-h-[300px] overflow-x-hidden overflow-y-auto',
            className,
        )}
        {...props}
    />
));
CommandList.displayName = 'CommandList';

const CommandEmpty = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
    <div
        ref={ref}
        className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400"
        {...props}
    />
));
CommandEmpty.displayName = 'CommandEmpty';

const CommandGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        heading?: React.ReactNode;
    }
>(({ className, heading, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'overflow-hidden p-1 text-zinc-900 dark:text-zinc-100',
            className,
        )}
        {...props}
    >
        {heading && (
            <div className="px-2 py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {heading}
            </div>
        )}
        {children}
    </div>
));
CommandGroup.displayName = 'CommandGroup';

const CommandItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        onSelect?: () => void;
    }
>(({ className, onSelect, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm text-zinc-900 transition-colors outline-none select-none hover:bg-zinc-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:text-zinc-100 dark:hover:bg-zinc-800',
            className,
        )}
        onClick={onSelect}
        {...props}
    />
));
CommandItem.displayName = 'CommandItem';

export {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
};
