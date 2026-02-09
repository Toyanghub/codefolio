# Security Quick Reference & Checklist

Quick reference guide for maintaining security in your Code-folio application.

---

## 🔒 Daily Security Checklist

### Before Starting Work

- [ ] Pull latest security updates: `git pull`
- [ ] Check for dependency vulnerabilities: `composer audit && npm audit`
- [ ] Review any new security logs

### During Development

- [ ] Validate all user inputs
- [ ] Use Eloquent ORM (never raw SQL)
- [ ] Escape output (React does this automatically)
- [ ] Use `$fillable` for mass assignment protection
- [ ] Add rate limiting to new endpoints
- [ ] Test file uploads with malicious files

### Before Committing

- [ ] No secrets in code (use `.env`)
- [ ] No `dd()`, `dump()`, or debug code
- [ ] Security headers implemented
- [ ] Input validation on all forms
- [ ] Run static analysis: `./vendor/bin/psalm`

### Before Deploying

- [ ] `APP_DEBUG=false` in production `.env`
- [ ] Run security audit: `composer audit`
- [ ] Test authentication flows
- [ ] Verify rate limits work
- [ ] Check error reporting is disabled

---

## 🚨 Security Red Flags (NEVER DO THIS)

### ❌ Database Queries

```php
// NEVER USE:
DB::raw("SELECT * FROM users WHERE email = '{$email}'")
User::whereRaw("email = '{$email}'")
DB::select("SELECT * WHERE id = " . $id)

// ALWAYS USE:
User::where('email', $email)->first()
DB::table('users')->where('email', $email)->get()
```

### ❌ User Input

```php
// NEVER:
$name = $_POST['name']; // Direct access
echo $request->input('message'); // Unvalidated output

// ALWAYS:
$validated = $request->validate(['name' => 'required|string|max:255']);
{{ $message }} // In Blade (auto-escaped)
```

### ❌ File Operations

```php
// NEVER:
file_get_contents($request->input('file'));
Storage::delete($request->input('path'));
include($request->input('template'));

// ALWAYS:
$request->validate(['file' => 'required|file|mimes:pdf,doc']);
Storage::disk('public')->delete($validatedPath);
// Never include user-provided paths
```

### ❌ Mass Assignment

```php
// NEVER:
$user->fill($request->all())->save();
User::create($request->all());

// ALWAYS:
$validated = $request->validate([...]);
$user->fill($validated)->save();
User::create($validated);
```

---

## ✅ Security Best Practices (Quick Reference)

### Input Validation

```php
// Basic validation
$request->validate([
    'email' => 'required|email|max:255',
    'password' => 'required|min:8|confirmed',
    'age' => 'required|integer|min:18|max:120',
]);

// File upload validation
$request->validate([
    'image' => 'required|file|mimes:jpeg,png,webp|max:2048',
    'document' => 'required|file|mimes:pdf|max:10240',
]);

// Array validation
$request->validate([
    'skills' => 'required|array|min:1',
    'skills.*' => 'exists:skills,id',
]);
```

### Authorization

```php
// Check authentication
if (!auth()->check()) {
    abort(401);
}

// Check ownership
if (auth()->id() !== $portfolio->user_id) {
    abort(403);
}

// Use policies (recommended)
$this->authorize('update', $portfolio);
```

### Safe File Uploads

```php
$request->validate([
    'file' => 'required|file|mimes:jpeg,png,webp|max:2048',
]);

$filename = Str::uuid() . '.' . $request->file('file')->extension();
$path = $request->file('file')->storeAs('uploads', $filename, 'public');
```

### Rate Limiting

```php
// In routes
Route::post('/api/endpoint', [Controller::class, 'method'])
    ->middleware('throttle:60,1'); // 60 requests per minute

// Custom rate limiter (in AppServiceProvider)
RateLimiter::for('custom', function (Request $request) {
    return Limit::perMinute(5)->by($request->ip());
});
```

---

## 🔐 Common Attack Vectors & Prevention

### SQL Injection

**Attack:** `'; DROP TABLE users; --`  
**Prevention:** Use Eloquent ORM, never raw SQL with user input

### XSS (Cross-Site Scripting)

**Attack:** `<script>alert('XSS')</script>`  
**Prevention:** React auto-escapes, use HTMLPurifier for rich text

### CSRF (Cross-Site Request Forgery)

**Attack:** Forged form submissions  
**Prevention:** Laravel's CSRF middleware (enabled by default)

### Path Traversal

**Attack:** `../../etc/passwd`  
**Prevention:** Validate file paths, use Storage facade

### File Upload Attacks

**Attack:** Upload malicious PHP file as image  
**Prevention:** Validate mime types, re-encode images, random filenames

### Mass Assignment

**Attack:** Add `is_admin=1` to form data  
**Prevention:** Use `$fillable` or `$guarded` in models

### Session Hijacking

**Attack:** Steal session cookies  
**Prevention:** HTTPS only, HttpOnly cookies, session encryption

---

## 🛠️ Essential Security Commands

### Check for Vulnerabilities

```bash
# PHP dependencies
composer audit
composer show --outdated

# JavaScript dependencies
npm audit
npm audit fix

# Update all dependencies
composer update
npm update
```

### Static Analysis

```bash
# Install tools
composer require --dev vimeo/psalm
composer require --dev phpstan/phpstan

# Run analysis
./vendor/bin/psalm --show-info=true
./vendor/bin/phpstan analyse app
```

### Security Scanning

```bash
# Laravel Enlightn (comprehensive)
composer require --dev enlightn/enlightn
php artisan enlightn

# Check security headers
curl -I https://yourdomain.com | grep -E "(X-|Content-Security|Strict-Transport)"
```

### Testing Authentication

