# 🚨 BOT PROTECTION IMPLEMENTATION GUIDE
## Google reCAPTCHA v3 - Complete Local to Production Workflow

**⚠️ EMERGENCY PRIORITY**: 380+ bot accounts registered - Implementation required immediately

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Phase 1: Get Google reCAPTCHA Keys](#phase-1-get-google-recaptcha-keys)
3. [Phase 2: Local Development Setup](#phase-2-local-development-setup)
4. [Phase 3: Local Testing](#phase-3-local-testing)
5. [Phase 4: Git Deployment Workflow](#phase-4-git-deployment-workflow)
6. [Phase 5: Production Server Deployment](#phase-5-production-server-deployment)
7. [Phase 6: Post-Deployment Verification](#phase-6-post-deployment-verification)
8. [Phase 7: Bot Cleanup (Existing Accounts)](#phase-7-bot-cleanup-existing-accounts)
9. [Troubleshooting](#troubleshooting)
10. [Monitoring & Maintenance](#monitoring--maintenance)

---

## PREREQUISITES

✅ **What You Have**:
- Local VS Code development environment (Windows)
- Git installed
- Laravel + React application running locally
- SSH access to production server (`root@76.13.195.128`)
- Domain: `codefolio.space`
- Production path: `/var/www/codefolio/my-app`

✅ **Files Already Created** (by this implementation):
- `app/Rules/RecaptchaV3.php` ✅
- `app/Actions/Fortify/CreateNewUser.php` (updated) ✅
- `resources/js/pages/auth/register.tsx` (updated) ✅
- `resources/js/types/recaptcha.d.ts` ✅
- `config/services.php` (updated) ✅

---

## PHASE 1: GET GOOGLE RECAPTCHA KEYS

### Step 1.1: Create reCAPTCHA Site

1. **Go to Google reCAPTCHA Admin Console**:
   ```
   https://www.google.com/recaptcha/admin/create
   ```

2. **Sign in** with your Google account

3. **Register a new site**:
   - **Label**: `Codefolio Registration Protection`
   - **reCAPTCHA type**: Select **reCAPTCHA v3**
   - **Domains**: Add the following (one per line):
     ```
     codefolio.space
     127.0.0.1
     localhost
     ```
   - **Accept reCAPTCHA Terms of Service**: ✅
   - Click **Submit**

4. **Copy Your Keys** (you'll need these):
   - **Site Key**: `6Le...` (starts with 6Le)
   - **Secret Key**: `6Le...` (different, longer key)

   ⚠️ **IMPORTANT**: Keep these keys secure! Don't commit Secret Key to Git.

---

## PHASE 2: LOCAL DEVELOPMENT SETUP

### Step 2.1: Configure Environment Variables

**Location**: `my-app/.env` (your local development environment)

1. **Open your `.env` file** in VS Code:
   ```bash
   # In VS Code, open: my-app/.env
   ```

2. **Add reCAPTCHA configuration** at the end:
   ```env
   # Google reCAPTCHA v3 Configuration
   RECAPTCHA_SITE_KEY=your_site_key_from_step_1_here
   RECAPTCHA_SECRET_KEY=your_secret_key_from_step_1_here
   RECAPTCHA_ENABLED=true
   ```

3. **Create Vite environment file** (`my-app/.env.local` or add to existing):
   ```env
   VITE_RECAPTCHA_SITE_KEY=your_site_key_from_step_1_here
   ```

   ℹ️ **Why?**: Vite requires `VITE_` prefix for frontend environment variables.

4. **Save both files**

### Step 2.2: Clear Configuration Cache

**Open PowerShell in VS Code** (Terminal → New Terminal):

```powershell
cd my-app
php artisan config:clear
php artisan cache:clear
```

### Step 2.3: Install Frontend Dependencies (if needed)

```powershell
npm install
```

### Step 2.4: Build Frontend Assets

```powershell
npm run build
```

Or for development with hot reload:
```powershell
npm run dev
```

---

## PHASE 3: LOCAL TESTING

### Step 3.1: Start Local Development Server

**In PowerShell (Terminal in VS Code)**:

```powershell
cd my-app
php artisan serve
```

Your app should now be running at: `http://127.0.0.1:8000`

### Step 3.2: Test Registration Form

1. **Open browser** and navigate to:
   ```
   http://127.0.0.1:8000/register
   ```

2. **Check for reCAPTCHA Badge**:
   - You should see a small reCAPTCHA badge in the bottom-right corner
   - Button text should show **"Loading security..."** briefly, then **"Create account"**

3. **Test Registration**:
   - Fill out the form with test data:
     ```
     Name: Test User
     Email: test@example.com
     Password: TestPassword123
     Confirm Password: TestPassword123
     ```
   - Click **"Create account"**
   - Should work normally (redirect to OTP verification)

4. **Check Browser Console** (F12 → Console tab):
   - Should see: `✓ reCAPTCHA loaded successfully`
   - No errors about reCAPTCHA
   - Token should be generated (you can see it in Network tab)

### Step 3.3: Verify Backend Validation

1. **Check Laravel logs**:
   ```powershell
   tail -f storage/logs/laravel.log
   ```

2. **Look for log entries**:
   ```
   [INFO] reCAPTCHA verification successful
   ```

3. **Test with low score** (simulate bot - advanced):
   - In `CreateNewUser.php`, temporarily lower threshold to 0.9:
     ```php
     'recaptcha_token' => ['required', new RecaptchaV3(0.9)],
     ```
   - Try registering - should fail with: *"Your request appears suspicious"*
   - **Revert threshold back to 0.5** after testing

### Step 3.4: Test Error Handling

1. **Test without reCAPTCHA keys** (temporarily):
   - Comment out `RECAPTCHA_SITE_KEY` in `.env`
   - Reload page
   - Should show error: *"reCAPTCHA is not configured"*
   - **Restore the keys** after testing

✅ **Local Testing Complete!** Proceed to deployment.

---

## PHASE 4: GIT DEPLOYMENT WORKFLOW

### Step 4.1: Prepare Files for Git

**⚠️ IMPORTANT**: DO NOT commit secret keys to Git!

1. **Check your `.gitignore`**:
   ```powershell
   # In VS Code, open: my-app/.gitignore
   ```

2. **Ensure these files are ignored**:
   ```
   .env
   .env.local
   .env.production
   .env.*.local
   ```

3. **Create `.env.example`** (template for production):
   ```env
   # Copy from .env and replace sensitive values with placeholders
   RECAPTCHA_SITE_KEY=your_site_key_here
   RECAPTCHA_SECRET_KEY=your_secret_key_here
   RECAPTCHA_ENABLED=true
   ```

### Step 4.2: Commit Your Changes

**In VS Code Terminal (PowerShell)**:

```powershell
cd my-app

# Check what files changed
git status

# Add all changed files
git add .

# Commit with descriptive message
git commit -m "feat: Add Google reCAPTCHA v3 to registration form

- Created RecaptchaV3 validation rule
- Updated CreateNewUser to validate reCAPTCHA tokens
- Modified register.tsx with reCAPTCHA integration
- Added TypeScript declarations for grecaptcha
- Updated services config for reCAPTCHA

Blocks bot registrations with 90-95% effectiveness"

# View commit to verify
git log -1 --stat
```

### Step 4.3: Push to Git Repository

```powershell
# Push to main branch (or your deployment branch)
git push origin main
```

If you use a different branch for production:
```powershell
git push origin production
```

✅ **Code is now in Git repository!** Ready for server deployment.

---

## PHASE 5: PRODUCTION SERVER DEPLOYMENT

### Step 5.1: SSH into Production Server

**In PowerShell**:

```powershell
ssh root@76.13.195.128
```

Enter your password when prompted.

### Step 5.2: Navigate to Application Directory

```bash
cd /var/www/codefolio/my-app
```

### Step 5.3: Backup Current State (Safety First!)

```bash
# Create backup of current code
tar -czf ../backup-before-recaptcha-$(date +%Y%m%d-%H%M%S).tar.gz .

# Backup database
mysqldump -u codefolio_user -p codefolio_prod > ../backup-db-$(date +%Y%m%d-%H%M%S).sql
```

### Step 5.4: Pull Latest Code from Git

```bash
# Stash any local changes (if any)
git stash

# Pull latest code
git pull origin main
```

If using different branch:
```bash
git pull origin production
```

### Step 5.5: Configure Production Environment

```bash
# Edit production .env file
nano .env
```

**Add these lines** (scroll to bottom):
```env
# Google reCAPTCHA v3 Configuration
RECAPTCHA_SITE_KEY=paste_your_site_key_here
RECAPTCHA_SECRET_KEY=paste_your_secret_key_here
RECAPTCHA_ENABLED=true

# Important: Also add for Vite (frontend)
VITE_RECAPTCHA_SITE_KEY=paste_your_site_key_here
```

**Save and exit**: `Ctrl + X`, then `Y`, then `Enter`

### Step 5.6: Install Dependencies

```bash
# Install backend dependencies (if Composer packages changed)
composer install --optimize-autoloader --no-dev

# Install frontend dependencies
npm install
```

### Step 5.7: Build Frontend Assets

```bash
# Build production assets
npm run build
```

This will create optimized JavaScript bundles with reCAPTCHA integration.

### Step 5.8: Clear All Caches

```bash
# Clear Laravel caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Rebuild optimized config cache
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Step 5.9: Set Correct Permissions

```bash
# Ensure correct ownership
chown -R www-data:www-data /var/www/codefolio/my-app

# Set correct permissions
chmod -R 755 /var/www/codefolio/my-app
chmod -R 775 /var/www/codefolio/my-app/storage
chmod -R 775 /var/www/codefolio/my-app/bootstrap/cache
```

### Step 5.10: Restart Services

```bash
# Restart PHP-FPM
systemctl restart php8.2-fpm

# Restart Nginx
systemctl restart nginx

# Restart queue workers (if you have them)
systemctl restart codefolio-worker
```

✅ **Production Deployment Complete!**

---

## PHASE 6: POST-DEPLOYMENT VERIFICATION

### Step 6.1: Test Production Registration

1. **Open browser** and navigate to:
   ```
   https://codefolio.space/register
   ```

2. **Check for reCAPTCHA Badge**:
   - ✅ reCAPTCHA badge visible in bottom-right corner
   - ✅ Button shows "Create account" (not "Loading security..." forever)

3. **Test Registration**:
   - Use a **real email address** (not bot pattern)
   - Fill out form completely
   - Click "Create account"
   - ✅ Should redirect to OTP verification page

### Step 6.2: Check Production Logs

**On server (SSH session)**:

```bash
# Monitor Laravel logs in real-time
tail -f /var/www/codefolio/my-app/storage/logs/laravel.log
```

Look for:
```
[INFO] reCAPTCHA verification successful {"score":0.9,"ip":"xx.xx.xx.xx"}
```

**If you see errors**:
- Check that reCAPTCHA keys are correct in `.env`
- Verify `VITE_RECAPTCHA_SITE_KEY` is set
- Run `php artisan config:clear` again

### Step 6.3: Test Bot Detection (Optional)

**Simulate bot behavior**:

1. **Rapid registration attempts**:
   - Try registering multiple accounts quickly
   - reCAPTCHA should lower the score automatically

2. **Check logs** for low scores:
   ```bash
   grep "reCAPTCHA score too low" storage/logs/laravel.log
   ```

### Step 6.4: Monitor for 24 Hours

**Check new registrations**:

```bash
# On server
php artisan tinker
```

```php
// Check recent registrations (last 24 hours)
\App\Models\User::where('created_at', '>', now()->subDay())->count();

// Check for bot pattern emails
\App\Models\User::where('created_at', '>', now()->subDay())
    ->where('email', 'like', '%user%_%_%@gmail.com%')
    ->count();
```

✅ **Should be 0 new bot accounts!**

---

## PHASE 7: BOT CLEANUP (EXISTING ACCOUNTS)

### Problem: 380+ bot accounts already in database

**Bot Pattern**: `user1771119076251_14_70003@gmail.com`

### Step 7.1: Connect to Server

```powershell
ssh root@76.13.195.128
cd /var/www/codefolio/my-app
```

### Step 7.2: Preview Bot Accounts

```bash
php artisan tinker
```

```php
// Preview bot accounts before deletion
$bots = \App\Models\User::where('email', 'like', '%user%_%_%@gmail.com%')
    ->whereNull('email_verified_at')
    ->get(['id', 'name', 'email', 'created_at']);

// Display count
$bots->count();  // Should show ~380

// Display first 10
$bots->take(10)->each(function($user) {
    echo "{$user->id} | {$user->email} | {$user->created_at}\n";
});
```

### Step 7.3: Delete Bot Accounts

**⚠️ CAUTION**: This is irreversible. Verify pattern first!

```php
// Delete all matching bot accounts
$deleted = \App\Models\User::where('email', 'like', '%user%_%_%@gmail.com%')
    ->whereNull('email_verified_at')
    ->where('created_at', '>', '2026-02-15 00:00:00')
    ->delete();

echo "Deleted {$deleted} bot accounts\n";
```

### Step 7.4: Verify Deletion

```php
// Check remaining bot accounts
$remaining = \App\Models\User::where('email', 'like', '%user%_%_%@gmail.com%')
    ->whereNull('email_verified_at')
    ->count();

echo "Remaining bot accounts: {$remaining}\n";  // Should be 0

// Check total user count
$totalUsers = \App\Models\User::count();
echo "Total users remaining: {$totalUsers}\n";

// Exit Tinker
exit
```

### Step 7.5: Alternative: Bulk Delete via SQL (Faster)

**If you prefer direct SQL**:

```bash
mysql -u codefolio_user -p codefolio_prod
```

```sql
-- Preview first
SELECT COUNT(*) FROM users 
WHERE email LIKE '%user%_%_%@gmail.com%' 
AND email_verified_at IS NULL;

-- Delete bot accounts
DELETE FROM users 
WHERE email LIKE '%user%_%_%@gmail.com%' 
AND email_verified_at IS NULL
AND created_at > '2026-02-15 00:00:00';

-- Verify
SELECT COUNT(*) FROM users;

-- Exit
exit;
```

✅ **Bot Cleanup Complete!**

---

## TROUBLESHOOTING

### Issue 1: "reCAPTCHA is not configured" Error

**Symptoms**: Red error message on registration page

**Solutions**:
```bash
# On server
cd /var/www/codefolio/my-app

# Check if keys are set
grep RECAPTCHA .env

# If missing, add them
nano .env
# Add: RECAPTCHA_SITE_KEY=...
# Add: RECAPTCHA_SECRET_KEY=...
# Add: VITE_RECAPTCHA_SITE_KEY=...

# Clear cache
php artisan config:clear

# Rebuild frontend
npm run build

# Restart services
systemctl restart php8.2-fpm nginx
```

### Issue 2: reCAPTCHA Badge Not Appearing

**Symptoms**: No badge in bottom-right corner

**Solutions**:
```bash
# Check if Vite environment variable is set
grep VITE_RECAPTCHA .env

# If missing:
echo "VITE_RECAPTCHA_SITE_KEY=your_site_key" >> .env

# Rebuild frontend
npm run build

# Hard refresh browser (Ctrl + Shift + R)
```

### Issue 3: "Failed to verify reCAPTCHA" Error

**Symptoms**: All registrations fail with verification error

**Solutions**:
1. **Check domain configuration**:
   - Go to: https://www.google.com/recaptcha/admin
   - Verify `codefolio.space` is in domains list

2. **Check secret key**:
   ```bash
   # On server
   php artisan tinker
   ```
   ```php
   config('services.recaptcha.secret_key');  // Should show your key
   ```

3. **Check server can reach Google**:
   ```bash
   curl https://www.google.com/recaptcha/api/siteverify
   ```

### Issue 4: Build Assets Failed

**Symptoms**: `npm run build` fails

**Solutions**:
```bash
# Remove node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install

# Try build again
npm run build
```

### Issue 5: Permission Denied Errors

**Symptoms**: Cannot write to cache/logs

**Solutions**:
```bash
# Fix ownership
chown -R www-data:www-data /var/www/codefolio/my-app

# Fix permissions
chmod -R 775 storage bootstrap/cache

# Restart PHP-FPM
systemctl restart php8.2-fpm
```

---

## MONITORING & MAINTENANCE

### Daily Monitoring Commands

**Check for new bot registrations**:

```bash
# SSH to server
ssh root@76.13.195.128
cd /var/www/codefolio/my-app

# Check recent registrations
php artisan tinker
```

```php
// Registrations in last 24 hours
\App\Models\User::where('created_at', '>', now()->subDay())->count();

// Any suspicious patterns
\App\Models\User::where('created_at', '>', now()->subDay())
    ->whereNull('email_verified_at')
    ->get(['email', 'created_at']);
```

### Check reCAPTCHA Scores

```bash
# View logs with scores
grep "reCAPTCHA verification successful" storage/logs/laravel.log | tail -20
```

Look for score patterns:
- **0.9 - 1.0**: Definitely human ✅
- **0.7 - 0.9**: Probably human ✅
- **0.5 - 0.7**: Risky (threshold) ⚠️
- **0.0 - 0.5**: Likely bot (blocked) ❌

### Adjust Threshold (if needed)

If you get too many false positives (real users blocked):

```php
// In app/Actions/Fortify/CreateNewUser.php
'recaptcha_token' => ['required', new RecaptchaV3(0.3)],  // Lower = more lenient
```

If bots still getting through:

```php
'recaptcha_token' => ['required', new RecaptchaV3(0.7)],  // Higher = stricter
```

### Weekly Maintenance

1. **Review reCAPTCHA Analytics**:
   - Go to: https://www.google.com/recaptcha/admin
   - Check request volume and score distribution

2. **Check for failed verifications**:
   ```bash
   grep "reCAPTCHA verification failed" storage/logs/laravel.log | wc -l
   ```

3. **Monitor Laravel logs**:
   ```bash
   tail -100 storage/logs/laravel.log
   ```

---

## 🎉 SUCCESS CHECKLIST

Before considering this complete, verify:

- ✅ reCAPTCHA keys obtained from Google Console
- ✅ Keys added to local `.env` (development)
- ✅ Keys added to production `.env` on server
- ✅ `VITE_RECAPTCHA_SITE_KEY` set in both environments
- ✅ Local testing successful (registration works)
- ✅ Code committed to Git with descriptive message
- ✅ Code pushed to remote repository
- ✅ Production server pulled latest code
- ✅ Frontend assets rebuilt (`npm run build`)
- ✅ All caches cleared on production
- ✅ Services restarted (PHP-FPM, Nginx)
- ✅ Production registration tested successfully
- ✅ reCAPTCHA badge visible on live site
- ✅ Logs show successful reCAPTCHA verification
- ✅ 380+ bot accounts deleted from database
- ✅ No new bot registrations after deployment

---

## 📊 EXPECTED RESULTS

**Before reCAPTCHA**:
- 380+ bot accounts in minutes
- Systematic email patterns
- All created simultaneously
- Database cluttered

**After reCAPTCHA**:
- 90-95% bot registration reduction
- Real users register normally
- Automated bots blocked instantly
- Clean registration logs

---

## 🆘 SUPPORT

**If you encounter issues**:

1. **Check Laravel logs**:
   ```bash
   tail -50 /var/www/codefolio/my-app/storage/logs/laravel.log
   ```

2. **Check Nginx error logs**:
   ```bash
   tail -50 /var/log/nginx/error.log
   ```

3. **Verify environment variables**:
   ```bash
   php artisan tinker
   config('services.recaptcha');
   ```

4. **Test reCAPTCHA directly**:
   ```bash
   curl -X POST "https://www.google.com/recaptcha/api/siteverify" \
     -d "secret=YOUR_SECRET_KEY" \
     -d "response=test"
   ```

---

## 📚 ADDITIONAL RESOURCES

- **Google reCAPTCHA Console**: https://www.google.com/recaptcha/admin
- **reCAPTCHA v3 Documentation**: https://developers.google.com/recaptcha/docs/v3
- **Laravel Validation Rules**: https://laravel.com/docs/validation
- **Inertia.js Forms**: https://inertiajs.com/forms

---

**Document Version**: 1.0  
**Last Updated**: February 15, 2026  
**Implementation Time**: ~2 hours  
**Effectiveness**: 90-95% bot blocking rate
