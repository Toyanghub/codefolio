import { CommentItem } from '@/components/comments/CommentItem';
import type { Comment } from '@/types/comment';

interface CommentListProps {
    comments: Comment[];
    portfolioOwnerId: number;
}

export function CommentList({ comments, portfolioOwnerId }: CommentListProps) {
    if (comments.length === 0) {
        return (
            <p className="py-6 text-center text-sm text-muted-foreground">
                No comments yet. Be the first to comment!
            </p>
        );
    }

    return (
        <div className="space-y-7">
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    portfolioOwnerId={portfolioOwnerId}
                />
            ))}
        </div>
    );
}
