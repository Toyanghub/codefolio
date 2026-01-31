<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsletterSubscription extends Model
{
    protected $fillable = [
        'email',
        'name',
        'ip_address',
        'is_active',
        'subscribed_at',
        'unsubscribed_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'subscribed_at' => 'datetime',
        'unsubscribed_at' => 'datetime',
    ];

    /**
     * Scope to get only active subscriptions.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Check if email is already subscribed.
     */
    public static function isSubscribed(string $email): bool
    {
        return static::where('email', $email)
            ->where('is_active', true)
            ->exists();
    }

    /**
     * Subscribe a new email.
     */
    public static function subscribe(string $email, ?string $name = null, ?string $ipAddress = null): self
    {
        return static::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'ip_address' => $ipAddress,
                'is_active' => true,
                'subscribed_at' => now(),
                'unsubscribed_at' => null,
            ]
        );
    }

    /**
     * Unsubscribe an email.
     */
    public function unsubscribe(): bool
    {
        return $this->update([
            'is_active' => false,
            'unsubscribed_at' => now(),
        ]);
    }
}
