# Quick Setup: Screenshot Generation

## 🚀 Get Started in 5 Minutes

### Option 1: Free Demo Mode (No API Key)
The feature will work with limited functionality using free demo endpoints.

```bash
# Just start the queue worker
php artisan queue:work
```

**Limitations:**
- Strict rate limits
- May be slower
- Less reliable

### Option 2: ScreenshotAPI (Recommended)

**Step 1:** Sign up for free account
- Visit: https://screenshotapi.net
- Sign up for free (no credit card)
- Free tier: 100 screenshots/month

**Step 2:** Get API Key
- Go to dashboard
- Copy your API token

**Step 3:** Add to .env
```env
SCREENSHOT_API_KEY=your_token_here
```

**Step 4:** Clear config cache
```bash
php artisan config:clear
```

**Step 5:** Start queue worker
```bash
php artisan queue:work
```

**Step 6:** Test it
1. Go to http://127.0.0.1:8000/settings/portfolio
2. Enter your website URL
3. Click "Generate from URL"
4. Wait 1-2 minutes
5. Refresh page to see screenshots

## ⚡ Quick Test

```bash
# Terminal 1: Start queue worker
php artisan queue:work --verbose

# Terminal 2: Test with tinker
php artisan tinker
>>> $user = User::first();
>>> \App\Jobs\GeneratePortfolioScreenshots::dispatch($user, 'https://example.com');
>>> exit

# Watch Terminal 1 for job processing
# Check storage/app/public/portfolio-screenshots/ for generated images
```

## 🎯 What It Does

1. **User clicks "Generate from URL"**
2. **Job dispatched to queue** (returns immediately)
3. **Background job processes:**
   - Captures desktop screenshot (1920x1080)
   - Captures mobile screenshot (375x667)
   - Saves to storage
   - Updates user's portfolio images
4. **User refreshes page** to see new screenshots

## 🔍 Troubleshooting Quick Fixes

### "Not seeing screenshots after generation"
```bash
# Check if queue worker is running
ps aux | grep "queue:work"

# If not, start it
php artisan queue:work
```

### "Button is disabled"
- Make sure you've entered a website URL first
- URL must include https:// or http://

### "Generation failed"
```bash
# Check logs
tail -f storage/logs/laravel.log | grep Screenshot

# Check failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all
```

### "API key not working"
```bash
# Verify it's loaded
php artisan tinker
>>> config('services.screenshot.api_key')

# If null, clear cache
php artisan config:clear
```

## 📝 Pro Tips

1. **For Development:** Use `queue:listen` instead of `queue:work` (auto-reloads on code changes)
   ```bash
   php artisan queue:listen
   ```

2. **Check Queue Status:**
   ```bash
   # See pending jobs
   php artisan queue:work --once
   
   # Process one job and stop
   php artisan queue:work --stop-when-empty
   ```

3. **Monitor in Real-Time:**
   ```bash
   # Watch logs
   tail -f storage/logs/laravel.log
   
   # Or use Laravel Pail (if installed)
   php artisan pail
   ```

## 💰 Cost Estimate

**ScreenshotAPI Free Tier:**
- 100 screenshots/month
- Each generation = 2 screenshots (desktop + mobile)
- **Can handle ~50 users per month**

**If you need more:**
- Pro Plan: $9/month for 1,000 screenshots
- **Can handle ~500 users per month**

## 🎬 Demo URLs to Test

Try these publicly accessible sites:
- https://example.com
- https://github.com
- https://laravel.com
- https://tailwindcss.com

## ✅ Success Checklist

After setup, verify:
- [ ] Queue worker running
- [ ] API key in .env (or using demo mode)
- [ ] Config cache cleared
- [ ] Button appears on portfolio settings page
- [ ] Test URL generates screenshots successfully
- [ ] Screenshots appear in storage/app/public/portfolio-screenshots/
- [ ] Screenshots display on portfolio settings page after refresh

## 🆘 Need Help?

Check the full documentation: **SCREENSHOT-GENERATION-FEATURE.md**

Or review logs:
```bash
# All errors
tail -f storage/logs/laravel.log | grep ERROR

# Screenshot specific
tail -f storage/logs/laravel.log | grep Screenshot
```

---

**Ready to go! Start generating screenshots! 📸**
