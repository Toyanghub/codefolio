<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RegularUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if regular user already exists
        $userEmail = 'user@codefolio.local';
        
        $existingUser = User::where('email', $userEmail)->first();
        
        if ($existingUser) {
            $this->command->info("Regular user already exists: {$userEmail}");
            
            // Update existing user to ensure non-admin status
            $existingUser->update([
                'is_admin' => false,
                'email_verified_at' => now(),
            ]);
            
            $this->command->info("Regular user status confirmed (non-admin): {$userEmail}");
        } else {
            // Create new regular user
            User::create([
                'name' => 'Test User',
                'email' => $userEmail,
                'password' => Hash::make('user123'),
                'is_admin' => false,
                'email_verified_at' => now(),
                'portfolio_setup_completed' => false,
                'portfolio_published' => false,
                'is_featured' => false,
                'email_verified' => true,
            ]);
            
            $this->command->info("Regular user created successfully!");
            $this->command->info("Email: {$userEmail}");
            $this->command->info("Password: user123");
            $this->command->info("Admin Status: false (regular user)");
        }
    }
}
