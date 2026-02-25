# Security Audit Report - Code-folio Application

**Date:** February 8, 2026  
**Application:** Code-folio (Laravel + React/TypeScript)  
**Audit Type:** Basic Security Assessment  
**Focus:** SQL Injection, Input Validation, Authentication, File Uploads, XSS

---

## Executive Summary

A comprehensive security audit was performed on the Code-folio application. The assessment focused on common web application vulnerabilities including SQL injection, XSS, CSRF, authentication issues, and file upload security.

### Overall Security Posture: **GOOD** ✅

The application demonstrates strong security practices with proper use of Laravel's built-in security features. However, several areas require attention to improve the security posture.

---

## Findings Summary

| Category                       | Status          | Risk Level |
| ------------------------------ | --------------- | ---------- |
| SQL Injection Protection       | ✅ PASS         | Low        |
| Input Validation               | ⚠️ PARTIAL      | Medium     |
| Authentication & Authorization | ✅ PASS         | Low-Medium |
| File Upload Security           | ⚠️ PARTIAL      | Medium     |
| XSS Protection                 | ⚠️ PARTIAL      | Medium     |
| CSRF Protection                | ✅ PASS         | Low        |
| Rate Limiting                  | ⚠️ PARTIAL      | Medium     |
| Session Security               | ⚠️ NEEDS REVIEW | Medium     |

---

## Detailed Findings

### 1. SQL Injection Protection ✅ EXCELLENT

**Status:** No SQL injection vulnerabilities detected

**Findings:**

- ✅ All database queries use Laravel Eloquent ORM
- ✅ No raw SQL queries found
- ✅ Parameterized queries via Eloquent models
- ✅ Proper use of `whereIn()`, `where()`, and other query builder methods
- ✅ Mass assignment protection with `$fillable` arrays on all models

**Evidence:**

```php
// Proper Eloquent usage in AccountHandlerController
$query = User::query()
    ->when($search, function ($query, $search) {
        $query->where(function($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%")
              ->orWhere('id', $search);
        });
    });

// Mass assignment protection in User model
protected $fillable = [
    'name', 'email', 'password', 'google_id', 'github_id',
    // ... other fields
];
```

**Risk Level:** LOW

---

### 2. Input Validation ⚠️ NEEDS IMPROVEMENT

**Status:** Partial - Good validation exists but inconsistent

**Strengths:**

- ✅ Form Request validation in use (`ProfileUpdateRequest`)
- ✅ Inline validation in most controllers
- ✅ Custom validation rules (e.g., `NotDisposableEmail`)
- ✅ File upload validation with mime type and size checks

**Weaknesses:**

- ⚠️ **ISSUE #1:** Contact form has basic validation but no CAPTCHA/honeypot
- ⚠️ **ISSUE #2:** Search functionality in admin panel may be vulnerable to LIKE injection patterns
- ⚠️ **ISSUE #3:** Missing sanitization for user-generated content before display

**Evidence of Concerns:**

```php
// Contact form - vulnerable to spam/abuse
public function store(Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'message' => 'required|string|max:5000', // ⚠️ No spam protection
    ]);
    // ...
}

// Search with potential LIKE injection (low risk with Eloquent but still concerning)
$q->where('name', 'like', "%{$search}%") // ⚠️ User input directly in LIKE
```

**Recommendations:**

1. Add CAPTCHA (Google reCAPTCHA v3) to contact form
2. Implement honeypot fields for spam prevention
3. Sanitize search inputs before using in LIKE queries
4. Add HTML purification for user-generated content

**Risk Level:** MEDIUM

---

### 3. Authentication & Authorization ✅ GOOD

**Status:** Strong authentication with minor concerns

**Strengths:**

- ✅ Laravel Fortify for authentication
- ✅ Two-factor authentication support
- ✅ Email OTP verification system
- ✅ Admin middleware properly implemented
- ✅ Password confirmation for sensitive actions
- ✅ OAuth integration with Google and GitHub
- ✅ Soft deletes for user accounts

**Concerns:**

- ⚠️ **ISSUE #4:** OAuth users get random passwords but no notification about account takeover risks
- ⚠️ **ISSUE #5:** Admin self-revocation is prevented, but no check for last admin deletion
- ⚠️ **ISSUE #6:** OTP attempts limit exists but no progressive delay implemented

**Evidence:**

```php
// Good: Admin middleware
public function handle(Request $request, Closure $next): Response {
    if (!$request->user() || !$request->user()->is_admin) {
        abort(403, 'Unauthorized. Admin access required.');
    }
    return $next($request);
}

// Concern: OAuth password handling
$user = User::create([
    'password' => Hash::make(Str::random(24)), // ⚠️ No email notification
    'email_verified' => false,
]);
```

**Recommendations:**

