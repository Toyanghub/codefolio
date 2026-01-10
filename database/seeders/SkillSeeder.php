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
        // Comprehensive skill categories
        $skills = [
            // Development Skills
            ['name' => 'Web Development', 'category' => 'skills'],
            ['name' => 'Frontend Development', 'category' => 'skills'],
            ['name' => 'Backend Development', 'category' => 'skills'],
            ['name' => 'Full Stack Development', 'category' => 'skills'],
            ['name' => 'Mobile Development', 'category' => 'skills'],
            ['name' => 'Desktop Development', 'category' => 'skills'],
            ['name' => 'API Development', 'category' => 'skills'],
            ['name' => 'Microservices', 'category' => 'skills'],
            
            // Specialized Development
            ['name' => 'Game Development', 'category' => 'skills'],
            ['name' => 'Blockchain Development', 'category' => 'skills'],
            ['name' => 'IoT Development', 'category' => 'skills'],
            ['name' => 'AR/VR Development', 'category' => 'skills'],
            ['name' => 'Embedded Systems', 'category' => 'skills'],
            
            // Data & AI
            ['name' => 'Data Science', 'category' => 'skills'],
            ['name' => 'Machine Learning', 'category' => 'skills'],
            ['name' => 'Deep Learning', 'category' => 'skills'],
            ['name' => 'Natural Language Processing', 'category' => 'skills'],
            ['name' => 'Computer Vision', 'category' => 'skills'],
            ['name' => 'Data Engineering', 'category' => 'skills'],
            ['name' => 'Big Data', 'category' => 'skills'],
            ['name' => 'Data Analytics', 'category' => 'skills'],
            
            // DevOps & Infrastructure
            ['name' => 'DevOps', 'category' => 'skills'],
            ['name' => 'Cloud Computing', 'category' => 'skills'],
            ['name' => 'CI/CD', 'category' => 'skills'],
            ['name' => 'Infrastructure as Code', 'category' => 'skills'],
            ['name' => 'Containerization', 'category' => 'skills'],
            ['name' => 'Orchestration', 'category' => 'skills'],
            ['name' => 'System Administration', 'category' => 'skills'],
            ['name' => 'Network Engineering', 'category' => 'skills'],
            
            // Security
            ['name' => 'Cybersecurity', 'category' => 'skills'],
            ['name' => 'Penetration Testing', 'category' => 'skills'],
            ['name' => 'Security Auditing', 'category' => 'skills'],
            ['name' => 'Application Security', 'category' => 'skills'],
            
            // Design & UX
            ['name' => 'UI Design', 'category' => 'skills'],
            ['name' => 'UX Design', 'category' => 'skills'],
            ['name' => 'Graphic Design', 'category' => 'skills'],
            ['name' => 'Interaction Design', 'category' => 'skills'],
            ['name' => 'Product Design', 'category' => 'skills'],
            
            // Testing & QA
            ['name' => 'Quality Assurance', 'category' => 'skills'],
            ['name' => 'Test Automation', 'category' => 'skills'],
            ['name' => 'Performance Testing', 'category' => 'skills'],
            ['name' => 'Unit Testing', 'category' => 'skills'],
            
            // Database
            ['name' => 'Database Design', 'category' => 'skills'],
            ['name' => 'Database Administration', 'category' => 'skills'],
            ['name' => 'SQL', 'category' => 'skills'],
            ['name' => 'NoSQL', 'category' => 'skills'],
        ];

        foreach ($skills as $skill) {
            Skill::firstOrCreate($skill);
        }
    }
}