```bash
# Test rate limiting
for i in {1..10}; do curl -X POST http://localhost:8000/login -d "email=test@test.com&password=wrong"; done

# Check for open endpoints
php artisan route:list --columns=Method,URI,Middleware
```

---

## 🚀 Quick Security Wins

### 1. Enable Session Encryption (2 minutes)

```env
# .env
SESSION_ENCRYPT=true
SESSION_SECURE_COOKIE=true
```

### 2. Add Security Headers (5 minutes)

```bash
# Create middleware
php artisan make:middleware AddSecurityHeaders

# See SECURITY-FIXES-EXAMPLES.md for implementation
```

### 3. Improve File Upload Validation (3 minutes)

```php
// Change from:
'image' => 'image|max:2048'

// To:
'image' => 'file|mimes:jpeg,png,webp|max:2048|dimensions:max_width=4000,max_height=4000'
```

### 4. Add Rate Limiting (2 minutes)

```php
// routes/web.php
->middleware('throttle:5,1') // Add to sensitive routes
```

### 5. Review .env Security (1 minute)

```bash
# Check these are set correctly
grep -E "(APP_DEBUG|APP_ENV)" .env
```

---

## 📊 Security Monitoring

### What to Log

```php
// In your controllers
use Illuminate\Support\Facades\Log;

// Failed login
Log::channel('security')->warning('Failed login', [
    'email' => $email,
    'ip' => request()->ip(),
]);

// Admin action
Log::channel('security')->info('Admin action', [
    'action' => 'user_deleted',
    'admin' => auth()->user()->email,
    'target' => $user->email,
]);

// Suspicious activity
Log::channel('security')->alert('Suspicious activity', [
    'type' => 'rate_limit_exceeded',
    'ip' => request()->ip(),
]);
```

### Monitor These Patterns

- Multiple failed login attempts from same IP
- Unusual file upload patterns
- Admin privilege escalations
- Large number of requests in short time
- Access to non-existent routes
- Requests with SQL injection patterns
- XSS attempt patterns in logs

---

## 🔍 Security Testing Checklist

### Manual Tests

**Authentication:**

- [ ] Try accessing admin routes without auth
- [ ] Try accessing other users' data
- [ ] Test password reset flow
- [ ] Verify session timeout works
- [ ] Test "remember me" functionality

**Input Validation:**

- [ ] Submit empty forms
- [ ] Submit forms with SQL injection patterns
- [ ] Submit forms with XSS payloads
- [ ] Test with extremely long inputs
- [ ] Test with special characters

**File Uploads:**

- [ ] Try uploading PHP file as image
- [ ] Try uploading oversized file
- [ ] Try uploading non-image file
- [ ] Upload file with `../` in name
- [ ] Upload SVG with embedded JavaScript

**Rate Limiting:**

- [ ] Make 100 requests quickly to contact form
- [ ] Try brute force login
- [ ] Test API endpoints for rate limits

### Automated Tests

```bash
# Run PHPUnit tests
php artisan test

# Run with coverage
php artisan test --coverage

# Run specific security tests
php artisan test --filter=SecurityTest
```

---

## 📱 Quick Response Guide

### If You Suspect a Security Breach:

1. **Immediate Actions:**

    ```bash
    # Check logs
    tail -f storage/logs/laravel.log

    # Check for suspicious database changes
    php artisan tinker
    > User::where('is_admin', true)->get()

    # Check recent logins
    > DB::table('sessions')->orderBy('last_activity', 'desc')->take(20)->get()
    ```

2. **Containment:**
    - Change all admin passwords immediately
    - Invalidate all sessions: `php artisan session:flush`
    - Review and remove any suspicious user accounts
    - Temporarily disable affected features

3. **Investigation:**
    - Review server access logs
    - Check Git history for unauthorized changes
    - Scan for malware: `grep -r "eval\|base64_decode" .`
    - Check for new files in upload directories

4. **Recovery:**
    - Patch the vulnerability
    - Deploy security updates
    - Monitor logs closely for 24-48 hours
    - Document the incident

---

## 🎯 Priority Matrix

### Must Have (Deploy Blocking) 🔴

- Input validation on all forms
- CSRF protection enabled
- SQL injection prevention (Eloquent)
- Authentication on protected routes
- HTTPS in production

### Should Have (Fix ASAP) 🟡

- Rate limiting on public endpoints
- File upload validation
- Security headers
- Session encryption
- Audit logging for admin actions

### Nice to Have (Improve Over Time) 🟢

- Two-factor authentication
- Advanced monitoring
- Automated security testing
- Security.txt file
- Bug bounty program

---

## 📚 Quick Links

- [Laravel Security Docs](https://laravel.com/docs/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Full Audit Report](./SECURITY-AUDIT-REPORT.md)
- [Fix Examples](./SECURITY-FIXES-EXAMPLES.md)
- [Security Headers Check](https://securityheaders.com/)
- [SSL Test](https://www.ssllabs.com/ssltest/)

---

## 🆘 Need Help?

### Common Issues

**"Too Many Requests" Error:**

- User hit rate limit
- Clear cache: `php artisan cache:clear`
- Adjust rate limit in `app/Providers/AppServiceProvider.php`

**File Upload Failing:**

- Check `upload_max_filesize` in `php.ini`
- Verify storage permissions: `chmod -R 775 storage`
- Check disk space: `df -h`

**Session Issues:**

- Clear sessions: `php artisan session:flush`
- Check session driver in `.env`
- Verify database sessions table exists

**CSRF Token Mismatch:**

- Check if page was cached
- Verify CSRF middleware is active
- Clear cache: `php artisan cache:clear`

---

**Remember:** Security is not a one-time task. Review this checklist regularly and stay updated on new vulnerabilities!

**Last Updated:** February 8, 2026  
**Next Review:** Monthly
