import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
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
    const [content, setContent] = useState('');
    const [processing, setProcessing] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setValidationError(null);
        setProcessing(true);

        fetch(`/users/${portfolioOwnerId}/comments`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': decodeURIComponent(
                    document.cookie
                        .split('; ')
                        .find((cookie) => cookie.startsWith('XSRF-TOKEN='))
                        ?.split('=')[1] ?? '',
                ),
            },
            body: JSON.stringify({ content, parent_id: parentId }),
        })
            .then(async (response) => {
                if (response.status === 422) {
                    const result = await response.json();
                    setValidationError(
                        result.errors?.content?.[0] ?? result.message,
                    );
                    return;
                }

                if (!response.ok) {
                    throw new Error('Unable to post this comment.');
                }

                setContent('');
                onSuccess?.();
            })
            .catch(() => setError('Unable to post this comment right now.'))
            .finally(() => setProcessing(false));
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
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder={
                    parentId ? 'Write a reply...' : 'Share your thoughts...'
                }
                maxLength={1000}
                disabled={processing}
                aria-label={parentId ? 'Reply content' : 'Comment content'}
            />
            {validationError && (
                <p className="text-sm text-destructive">{validationError}</p>
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
                <Button type="submit" disabled={processing || !content.trim()}>
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
