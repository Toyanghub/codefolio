# 🧹 BOT ACCOUNT CLEANUP GUIDE
## Delete 380+ Existing Bot Accounts

**⚠️ IMPORTANT**: This guide is for DELETING existing bot accounts. This will NOT prevent future bots (use reCAPTCHA for prevention).

---

## 🔍 IDENTIFY BOT PATTERN

**Current Bot Email Pattern**:
```
user1771119076251_14_70003@gmail.com
user1234567890_12_34567@gmail.com
user*_*_*@gmail.com (pattern)
```

**Characteristics**:
- Email matches: `user[numbers]_[numbers]_[numbers]@gmail.com`
- All created: Feb 15, 2026 around 09:31 AM
- Status: `email_verified_at` is NULL (never verified OTP)
- IDs: 379-393+ (and beyond)

---

## 🚨 METHOD 1: TINKER (RECOMMENDED)

### Step 1: SSH to Server
```powershell
ssh root@76.13.195.128
cd /var/www/codefolio/my-app
```

### Step 2: Open Tinker
```bash
php artisan tinker
```

### Step 3: Preview Bot Accounts
```php
// Count bot accounts
$botCount = \App\Models\User::where('email', 'like', '%user%_%_%@gmail.com%')
    ->whereNull('email_verified_at')
    ->count();

echo "Found {$botCount} bot accounts\n";

// Preview first 10 bots
$bots = \App\Models\User::where('email', 'like', '%user%_%_%@gmail.com%')
    ->whereNull('email_verified_at')
    ->limit(10)
    ->get(['id', 'name', 'email', 'created_at']);

// Display
$bots->each(function($user) {
    echo "ID: {$user->id} | {$user->email} | Created: {$user->created_at}\n";
});
```

**Expected Output**:
```
Found 380 bot accounts
ID: 379 | user1771119076251_14_70003@gmail.com | Created: 2026-02-15 09:31:12
ID: 380 | user1771119076252_15_70004@gmail.com | Created: 2026-02-15 09:31:13
...
```

### Step 4: Delete Bot Accounts
```php
// ⚠️ DESTRUCTIVE OPERATION - Review pattern first!

$deleted = \App\Models\User::where('email', 'like', '%user%_%_%@gmail.com%')
    ->whereNull('email_verified_at')
    ->where('created_at', '>', '2026-02-15 00:00:00')  // Only delete recent
    ->delete();

echo "✅ Deleted {$deleted} bot accounts\n";
```

### Step 5: Verify Deletion
```php
// Check remaining bots
$remaining = \App\Models\User::where('email', 'like', '%user%_%_%@gmail.com%')
    ->whereNull('email_verified_at')
    ->count();

echo "Remaining bot accounts: {$remaining}\n";  // Should be 0

// Check total users
$totalUsers = \App\Models\User::count();
echo "Total users in database: {$totalUsers}\n";

// Exit Tinker
exit
```

---

## 🗄️ METHOD 2: DIRECT SQL

**⚠️ More dangerous - use only if Tinker fails**

### Step 1: SSH to Server & Backup
```bash
ssh root@76.13.195.128
cd /var/www/codefolio/my-app

# Backup database first
mysqldump -u codefolio_user -p codefolio_prod > bot-cleanup-backup-$(date +%Y%m%d-%H%M%S).sql
```

### Step 2: Connect to Database
```bash
mysql -u codefolio_user -p codefolio_prod
```
Enter your MySQL password.

### Step 3: Preview Bot Accounts
```sql
-- Count bots
SELECT COUNT(*) AS bot_count 
FROM users 
WHERE email LIKE '%user%_%_%@gmail.com%' 
AND email_verified_at IS NULL;

-- View sample bots
SELECT id, email, created_at 
FROM users 
WHERE email LIKE '%user%_%_%@gmail.com%' 
AND email_verified_at IS NULL
LIMIT 10;
```

### Step 4: Delete Bots
```sql
-- ⚠️ DESTRUCTIVE - Double-check pattern!
DELETE FROM users 
WHERE email LIKE '%user%_%_%@gmail.com%' 
AND email_verified_at IS NULL
AND created_at > '2026-02-15 00:00:00';

-- Check affected rows
SELECT ROW_COUNT() AS deleted_count;
```

### Step 5: Verify
```sql
-- Check remaining bots
SELECT COUNT(*) FROM users 
WHERE email LIKE '%user%_%_%@gmail.com%';

-- Check total users
SELECT COUNT(*) FROM users;

-- Exit
exit;
```

---

## 🎯 METHOD 3: SELECTIVE DELETION (Safest)

**For cautious deletion by ID range**

```php
// In Tinker
php artisan tinker

// Delete specific ID range (adjust based on your bot IDs)
$deleted = \App\Models\User::whereBetween('id', [379, 800])
    ->where('email', 'like', '%user%_%_%@gmail.com%')
    ->whereNull('email_verified_at')
    ->delete();

echo "Deleted {$deleted} accounts\n";
```

---

## 📊 VERIFICATION CHECKLIST

