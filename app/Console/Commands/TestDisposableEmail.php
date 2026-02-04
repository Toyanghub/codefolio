<?php

namespace App\Console\Commands;

use App\Rules\NotDisposableEmail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

class TestDisposableEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:disposable-email {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test if an email address is from a disposable email provider';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = $this->argument('email');

        $validator = Validator::make(
            ['email' => $email],
            ['email' => ['required', 'email', new NotDisposableEmail()]]
        );

        if ($validator->fails()) {
            $this->error("❌ Email validation failed!");
            $this->error($validator->errors()->first('email'));
            
            // Extract domain
            $domain = strtolower(substr(strrchr($email, '@'), 1));
            $this->warn("Domain detected: {$domain}");
            
            return 1;
        }

        $this->info("✅ Email is valid and not from a disposable provider!");
        
        // Extract and display domain
        $domain = strtolower(substr(strrchr($email, '@'), 1));
        $this->info("Domain: {$domain}");
        
        return 0;
    }
}
