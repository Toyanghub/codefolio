# Email OTP Verification System

## Overview

This system implements email verification for new user registrations using One-Time Passwords (OTP). Users receive a 6-digit code via email that must be entered within 15 minutes to verify their account.

## Features

- ✅ 6-digit numeric OTP codes
- ✅ 15-minute expiration time
- ✅ Rate limiting: Maximum 3 OTP requests per hour per user
- ✅ Attempt limiting: Maximum 5 verification attempts per OTP
- ✅ Queued email delivery for better performance
- ✅ Cache-based rate limiting
- ✅ Countdown timer in UI showing remaining time
- ✅ Auto-submit when all 6 digits entered
- ✅ Paste support for 6-digit codes
- ✅ Middleware to protect authenticated routes
- ✅ Dark/light mode support in UI

## Database Schema

The following columns were added to the `users` table:

```sql
email_verified BOOLEAN DEFAULT FALSE
email_otp VARCHAR(6) NULLABLE
email_otp_expires_at TIMESTAMP NULLABLE
email_otp_attempts INTEGER DEFAULT 0
```

Migration file: `database/migrations/2026_02_04_121104_add_email_verification_columns_to_users_table.php`

## Components

### Backend

#### 1. OtpService (`app/Services/OtpService.php`)

Core service handling OTP logic:

- `generateAndSendOtp(User $user)`: Generates 6-digit OTP and sends via email
- `verifyOtp(User $user, string $otp)`: Validates OTP with expiration and attempt checks
- `getRemainingTime(User $user)`: Returns seconds until OTP expiration
- `canRequestOtp(User $user)`: Checks rate limiting
- Uses Laravel Cache for rate limiting (1 hour TTL)

#### 2. EmailOtpNotification (`app/Notifications/EmailOtpNotification.php`)

Email notification sent to users:

- Implements `ShouldQueue` for async delivery
- Contains 6-digit OTP code
- Warns about 15-minute expiration
- Professional email template

#### 3. EmailVerificationController (`app/Http/Controllers/EmailVerificationController.php`)

Handles OTP verification flow:

- `show()`: Display verification page with countdown timer
- `verifyOtp()`: Process OTP submission and verify code
- `resendOtp()`: Generate and send new OTP (with rate limiting)
- Uses `redirect()->intended()` for proper post-verification navigation

#### 4. EnsureEmailIsVerified Middleware (`app/Http/Middleware/EnsureEmailIsVerified.php`)

Protects routes requiring verified email:

- Checks `user->email_verified` status
- Uses `redirect()->guest()` to save intended URL
- Redirects unverified users to `/verify-otp`
- Applied to settings and admin routes

### Frontend

#### verify-email-otp.tsx (`resources/js/pages/auth/verify-email-otp.tsx`)

React/TypeScript verification page:

- 6 individual input boxes for OTP digits
- Auto-focus next input on digit entry
- Backspace navigation between inputs
- Paste support for 6-digit codes
- Auto-submit when all 6 digits entered
- Countdown timer (MM:SS format)
- Resend button with rate limit feedback
- Error messages with remaining attempts
- Dark mode support

### Configuration

#### Routes (`routes/web.php`)

```php
// Email OTP verification routes (requires auth)
Route::get('/verify-otp', [EmailVerificationController::class, 'show']);
Route::post('/verify-otp', [EmailVerificationController::class, 'verifyOtp']);
Route::post('/verify-otp/resend', [EmailVerificationController::class, 'resendOtp']);
```

#### Protected Routes

Settings routes (`routes/settings.php`) and admin routes require `EnsureEmailIsVerified` middleware.

#### Fortify Config (`config/fortify.php`)

```php
'home' => '/verify-otp'  // Redirect here after registration/login
```

## User Flow

### Registration Flow

1. User fills out registration form
2. `CreateNewUser` action creates user with `email_verified = false`
3. OTP is generated and sent via email
4. User redirected to `/verify-otp`
5. User enters 6-digit code
6. System validates OTP:
    - Checks expiration (15 minutes)
    - Checks attempts (max 5)
    - Verifies code matches
7. On success: `email_verified = true`, redirect to intended page or home
8. On failure: Error message with remaining attempts

### Resend Flow

1. User clicks "Resend Code" button
2. System checks rate limit (max 3 per hour)
3. If allowed:
    - Generates new 6-digit OTP
    - Resets expiration to 15 minutes
    - Resets attempts to 0
    - Sends new email
    - Shows success message