1. Send email to OAuth users explaining their account setup
2. Prevent deletion of the last admin account
3. Implement progressive delays for OTP attempts (exponential backoff)
4. Add audit logging for admin actions

**Risk Level:** LOW-MEDIUM

---

### 4. File Upload Security ⚠️ NEEDS IMPROVEMENT

**Status:** Basic security in place but needs hardening

**Strengths:**

- ✅ File size limits (2MB)
- ✅ Image mime type validation
- ✅ Proper storage using Laravel's Storage facade
- ✅ Old files are deleted when replaced

**Critical Weaknesses:**

- ⚠️ **ISSUE #7:** Only validates 'image' type - too broad
- ⚠️ **ISSUE #8:** No file extension whitelist
- ⚠️ **ISSUE #9:** No virus/malware scanning
- ⚠️ **ISSUE #10:** Uploaded filenames not sanitized (potential path traversal)
- ⚠️ **ISSUE #11:** No Content-Security-Policy headers to prevent XSS via SVG uploads

**Evidence:**

```php
public function updateDesktopImage(Request $request): RedirectResponse {
    $request->validate([
        'desktop_image' => ['required', 'image', 'max:2048'], // ⚠️ Too permissive
    ]);

    // ⚠️ No extension checking or content verification
    $path = $request->file('desktop_image')->store('portfolio', 'public');
    // ...
}
```

**Attack Scenarios:**

1. **SVG XSS:** Upload malicious SVG with embedded JavaScript
2. **WebP/AVIF Exploits:** Newer formats may have parsing vulnerabilities
3. **File Extension Confusion:** Upload .php.jpg or similar

**Recommendations:**

1. **CRITICAL:** Restrict to specific image types: `mimes:jpeg,jpg,png,webp`
2. **CRITICAL:** Add file extension whitelist validation
3. Implement image re-encoding to strip metadata and validate content
4. Add virus scanning for uploaded files (ClamAV)
5. Store uploaded files outside web root or with proper access controls
6. Implement Content-Security-Policy headers
7. Generate unique, random filenames to prevent directory traversal

**Example Fix:**

```php
$request->validate([
    'desktop_image' => [
        'required',
        'file',
        'mimes:jpeg,jpg,png,webp', // Specific formats only
        'max:2048',
        new ImageDimensions(['max_width' => 4000, 'max_height' => 4000])
    ],
]);

// Re-encode image to strip EXIF and validate
$image = Image::make($request->file('desktop_image'));
$filename = Str::uuid() . '.jpg'; // Random filename
$image->save(storage_path('app/public/portfolio/' . $filename));
```

**Risk Level:** MEDIUM-HIGH

---

### 5. XSS (Cross-Site Scripting) Protection ⚠️ NEEDS ATTENTION

**Status:** Framework protection exists but one concerning usage

**Strengths:**

- ✅ React automatically escapes JSX expressions
- ✅ Inertia.js handles data sanitization
- ✅ Laravel Blade escapes output by default (not heavily used)

**Weaknesses:**

- ⚠️ **ISSUE #12:** Use of `dangerouslySetInnerHTML` for QR code SVG
- ⚠️ **ISSUE #13:** No Content-Security-Policy headers configured
- ⚠️ **ISSUE #14:** User-generated content (portfolio descriptions) not sanitized

**Evidence:**

```tsx
// Potentially dangerous in two-factor-setup-modal.tsx
<div
    className="..."
    dangerouslySetInnerHTML={{
        __html: qrCodeSvg, // ⚠️ Directly from backend
    }}
/>
```

**Attack Scenario:**
If the QR code generation library or backend is compromised, malicious JavaScript could be injected through the SVG.

**Recommendations:**

1. **For QR Code:** Use a React SVG component library instead of innerHTML
2. Implement Content-Security-Policy headers:
    ```php
    'Content-Security-Policy' => "default-src 'self'; script-src 'self' 'nonce-{random}'"
    ```
3. Sanitize portfolio descriptions before storage using HTMLPurifier
4. Add DOMPurify on frontend for additional protection

**Example Fix:**

```tsx
// Use a React QR code library instead
import QRCode from 'react-qr-code';

<QRCode value={twoFactorSecret} size={256} />;
```

**Risk Level:** MEDIUM

---

### 6. CSRF Protection ✅ EXCELLENT

**Status:** Properly implemented

**Findings:**

- ✅ Laravel's CSRF middleware active
- ✅ Inertia.js automatically includes CSRF tokens
- ✅ All state-changing operations use POST/PUT/DELETE
- ✅ Tokens validated on every request

**Risk Level:** LOW

---

### 7. Rate Limiting ⚠️ INCONSISTENT

**Status:** Partial implementation

**Strengths:**

