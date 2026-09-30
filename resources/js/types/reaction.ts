export interface ReactionUser {
    id: number;
    name: string;
    avatar: string | null;
    profile_picture: string | null;
}

export interface ReactionSummary {
    emoji: string;
    count: number;
    users: ReactionUser[];
    has_reacted: boolean;
}

export type ReactableType = 'comment' | 'portfolio';
