# Disposable Email Validation

## Overview

This application prevents users from registering with disposable or temporary email addresses. This ensures account authenticity and maintains communication capabilities with users.

## Implementation

### Components

1. **Validation Rule**: `App\Rules\NotDisposableEmail`
    - Custom Laravel validation rule
    - Checks email domains against a maintained list
    - Uses caching for performance (24-hour cache)

2. **Domains Database**: `storage/app/disposable-email-domains.txt`
    - Text file with 500+ known disposable email domains
    - One domain per line
    - Comments start with `#`
    - Regularly updated list

3. **Registration Integration**: `App\Actions\Fortify\CreateNewUser`
    - Applied during user registration
    - Validates email before account creation
    - Shows clear error message to users

## How It Works

### Validation Flow

```
User submits registration
    ↓
Email validation rules execute
    ↓
NotDisposableEmail rule checks domain
    ↓
Domain extracted (e.g., user@mailinator.com → mailinator.com)
    ↓
Check against disposable domains list (cached)
    ↓
If disposable: Reject with error message
If legitimate: Continue registration
```

### Performance

- **Caching**: Domains list cached for 24 hours (prevents file reading on every validation)
- **Fast Lookup**: In-memory array search (microseconds)
- **No External API**: No network calls, no latency

## Usage

### Testing Emails

Test if an email would be blocked:

```bash
php artisan test:disposable-email "test@mailinator.com"
# ❌ Email validation failed!
# The email must be from a legitimate email provider...

php artisan test:disposable-email "user@gmail.com"
# ✅ Email is valid and not from a disposable provider!
```

### Updating Domains List

Fetch the latest disposable domains from GitHub:

```bash
php artisan update:disposable-domains
```

This command:

- Downloads latest list from `disposable-email-domains` repository
- Updates `storage/app/disposable-email-domains.txt`
- Clears the cache
- Shows count of domains updated

### Manual Updates

You can manually edit the domains file:

```bash
# Edit the file
nano storage/app/disposable-email-domains.txt

# Clear cache after manual edits
php artisan cache:forget disposable_email_domains
```

### Adding Custom Domains

Add custom domains to block:

```txt
# storage/app/disposable-email-domains.txt

# Custom blocked domains
example-temp-mail.com
another-disposable.net
```

## Error Messages

### User Sees

```
The email must be from a legitimate email provider.
Temporary or disposable email addresses are not allowed.
```

### Customizing Error Message

Edit the message in `app/Rules/NotDisposableEmail.php`:

```php
$fail('Your custom error message here.');
```

## Common Blocked Domains

Some examples of blocked disposable email services:

- mailinator.com
- guerrillamail.com
- temp-mail.org
- 10minutemail.com
- yopmail.com
- trashmail.com
- throwaway.email
- And 500+ more...

## Maintenance

### Regular Updates

Set up a scheduled task to update domains weekly:

```php
// app/Console/Kernel.php

protected function schedule(Schedule $schedule)
{
    $schedule->command('update:disposable-domains')
        ->weekly()
        ->sundays()
        ->at('02:00');
}
```

### Monitoring

Check logs for validation attempts:

```bash
# Laravel logs any missing files
tail -f storage/logs/laravel.log | grep "Disposable email domains"
```

## Fail-Safe Behavior

If the domains file is missing or unreadable:

- Validation **fails open** (allows email through)
- Logs a warning
- Prevents registration from breaking due to missing file

This ensures user registration continues working even if there's an issue with the domains list.

## Security Considerations

### Why Block Disposable Emails?

1. **Account Quality**: Reduces spam/fake accounts
2. **Communication**: Ensures email notifications reach users
3. **Verification**: Email verification links are reliable
4. **Abuse Prevention**: Harder to create multiple accounts

### Limitations

- Cannot catch **all** disposable services (new ones appear)
- Some legitimate domains might be blocked (rare)
- Users can still use plus addressing (user+tag@gmail.com)

### Best Practices

1. **Update regularly**: Run update command monthly
2. **Monitor false positives**: Check user feedback
3. **Combine with email verification**: Still send verification emails
4. **Provide support**: Have a process for legitimate users blocked incorrectly

## Integration with Other Features

### Profile Updates

To also prevent users from changing their email to a disposable one, add validation to profile update:

```php
// In your profile update validation
'email' => [
    'required',
    'email',
    new NotDisposableEmail(),
],
```

### API Endpoints

Use in API validation:

```php
use App\Rules\NotDisposableEmail;

$request->validate([
    'email' => ['required', 'email', new NotDisposableEmail()],
]);
```

## Troubleshooting

### Issue: All emails are being blocked

**Solution**: Check cache and file:

```bash
php artisan cache:clear
cat storage/app/disposable-email-domains.txt | head
```

### Issue: Disposable emails are getting through

**Solution**: Update domains list:

```bash
php artisan update:disposable-domains
php artisan cache:clear
```

### Issue: Legitimate email blocked

**Solution**: Remove from list:

```bash
# Edit file, remove the domain
nano storage/app/disposable-email-domains.txt

# Clear cache
php artisan cache:forget disposable_email_domains
```

## Resources

- **Disposable Domains List**: [disposable-email-domains/disposable-email-domains](https://github.com/disposable-email-domains/disposable-email-domains)
- **Laravel Validation**: [Laravel Docs - Custom Rules](https://laravel.com/docs/validation#custom-validation-rules)

## Support

If you encounter issues:

1. Test with command: `php artisan test:disposable-email <email>`
2. Check file exists: `ls -la storage/app/disposable-email-domains.txt`
3. Clear cache: `php artisan cache:clear`
4. Update list: `php artisan update:disposable-domains`