- ✅ Contact form: `throttle:5,1` (5 requests per minute)
- ✅ Newsletter: `throttle:6,1` (6 requests per minute)
- ✅ OTP resend: `throttle:6,1`

**Weaknesses:**

- ⚠️ **ISSUE #15:** No rate limiting on admin actions
- ⚠️ **ISSUE #16:** Login/register endpoints use default Fortify rates (may be too permissive)
- ⚠️ **ISSUE #17:** No IP-based blocking for repeated failures
- ⚠️ **ISSUE #18:** Portfolio viewing has no rate limit (potential DoS)

**Recommendations:**

1. Add stricter rate limits to authentication endpoints
2. Implement progressive delays for failed login attempts
3. Add rate limiting to admin panel actions
4. Consider implementing account lockout after X failed attempts
5. Add rate limiting to public portfolio views

**Risk Level:** MEDIUM

---

### 8. Session Security ⚠️ NEEDS CONFIGURATION REVIEW

**Status:** Adequate but improvable

**Current Configuration:**

```php
'driver' => env('SESSION_DRIVER', 'database'), // ✅ Good
'lifetime' => env('SESSION_LIFETIME', 120),   // 2 hours
'expire_on_close' => false,                    // ⚠️ May be too permissive
'encrypt' => false,                            // ⚠️ Not encrypted
```

**Recommendations:**

1. **Enable session encryption:**
    ```php
    'encrypt' => true,
    ```
2. Configure secure cookie settings:
    ```php
    'secure' => env('SESSION_SECURE_COOKIE', true), // HTTPS only
    'http_only' => true,                            // Prevent JavaScript access
    'same_site' => 'lax',                           // CSRF protection
    ```
3. Consider shorter session lifetime for admin users
4. Implement "remember me" functionality securely

**Risk Level:** MEDIUM

---

## Additional Security Concerns

### 9. Password Reset Process

**Status:** Uses Fortify (needs verification)

**Recommendations:**

1. Verify password reset tokens expire after 60 minutes
2. Ensure tokens are single-use
3. Invalidate all sessions on password reset
4. Notify user via email when password is changed

### 10. Database Security

**Recommendations:**

1. Ensure database user has minimum required privileges
2. Use separate read/write database connections if possible
3. Enable query logging for suspicious activity monitoring
4. Regular database backups with encryption

### 11. API Security (Future Consideration)

If you add API endpoints:

- Implement API authentication (Laravel Sanctum)
- Add API rate limiting
- Use API versioning
- Validate all JSON payloads

---

## Testing Recommendations

### Manual Testing

1. **SQL Injection Testing:**

    ```
    - Test search with: ' OR 1=1 --
    - Test inputs with: '; DROP TABLE users; --
    - Use sqlmap for automated testing
    ```

2. **XSS Testing:**

    ```
    - Test portfolio description with: <script>alert('XSS')</script>
    - Test name fields with: <img src=x onerror=alert('XSS')>
    - Use XSStrike for automated testing
    ```

3. **File Upload Testing:**
    ```
    - Upload .svg with embedded JavaScript
    - Upload .php disguised as .jpg
    - Upload extremely large files
    - Upload files with ../ in filename
    ```

### Automated Security Tools

1. **Static Analysis:**

    ```bash
    # Install and run PHP security checker
    composer require --dev roave/security-advisories:dev-latest
    composer audit

    # Use Psalm for static analysis
    composer require --dev vimeo/psalm
    ./vendor/bin/psalm --show-info=true
    ```

2. **Dependency Scanning:**

    ```bash
    # Check for vulnerable npm packages
    npm audit
    npm audit fix

    # Check for vulnerable composer packages
    composer audit
    ```

3. **OWASP ZAP:**

    ```bash
    # Run automated security scan
    docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:8000
    ```

4. **Security Headers:**
   Use https://securityheaders.com/ to check HTTP security headers

---

## Priority Action Items

### Critical (Fix Immediately) 🔴

1. **Fix file upload validation** - Add specific mime type restrictions and extension whitelist
2. **Replace dangerouslySetInnerHTML** - Use React QR code component
3. **Enable session encryption** - Set `SESSION_ENCRYPT=true`

### High Priority (Fix This Week) 🟡

4. **Add CAPTCHA to contact form** - Prevent spam/abuse
5. **Implement CSP headers** - Prevent XSS attacks
6. **Sanitize user-generated content** - Add HTMLPurifier
7. **Add file re-encoding** - Strip EXIF and validate image content

### Medium Priority (Fix This Month) 🟢

8. **Improve rate limiting** - Add to admin actions and adjust limits
9. **Add audit logging** - Track security-sensitive actions
10. **Implement progressive OTP delays** - Prevent brute force
11. **Add virus scanning** - ClamAV integration
12. **Configure secure cookie settings** - Add security flags

### Low Priority (Future Improvements) 🔵

