export interface Comment {
    id: number;
    content: string;
    portfolio_owner_id: number;
    user_id: number;
    parent_id: number | null;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        avatar: string | null;
        profile_picture: string | null;
    };
    replies?: Comment[];
    can_edit: boolean;
    can_delete: boolean;
}
