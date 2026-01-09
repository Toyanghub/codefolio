<?php

namespace Database\Seeders;

use App\Models\Profession;
use Illuminate\Database\Seeder;

class ProfessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $professions = [
            'Fullstack Developer',
            'Frontend Developer',
            'Backend Developer',
            'Web Developer',
            'Software Developer',
            'Mobile Developer',
            'DevOps Engineer',
            'Data Scientist',
            'Data Engineer',
            'Machine Learning Engineer',
            'UI/UX Designer',
            'Product Designer',
            'Graphic Designer',
            'Product Manager',
            'Project Manager',
            'Software Architect',
            'Database Administrator',
            'Security Engineer',
            'Quality Assurance Engineer',
            'Technical Writer',
        ];

        foreach ($professions as $profession) {
            Profession::firstOrCreate(['name' => $profession]);
        }
    }
}
