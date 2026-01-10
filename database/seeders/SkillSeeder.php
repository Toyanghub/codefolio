<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Skills from Observatory filters - only 'skills' category
        $skills = [
            ['name' => 'Web', 'category' => 'skills'],
            ['name' => 'Frontend', 'category' => 'skills'],
            ['name' => 'Backend', 'category' => 'skills'],
            ['name' => 'Fullstack', 'category' => 'skills'],
            ['name' => 'Mobile', 'category' => 'skills'],
            ['name' => 'Data', 'category' => 'skills'],
            ['name' => 'Software', 'category' => 'skills'],
        ];

        foreach ($skills as $skill) {
            Skill::firstOrCreate($skill);
        }
    }
}
