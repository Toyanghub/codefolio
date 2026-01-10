<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use App\Models\TechStack;
use App\Models\Profession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ObservatoryController extends Controller
{
    /**
     * Display the observatory page with filter options.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('observatory', [
            'filterOptions' => [
                'skills' => Skill::where('category', 'skills')
                    ->orderBy('name')
                    ->pluck('name')
                    ->toArray(),
                'techStack' => TechStack::orderBy('name')
                    ->pluck('name')
                    ->toArray(),
                'profession' => Profession::orderBy('name')
                    ->pluck('name')
                    ->toArray(),
            ],
        ]);
    }
}
