<?php

namespace Database\Seeders;

use App\Models\TechStack;
use Illuminate\Database\Seeder;

class TechStackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $techStacks = [
            'JavaScript',
            'TypeScript',
            'React',
            'Node.js',
            'Python',
            'HTML',
            'CSS',
            'Django',
            'C++',
            'Vue.js',
            'Angular',
            'PHP',
            'Laravel',
            'MySQL',
            'PostgreSQL',
            'MongoDB',
            'Redis',
            'Docker',
            'Kubernetes',
            'AWS',
            'Git',
        ];

        foreach ($techStacks as $techStack) {
            TechStack::firstOrCreate(['name' => $techStack]);
        }
    }
}