4. If rate limited: Shows error message

### Protected Route Access

1. User tries to access protected route (e.g., `/settings/profile`)
2. Middleware checks `email_verified` status
3. If not verified:
    - Saves intended URL
    - Redirects to `/verify-otp`
4. After verification:
    - Redirects to originally intended URL

## Rate Limiting

### OTP Request Limit

- Maximum: 3 requests per hour per user
- Stored in Laravel Cache with 1-hour TTL
- Key format: `otp_requests:{user_id}`

### OTP Verification Attempts

- Maximum: 5 attempts per OTP code
- Stored in database: `email_otp_attempts` column
- Reset to 0 when new OTP generated

### Expiration

- OTP expires 15 minutes after generation
- Timestamp stored in: `email_otp_expires_at` column
- Countdown timer shown in UI

## Security Features

1. **OTP Hidden from API Responses**
    - `email_otp` added to User model `$hidden` array
    - Prevents accidental exposure in API responses

2. **Rate Limiting**
    - Prevents spam/abuse with 3 requests per hour limit
    - Cache-based for better performance

3. **Attempt Limiting**
    - Maximum 5 verification attempts per OTP
    - Prevents brute force attacks

4. **Time-Based Expiration**
    - OTPs expire after 15 minutes
    - Countdown timer visible to user

5. **Queued Email Delivery**
    - Emails sent asynchronously via Laravel Queue
    - Prevents registration delays

6. **Middleware Protection**
    - Routes automatically protected via middleware
    - No manual checks needed in controllers

## Testing

### Manual Testing

1. Register a new account
2. Check email for 6-digit OTP code
3. Enter code on verification page
4. Verify countdown timer works
5. Test paste functionality with 6-digit code
6. Test resend button (works 3 times, then rate limited)
7. Test wrong code (5 attempts allowed)
8. Try accessing `/settings/profile` before verification (should redirect)
9. After verification, access should work

### Edge Cases to Test

- Expired OTP (wait 15+ minutes)
- Maximum attempts exceeded (5 wrong codes)
- Rate limit exceeded (request 4th OTP within 1 hour)
- Paste non-numeric characters (should filter)
- Paste code with spaces (should work)
- Already verified user accessing `/verify-otp`

## Files Modified/Created

### Created Files

1. `app/Services/OtpService.php` - Core OTP logic
2. `app/Notifications/EmailOtpNotification.php` - Email template
3. `app/Http/Controllers/EmailVerificationController.php` - Verification endpoints
4. `app/Http/Middleware/EnsureEmailIsVerified.php` - Route protection
5. `resources/js/pages/auth/verify-email-otp.tsx` - Frontend UI
6. `database/migrations/2026_02_04_121104_add_email_verification_columns_to_users_table.php` - Database schema

### Modified Files

1. `app/Models/User.php` - Added OTP fields to fillable, hidden, casts
2. `app/Actions/Fortify/CreateNewUser.php` - Integrated OTP generation
3. `routes/web.php` - Added OTP routes, updated admin middleware
4. `routes/settings.php` - Added EnsureEmailIsVerified middleware
5. `config/fortify.php` - Updated home path
6. `app/Providers/FortifyServiceProvider.php` - Added custom authentication

## Future Enhancements

- Add SMS OTP option
- Add "Remember this device" feature
- Add email change verification
- Add admin bypass for testing
- Add OTP analytics/logging
- Add custom email templates per app
- Add multi-language support for emails

## Troubleshooting

### OTP Email Not Received

1. Check queue is running: `php artisan queue:work`
2. Check mail configuration in `.env`
3. Check spam folder
4. Check logs: `storage/logs/laravel.log`

### Rate Limit Issues

1. Clear cache: `php artisan cache:clear`
2. Check cache driver configuration
3. Verify Cache is working: `php artisan cache:table` (if using database)

### Verification Loop

1. Check `email_verified` column in database
2. Verify middleware is applied correctly
3. Check Fortify `home` path configuration
4. Check `redirect()->intended()` usage in controller

### Frontend Build Errors

1. Run `npm install` to ensure dependencies installed
2. Run `npm run build` to rebuild assets
3. Check for TypeScript errors
4. Verify all imports are correct

## Constants

```php
OTP_EXPIRATION_MINUTES = 15
MAX_OTP_ATTEMPTS = 5
MAX_OTP_REQUESTS_PER_HOUR = 3
```

These can be adjusted in `app/Services/OtpService.php` if needed.