After deletion, verify:

### 1. Check User Count
```bash
php artisan tinker
```
```php
// Total users
\App\Models\User::count();

// Verified users only (legitimate)
\App\Models\User::whereNotNull('email_verified_at')->count();

// Unverified users (should be recent legitimate signups)
\App\Models\User::whereNull('email_verified_at')->count();
```

### 2. Check for Remaining Bot Patterns
```php
// Check bot pattern
\App\Models\User::where('email', 'like', '%user%_%_%@gmail.com%')->count();
// Expected: 0
```

### 3. Check Latest Registrations
```php
// View last 10 registrations
\App\Models\User::orderBy('created_at', 'desc')
    ->limit(10)
    ->get(['id', 'email', 'created_at', 'email_verified_at']);
```

---

## 🔄 ALTERNATIVE: ADMIN PANEL FIX

**Issue**: Your admin panel delete button doesn't work.

### Temporary Fix (If You Want to Fix Delete Button)

**File**: Check your admin account handler controller

Likely location: `app/Http/Controllers/Admin/UserController.php`

**Look for delete method and ensure**:
```php
public function destroy(User $user)
{
    // Add authorization check
    if (auth()->user()->is_admin !== true) {
        abort(403);
    }

    // Delete user
    $user->delete();

    return redirect()->back()->with('success', 'User deleted successfully');
}
```

---

## ⚠️ SAFETY WARNINGS

**Before Deleting**:
1. ✅ Backup database first
2. ✅ Preview accounts to be deleted
3. ✅ Verify email pattern matches ONLY bots
4. ✅ Double-check `email_verified_at IS NULL` condition
5. ✅ Delete during low-traffic period

**Do NOT Delete If**:
- Email pattern might match legitimate users
- You're unsure about the selection criteria
- You haven't backed up the database

---

## 🚀 POST-CLEANUP ACTIONS

After deleting bot accounts:

### 1. Clean Up Related Data
```php
// In Tinker
php artisan tinker

// Clear orphaned OTP tokens (if any)
\DB::table('otp_tokens')->whereNotIn('user_id', \App\Models\User::pluck('id'))->delete();

// Clear orphaned sessions
\DB::table('sessions')->whereNotIn('user_id', \App\Models\User::pluck('id'))->delete();
```

### 2. Optimize Database
```bash
# SSH to server
cd /var/www/codefolio/my-app
php artisan db:optimize
```

Or via MySQL:
```sql
mysql -u codefolio_user -p codefolio_prod
OPTIMIZE TABLE users;
exit;
```

### 3. Clear Application Cache
```bash
php artisan cache:clear
php artisan config:clear
```

---

## 📈 MONITORING AFTER CLEANUP

**Check daily for new bot accounts**:

```bash
ssh root@76.13.195.128
cd /var/www/codefolio/my-app
php artisan tinker
```

```php
// Check registrations in last 24 hours
\App\Models\User::where('created_at', '>', now()->subDay())
    ->get(['email', 'created_at', 'email_verified_at']);

// Check for bot pattern
\App\Models\User::where('created_at', '>', now()->subDay())
    ->where('email', 'like', '%user%_%_%@gmail.com%')
    ->count();  // Should be 0 after reCAPTCHA is deployed
```

---

## 🎯 EXPECTED RESULTS

**Before Cleanup**:
- Total Users: ~400+
- Bot Accounts: 380+
- Legitimate Users: ~20

**After Cleanup**:
- Total Users: ~20
- Bot Accounts: 0
- Legitimate Users: ~20

**After reCAPTCHA Deployment**:
- New bot registrations: 0 per day (90-95% reduction)
- Legitimate signups: Normal rate

---

## 📚 RELATED GUIDES

- **Primary Guide**: `RECAPTCHA-DEPLOYMENT-GUIDE.md` (prevents future bots)
- **Quick Start**: `RECAPTCHA-QUICK-START.md` (30-minute deployment)
- **This Guide**: Deletes existing bots only

**⚠️ IMPORTANT**: After cleanup, immediately deploy reCAPTCHA to prevent new bot attacks!

---

## 🆘 TROUBLESHOOTING

### "No users deleted" (0 rows affected)

**Possible causes**:
1. Email pattern doesn't match current bots
2. Bots were already deleted
3. Bots have `email_verified_at` set

**Solution**:
```php
// Check actual bot emails
\App\Models\User::whereNull('email_verified_at')
    ->where('created_at', '>', '2026-02-15 00:00:00')
    ->limit(20)
    ->get(['email']);

// Adjust pattern based on actual emails
```

### "Too many deleted" (more than expected)

**Solution**: Check your WHERE conditions BEFORE running DELETE:
```php
// Always preview first!
$preview = \App\Models\User::where('email', 'like', '%user%@gmail.com%')
    ->whereNull('email_verified_at')
    ->get(['email']);

// Review emails manually before deleting
```

---

**Last Updated**: February 15, 2026  
**Estimated Time**: 10 minutes  
**Risk Level**: Medium (with backup: Low)
