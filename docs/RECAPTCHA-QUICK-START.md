# 🚀 RECAPTCHA QUICK START CHECKLIST
## 30-Minute Express Deployment Guide

---

## ✅ PRE-DEPLOYMENT (Local - 10 minutes)

### 1. Get reCAPTCHA Keys (3 minutes)
- [ ] Go to: https://www.google.com/recaptcha/admin/create
- [ ] Create reCAPTCHA v3 site
- [ ] Add domains: `codefolio.space`, `localhost`, `127.0.0.1`
- [ ] Copy **Site Key** and **Secret Key**

### 2. Configure Local Environment (2 minutes)
- [ ] Open `my-app/.env`
- [ ] Add:
  ```env
  RECAPTCHA_SITE_KEY=your_site_key
  RECAPTCHA_SECRET_KEY=your_secret_key
  RECAPTCHA_ENABLED=true
  VITE_RECAPTCHA_SITE_KEY=your_site_key
  ```

### 3. Build & Test Locally (5 minutes)
```powershell
cd my-app
php artisan config:clear
npm run build
php artisan serve
```
- [ ] Visit: http://127.0.0.1:8000/register
- [ ] Verify reCAPTCHA badge appears (bottom-right)
- [ ] Test registration with sample data
- [ ] Check console for errors (F12)

---

## 📦 GIT DEPLOYMENT (Local - 5 minutes)

### 4. Commit Changes
```powershell
git status
git add .
git commit -m "feat: Add Google reCAPTCHA v3 bot protection"
git push origin main
```
- [ ] Push successful
- [ ] No sensitive data committed (`.env` excluded)

---

## 🚀 PRODUCTION DEPLOYMENT (Server - 10 minutes)

### 5. SSH to Server
```powershell
ssh root@76.13.195.128
cd /var/www/codefolio/my-app
```

### 6. Pull & Configure
```bash
# Backup first
tar -czf ../backup-$(date +%Y%m%d-%H%M%S).tar.gz .

# Pull code
git pull origin main

# Configure environment
nano .env
```

**Add to `.env`**:
```env
RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
RECAPTCHA_ENABLED=true
VITE_RECAPTCHA_SITE_KEY=your_site_key
```
Save: `Ctrl+X`, `Y`, `Enter`

### 7. Build & Deploy
```bash
npm install
npm run build
php artisan config:clear
php artisan config:cache
chown -R www-data:www-data .
systemctl restart php8.2-fpm nginx
```
- [ ] No build errors
- [ ] Services restarted successfully

---

## ✅ VERIFICATION (5 minutes)

### 8. Test Live Site
- [ ] Visit: https://codefolio.space/register
- [ ] reCAPTCHA badge visible
- [ ] Button shows "Create account" (not "Loading...")
- [ ] Registration works with real email
- [ ] Check logs: `tail -f storage/logs/laravel.log`
- [ ] See: "reCAPTCHA verification successful"

---

## 🧹 BOT CLEANUP (Optional - 5 minutes)

### 9. Delete Existing Bot Accounts
```bash
ssh root@76.13.195.128
cd /var/www/codefolio/my-app
php artisan tinker
```

```php
// Preview bots
$count = \App\Models\User::where('email', 'like', '%user%_%_%@gmail.com%')
    ->whereNull('email_verified_at')
    ->count();
echo "Found {$count} bot accounts\n";

// Delete
$deleted = \App\Models\User::where('email', 'like', '%user%_%_%@gmail.com%')
    ->whereNull('email_verified_at')
    ->where('created_at', '>', '2026-02-15 00:00:00')
    ->delete();
echo "Deleted {$deleted} accounts\n";

exit
```

---

## 🎯 SUCCESS INDICATORS

✅ **Immediate Benefits**:
- No new bot registrations with pattern `user*_*_*@gmail.com`
- reCAPTCHA badge visible on registration page
- Logs show reCAPTCHA scores (0.5-1.0 for humans)
- Real users can register normally

✅ **24-Hour Verification**:
```bash
# Check new registrations
php artisan tinker
\App\Models\User::where('created_at', '>', now()->subDay())->count();
```
Should be low, legitimate registrations only.

---

## ⚠️ TROUBLESHOOTING

### Badge Not Showing?
```bash
# Ensure VITE_ variable is set
grep VITE_RECAPTCHA .env
npm run build
systemctl restart nginx php8.2-fpm
```

### All Registrations Failing?
```bash
# Check keys are correct
php artisan tinker
config('services.recaptcha.secret_key');
exit

# Clear config
php artisan config:clear
php artisan config:cache
```

### JS Console Errors?
- Hard refresh browser: `Ctrl + Shift + R`
- Check if site key matches in `.env`
- Verify domain added to Google Console

---

## 📊 MONITORING COMMANDS

**Check recent registrations:**
```bash
php artisan tinker
\App\Models\User::where('created_at', '>', now()->subHours(6))->get(['email','created_at']);
```

**View reCAPTCHA logs:**
```bash
grep "reCAPTCHA" storage/logs/laravel.log | tail -20
```

**Check for bot patterns:**
```bash
php artisan tinker
\App\Models\User::where('email', 'like', '%user%_%_%@gmail.com%')
    ->where('created_at', '>', now()->subDay())
    ->count();  // Should be 0
```

---

## 🎉 COMPLETE!

**Total Time**: ~30 minutes  
**Bot Protection**: 90-95% effective  
**Next Steps**: Monitor for 24 hours, adjust threshold if needed

**For detailed troubleshooting, see**: `RECAPTCHA-DEPLOYMENT-GUIDE.md`
