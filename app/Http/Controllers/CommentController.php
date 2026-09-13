<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\PortfolioItem;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CommentController extends Controller
{
    use AuthorizesRequests;

    public function index(PortfolioItem $portfolio): JsonResponse
    {
        $comments = $portfolio->comments()
            ->topLevel()
            ->with(['user', 'replies.user'])
            ->latest()
            ->get();

        $comments->each(function (Comment $comment): void {
            $this->addAuthorizationFlags($comment);

            $comment->replies->each(function (Comment $reply): void {
                $this->addAuthorizationFlags($reply);
            });
        });

        return response()->json($comments);
    }

    public function store(Request $request, PortfolioItem $portfolio): JsonResponse
    {
        $this->authorize('create', Comment::class);

        $validated = $request->validate([
            'content' => 'required|string|min:1|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        if (isset($validated['parent_id']) && ! Comment::query()
            ->whereKey($validated['parent_id'])
            ->where('portfolio_id', $portfolio->id)
            ->exists()) {
            return response()->json([
                'message' => 'The selected parent comment does not belong to this portfolio.',
                'errors' => [
                    'parent_id' => ['The selected parent comment does not belong to this portfolio.'],
                ],
            ], 422);
        }

        $comment = $portfolio->comments()->create([
            'user_id' => $request->user()->id,
            'parent_id' => $validated['parent_id'] ?? null,
            'content' => $validated['content'],
        ]);

        return response()->json($comment->load('user'), 201);
    }

    public function update(Request $request, Comment $comment): JsonResponse
    {
        $this->authorize('update', $comment);

        $validated = $request->validate([
            'content' => 'required|string|min:1|max:1000',
        ]);

        $comment->update($validated);

        return response()->json($comment->fresh()->load('user'));
    }

    public function destroy(Comment $comment): JsonResponse
    {
        $this->authorize('delete', $comment);
        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully.',
        ]);
    }

    private function addAuthorizationFlags(Comment $comment): void
    {
        $user = auth()->user();

        $comment->setAttribute('can_edit', $user !== null && Gate::forUser($user)->allows('update', $comment));
        $comment->setAttribute('can_delete', $user !== null && Gate::forUser($user)->allows('delete', $comment));
    }
}