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
        // Skills from Observatory filterCategories
        $skills = [
            // Skills category
            ['name' => 'Web', 'category' => 'skills'],
            ['name' => 'Frontend', 'category' => 'skills'],
            ['name' => 'Backend', 'category' => 'skills'],
            ['name' => 'Fullstack', 'category' => 'skills'],
            ['name' => 'Mobile', 'category' => 'skills'],
            ['name' => 'Data', 'category' => 'skills'],
            ['name' => 'Software', 'category' => 'skills'],
            
            // Tech Stack category
            ['name' => 'JavaScript', 'category' => 'techStack'],
            ['name' => 'TypeScript', 'category' => 'techStack'],
            ['name' => 'React', 'category' => 'techStack'],
            ['name' => 'Node.js', 'category' => 'techStack'],
            ['name' => 'Python', 'category' => 'techStack'],
            ['name' => 'HTML', 'category' => 'techStack'],
            ['name' => 'CSS', 'category' => 'techStack'],
            ['name' => 'Django', 'category' => 'techStack'],
            ['name' => 'C++', 'category' => 'techStack'],
            
            // Profession category
            ['name' => 'Fullstack Developer', 'category' => 'profession'],
            ['name' => 'Frontend Developer', 'category' => 'profession'],
            ['name' => 'Web Developer', 'category' => 'profession'],
            ['name' => 'Software Developer', 'category' => 'profession'],
        ];

        foreach ($skills as $skill) {
            Skill::firstOrCreate($skill);
        }
    }
}
