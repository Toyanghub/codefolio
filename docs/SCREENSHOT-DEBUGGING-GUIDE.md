# Screenshot Generation Feature - Debugging Guide

## ✅ System Status

All components are working correctly:
- ✅ Screenshot API Key configured and valid
- ✅ Queue worker is running
- ✅ Storage permissions are correct
- ✅ API connection tested successfully

## 🔍 How to Test the Feature

### Step 1: Access Portfolio Settings
1. Go to: `https://codefolio.space/settings/portfolio`
2. Make sure you're logged in (you'll be redirected to login if not)

### Step 2: Generate Screenshots
1. Enter your portfolio website URL in the "Website URL" field
2. Click the **"Generate from URL"** button
3. Confirm the popup dialog
4. You'll see a message: "Screenshot generation started! This may take 1-2 minutes. Refresh the page to see the results."

### Step 3: Wait and Refresh
1. Wait **1-2 minutes** for the background job to complete
2. **Refresh the page** (F5 or Ctrl+R)
3. Screenshots should appear in the desktop and mobile preview areas

## 🐛 Debugging Steps

### 1. Check Browser Console (F12)
Open browser developer tools and check for:
- Network errors when clicking the button
- JavaScript errors in the Console tab
- Failed API requests in the Network tab

**Expected Network Request:**
- URL: `POST /settings/portfolio/generate-screenshots`
- Status: `302` (redirect back to settings page)
- Response should include session flash message

### 2. Monitor Laravel Logs in Real-Time

Open a terminal and run:
```bash
tail -f /var/www/codefolio/storage/logs/laravel.log | grep -i screenshot
```

You should see logs like:
```
[timestamp] Starting screenshot generation {"user_id": 123, "url": "https://example.com"}
[timestamp] Screenshot generation completed {"user_id": 123, "desktop": "...", "mobile": "..."}
```

### 3. Check Queue Jobs

See if jobs are being queued:
```bash
cd /var/www/codefolio
php artisan queue:monitor
```

Or check the database:
```bash
php artisan tinker --execute="
    echo 'Pending jobs: ' . DB::table('jobs')->count() . PHP_EOL;
    echo 'Failed jobs: ' . DB::table('failed_jobs')->count() . PHP_EOL;
"
```

### 4. Manually Process a Job (for testing)

If you want to test without waiting:
```bash
cd /var/www/codefolio
php artisan queue:work --once
```

This will process one job immediately and show you any errors.

### 5. Test Screenshot Generation Manually

Test the screenshot API directly:
```bash
cd /var/www/codefolio
php artisan screenshot:test https://your-website.com
```

## 🚨 Common Issues and Solutions

### Issue 1: Button Click Does Nothing
**Symptoms:** Clicking "Generate from URL" has no visible effect

**Solution:**
1. Check if website URL field is filled (required)
2. Open browser console (F12) and look for JavaScript errors
3. Check Network tab to see if request is being sent

### Issue 2: "Failed to start screenshot generation"
**Symptoms:** Error message appears immediately after clicking

**Possible causes:**
- Invalid URL format
- Backend validation error
- Route not found

**Solution:**
```bash
# Check if route exists
php artisan route:list | grep screenshot

# Should show:
# POST settings/portfolio/generate-screenshots
```

### Issue 3: Job Never Completes
**Symptoms:** Waiting 5+ minutes but no screenshots appear

**Solution:**
1. Check if queue worker is running:
```bash
ps aux | grep "queue:work\|queue:listen"
```

2. Process the job manually:
```bash
php artisan queue:work --once --tries=1
```

3. Check for failed jobs:
```bash
php artisan queue:failed
```

4. If failed, see details:
```bash
php artisan queue:failed-table
php artisan migrate
php artisan queue:retry all
```

### Issue 4: Screenshots Generated But Not Appearing
**Symptoms:** Logs show success but images don't show on page

**Solution:**
1. Check if storage link exists:
```bash
ls -la /var/www/codefolio/public/storage
```

2. If not, create it:
```bash
php artisan storage:link
```

3. Verify images exist:
```bash
ls -la /var/www/codefolio/storage/app/public/portfolio-screenshots/
```

4. Check file permissions:
```bash
chmod -R 775 /var/www/codefolio/storage/app/public
```

### Issue 5: API Key Issues
**Symptoms:** "API request failed" in logs

**Solution:**
1. Verify API key in .env:
```bash
cat .env | grep SCREENSHOT_API_KEY
```

2. Clear and recache config:
```bash
php artisan config:clear
php artisan config:cache
```

3. Test API key:
```bash
php artisan screenshot:test
```

## 🔧 Diagnostic Tools

### Run Full Diagnostic
```bash
cd /var/www/codefolio
php scripts/test-screenshot-feature.php
```

### Check Queue Worker Status
```bash
# See if running
ps aux | grep queue

# Start if not running
php artisan queue:work --daemon --tries=3 --timeout=120
```

### Monitor Queue in Real-Time
```bash
watch -n 2 'php artisan queue:monitor'
```

### View Recent Logs
```bash
tail -100 storage/logs/laravel.log | grep -A 5 -B 5 screenshot
```

## 📊 Expected Behavior Timeline

1. **0:00** - User clicks "Generate from URL"
2. **0:01** - Page refreshes with success message
3. **0:02** - Job is queued in database
4. **0:03** - Queue worker picks up job
5. **0:05** - API request sent for desktop screenshot
6. **0:30** - Desktop screenshot received
7. **0:35** - API request sent for mobile screenshot
8. **1:00** - Mobile screenshot received
9. **1:01** - Database updated with image paths
10. **1:02** - Job marked as complete

**Total time: 60-120 seconds**

## 📝 Testing Checklist

Before reporting an issue, verify:

- [ ] I'm logged in to the application
- [ ] I've entered a valid website URL
- [ ] The URL is in correct format (https://example.com)
- [ ] I clicked "Generate from URL" button
- [ ] I confirmed the popup dialog
- [ ] I waited at least 2 minutes
- [ ] I refreshed the page after waiting
- [ ] Queue worker is running (`ps aux | grep queue`)
- [ ] No errors in browser console (F12)
- [ ] No errors in Laravel logs
- [ ] API key is configured correctly

## 🆘 Still Not Working?

Run the diagnostic script and share the output:
```bash
cd /var/www/codefolio
php scripts/test-screenshot-feature.php > screenshot-diagnostic.txt
cat screenshot-diagnostic.txt
```

Check the last 100 lines of logs:
```bash
tail -100 storage/logs/laravel.log
```

Check for failed jobs:
```bash
php artisan queue:failed
```

## 📞 Support Information

If you've tried all the above and it still doesn't work:

1. Run: `php scripts/test-screenshot-feature.php`
2. Check: `tail -100 storage/logs/laravel.log`
3. Check: `php artisan queue:failed`
4. Share the output of these commands for support
