import type { SharedData } from '@/types';
import type {
    ReactableType,
    ReactionSummary,
    ReactionUser,
} from '@/types/reaction';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ReactionButton from './ReactionButton';
import ReactionPicker from './ReactionPicker';

interface ReactionDisplayProps {
    reactableType: ReactableType;
    reactableId: number;
    initialReactions?: ReactionSummary[];
}

interface ToggleResponse {
    message?: string;
    action?: 'added' | 'removed';
}

const reactionUrl = (reactableType: ReactableType, reactableId: number) =>
    reactableType === 'comment'
        ? `/comments/${reactableId}/reactions`
        : `/users/${reactableId}/reactions`;

const xsrfToken = () =>
    decodeURIComponent(
        document.cookie
            .split('; ')
            .find((cookie) => cookie.startsWith('XSRF-TOKEN='))
            ?.split('=')[1] ?? '',
    );

export default function ReactionDisplay({
    reactableType,
    reactableId,
    initialReactions = [],
}: ReactionDisplayProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;
    const [reactions, setReactions] = useState(initialReactions);
    const [loading, setLoading] = useState(initialReactions.length === 0);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadReactions = async (signal?: AbortSignal) => {
        try {
            const response = await fetch(
                reactionUrl(reactableType, reactableId),
                {
                    headers: { Accept: 'application/json' },
                    signal,
                },
            );

            if (!response.ok) throw new Error('Could not load reactions.');

            const result: { reactions: ReactionSummary[] } =
                await response.json();
            setReactions(result.reactions);
            setError(null);
        } catch (loadError) {
            if (
                loadError instanceof DOMException &&
                loadError.name === 'AbortError'
            ) {
                return;
            }
            setError('Reactions could not be loaded.');
        } finally {
            if (!signal?.aborted) setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        void loadReactions(controller.signal);

        return () => controller.abort();
    }, [reactableType, reactableId]);

    const toggleReaction = async (emoji: string) => {
        if (!user) {
            window.location.href = '/login';
            return;
        }

        if (processing) return;

        setProcessing(true);
        setError(null);
        const previousReactions = reactions;
        const existing = reactions.find((reaction) => reaction.emoji === emoji);
        const hasReacted = existing?.has_reacted ?? false;
        const optimisticUser: ReactionUser = {
            id: user.id,
            name: user.name,
            avatar: user.avatar ?? null,
            profile_picture: user.profile_picture ?? null,
        };

        setReactions((current) => {
            if (hasReacted) {
                return current
                    .map((reaction) =>
                        reaction.emoji === emoji
                            ? {
                                  ...reaction,
                                  count: Math.max(0, reaction.count - 1),
                                  has_reacted: false,
                                  users: reaction.users.filter(
                                      (reactingUser) =>
                                          reactingUser.id !== user.id,
                                  ),
                              }
                            : reaction,
                    )
                    .filter((reaction) => reaction.count > 0);
            }

            const existingReaction = current.find(
                (reaction) => reaction.emoji === emoji,
            );

            if (existingReaction) {
                return current.map((reaction) =>
                    reaction.emoji === emoji
                        ? {
                              ...reaction,
                              count: reaction.count + 1,
                              has_reacted: true,
                              users: [...reaction.users, optimisticUser],
                          }
                        : reaction,
                );
            }

            return [
                ...current,
                {
                    emoji,
                    count: 1,
                    users: [optimisticUser],
                    has_reacted: true,
                },
            ];
        });

        try {
            const response = await fetch('/reactions/toggle', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': xsrfToken(),
                },
                body: JSON.stringify({
                    reactable_type: reactableType,
                    reactable_id: reactableId,
                    emoji,
                }),
            });

            const result: ToggleResponse = await response.json();
            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }
            if (!response.ok) {
                throw new Error(result.message ?? 'Could not update reaction.');
            }

            await loadReactions();
        } catch {
            setReactions(previousReactions);
            setError('Your reaction could not be saved. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2" aria-live="polite">
            {reactions.map((reaction) => (
                <ReactionButton
                    key={reaction.emoji}
                    emoji={reaction.emoji}
                    count={reaction.count}
                    hasReacted={reaction.has_reacted}
                    users={reaction.users}
                    onClick={() => void toggleReaction(reaction.emoji)}
                    disabled={processing}
                />
            ))}

            <ReactionPicker
                onSelect={(emoji) => void toggleReaction(emoji)}
                onClose={() => undefined}
            />

            {loading && reactions.length === 0 && (
                <span className="text-xs text-muted-foreground">
                    Loading reactions...
                </span>
            )}
            {error && (
                <span role="status" className="text-xs text-destructive">
                    {error}
                </span>
            )}
            {processing && <span className="sr-only">Updating reaction</span>}
        </div>
    );
}
