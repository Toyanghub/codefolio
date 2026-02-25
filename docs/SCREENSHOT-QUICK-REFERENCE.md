# Screenshot Feature - Quick Reference

## ✅ Current Status
ALL SYSTEMS OPERATIONAL ✅
- Screenshot API: Working
- Queue Worker: Running
- Storage: Writable
- No current errors

## 🎯 How to Use

### Generate Screenshots
1. Go to: https://codefolio.space/settings/portfolio
2. Enter your website URL
3. Click "Generate from URL"
4. Wait 1-2 minutes
5. Refresh page (F5)

### Quick Commands

```bash
# Test the feature
php artisan screenshot:test https://example.com

# Check diagnostic
php scripts/test-screenshot-feature.php

# Monitor logs
tail -f storage/logs/laravel.log | grep screenshot

# Process queued jobs manually
php artisan queue:work --once

# Check queue status
php artisan queue:monitor

# Restart queue worker
php artisan queue:restart
```

## 🐛 Quick Troubleshooting

### If button does nothing:
1. Check browser console (F12)
2. Make sure URL field is filled
3. Verify you're logged in

### If screenshots don't appear:
1. Wait 2 minutes minimum
2. Refresh the page (F5)
3. Check: `php artisan queue:work --once`
4. Check: `tail -f storage/logs/laravel.log`

### If seeing errors:
1. Clear config: `php artisan config:clear && php artisan config:cache`
2. Restart queue: `php artisan queue:restart`
3. Check logs: `tail -100 storage/logs/laravel.log`

## 📍 Important Files

- Config: `.env` (SCREENSHOT_API_KEY)
- Controller: `app/Http/Controllers/Settings/PortfolioController.php`
- Job: `app/Jobs/GeneratePortfolioScreenshots.php`
- Service: `app/Services/ScreenshotService.php`
- Frontend: `resources/js/pages/settings/portfolio.tsx`
- Route: `routes/settings.php`

## 🔍 Where to Look

- **Browser**: F12 Developer Tools → Console + Network tabs
- **Backend Logs**: `storage/logs/laravel.log`
- **Queue Jobs**: `php artisan queue:monitor`
- **Storage**: `storage/app/public/portfolio-screenshots/`

## 💡 Pro Tips

1. Queue worker MUST be running for async processing
2. Screenshots take 60-120 seconds to generate
3. Always refresh page after waiting
4. Use `php artisan screenshot:test` to verify API
5. Monitor logs in real-time during testing

## 🚨 Emergency Commands

```bash
# Restart everything
php artisan config:clear
php artisan cache:clear
php artisan queue:restart
php artisan config:cache

# Check what's wrong
php scripts/test-screenshot-feature.php
tail -100 storage/logs/laravel.log
php artisan queue:failed

# Fix failed jobs
php artisan queue:retry all
```

## 📊 Expected Timeline

- Click button: 0 sec
- Job queued: 1 sec
- Processing starts: 2-5 sec
- Desktop done: 30-40 sec
- Mobile done: 60-80 sec
- Total time: 1-2 minutes

## ✨ Success Indicators

- ✅ Alert: "Screenshot generation started!"
- ✅ Logs: "Starting screenshot generation"
- ✅ Logs: "Screenshot generation completed"
- ✅ Page shows desktop and mobile images
- ✅ Database updated with image paths
