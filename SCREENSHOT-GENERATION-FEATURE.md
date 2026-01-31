# Automated Screenshot Generation Feature

## Overview

Automated screenshot generation allows users to automatically create desktop and mobile portfolio screenshots from their website URL, eliminating the need for manual screenshot uploads.

## ✨ Features Implemented

### 1. Screenshot Service

**Location:** `app/Services/ScreenshotService.php`

**Capabilities:**

- Generates both desktop (1920x1080) and mobile (375x667) screenshots
- Uses ScreenshotAPI as primary service (with API key)
- Falls back to ApiFlash for demo/testing
- Automatic image optimization and storage
- Cleanup of old screenshot files

**Supported Services:**

- **ScreenshotAPI** (recommended): https://screenshotapi.net
- **ApiFlash**: https://apiflash.com
- **Urlbox**: https://urlbox.io
- **ScreenshotOne**: https://screenshotone.com

### 2. Background Processing

**Location:** `app/Jobs/GeneratePortfolioScreenshots.php`

**Benefits:**

- Non-blocking operation (doesn't timeout)
- Queue-based processing
- Automatic retries on failure
- Error logging and tracking
- Cleanup of old temporary files

**Configuration:**

- Timeout: 120 seconds (2 minutes)
- Max Retries: 2 attempts
- Queue: database (default)

### 3. User Interface

**Location:** `resources/js/pages/settings/portfolio.tsx`

**UI Features:**

- Prominent "Auto-Generate" section with amber styling
- Clear instructions and requirements
- Loading state with spinner
- Validation (requires website URL)
- Confirmation before processing
- User feedback messages

**Button States:**

- Disabled if no URL entered
- Loading state during generation
- Re-enabled after completion

### 4. Backend Integration

**Controller:** `app/Http/Controllers/Settings/PortfolioController.php`
**Route:** `/settings/portfolio/generate-screenshots`

**Process Flow:**

1. Validate website URL
2. Dispatch background job
3. Return immediate response
4. Job processes in background
5. Screenshots saved to storage
6. User model updated with image paths

---

## 📋 Setup Instructions

### Step 1: Choose a Screenshot Service

**Option A: ScreenshotAPI (Recommended)**

1. Sign up at https://screenshotapi.net
2. Get your API key from the dashboard
3. Add to `.env`:

```env
SCREENSHOT_API_KEY=your_api_key_here
```

**Pricing:**

- Free tier: 100 screenshots/month
- Pro: $9/month for 1,000 screenshots
- Enterprise: Custom pricing

**Option B: ApiFlash**

1. Sign up at https://apiflash.com
2. Get your access key
3. Update `ScreenshotService.php` to use ApiFlash as primary

**Pricing:**

- Free tier: 100 screenshots/month
- Plus: $9/month for 1,000 screenshots

**Option C: No API Key (Demo Mode)**

The service will attempt to use free demo endpoints, but these have strict rate limits and may not work reliably.

### Step 2: Configure Queue Worker

Screenshot generation runs in the background queue. Ensure your queue worker is running:

```bash
# Start the queue worker
php artisan queue:work

# Or use queue:listen for development
php artisan queue:listen
```

**For Production:**
Use Supervisor or similar process manager to keep the queue worker running:

```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/path/to/worker.log
```

### Step 3: Storage Configuration

Screenshots are stored in `storage/app/public/portfolio-screenshots/`. Ensure the storage link is created:

```bash
php artisan storage:link
```

### Step 4: Test the Feature

1. Go to **Settings → Portfolio** (`/settings/portfolio`)
2. Enter your website URL in the "Portfolio Link" section
3. Scroll to "Portfolio Screenshots"
4. Click **"Generate from URL"** in the amber box
5. Confirm the action
6. Wait 1-2 minutes
7. Refresh the page to see the generated screenshots

---

## 🔧 Usage Guide

### For Users

**How to Generate Screenshots:**

1. Navigate to your portfolio settings page
2. Enter your portfolio website URL (e.g., `https://yourportfolio.com`)
3. Look for the amber "Automatic Screenshot Generation" box
4. Click **"Generate from URL"** button
5. Confirm you want to proceed
6. Wait for the success message
7. Refresh the page after 1-2 minutes
8. Your desktop and mobile screenshots will appear

**Manual Upload (Alternative):**
Users can still manually upload screenshots if they prefer:

- Click the desktop/mobile upload areas
- Select an image file (PNG/JPG, max 2MB)
- Click "Upload Desktop Image" or "Upload Mobile Image"

**When to Use Auto-Generation:**
✅ Your portfolio is publicly accessible
✅ Your website loads quickly
✅ You want consistent, automatic screenshots
✅ You're updating your portfolio regularly

**When to Use Manual Upload:**
✅ Your portfolio requires authentication
✅ You want custom cropped images
✅ Your site has specific screenshots you prefer
✅ You have faster upload than generation

### For Developers

**Monitoring Screenshot Generation:**

```bash
# Watch the queue in real-time
php artisan queue:work --verbose

# Check failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all
```

**View Logs:**

```bash
# Laravel logs
tail -f storage/logs/laravel.log | grep Screenshot

# Specific user screenshot generation
tail -f storage/logs/laravel.log | grep "user_id.*123"
```

**Manual Testing:**

```php
// In tinker
php artisan tinker

use App\Models\User;
use App\Jobs\GeneratePortfolioScreenshots;

$user = User::find(1);
$url = 'https://example.com';

GeneratePortfolioScreenshots::dispatch($user, $url);
```

---

## 🎛️ Configuration Options

### Service Selection

Edit `app/Services/ScreenshotService.php` to customize:

**Desktop Screenshot Size:**

```php
private function captureDesktop(string $url): ?string
{
    return $this->captureScreenshot($url, [
        'width' => 1920,  // Change resolution
        'height' => 1080,
        'device' => 'desktop',
    ]);
}
```

**Mobile Screenshot Size:**

```php
private function captureMobile(string $url): ?string
{
    return $this->captureScreenshot($url, [
        'width' => 375,   // Change to different device
        'height' => 667,  // iPhone SE, iPhone 12 Mini, etc.
        'device' => 'mobile',
    ]);
}
```

**Popular Device Sizes:**

- iPhone SE: 375x667
- iPhone 12/13/14: 390x844
- iPhone 12/13/14 Pro Max: 428x926
- Samsung Galaxy S21: 360x800
- iPad: 768x1024

### API Parameters

**ScreenshotAPI Additional Options:**

```php
$response = Http::timeout(30)->get('https://shot.screenshotapi.net/screenshot', [
    'token' => $apiKey,
    'url' => $url,
    'width' => $options['width'],
    'height' => $options['height'],
    'output' => 'image',
    'file_type' => 'png',        // or 'jpg', 'webp'
    'wait_for_event' => 'load',  // or 'networkidle'
    'delay' => 1000,             // Wait time in ms
    'fresh' => true,             // Don't use cache
    'full_page' => false,        // Capture full page or just viewport
    'retina' => true,            // 2x resolution for retina displays
]);
```

### Cleanup Settings

**Adjust Screenshot Cleanup Time:**

```php
// In ScreenshotService.php
public function cleanupOldScreenshots(int $userId): void
{
    // Change from 3600 (1 hour) to different duration
    if (time() - $fileTime > 7200) { // 2 hours
        Storage::disk('public')->delete($file);
    }
}
```

---

## 🚨 Troubleshooting

### Issue: "Screenshot generation started but images don't appear"

**Possible Causes:**

1. Queue worker not running
2. Job failed silently
3. API rate limit exceeded
4. Invalid website URL

**Solutions:**

```bash
# Check if queue worker is running
ps aux | grep "queue:work"

# Check failed jobs
php artisan queue:failed

# View logs
tail -f storage/logs/laravel.log

# Manually process queued jobs
php artisan queue:work --once
```

### Issue: "Invalid URL format error"

**Solution:**

- Ensure URL includes protocol: `https://example.com` (not `example.com`)
- Check URL is publicly accessible
- Verify no typos in URL

### Issue: "Screenshots are blank or error images"

**Possible Causes:**

1. Website requires authentication
2. Website blocks automated requests
3. Website takes too long to load
4. JavaScript-heavy site not fully rendered

**Solutions:**

- Use manual upload for private sites
- Increase `delay` parameter in service
- Check if website allows bot access
- Add wait time for JavaScript to load

### Issue: "Generation takes too long"

**Normal Behavior:**

- Desktop: 10-30 seconds
- Mobile: 10-30 seconds
- Total: 30-60 seconds typically

**If Longer Than 2 Minutes:**

```bash
# Check job status
php artisan queue:failed

# Increase timeout in job
public int $timeout = 180; // 3 minutes
```

### Issue: "API key not working"

**Checklist:**

- ✅ API key added to `.env` file
- ✅ Config cache cleared: `php artisan config:clear`
- ✅ API key is valid and active
- ✅ API quota not exceeded
- ✅ Correct service configuration

```bash
# Verify configuration
php artisan tinker
>>> config('services.screenshot.api_key')
```

### Issue: "Storage disk not found"

**Solution:**

```bash
# Create storage link
php artisan storage:link

# Verify storage permissions
chmod -R 775 storage/app/public
```

---

## 💡 Best Practices

### 1. API Key Security

- Never commit API keys to version control
- Use `.env` file for sensitive credentials
- Rotate keys periodically
- Monitor usage and costs

### 2. Queue Management

- Always run queue worker in production
- Monitor failed jobs regularly
- Set up alerts for queue failures
- Use Redis or database for queue in production

### 3. User Experience

- Show clear loading indicators
- Provide estimated wait times
- Send notifications when complete (future enhancement)
- Allow manual uploads as fallback

### 4. Cost Optimization

- Cache screenshots to avoid regeneration
- Set reasonable rate limits per user
- Use free tiers for development
- Monitor API usage and costs

### 5. Error Handling

- Log all failures for debugging
- Show user-friendly error messages
- Provide retry mechanisms
- Have fallback services

---

## 📊 Alternative Services Comparison

| Service           | Free Tier | Pro Price      | Best For           |
| ----------------- | --------- | -------------- | ------------------ |
| **ScreenshotAPI** | 100/month | $9/month (1K)  | Best reliability   |
| **ApiFlash**      | 100/month | $9/month (1K)  | Fast processing    |
| **Urlbox**        | 50/month  | $19/month (5K) | Advanced features  |
| **ScreenshotOne** | 100/month | $12/month (1K) | Good documentation |

### Recommendation:

- **Development:** Use free tier of any service
- **Small Projects:** ScreenshotAPI or ApiFlash
- **Large Projects:** Enterprise plan or self-hosted solution

---

## 🔮 Future Enhancements

### Planned Features:

1. **Real-time Progress**: WebSocket notifications for job progress
2. **Preview Before Save**: Show generated screenshots before applying
3. **Bulk Generation**: Generate screenshots for multiple URLs
4. **Scheduling**: Automatic regeneration on schedule
5. **Comparison View**: Side-by-side old vs new screenshots
6. **Custom Viewports**: User-defined screenshot dimensions
7. **PDF Support**: Generate screenshots from PDF portfolios
8. **Video Capture**: Short video walkthroughs of portfolio

### Self-Hosted Alternative:

For unlimited screenshots, consider self-hosting with Puppeteer:

```bash
# Install Puppeteer via npm
npm install puppeteer

# Create Node.js microservice
node screenshot-service.js
```

This requires additional setup but eliminates API costs.

---

## 📚 Code Reference

### Key Files Created/Modified:

**New Files:**

```
app/Services/ScreenshotService.php
app/Jobs/GeneratePortfolioScreenshots.php
```

**Modified Files:**

```
app/Http/Controllers/Settings/PortfolioController.php
resources/js/pages/settings/portfolio.tsx
routes/settings.php
config/services.php
```

### Database Changes:

No new migrations required. Uses existing `portfolio_desktop_image` and `portfolio_mobile_image` columns in `users` table.

### Dependencies:

No new Composer or NPM packages required. Uses built-in:

- Laravel HTTP client
- Laravel Queue system
- Laravel Storage
- Inertia.js

---

## 🆘 Support & Resources

### Documentation Links:

- ScreenshotAPI Docs: https://screenshotapi.net/documentation
- ApiFlash Docs: https://apiflash.com/docs
- Laravel Queues: https://laravel.com/docs/queues
- Laravel HTTP Client: https://laravel.com/docs/http-client

### Getting Help:

1. Check Laravel logs: `storage/logs/laravel.log`
2. Review queue failed jobs: `php artisan queue:failed`
3. Test in Tinker for debugging
4. Check API service status pages

---

## ✅ Testing Checklist

### Frontend Testing:

- [ ] Generate button appears on portfolio settings page
- [ ] Button disabled when no URL entered
- [ ] Loading state shows during generation
- [ ] Confirmation dialog appears before processing
- [ ] Success message displayed after submission
- [ ] Error messages shown for invalid URLs

### Backend Testing:

- [ ] Queue job dispatched successfully
- [ ] Screenshots generated with correct dimensions
- [ ] Images saved to storage/app/public
- [ ] User model updated with image paths
- [ ] Old screenshots cleaned up
- [ ] Failed jobs logged properly

### Integration Testing:

- [ ] Queue worker processes jobs
- [ ] Generated images appear in UI after refresh
- [ ] Manual upload still works alongside auto-generation
- [ ] Multiple users can generate simultaneously
- [ ] Rate limiting works (if implemented)

---

## 🎉 Feature Complete!

The automated screenshot generation feature is now fully implemented and ready for use:

✅ Screenshot service with multiple API options
✅ Background queue processing
✅ User-friendly interface
✅ Error handling and logging
✅ Storage management and cleanup
✅ Comprehensive documentation

**To start using:**

1. Add `SCREENSHOT_API_KEY` to `.env`
2. Start queue worker: `php artisan queue:work`
3. Visit `/settings/portfolio`
4. Click "Generate from URL"

**Happy screenshot generating! 📸**
