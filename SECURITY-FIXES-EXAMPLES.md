# Security Fixes - Implementation Examples

This document provides code examples for fixing the security issues identified in the security audit.

---

## Critical Fix #1: Enhanced File Upload Validation

### Current Code (VULNERABLE)

```php
// app/Http/Controllers/Settings/PortfolioController.php
public function updateDesktopImage(Request $request): RedirectResponse
{
    $request->validate([
        'desktop_image' => ['required', 'image', 'max:2048'], // Too permissive
    ]);

    $path = $request->file('desktop_image')->store('portfolio', 'public');
    // ...
}
```

### Fixed Code (SECURE)

```php
public function updateDesktopImage(Request $request): RedirectResponse
{
    $request->validate([
        'desktop_image' => [
            'required',
            'file',
            'mimes:jpeg,jpg,png,webp', // Specific formats only
            'max:2048',
            'dimensions:max_width=4000,max_height=4000',
        ],
    ]);

    $user = $request->user();

    // Delete old image
    if ($user->portfolio_desktop_image) {
        Storage::disk('public')->delete($user->portfolio_desktop_image);
    }

    // Generate secure filename
    $file = $request->file('desktop_image');
    $extension = $file->getClientOriginalExtension();
    $filename = Str::uuid() . '.' . $extension;

    // Re-encode image to strip metadata and validate content
    try {
        $image = \Intervention\Image\Facades\Image::make($file);
        $image->encode($extension, 85); // 85% quality

        $path = 'portfolio/' . $filename;
        Storage::disk('public')->put($path, (string) $image);
    } catch (\Exception $e) {
        return back()->withErrors(['desktop_image' => 'Invalid or corrupted image file.']);
    }

    $user->update([
        'portfolio_desktop_image' => $path,
    ]);

    return back()->with('status', 'desktop-image-updated');
}
```

### Installation Requirements

```bash
# Install Intervention Image
composer require intervention/image
```

### Configuration

```php
// config/app.php - Add to providers array
'providers' => [
    // ...
    Intervention\Image\ImageServiceProvider::class,
],

// Add to aliases array
'aliases' => [
    // ...
    'Image' => Intervention\Image\Facades\Image::class,
],
```

---

## Critical Fix #2: Replace dangerouslySetInnerHTML

### Current Code (VULNERABLE)

```tsx
// resources/js/components/two-factor-setup-modal.tsx
<div
    className="..."
    dangerouslySetInnerHTML={{
        __html: qrCodeSvg, // Dangerous!
    }}
/>
```

### Fixed Code (SECURE)

```tsx
// Install: npm install react-qr-code
import QRCode from 'react-qr-code';

// Replace the dangerous div with:
<div className="mx-auto flex max-w-md overflow-hidden">
    <div className="border-border mx-auto aspect-square w-64 rounded-lg border bg-white p-4">
        {twoFactorData?.svg ? (
            <QRCode
                value={twoFactorData.svg}
                size={256}
                level="H"
                className="h-full w-full"
            />
        ) : (
            <Spinner />
        )}
    </div>
</div>;
```

### Installation

```bash
npm install react-qr-code
```

---

## Critical Fix #3: Enable Session Encryption

### Update .env File

```env
SESSION_ENCRYPT=true
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax
```

### Update config/session.php

```php
return [
    'encrypt' => env('SESSION_ENCRYPT', true), // Changed default to true

    'secure' => env('SESSION_SECURE_COOKIE', true),

    'http_only' => true,

    'same_site' => env('SESSION_SAME_SITE', 'lax'),

    // ... rest of config
];
```

---

## High Priority Fix #1: Add CAPTCHA to Contact Form

### Install Google reCAPTCHA v3

```bash
composer require google/recaptcha "^1.3"
```

### Update .env

```env
RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

### Create Validation Rule

```php
<?php
// app/Rules/RecaptchaV3.php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use ReCaptcha\ReCaptcha;

