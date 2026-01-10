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
            // Software Development
            'Full Stack Developer',
            'Frontend Developer',
            'Backend Developer',
            'Web Developer',
            'Software Engineer',
            'Software Developer',
            'Senior Software Engineer',
            'Lead Developer',
            'Principal Engineer',
            'Staff Engineer',
            
            // Mobile Development
            'Mobile Developer',
            'iOS Developer',
            'Android Developer',
            'React Native Developer',
            'Flutter Developer',
            
            // Specialized Development
            'Game Developer',
            'Blockchain Developer',
            'Smart Contract Developer',
            'IoT Developer',
            'Embedded Systems Engineer',
            'AR/VR Developer',
            'Desktop Application Developer',
            
            // Data & AI
            'Data Scientist',
            'Data Engineer',
            'Data Analyst',
            'Business Intelligence Analyst',
            'Machine Learning Engineer',
            'ML Engineer',
            'AI Engineer',
            'Research Scientist',
            'Computer Vision Engineer',
            'NLP Engineer',
            
            // DevOps & Infrastructure
            'DevOps Engineer',
            'Site Reliability Engineer',
            'Platform Engineer',
            'Cloud Engineer',
            'Cloud Architect',
            'Infrastructure Engineer',
            'System Administrator',
            'Network Engineer',
            'Solutions Architect',
            
            // Security
            'Security Engineer',
            'Cybersecurity Engineer',
            'Information Security Analyst',
            'Penetration Tester',
            'Security Architect',
            'Application Security Engineer',
            
            // Design
            'UI/UX Designer',
            'UI Designer',
            'UX Designer',
            'Product Designer',
            'Graphic Designer',
            'Visual Designer',
            'Interaction Designer',
            'Motion Designer',
            'Design Systems Designer',
            
            // Management & Leadership
            'Engineering Manager',
            'Technical Lead',
            'Team Lead',
            'CTO',
            'VP of Engineering',
            'Director of Engineering',
            
            // Product Management
            'Product Manager',
            'Technical Product Manager',
            'Product Owner',
            'Senior Product Manager',
            'Director of Product',
            
            // Quality Assurance
            'QA Engineer',
            'Quality Assurance Engineer',
            'Test Engineer',
            'Automation Engineer',
            'SDET',
            'QA Analyst',
            
            // Database
            'Database Administrator',
            'Database Engineer',
            'Database Architect',
            
            // Architecture
            'Software Architect',
            'Solutions Architect',
            'Enterprise Architect',
            'System Architect',
            
            // Project Management
            'Project Manager',
            'Technical Project Manager',
            'Scrum Master',
            'Agile Coach',
            'Program Manager',
            
            // Other Technical Roles
            'Technical Writer',
            'Documentation Engineer',
            'Developer Advocate',
            'Developer Relations Engineer',
            'Technical Support Engineer',
            'Integration Engineer',
            'Performance Engineer',
            'Release Engineer',
            'Build Engineer',
            
            // Consulting
            'Technical Consultant',
            'Software Consultant',
            'IT Consultant',
            
            // Freelance
            'Freelance Developer',
            'Independent Contractor',
            'Consultant',
        ];

        foreach ($professions as $profession) {
            Profession::firstOrCreate(['name' => $profession]);
        }
    }
}