13. **Add security monitoring** - Implement logging and alerting
14. **Create security documentation** - Document security practices
15. **Set up security testing pipeline** - Automate security checks in CI/CD
16. **Implement Security.txt** - Add /.well-known/security.txt

---

## Security Best Practices Checklist

### Deployment Security

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Debug mode disabled in production (`APP_DEBUG=false`)
- [ ] Error reporting disabled in production
- [ ] `.env` file not accessible via web
- [ ] `storage/` and `bootstrap/cache/` not web-accessible
- [ ] Proper file permissions (644 for files, 755 for directories)
- [ ] Database credentials not in version control
- [ ] API keys and secrets in environment variables
- [ ] Regular security updates for dependencies

### Laravel Security

- [ ] APP_KEY properly set and secured
- [ ] CSRF protection enabled
- [ ] SQL injection protection via Eloquent
- [ ] XSS protection via escaping
- [ ] Mass assignment protection
- [ ] Authentication scaffolding secured
- [ ] File upload restrictions
- [ ] Rate limiting on endpoints
- [ ] Proper error handling

### Frontend Security

- [ ] React JSX auto-escaping utilized
- [ ] No eval() or Function() usage
- [ ] Dependencies regularly updated (npm audit)
- [ ] No sensitive data in client-side code
- [ ] Secure cookie flags set
- [ ] Content-Security-Policy headers

---

## Testing Tools & Commands

### Dependency Checks

```bash
# Backend
composer audit
composer require --dev roave/security-advisories:dev-latest

# Frontend
npm audit
npm audit fix --force  # Use cautiously
```

### Static Analysis

```bash
# Install Psalm
composer require --dev vimeo/psalm
./vendor/bin/psalm --init
./vendor/bin/psalm --show-info=true

# Install PHPStan
composer require --dev phpstan/phpstan
./vendor/bin/phpstan analyse app
```

### Laravel Security Tools

```bash
# Laravel Security Checker
composer require --dev enlightn/security-checker
php artisan security-check

# Laravel Enlightn (comprehensive security & performance)
composer require --dev enlightn/enlightn
php artisan enlightn
```

### Penetration Testing

```bash
# OWASP ZAP (in Docker)
docker run -t owasp/zap2docker-stable zap-full-scan.py -t http://localhost:8000

# SQLMap (test for SQL injection)
sqlmap -u "http://localhost:8000/search?query=test" --batch

# Nikto (web server scanner)
nikto -h http://localhost:8000
```

---

## Environment Configuration Checklist

### Production `.env` File

```env
# Application
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Security
SESSION_DRIVER=database
SESSION_ENCRYPT=true
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax

# Database (use separate user with limited privileges)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=limited_user  # Not root!
DB_PASSWORD=strong_password_here

# Mail (for security notifications)
MAIL_MAILER=smtp
MAIL_FROM_ADDRESS=noreply@yourdomain.com

# OAuth (restrict to production domains)
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
GITHUB_REDIRECT_URI=https://yourdomain.com/auth/github/callback
```

---

## Monitoring & Logging

### Security Events to Log

1. Failed login attempts
2. Admin privilege escalation
3. File upload events
4. Account deletions
5. Password resets
6. OAuth authentication failures
7. Rate limit violations
8. Suspicious search patterns

### Recommended Logging Setup

```php
// In EventServiceProvider or middleware
Log::channel('security')->warning('Failed login attempt', [
    'email' => $email,
    'ip' => request()->ip(),
    'user_agent' => request()->userAgent(),
    'timestamp' => now(),
]);
```

---

## Security Headers to Implement

Add these headers in your web server configuration or Laravel middleware:

```php
// In a middleware or HTTP kernel
return $next($response)->withHeaders([
    'X-Content-Type-Options' => 'nosniff',
    'X-Frame-Options' => 'SAMEORIGIN',
    'X-XSS-Protection' => '1; mode=block',
    'Strict-Transport-Security' => 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy' => "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
    'Referrer-Policy' => 'strict-origin-when-cross-origin',
    'Permissions-Policy' => 'geolocation=(), microphone=(), camera=()',
]);
```

---

## Conclusion

Your Laravel + React application demonstrates a strong foundation with proper use of framework security features. The primary areas requiring immediate attention are:

1. **File upload security hardening**
2. **XSS prevention improvements**
3. **Session configuration hardening**
4. **Rate limiting expansion**

Following the recommendations in this report will significantly improve your application's security posture and protect against common web application vulnerabilities.

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Laravel Security Documentation](https://laravel.com/docs/security)
- [React Security Best Practices](https://react.dev/learn/security)
- [PHP Security Guide](https://www.php.net/manual/en/security.php)
- [Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

---

**Report Generated:** February 8, 2026  
**Next Review Recommended:** March 2026 (30 days)
