<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\PortfolioItem;
use App\Models\User;

class CommentPolicy
{
    public function viewAny(User $user, PortfolioItem $portfolio): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Comment $comment): bool
    {
        return $user->id === $comment->user_id;
    }

    public function delete(User $user, Comment $comment): bool
    {
        return $user->id === $comment->user_id || $user->is_admin;
    }
}