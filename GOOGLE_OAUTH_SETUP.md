# Google OAuth Setup Guide

## Overview
This guide will help you configure Google OAuth authentication for your Laravel application using Laravel Socialite.

## Configuration Status
✅ Laravel Socialite installed  
✅ Configuration files updated ([config/services.php](config/services.php), [.env](.env))  
✅ Database migration created for `google_id` column  
⏳ Need to obtain Google OAuth credentials  
⏳ Need to run migration  

---

## Step 1: Create Google OAuth Credentials

### A. Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

### B. Create or Select a Project
1. Click on the project dropdown at the top of the page
2. Click "New Project" or select an existing project
3. Give it a name (e.g., "Codefolio OAuth")
4. Click "Create"

### C. Enable Google+ API
1. In the left sidebar, go to **APIs & Services > Library**
2. Search for "Google+ API"
3. Click on it and press "Enable"

### D. Configure OAuth Consent Screen
1. Go to **APIs & Services > OAuth consent screen**
2. Choose **External** (unless you have a Google Workspace account)
3. Click "Create"
4. Fill in required fields:
   - **App name**: Codefolio (or your app name)
   - **User support email**: Your email
   - **Developer contact email**: Your email
5. Click "Save and Continue"
6. Skip "Scopes" (click "Save and Continue")
7. Add test users if needed (for development)
8. Click "Save and Continue"

### E. Create OAuth 2.0 Credentials
1. Go to **APIs & Services > Credentials**
2. Click "Create Credentials" > "OAuth client ID"
3. Choose **Application type**: "Web application"
4. Give it a name (e.g., "Codefolio Web Client")
5. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:8000
   http://localhost:5173
   ```
6. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:8000/auth/google/callback
   ```
7. Click "Create"
8. **IMPORTANT**: Copy the **Client ID** and **Client Secret** that appear in the popup

---

## Step 2: Configure Your Laravel Application

### A. Update .env File
Open your `.env` file and add the credentials you just obtained:

```env
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI="${APP_URL}/auth/google/callback"
```

**Example:**
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-1234567890abcdefghij
GOOGLE_REDIRECT_URI="http://localhost:8000/auth/google/callback"
```

### B. Run Database Migration
The migration for the `google_id` column has been created. Run it now:

```bash
php artisan migrate
```

This will add the `google_id` column to your `users` table.

### C. Clear Configuration Cache
```bash
php artisan config:clear
php artisan cache:clear
```

---

## Step 3: Verify Configuration

### Configuration Files Already Set Up:

1. **[config/services.php](config/services.php)** - Contains:
   ```php
   'google' => [
       'client_id' => env('GOOGLE_CLIENT_ID'),
       'client_secret' => env('GOOGLE_CLIENT_SECRET'),
       'redirect' => env('GOOGLE_REDIRECT_URI', env('APP_URL') . '/auth/google/callback'),
   ],
   ```

2. **User Model** - Already has `google_id` in fillable array

3. **Migration** - Created at `database/migrations/2026_01_16_000001_add_google_id_to_users_table.php`

---

## Step 4: Test the Configuration

After setting up your credentials:

1. Make sure your Laravel application is running:
   ```bash
   php artisan serve
   ```

2. Visit your login page at `http://localhost:8000/login`

3. Click the "Sign in with Google" button

4. You should be redirected to Google's authentication page

5. After authorizing, you'll be redirected back to your application

---

## Common Issues & Solutions

### Issue: "Missing required configuration keys"
**Solution**: Make sure you've:
- Added the credentials to your `.env` file
- Run `php artisan config:clear`
- Restarted your development server

### Issue: "Redirect URI mismatch"
**Solution**: 
- Ensure the redirect URI in Google Cloud Console exactly matches: `http://localhost:8000/auth/google/callback`
- Check that `APP_URL` in your `.env` file is `http://localhost:8000`

### Issue: "This app isn't verified"
**Solution**: This is normal during development. Click "Advanced" then "Go to [App Name] (unsafe)" to proceed.

### Issue: "Access blocked: Authorization Error"
**Solution**: 
- Make sure you've enabled the Google+ API
- Add your Google account as a test user in the OAuth consent screen

---

## Production Setup

When deploying to production:

1. **Update Google Cloud Console**:
   - Add your production domain to "Authorized JavaScript origins"
   - Add your production callback URL to "Authorized redirect URIs"
   - Example: `https://yourdomain.com/auth/google/callback`

2. **Update .env on Production Server**:
   ```env
   GOOGLE_CLIENT_ID=your_production_client_id
   GOOGLE_CLIENT_SECRET=your_production_client_secret
   GOOGLE_REDIRECT_URI="https://yourdomain.com/auth/google/callback"
   ```

3. **Verify OAuth Consent Screen**:
   - You may need to submit your app for verification if you have many users
   - Until verified, users will see an "unverified app" warning

---

## Security Best Practices

1. ✅ Never commit your `.env` file to version control
2. ✅ Keep your `GOOGLE_CLIENT_SECRET` confidential
3. ✅ Use different OAuth credentials for development and production
4. ✅ Regularly rotate your client secrets
5. ✅ Only request the minimum required scopes
6. ✅ Implement rate limiting on OAuth routes

---

## Next Steps

Once you've obtained your Google OAuth credentials:

1. ✅ Copy Client ID and Client Secret to [.env](.env)
2. ✅ Run `php artisan migrate`
3. ✅ Run `php artisan config:clear`
4. ✅ Test the Google sign-in flow on your login/register pages
5. ✅ Monitor error logs for any issues

---

## Need Help?

If you encounter any issues:

1. Check Laravel logs: `storage/logs/laravel.log`
2. Verify Google Cloud Console configuration
3. Ensure all environment variables are set correctly
4. Test with `php artisan tinker`:
   ```php
   config('services.google')
   ```
   This should return your Google configuration array.

---

## References

- [Laravel Socialite Documentation](https://laravel.com/docs/11.x/socialite)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
