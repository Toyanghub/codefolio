<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AccountHandlerController extends Controller
{
    /**
     * Display all user accounts with filtering and search
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search', '');
        $filter = $request->input('filter', 'all'); // all, verified, unverified, admin, regular
        $perPage = $request->input('per_page', 15);
        
        $query = User::query()
            ->when($search, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('id', $search);
                });
            });
        
        // Apply filters
        switch ($filter) {
            case 'verified':
                $query->where('email_verified', true);
                break;
            case 'unverified':
                $query->where('email_verified', false);
                break;
            case 'admin':
                $query->where('is_admin', true);
                break;
            case 'regular':
                $query->where('is_admin', false);
                break;
            case 'oauth':
                $query->where(function($q) {
                    $q->whereNotNull('google_id')
                      ->orWhereNotNull('github_id');
                });
                break;
            case 'all':
            default:
                // Show all users
                break;
        }
        
        $users = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();
        
        // Get statistics
        $stats = [
            'total' => User::count(),
            'verified' => User::where('email_verified', true)->count(),
            'unverified' => User::where('email_verified', false)->count(),
            'admins' => User::where('is_admin', true)->count(),
            'oauth_users' => User::whereNotNull('google_id')
                ->orWhereNotNull('github_id')
                ->count(),
        ];
        
        return Inertia::render('admin/account-handler', [
            'users' => $users,
            'stats' => $stats,
            'search' => $search,
            'filter' => $filter,
            'perPage' => $perPage,
        ]);
    }
    
    /**
     * Toggle admin status for a user
     */
    public function toggleAdmin(Request $request, User $user)
    {
        // Prevent user from removing their own admin access
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'You cannot remove your own admin access.');
        }
        
        $user->is_admin = !$user->is_admin;
        $user->save();
        
        Log::info('Admin status toggled', [
            'admin_user' => $request->user()->email,
            'target_user' => $user->email,
            'new_status' => $user->is_admin ? 'admin' : 'regular',
        ]);
        
        return back()->with('success', 
            $user->is_admin 
                ? "{$user->name} is now an administrator." 
                : "{$user->name} is no longer an administrator."
        );
    }
    
    /**
     * Toggle email verification status for a user
     */
    public function toggleVerification(Request $request, User $user)
    {
        $user->email_verified = !$user->email_verified;
        
        if ($user->email_verified && !$user->email_verified_at) {
            $user->email_verified_at = now();
        } elseif (!$user->email_verified) {
            $user->email_verified_at = null;
        }
        
        $user->save();
        
        Log::info('Email verification status toggled', [
            'admin_user' => $request->user()->email,
            'target_user' => $user->email,
            'new_status' => $user->email_verified ? 'verified' : 'unverified',
        ]);
        
        return back()->with('success', 
            $user->email_verified 
                ? "{$user->name}'s email is now  verified." 
                : "{$user->name}'s email is now unverified."
        );
    }
    
    /**
     * Delete a user account
     */
    public function destroy(Request $request, User $user)
    {
        // Prevent user from deleting their own account
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'You cannot delete your own account.');
        }
        
        Log::warning('User account deleted', [
            'admin_user' => $request->user()->email,
            'deleted_user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
        
        $userName = $user->name;
        $user->delete();
        
        return back()->with('success', "Account for {$userName} has been deleted.");
    }
    
    /**
     * Get detailed user information
     */
    public function show(User $user): Response
    {
        // Load user with sensitive data (for admin view only)
        $userData = $user->makeVisible([
            'email_otp',
            'email_otp_expires_at',
            'email_otp_attempts',
            'two_factor_secret',
            'two_factor_recovery_codes',
            'remember_token',
        ])->toArray();
        
        // Mask sensitive data for display
        if ($userData['two_factor_secret']) {
            $userData['two_factor_secret'] = '****** (Hidden for security)';
        }
        if ($userData['two_factor_recovery_codes']) {
            $userData['two_factor_recovery_codes'] = '****** (Hidden for security)';
        }
        
        return Inertia::render('admin/account-detail', [
            'user' => $userData,
        ]);
    }
    
    /**
     * Clear OTP attempts for a user
     */
    public function clearOtpAttempts(User $user)
    {
        $user->email_otp_attempts = 0;
        $user->save();
        
        return back()->with('success', "OTP attempts cleared for {$user->name}.");
    }
    
    /**
     * Clear 2FA for a user
     */
    public function clear2FA(User $user)
    {
        $user->two_factor_secret = null;
        $user->two_factor_recovery_codes = null;
        $user->two_factor_confirmed_at = null;
        $user->save();
        
        Log::info('2FA cleared for user', [
            'target_user' => $user->email,
        ]);
        
        return back()->with('success', "Two-factor authentication cleared for {$user->name}.");
    }
}
