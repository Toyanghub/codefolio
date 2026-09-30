<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Reaction;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReactionController extends Controller
{
    use AuthorizesRequests;

    public function toggle(Request $request): JsonResponse
    {
        $this->authorize('create', Reaction::class);

        $validated = $request->validate([
            'reactable_type' => 'required|in:comment,portfolio',
            'reactable_id' => 'required|integer',
            'emoji' => 'required|string|max:10',
        ]);

        $reactable = $this->resolveReactable(
            $validated['reactable_type'],
            (int) $validated['reactable_id'],
        );

        if (! $reactable) {
            return response()->json([
                'message' => 'The target does not exist.',
            ], 404);
        }

        $user = $request->user();
        $existingReaction = Reaction::query()
            ->where('user_id', $user->id)
            ->where('reactable_type', $validated['reactable_type'])
            ->where('reactable_id', $validated['reactable_id'])
            ->where('emoji', $validated['emoji'])
            ->first();

        if ($existingReaction) {
            $this->authorize('delete', $existingReaction);
            $existingReaction->delete();

            return response()->json([
                'message' => 'Reaction removed.',
                'action' => 'removed',
                'emoji' => $validated['emoji'],
            ]);
        }

        $reaction = Reaction::create([
            'user_id' => $user->id,
            'reactable_type' => $validated['reactable_type'],
            'reactable_id' => $validated['reactable_id'],
            'emoji' => $validated['emoji'],
        ]);

        return response()->json([
            'message' => 'Reaction added.',
            'action' => 'added',
            'reaction' => $reaction->load('user:id,name,avatar,profile_picture'),
        ], 201);
    }

    public function forComment(Comment $comment): JsonResponse
    {
        $this->authorize('viewAny', Reaction::class);

        return response()->json([
            'reactions' => $comment->getReactionSummary(),
        ]);
    }

    public function forPortfolio(User $portfolioOwner): JsonResponse
    {
        $this->authorize('viewAny', Reaction::class);

        $reactions = $portfolioOwner->portfolioReactions()
            ->with('user:id,name,avatar,profile_picture')
            ->get()
            ->groupBy('emoji')
            ->map(function ($reactions, $emoji): array {
                return [
                    'emoji' => $emoji,
                    'count' => $reactions->count(),
                    'users' => $reactions->pluck('user')->map(function ($user): array {
                        return [
                            'id' => $user->id,
                            'name' => $user->name,
                            'avatar' => $user->avatar,
                            'profile_picture' => $user->profile_picture,
                        ];
                    })->values(),
                    'has_reacted' => auth()->check()
                        && $reactions->contains('user_id', auth()->id()),
                ];
            })
            ->values()
            ->toArray();

        return response()->json([
            'reactions' => $reactions,
        ]);
    }

    private function resolveReactable(string $type, int $id): ?object
    {
        return match ($type) {
            'comment' => Comment::find($id),
            'portfolio' => User::find($id),
            default => null,
        };
    }
}