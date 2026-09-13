import { CommentForm } from '@/components/comments/CommentForm';

interface CommentReplyFormProps {
    portfolioOwnerId: number;
    parentId: number;
    onSuccess: () => void;
    onCancel: () => void;
}

export function CommentReplyForm({
    portfolioOwnerId,
    parentId,
    onSuccess,
    onCancel,
}: CommentReplyFormProps) {
    return (
        <CommentForm
            portfolioOwnerId={portfolioOwnerId}
            parentId={parentId}
            onSuccess={onSuccess}
            onCancel={onCancel}
        />
    );
}