class RecaptchaV3 implements ValidationRule
{
    protected float $threshold;

    public function __construct(float $threshold = 0.5)
    {
        $this->threshold = $threshold;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (empty($value)) {
            $fail('The reCAPTCHA verification failed. Please try again.');
            return;
        }

        $recaptcha = new ReCaptcha(config('services.recaptcha.secret_key'));
        $response = $recaptcha->verify($value, request()->ip());

        if (!$response->isSuccess()) {
            $fail('The reCAPTCHA verification failed. Please try again.');
            return;
        }

        if ($response->getScore() < $this->threshold) {
            $fail('The reCAPTCHA score is too low. Please try again.');
        }
    }
}
```

### Update config/services.php

```php
return [
    // ... other services

    'recaptcha' => [
        'site_key' => env('RECAPTCHA_SITE_KEY'),
        'secret_key' => env('RECAPTCHA_SECRET_KEY'),
    ],
];
```

### Update ContactController

```php
<?php
// app/Http/Controllers/ContactController.php

use App\Rules\RecaptchaV3;

public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'message' => 'required|string|max:5000',
        'recaptcha_token' => ['required', new RecaptchaV3(0.5)], // Add this
    ]);

    // Remove recaptcha_token from data before saving
    unset($validated['recaptcha_token']);

    ContactMessage::create($validated);

    return back()->with('success', 'Thank you for your message! We\'ll get back to you soon.');
}
```

### Update Contact Form (Frontend)

```tsx
// resources/js/pages/contact.tsx

// Add script in head
<Head>
    <title>Contact Us</title>
    <script src="https://www.google.com/recaptcha/api.js?render={SITE_KEY}"></script>
</Head>;

// In form submission
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get reCAPTCHA token
    const token = await grecaptcha.execute(SITE_KEY, { action: 'contact' });

    router.post('/contact', {
        name,
        email,
        message,
        recaptcha_token: token,
    });
};
```

---

## High Priority Fix #2: Content Security Policy Headers

### Create Middleware

```php
<?php
// app/Http/Middleware/AddSecurityHeaders.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AddSecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // HSTS - only on HTTPS
        if ($request->secure()) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains; preload'
            );
        }

        // Content Security Policy
        $csp = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com data:",
            "img-src 'self' data: https: blob:",
            "connect-src 'self'",
            "frame-src 'self' https://www.google.com",
        ];

        $response->headers->set('Content-Security-Policy', implode('; ', $csp));

        // Permissions Policy
        $response->headers->set(
            'Permissions-Policy',
            'geolocation=(), microphone=(), camera=()'
        );

        return $response;
    }
}
```

### Register Middleware

```php
// bootstrap/app.php

->withMiddleware(function (Middleware $middleware): void {
    $middleware->web(append: [
        \App\Http\Middleware\AddSecurityHeaders::class,
        HandleAppearance::class,
        HandleInertiaRequests::class,
        AddLinkHeadersForPreloadedAssets::class,
        EnsureEmailIsVerified::class,
    ]);
})
```

---

## High Priority Fix #3: Sanitize User Content

### Install HTML Purifier

```bash
composer require mews/purifier
```

### Publish Config

```bash
php artisan vendor:publish --provider="Mews\Purifier\PurifierServiceProvider"
```

### Update PortfolioController

```php
use Mews\Purifier\Facades\Purifier;

public function updateDescription(Request $request): RedirectResponse
{
    $request->validate([
        'portfolio_description' => ['nullable', 'string', 'max:5000'],
    ]);

    // Sanitize HTML content
    $cleanDescription = Purifier::clean($request->portfolio_description, [
        'HTML.Allowed' => 'p,br,strong,em,u,a[href],ul,ol,li',
        'AutoFormat.RemoveEmpty' => true,
        'AutoFormat.Linkify' => true,
    ]);

    $request->user()->update([
        'portfolio_description' => $cleanDescription,
    ]);

    return back()->with('status', 'description-updated');
}
```

---

## Medium Priority Fix #1: Improve Rate Limiting

### Create Custom Rate Limiter

```php
<?php
// app/Providers/AppServiceProvider.php

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

