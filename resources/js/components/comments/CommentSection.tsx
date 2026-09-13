import { CommentForm } from '@/components/comments/CommentForm';
import { CommentList } from '@/components/comments/CommentList';
import { Skeleton } from '@/components/ui/skeleton';
import type { Comment } from '@/types/comment';
import { useEffect, useState } from 'react';

interface CommentSectionProps {
    portfolioOwnerId: number;
}

export function CommentSection({ portfolioOwnerId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadComments = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/users/${portfolioOwnerId}/comments`,
                { headers: { Accept: 'application/json' } },
            );

            if (!response.ok) {
                throw new Error('Unable to load comments.');
            }

            const data: Comment[] | { data: Comment[] } = await response.json();
            setComments(Array.isArray(data) ? data : data.data);
        } catch {
            setError('Unable to load comments right now. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadComments();

        const handleCommentsUpdated = () => {
            void loadComments();
        };

        window.addEventListener('comments:updated', handleCommentsUpdated);

        return () =>
            window.removeEventListener(
                'comments:updated',
                handleCommentsUpdated,
            );
    }, [portfolioOwnerId]);

    return (
        <section
            className="mt-16 border-t border-border/60 pt-10"
            aria-labelledby="comments-heading"
        >
            <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                    <p className="mb-2 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                        Community
                    </p>
                    <h2
                        id="comments-heading"
                        className="text-2xl font-medium tracking-tight"
                    >
                        Comments
                    </h2>
                </div>
                <span className="text-sm text-muted-foreground">
                    {comments.length}{' '}
                    {comments.length === 1 ? 'comment' : 'comments'}
                </span>
            </div>

            <div className="space-y-8">
                <CommentForm
                    portfolioOwnerId={portfolioOwnerId}
                    onSuccess={loadComments}
                />

                {loading ? (
                    <div className="space-y-6" aria-label="Loading comments">
                        {[1, 2].map((item) => (
                            <div key={item} className="flex gap-3">
                                <Skeleton className="size-9 rounded-full" />
                                <div className="flex-1 space-y-3">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-16 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <p className="text-sm text-destructive">{error}</p>
                ) : (
                    <CommentList
                        comments={comments}
                        portfolioOwnerId={portfolioOwnerId}
                    />
                )}
            </div>
        </section>
    );
}
