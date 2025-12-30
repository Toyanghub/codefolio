import { Footerdemo } from '@/components/ui/footer-section';
import { dashboard, login, logout, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

function Navbar({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = () => {
        router.post(logout.url());
    };

    return (
        <nav className="fixed top-0 right-0 left-0 z-50 border-b border-zinc-200/50 bg-white/80 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo/Brand */}
                    <Link
                        href="/"
                        className="flex items-center space-x-2 text-xl font-semibold tracking-tight text-zinc-900 transition-colors hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
                    >
                        {/* <span className="text-2xl">💼</span> */}
                        <span>Codefolio</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden items-center space-x-1 md:flex">
                        <Link
                            href="/"
                            className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                        >
                            Home
                        </Link>
                        <Link
                            href="/explore"
                            className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                        >
                            Explore
                        </Link>
                        <Link
                            href="/projects"
                            className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                        >
                            Projects
                        </Link>
                    </div>

                    {/* Auth Buttons (Desktop) */}
                    <div className="hidden items-center space-x-2 md:flex">
                        {auth.user ? (
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setUserMenuOpen(!userMenuOpen)
                                    }
                                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                    <div className="flex flex-col items-end text-sm">
                                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                            {auth.user.name}
                                        </span>
                                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                            @{auth.user.email.split('@')[0]}
                                        </span>
                                    </div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                                        <span className="text-sm font-semibold">
                                            {auth.user.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                {userMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() =>
                                                setUserMenuOpen(false)
                                            }
                                        />
                                        <div className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                                            <div className="space-y-1 p-2">
                                                {/* User Info Header */}
                                                <div className="flex items-center gap-3 px-2 py-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                                                        <span className="font-semibold">
                                                            {auth.user.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                            {auth.user.name}
                                                        </span>
                                                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                                            {auth.user.email}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="border-t border-zinc-200 dark:border-zinc-800" />

                                                <Link
                                                    href="/settings/profile"
                                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                    onClick={() =>
                                                        setUserMenuOpen(false)
                                                    }
                                                >
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    Settings
                                                </Link>

                                                <button
                                                    onClick={() => {
                                                        setUserMenuOpen(false);
                                                        handleLogout();
                                                    }}
                                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                >
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Log out
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                    >
                                        Sign up
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:ring-2 focus:ring-zinc-500 focus:outline-none focus:ring-inset md:hidden dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                        aria-expanded={mobileMenuOpen}
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {mobileMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="border-t border-zinc-200/50 bg-white/95 backdrop-blur-md md:hidden dark:border-zinc-800/50 dark:bg-zinc-950/95">
                    <div className="space-y-1 px-4 pt-2 pb-3">
                        {/* Mobile Navigation Links */}
                        <Link
                            href="/"
                            className="block rounded-md px-4 py-2 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/explore"
                            className="block rounded-md px-4 py-2 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Explore
                        </Link>
                        <Link
                            href="/projects"
                            className="block rounded-md px-4 py-2 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Projects
                        </Link>

                        {/* Mobile Auth Buttons */}
                        <div className="space-y-2 pt-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="block w-full rounded-md bg-zinc-900 px-4 py-2 text-center text-base font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="block w-full rounded-md border border-zinc-300 px-4 py-2 text-center text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="block w-full rounded-md bg-zinc-900 px-4 py-2 text-center text-base font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            Sign up
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    return (
        <>
            <Head title="Welcome to Codefolio" />

            <Navbar canRegister={canRegister} />

            {/* Main Content */}
            <div className="min-h-screen pt-16">
                <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-zinc-50 p-6 dark:bg-zinc-950">
                    <div className="w-full max-w-4xl text-center">
                        <h1 className="mb-4 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            Welcome to Codefolio
                        </h1>
                        <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
                            Showcase your projects and connect with developers
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footerdemo />
        </>
    );
}