public function boot(): void
{
    // Authentication rate limits
    RateLimiter::for('login', function (Request $request) {
        return Limit::perMinute(5)->by($request->ip());
    });

    RateLimiter::for('register', function (Request $request) {
        return Limit::perHour(3)->by($request->ip());
    });

    // Admin actions
    RateLimiter::for('admin', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()->id ?? $request->ip());
    });

    // Portfolio views
    RateLimiter::for('portfolio', function (Request $request) {
        return Limit::perMinute(30)->by($request->ip());
    });

    // Contact form (stricter)
    RateLimiter::for('contact', function (Request $request) {
        return [
            Limit::perMinute(3)->by($request->ip()),
            Limit::perDay(10)->by($request->ip()),
        ];
    });
}
```

### Apply Rate Limits

```php
// routes/web.php

// Contact form
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:contact')
    ->name('contact.store');

// Portfolio detail
Route::get('/portfolio/{id}', [PortfolioDetailController::class, 'show'])
    ->middleware('throttle:portfolio')
    ->name('portfolio.detail');

// Admin routes
Route::middleware(['auth', EnsureUserIsAdmin::class, 'throttle:admin'])
    ->prefix('admin')
    ->group(function () {
        // ... admin routes
    });
```

### Configure Fortify Rate Limits

```php
// config/fortify.php

'limiters' => [
    'login' => 'login',      // Use custom limiter
    'two-factor' => 'login', // Use same limiter
],
```

---

## Medium Priority Fix #2: Add Audit Logging

### Create Audit Log Model

```php
<?php
// app/Models/AuditLog.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $fillable = [
        'user_id',
        'event',
        'description',
        'ip_address',
        'user_agent',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

### Create Migration

```bash
php artisan make:migration create_audit_logs_table
```

```php
<?php
// database/migrations/xxxx_xx_xx_create_audit_logs_table.php

public function up(): void
{
    Schema::create('audit_logs', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
        $table->string('event');
        $table->text('description')->nullable();
        $table->string('ip_address', 45)->nullable();
        $table->text('user_agent')->nullable();
        $table->json('metadata')->nullable();
        $table->timestamps();

        $table->index(['user_id', 'event']);
        $table->index('created_at');
    });
}
```

### Create Audit Service

```php
<?php
// app/Services/AuditService.php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Request;

class AuditService
{
    public function log(string $event, string $description, ?int $userId = null, array $metadata = []): void
    {
        AuditLog::create([
            'user_id' => $userId ?? auth()->id(),
            'event' => $event,
            'description' => $description,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'metadata' => $metadata,
        ]);
    }

    public function logAdminAction(string $action, string $description, array $metadata = []): void
    {
        $this->log("admin.$action", $description, auth()->id(), $metadata);
    }

    public function logSecurityEvent(string $event, string $description, array $metadata = []): void
    {
        $this->log("security.$event", $description, null, $metadata);

        // Also log to Laravel's log for critical events
        \Log::channel('security')->warning($description, $metadata);
    }
}
```

### Use in Controllers

```php
<?php
// app/Http/Controllers/Admin/AccountHandlerController.php

use App\Services\AuditService;

public function __construct(
    protected AuditService $auditService
) {}

public function toggleAdmin(Request $request, User $user)
{
    if ($user->id === $request->user()->id) {
        return back()->with('error', 'You cannot remove your own admin access.');
    }

    $previousStatus = $user->is_admin;
    $user->is_admin = !$user->is_admin;
    $user->save();

    // Log the action
    $this->auditService->logAdminAction('toggle_admin',
        "Admin status changed for user {$user->email}", [
        'target_user_id' => $user->id,
        'target_user_email' => $user->email,
        'previous_status' => $previousStatus,
        'new_status' => $user->is_admin,
    ]);

    return back()->with('success', 'Admin status updated successfully.');
}
```

