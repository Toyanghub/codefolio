import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';

interface CommentFormProps {
    portfolioOwnerId: number;
    parentId?: number;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function CommentForm({
    portfolioOwnerId,
    parentId,
    onSuccess,
    onCancel,
}: CommentFormProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;
    const [error, setError] = useState<string | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
        parent_id: parentId,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        post(`/users/${portfolioOwnerId}/comments`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onSuccess?.();
            },
            onError: () => setError('Unable to post this comment right now.'),
        });
    };

    if (!user) {
        return (
            <div className="rounded-lg border border-border/60 bg-muted/20 p-5">
                <p className="mb-4 text-sm text-muted-foreground">
                    Sign in to join the conversation.
                </p>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        window.location.href = '/login';
                    }}
                >
                    Login to comment
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="space-y-3">
            <Textarea
                value={data.content}
                onChange={(event) => setData('content', event.target.value)}
                placeholder={
                    parentId ? 'Write a reply...' : 'Share your thoughts...'
                }
                maxLength={1000}
                disabled={processing}
                aria-label={parentId ? 'Reply content' : 'Comment content'}
            />
            {errors.content && (
                <p className="text-sm text-destructive">{errors.content}</p>
            )}
            {errors.parent_id && (
                <p className="text-sm text-destructive">{errors.parent_id}</p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex justify-end gap-2">
                {onCancel && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={processing || !data.content.trim()}
                >
                    {processing
                        ? 'Posting...'
                        : parentId
                          ? 'Reply'
                          : 'Post Comment'}
                </Button>
            </div>
        </form>
    );
}
