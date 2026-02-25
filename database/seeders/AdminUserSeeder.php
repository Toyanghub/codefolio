<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if admin user already exists
        $adminEmail = 'admin@codefolio.local';
        
        $existingAdmin = User::where('email', $adminEmail)->first();
        
        if ($existingAdmin) {
            $this->command->info("Admin user already exists: {$adminEmail}");
            
            // Update existing user to ensure admin status
            $existingAdmin->update([
                'is_admin' => true,
                'email_verified_at' => now(),
            ]);
            
            $this->command->info("Admin status confirmed for: {$adminEmail}");
        } else {
            // Create new admin user
            User::create([
                'name' => 'Admin User',
                'email' => $adminEmail,
                'password' => Hash::make('admin123'),
                'is_admin' => true,
                'email_verified_at' => now(),
                'portfolio_setup_completed' => false,
                'portfolio_published' => false,
                'is_featured' => false,
                'email_verified' => true,
            ]);
            
            $this->command->info("Admin user created successfully!");
            $this->command->info("Email: {$adminEmail}");
            $this->command->info("Password: admin123");
        }
    }
}