---

## Medium Priority Fix #3: Progressive OTP Delays

### Update OTP Service

```php
<?php
// app/Services/OtpService.php

public function verifyOtp(User $user, string $otp): bool
{
    // Check if OTP has expired
    if ($user->email_otp_expires_at < now()) {
        return false;
    }

    // Increment attempt counter
    $user->increment('email_otp_attempts');

    // Verify OTP
    if ($user->email_otp !== $otp) {
        // Progressive delay based on attempts
        $attempts = $user->email_otp_attempts;

        if ($attempts >= 3) {
            $delaySeconds = min(pow(2, $attempts - 2), 300); // Max 5 minutes
            sleep($delaySeconds);
        }

        // Lock account after 5 failed attempts
        if ($attempts >= 5) {
            $user->update([
                'email_otp' => null,
                'email_otp_expires_at' => now()->addHours(1), // Lock for 1 hour
                'email_otp_attempts' => 0,
            ]);

            // Log security event
            app(AuditService::class)->logSecurityEvent(
                'otp_lockout',
                "User locked out after {$attempts} failed OTP attempts",
                ['user_id' => $user->id, 'email' => $user->email]
            );

            throw new \Exception('Too many failed attempts. Your account has been temporarily locked.');
        }

        return false;
    }

    // OTP is correct
    $user->update([
        'email_verified' => true,
        'email_verified_at' => now(),
        'email_otp' => null,
        'email_otp_expires_at' => null,
        'email_otp_attempts' => 0,
    ]);

    return true;
}
```

---

## Testing Your Security Fixes

### 1. Test File Upload Security

```bash
# Create test files
echo '<?php phpinfo(); ?>' > test.php
mv test.php test.php.jpg

# Try to upload - should be rejected
curl -X POST http://localhost:8000/settings/portfolio/desktop-image \
  -H "Authorization: Bearer {token}" \
  -F "desktop_image=@test.php.jpg"
```

### 2. Test Rate Limiting

```bash
# Test contact form rate limit
for i in {1..10}; do
  curl -X POST http://localhost:8000/contact \
    -d "name=Test&email=test@test.com&message=Test" \
    -H "X-CSRF-TOKEN: {token}"
done
# Should see 429 errors after 3 requests
```

### 3. Test CSP Headers

```bash
# Check security headers
curl -I https://yourdomain.com

# Should see:
# Content-Security-Policy: default-src 'self'; ...
# X-Content-Type-Options: nosniff
# X-Frame-Options: SAMEORIGIN
```

### 4. Test HTML Sanitization

```php
// In Tinker
php artisan tinker

$user = User::first();
$user->update([
    'portfolio_description' => '<script>alert("XSS")</script><p>Safe content</p>'
]);

echo $user->fresh()->portfolio_description;
// Should output: <p>Safe content</p>
```

---

## Deployment Checklist

Before deploying security fixes:

- [ ] Test all fixes in development environment
- [ ] Run `composer audit` and `npm audit`
- [ ] Update `.env` with security settings
- [ ] Test file upload with various file types
- [ ] Verify rate limiting works correctly
- [ ] Check security headers are present
- [ ] Test OAuth flows still work
- [ ] Verify admin actions are logged
- [ ] Test OTP progressive delays
- [ ] Run automated security scans
- [ ] Document changes for team
- [ ] Create rollback plan
- [ ] Monitor logs after deployment

---

## Additional Resources

- [Laravel Security Best Practices](https://laravel.com/docs/security)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Intervention Image Documentation](http://image.intervention.io/)
- [Google reCAPTCHA v3 Guide](https://developers.google.com/recaptcha/docs/v3)
- [Content Security Policy Reference](https://content-security-policy.com/)
