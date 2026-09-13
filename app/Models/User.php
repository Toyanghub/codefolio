<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'github_id',
        'avatar',
        'is_admin',
        'profile_picture',
        'portfolio_desktop_image',
        'portfolio_mobile_image',
        'website_url',
        'portfolio_description',
        'portfolio_published',
        'portfolio_setup_completed',
        'is_featured',
        'featured_at',
        'email_verified',
        'email_otp',
        'email_otp_expires_at',
        'email_otp_attempts',
    ];

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class);
    }

    public function techStacks(): BelongsToMany
    {
        return $this->belongsToMany(TechStack::class);
    }

    public function professions(): BelongsToMany
    {
        return $this->belongsToMany(Profession::class);
    }

    public function comments(): HasMany
{
    return $this->hasMany(Comment::class, 'user_id');
}

public function portfolioComments(): HasMany
{
    return $this->hasMany(Comment::class, 'portfolio_owner_id');
}

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
        'email_otp',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'email_verified' => 'boolean',
            'email_otp_expires_at' => 'datetime',
            'email_otp_attempts' => 'integer',
        ];
    }
}
