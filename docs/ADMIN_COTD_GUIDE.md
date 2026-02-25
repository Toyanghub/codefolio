# Admin COTD Management System

## Overview

The Card of the Day (COTD) feature allows administrators to feature exceptional portfolios on the Works page. This guide explains how to use the admin system.

## Features

- Browse all published portfolios
- Search portfolios by name or email
- Feature/unfeature portfolios with a single click
- View featured date for active COTDs
- Real-time updates on the Works page

## Database Schema

### Users Table Extensions

Two new columns have been added to the `users` table:

1. **`is_admin`** (boolean, default: false)
    - Determines if user has admin privileges
    - Required to access admin routes

2. **`is_featured`** (boolean, default: false)
    - Marks portfolio as featured COTD
    - Controls visibility on Works page

3. **`featured_at`** (timestamp, nullable)
    - Records when portfolio was featured
    - Used for ordering featured portfolios

## Creating Admin Users

### Method 1: Using Tinker

```bash
php artisan tinker
```

Then run:

```php
// Make existing user admin by ID
$user = App\Models\User::find(1);
$user->is_admin = true;
$user->save();

// Or by email
$user = App\Models\User::where('email', 'admin@example.com')->first();
$user->update(['is_admin' => true]);
```

### Method 2: Direct Database

```sql
UPDATE users SET is_admin = 1 WHERE email = 'admin@example.com';
```

## Admin Routes

### Admin COTD Management Page

- **URL**: `/admin/cotd`
- **Method**: GET
- **Access**: Authenticated admin users only
- **Middleware**: `auth`, `EnsureUserIsAdmin`

**Query Parameters:**

- `search` (optional): Filter portfolios by name or email

### Toggle Featured Status

- **URL**: `/admin/cotd/{user}/toggle`
- **Method**: POST
- **Access**: Authenticated admin users only
- **Request Body**:
    ```json
    {
        "is_featured": true // or false
    }
    ```

## Using the Admin Interface

### Accessing the Admin Panel

1. Log in with an admin account
2. Navigate to `/admin/cotd`
3. You'll see a grid of all published portfolios

### Featuring a Portfolio

1. Browse or search for the desired portfolio
2. Click the **"Feature"** button with star icon
3. Portfolio will immediately appear on Works page
4. Featured badge appears on the card
5. Featured date is recorded

### Unfeaturing a Portfolio

1. Find the featured portfolio (indicated by amber border and badge)
2. Click the **"Unfeature"** button with star-off icon
3. Portfolio will be removed from Works page
4. Featured status is cleared

### Search Functionality

- Use the search bar to filter by:
    - User name (e.g., "John Doe")
    - Email address (e.g., "john@example.com")
- Press Enter or submit the form
- Results update instantly

### Portfolio Preview

- Click the external link icon button to view full portfolio
- Opens portfolio detail page in same tab

## Works Page Display

### Frontend Integration

Featured portfolios automatically appear on `/works` page in:

- Grid layout with modern cards
- Ordered by `featured_at` (most recent first)
- Shows avatar, name, role, tech stack, description
- Links to full portfolio detail

### Empty State

When no portfolios are featured:

- Friendly empty state message displayed
- Book icon illustration
- Encouragement to check back soon

## Controller Logic

### Admin Controller (`Admin\CotdController`)

- **`index()`**: Lists all published portfolios with relationships
    - Supports search filtering
    - Eager loads skills, tech stacks, professions
    - Returns to Inertia `admin/cotd` page

- **`toggleFeatured(User $user)`**: Updates featured status
    - Validates `is_featured` boolean
    - Sets/clears `featured_at` timestamp
    - Returns success message

### Works Controller (`WorksController`)

- **`index()`**: Fetches featured portfolios for public display
    - Queries: `is_featured = true` AND `portfolio_published = true`
    - Generates avatar fallbacks (DiceBear)
    - Maps to frontend format
    - Returns to Inertia `works` page

## Middleware

### EnsureUserIsAdmin

- Protects all `/admin/*` routes
- Checks if user is authenticated
- Verifies `is_admin = true`
- Returns 403 "Unauthorized" if not admin

**Location**: `app/Http/Middleware/EnsureUserIsAdmin.php`

## Frontend Components

### Admin COTD Page (`resources/js/pages/admin/cotd.tsx`)

- Portfolio grid with search
- Feature/unfeature toggle buttons
- Featured badge and date display
- Empty state handling
- Real-time processing indicators

### Works Page (`resources/js/pages/works.tsx`)

- COTD showcase section
- Feature-spotlight card design
- Animated hover effects
- Skills and tech stack badges
- Empty state with illustration

## Best Practices

### Recommended Workflow

1. **Quality Review**: Check portfolio completeness before featuring
2. **Limit Featured Count**: Consider featuring 3-6 portfolios maximum
3. **Regular Rotation**: Update featured portfolios periodically
4. **Diversity**: Feature varied tech stacks and professions
5. **Communication**: Consider notifying users when featured

### Featured Portfolio Criteria

- ✅ Complete portfolio information
- ✅ High-quality desktop image
- ✅ Detailed description
- ✅ Relevant skills and tech stack
- ✅ Professional presentation
- ✅ Published status

## Troubleshooting

### Cannot Access Admin Panel

- **Issue**: 403 Unauthorized error
- **Solution**: Verify user has `is_admin = true` in database

### Featured Portfolio Not Showing

- **Issue**: Portfolio featured but not on Works page
- **Solution**: Check:
    - `portfolio_published = true`
    - `portfolio_desktop_image` is not null
    - Clear cache if needed

### Search Not Working

- **Issue**: Search returns no results
- **Solution**: Ensure searching correct field (name/email)
- Check database has matching records

## Future Enhancements

### Potential Features

- [ ] Featured duration/expiry dates
- [ ] Maximum featured limit (e.g., top 5)
- [ ] Bulk feature/unfeature operations
- [ ] Featured notification emails
- [ ] Admin analytics dashboard
- [ ] Featured portfolio scheduling
- [ ] User submission/nomination system

## Technical Stack

- **Backend**: Laravel 12.44.0, Eloquent ORM
- **Frontend**: React 19.2.0, TypeScript, Inertia.js
- **UI**: Tailwind CSS, Framer Motion, Lucide Icons
- **Database**: MySQL/PostgreSQL

## Support

For issues or questions about the admin system, check:

1. Laravel logs: `storage/logs/laravel.log`
2. Browser console for frontend errors
3. Database migrations status: `php artisan migrate:status`
