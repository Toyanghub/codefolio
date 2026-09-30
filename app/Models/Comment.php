<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'portfolio_owner_id',
        'user_id',
        'parent_id',
        'content',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function portfolioOwner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'portfolio_owner_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function reactions(): MorphMany
    {
        return $this->morphMany(Reaction::class, 'reactable');
    }

    public function getReactionSummary(): array
    {
        return $this->reactions()
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
    }

    public function scopeTopLevel(Builder $query): void
    {
        $query->whereNull('parent_id');
    }
}