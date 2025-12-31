<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/observatory', function () {
    return Inertia::render('observatory');
})->name('observatory');

Route::get('/works', function () {
    return Inertia::render('works');
})->name('works');

Route::get('/portfolio/{id}', function ($id) {
    // Sample portfolio data - in production, fetch from database
    $portfolios = [
        [
            'id' => 1,
            'name' => 'rizamb',
            'role' => 'Fullstack Developer',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=rizamb',
            'image' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
            'skills' => ['Web', 'Fullstack'],
            'techStack' => ['JavaScript', 'React', 'Node.js', 'MongoDB'],
            'isCotd' => true,
            'description' => 'Creating seamless web experiences with modern JavaScript frameworks. Passionate about building scalable applications that make a difference.',
            'email' => 'rizamb@example.com',
            'github' => 'https://github.com/rizamb',
        ],
        [
            'id' => 2,
            'name' => 'elliottprgrammer',
            'role' => 'Fullstack Developer',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=elliott',
            'image' => 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
            'skills' => ['Web', 'Backend'],
            'techStack' => ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
            'description' => 'Backend specialist with a focus on building robust and scalable server-side applications.',
            'website' => 'https://elliott.dev',
        ],
        [
            'id' => 3,
            'name' => 'Jammore123',
            'role' => 'Fullstack Developer',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=jammore',
            'image' => 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&h=600&fit=crop',
            'skills' => ['Web', 'Mobile'],
            'techStack' => ['JavaScript', 'React', 'React Native', 'Firebase'],
            'description' => 'Crafting beautiful mobile and web experiences with React ecosystem.',
        ],
        [
            'id' => 4,
            'name' => 'Deepak',
            'role' => 'Web Developer',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=deepak',
            'image' => 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop',
            'skills' => ['Frontend', 'Web'],
            'techStack' => ['HTML', 'CSS', 'JavaScript', 'Tailwind'],
            'isCotd' => true,
            'description' => 'Crafting beautiful and responsive user interfaces with attention to detail.',
        ],
        [
            'id' => 5,
            'name' => 'samilanojeff98',
            'role' => 'Web Developer',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=samilano',
            'image' => 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=600&fit=crop',
            'skills' => ['Web', 'Fullstack'],
            'techStack' => ['React', 'TypeScript', 'Next.js', 'Prisma'],
            'description' => 'Modern web development with a focus on performance and user experience.',
        ],
        [
            'id' => 6,
            'name' => 'elkoh',
            'role' => 'Fullstack Developer',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=elkoh',
            'image' => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
            'skills' => ['Backend', 'Fullstack'],
            'techStack' => ['Python', 'Django', 'PostgreSQL', 'Redis'],
            'description' => 'Python enthusiast building powerful backend systems and APIs.',
        ],
        [
            'id' => 7,
            'name' => 'JazzMase',
            'role' => 'Fullstack Developer',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=jazzmase',
            'image' => 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=600&fit=crop',
            'skills' => ['Web', 'Data'],
            'techStack' => ['JavaScript', 'Node.js', 'Express', 'MongoDB'],
            'isCotd' => true,
            'description' => 'Building scalable applications with data-driven solutions.',
        ],
        [
            'id' => 8,
            'name' => 'Dock',
            'role' => 'Frontend Developer',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=dock',
            'image' => 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop',
            'skills' => ['Frontend', 'Web'],
            'techStack' => ['React', 'CSS', 'Sass', 'Webpack'],
            'description' => 'Creating pixel-perfect interfaces with modern CSS and React.',
        ],
        [
            'id' => 9,
            'name' => 'quinchy',
            'role' => 'Fullstack Developer',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=quinchy',
            'image' => 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
            'skills' => ['Fullstack', 'Mobile'],
            'techStack' => ['JavaScript', 'React', 'Vue.js', 'Flutter'],
            'description' => 'Versatile developer with experience in both web and mobile development.',
            'github' => 'https://github.com/quinchy',
        ],
        [
            'id' => 10,
            'name' => 'klynesjido',
            'role' => 'Software Developer',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=klynes',
            'image' => 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=600&fit=crop',
            'skills' => ['Software', 'Backend'],
            'techStack' => ['C++', 'Python', 'Go', 'Rust'],
            'description' => 'Systems programmer specializing in high-performance backend solutions.',
            'website' => 'https://klynesjido.dev',
        ],
    ];

    $portfolio = collect($portfolios)->firstWhere('id', (int)$id);
    
    if (!$portfolio) {
        abort(404);
    }

    return Inertia::render('portfolio-detail', [
        'portfolio' => $portfolio,
    ]);
})->name('portfolio.detail');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
