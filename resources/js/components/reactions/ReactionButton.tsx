import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ReactionUser } from '@/types/reaction';
import ReactionTooltip from './ReactionTooltip';

interface ReactionButtonProps {
    emoji: string;
    count: number;
    hasReacted: boolean;
    users: ReactionUser[];
    onClick: () => void;
    disabled?: boolean;
}

export default function ReactionButton({
    emoji,
    count,
    hasReacted,
    users,
    onClick,
    disabled = false,
}: ReactionButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    onClick={onClick}
                    disabled={disabled}
                    aria-pressed={hasReacted}
                    aria-label={`${emoji}, ${count} ${count === 1 ? 'reaction' : 'reactions'}${hasReacted ? ', you reacted' : ''}`}
                    className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                        hasReacted
                            ? 'border-primary/40 bg-primary/10 text-foreground hover:bg-primary/15'
                            : 'border-border bg-muted/40 text-foreground hover:bg-muted'
                    }`}
                >
                    <span aria-hidden="true" className="text-base leading-none">
                        {emoji}
                    </span>
                    <span className="tabular-nums">{count}</span>
                </button>
            </TooltipTrigger>
            <TooltipContent>
                <ReactionTooltip users={users} />
            </TooltipContent>
        </Tooltip>
    );
}
