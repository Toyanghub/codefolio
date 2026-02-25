<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Primary Meta Tags --}}
        <title inertia>{{ config('app.name', 'Codefolio') }}</title>
        <meta name="title" content="{{ config('app.name', 'Codefolio') }} - Showcase Your Developer Portfolio">
        <meta name="description" content="Codefolio is an online platform where developers can upload, organize, and showcase their portfolios in one public place. Share your work and connect with the developer community.">
        <meta name="keywords" content="developer portfolio, coding portfolio, programming projects, web developer showcase, software engineer portfolio">
        <meta name="author" content="Codefolio">
        
        {{-- Theme Color --}}
        <meta name="theme-color" content="#18181b" media="(prefers-color-scheme: dark)">
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">

        {{-- Open Graph / Facebook --}}
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="{{ config('app.name', 'Codefolio') }} - Showcase Your Developer Portfolio">
        <meta property="og:description" content="An online platform where developers can upload, organize, and showcase their portfolios. Join the developer community and share your work.">
        <meta property="og:image" content="{{ asset('/favicon.svg') }}">
        <meta property="og:site_name" content="{{ config('app.name', 'Codefolio') }}">

        {{-- Twitter Card --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="{{ url()->current() }}">
        <meta name="twitter:title" content="{{ config('app.name', 'Codefolio') }} - Showcase Your Developer Portfolio">
        <meta name="twitter:description" content="An online platform where developers can upload, organize, and showcase their portfolios.">
        <meta name="twitter:image" content="{{ asset('/favicon.svg') }}">

        {{-- Canonical URL --}}
        <link rel="canonical" href="{{ url()->current() }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        {{-- Favicon --}}
        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">
        <link rel="manifest" href="/site.webmanifest">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
