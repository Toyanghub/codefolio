import { CommentReplyForm } from '@/components/comments/CommentReplyForm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Comment } from '@/types/comment';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface CommentItemProps {
    comment: Comment;
    portfolioOwnerId: number;
    depth?: number;
}

const formatTimeAgo = (date: string) => {
    const seconds = Math.max(
        0,
        Math.floor((Date.now() - new Date(date).getTime()) / 1000),
    );
    const units: [number, string][] = [
        [31536000, 'year'],
        [2592000, 'month'],
        [604800, 'week'],
        [86400, 'day'],
        [3600, 'hour'],
        [60, 'minute'],
    ];

    if (seconds < 60) return 'just now';

    for (const [duration, label] of units) {
        if (seconds >= duration) {
            const count = Math.floor(seconds / duration);
            return `${count} ${label}${count === 1 ? '' : 's'} ago`;
        }
    }

    return 'just now';
};

const getAvatarUrl = (path: string | null) => {
    if (!path) return undefined;
    return path.startsWith('http') || path.startsWith('/')
        ? path
        : `/storage/${path}`;
};

export function CommentItem({
    comment,
    portfolioOwnerId,
    depth = 0,
}: CommentItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { data, setData, put, processing, errors } = useForm({
        content: comment.content,
    });
    const replies = comment.replies ?? [];
    const avatar = getAvatarUrl(
        comment.user.avatar ?? comment.user.profile_picture,
    );

    const saveEdit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(`/comments/${comment.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
                window.dispatchEvent(new Event('comments:updated'));
            },
            onError: () => setError('Unable to update this comment.'),
        });
    };

    const deleteComment = () => {
        if (!window.confirm('Delete this comment?')) return;
        router.delete(`/comments/${comment.id}`, {
            preserveScroll: true,
            onSuccess: () =>
                window.dispatchEvent(new Event('comments:updated')),
            onError: () => setError('Unable to delete this comment.'),
        });
    };

    return (
        <article
            className={
                depth > 0 ? 'ml-6 border-l border-border/60 pl-4 sm:ml-10' : ''
            }
        >
            <div className="flex gap-3">
                <Avatar className="size-9">
                    <AvatarImage src={avatar} alt={comment.user.name} />
                    <AvatarFallback>
                        {comment.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="text-sm font-medium">
                            {comment.user.name}
                        </span>
                        <time
                            className="text-xs text-muted-foreground"
                            dateTime={comment.created_at}
                        >
                            {formatTimeAgo(comment.created_at)}
                        </time>
                    </div>

                    {isEditing ? (
                        <form onSubmit={saveEdit} className="mt-3 space-y-3">
                            <Textarea
                                value={data.content}
                                onChange={(event) =>
                                    setData('content', event.target.value)
                                }
                                maxLength={1000}
                                disabled={processing}
                            />
                            {errors.content && (
                                <p className="text-sm text-destructive">
                                    {errors.content}
                                </p>
                            )}
                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={
                                        processing || !data.content.trim()
                                    }
                                >
                                    {processing ? 'Saving...' : 'Save'}
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setIsEditing(false)}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <p className="mt-2 text-sm leading-6 whitespace-pre-wrap text-foreground/85">
                            {comment.content}
                        </p>
                    )}

                    {error && (
                        <p className="mt-2 text-sm text-destructive">{error}</p>
                    )}
                    {!isEditing && (
                        <div className="mt-3 flex flex-wrap gap-1">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsReplying((value) => !value)}
                            >
                                Reply
                            </Button>
                            {comment.can_edit && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </Button>
                            )}
                            {comment.can_delete && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={deleteComment}
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                    )}

                    {isReplying && (
                        <div className="mt-4">
                            <CommentReplyForm
                                portfolioOwnerId={portfolioOwnerId}
                                parentId={comment.id}
                                onSuccess={() => {
                                    setIsReplying(false);
                                    window.dispatchEvent(
                                        new Event('comments:updated'),
                                    );
                                }}
                                onCancel={() => setIsReplying(false)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {replies.length > 0 && depth < 4 && (
                <div className="mt-6 space-y-6">
                    {replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            portfolioOwnerId={portfolioOwnerId}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </article>
    );
}
