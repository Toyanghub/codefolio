import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ReactionUser } from '@/types/reaction';

interface ReactionTooltipProps {
    users: ReactionUser[];
}

const avatarUrl = (user: ReactionUser) => {
    const path = user.avatar ?? user.profile_picture;

    if (!path) return undefined;
    return path.startsWith('http') || path.startsWith('/')
        ? path
        : `/storage/${path}`;
};

export default function ReactionTooltip({ users }: ReactionTooltipProps) {
    if (users.length === 0) {
        return <span>Be the first to react</span>;
    }

    const visibleUsers = users.slice(0, 4);
    const remainingCount = Math.max(0, users.length - 2);

    return (
        <div className="flex max-w-64 items-center gap-2">
            <div className="flex -space-x-2">
                {visibleUsers.map((user) => (
                    <Avatar
                        key={user.id}
                        className="size-6 border-2 border-primary"
                    >
                        <AvatarImage src={avatarUrl(user)} alt={user.name} />
                        <AvatarFallback className="text-[10px]">
                            {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                ))}
            </div>
            <span className="truncate">
                {users
                    .slice(0, 2)
                    .map((user) => user.name)
                    .join(', ')}
                {remainingCount > 0
                    ? `, and ${remainingCount} ${remainingCount === 1 ? 'other' : 'others'}`
                    : ''}
            </span>
        </div>
    );
}
