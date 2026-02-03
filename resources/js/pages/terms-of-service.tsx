import { Footerdemo } from '@/components/ui/footer-section';
import { useAppearance } from '@/hooks/use-appearance';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    FileText,
    Gavel,
    Moon,
    Scale,
    Shield,
    Sun,
    UserCheck,
    XCircle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

function Navbar() {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { appearance, updateAppearance } = useAppearance();

    const handleLogout = () => {
        router.post('/logout');
    };

    const toggleTheme = () => {
        const newTheme = appearance === 'dark' ? 'light' : 'dark';
        updateAppearance(newTheme);
    };

    const isDark =
        appearance === 'dark' ||
        (appearance === 'system' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <>
            <div className="flex w-full justify-center px-4 py-6">
                <nav className="relative z-50 flex w-full max-w-6xl items-center justify-between rounded-full bg-white px-6 py-3 shadow-lg dark:border dark:border-zinc-800 dark:bg-zinc-950">
                    {/* Logo/Brand */}
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Link
                            href="/"
                            className="flex items-center space-x-2 text-xl font-semibold tracking-tight transition-colors"
                        >
                            <span>
                                <span className="text-zinc-900 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300">
                                    Code
                                </span>
                                <span className="text-zinc-400 hover:text-zinc-500 dark:text-zinc-500 dark:hover:text-zinc-400">
                                    folio
                                </span>
                            </span>
                        </Link>
                    </motion.div>

                    {/* Navigation Links */}
                    <div className="hidden items-center space-x-1 md:flex">
                        {[
                            { href: '/', label: 'Lobby' },
                            { href: '/observatory', label: 'Observatory' },
                            { href: '/works', label: 'Works' },
                        ].map((item, index) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.1,
                                }}
                            >
                                <Link
                                    href={item.href}
                                    className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 transition-all duration-300 hover:text-zinc-900 hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.3)] dark:text-zinc-300 dark:hover:text-zinc-100 dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                >
                                    {item.label}
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Auth Buttons (Desktop) */}
                    <motion.div
                        className="hidden items-center space-x-2 md:flex"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        {auth.user ? (
                            <div className="relative">
                                <motion.button
                                    onClick={() =>
                                        setUserMenuOpen(!userMenuOpen)
                                    }
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center gap-2 rounded-full p-1 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                                        {auth.user.profile_picture ? (
                                            <img
                                                src={`/storage/${auth.user.profile_picture}`}
                                                alt={auth.user.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-sm font-semibold">
                                                {auth.user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </motion.button>

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
                                                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                                                        {auth.user
                                                            .profile_picture ? (
                                                            <img
                                                                src={`/storage/${auth.user.profile_picture}`}
                                                                alt={
                                                                    auth.user
                                                                        .name
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="font-semibold">
                                                                {auth.user.name
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </span>
                                                        )}
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

                                                {/* Admin Link - Only visible to admins */}
                                                {!!auth.user.is_admin && (
                                                    <>
                                                        <Link
                                                            href="/admin/cotd"
                                                            className="flex items-center gap-2 rounded-md bg-amber-500 px-3 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-amber-600 hover:shadow-md"
                                                            onClick={() =>
                                                                setUserMenuOpen(
                                                                    false,
                                                                )
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
                                                                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                            </svg>
                                                            Admin Panel
                                                        </Link>
                                                        <div className="border-t border-zinc-200 dark:border-zinc-800" />
                                                    </>
                                                )}

                                                <button
                                                    onClick={toggleTheme}
                                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                >
                                                    {isDark ? (
                                                        <>
                                                            <Sun className="h-4 w-4" />
                                                            Light Mode
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Moon className="h-4 w-4" />
                                                            Dark Mode
                                                        </>
                                                    )}
                                                </button>

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
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Link
                                        href="/login"
                                        className="rounded-full px-5 py-2 text-sm font-medium text-zinc-900 transition-all duration-300 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                                    >
                                        Log in
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Link
                                        href="/register"
                                        className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                    >
                                        Sign up
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </motion.div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="rounded-lg p-2 text-zinc-900 hover:bg-zinc-100 md:hidden dark:text-zinc-100 dark:hover:bg-zinc-800"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {mobileMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </motion.button>
                </nav>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden md:hidden"
                    >
                        <div className="space-y-1 px-4 pt-2 pb-4">
                            {[
                                { href: '/', label: 'Lobby' },
                                { href: '/observatory', label: 'Observatory' },
                                { href: '/works', label: 'Works' },
                            ].map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="block rounded-lg px-4 py-3 text-base font-medium text-zinc-900 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}

                            {auth.user ? (
                                <div className="space-y-1 border-t pt-4 dark:border-zinc-800">
                                    <div className="px-4 py-2">
                                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                            {auth.user.name}
                                        </p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                            {auth.user.email}
                                        </p>
                                    </div>

                                    {/* Admin Link - Only visible to admins */}
                                    {!!auth.user.is_admin && (
                                        <Link
                                            href="/admin/cotd"
                                            className="mb-1 flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-base font-medium text-white shadow-sm hover:from-amber-600 hover:to-orange-600"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            Admin Panel
                                        </Link>
                                    )}

                                    <Link
                                        href="/settings/profile"
                                        className="block rounded-lg px-4 py-3 text-base font-medium text-zinc-900 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Settings
                                    </Link>

                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="block w-full rounded-lg px-4 py-3 text-left text-base font-medium text-red-600 hover:bg-zinc-100 dark:text-red-400 dark:hover:bg-zinc-800"
                                    >
                                        Log out
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2 border-t pt-4 dark:border-zinc-800">
                                    <Link
                                        href="/login"
                                        className="block rounded-lg px-4 py-3 text-center text-base font-medium text-zinc-900 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block rounded-lg bg-zinc-900 px-4 py-3 text-center text-base font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default function TermsOfService() {
    return (
        <>
            <Head title="Terms of Service - Codefolio" />
            <Navbar />

            <div className="min-h-screen bg-white dark:bg-zinc-950">
                {/* Header */}
                <div className="border-b bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/50">
                                <Scale className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
                                    Terms of Service
                                </h1>
                                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                                    Last updated: January 16, 2026
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="prose prose-zinc dark:prose-invert max-w-none">
                        {/* Introduction */}
                        <section className="mb-12">
                            <p className="text-lg text-zinc-700 dark:text-zinc-300">
                                Welcome to Codefolio. These Terms of Service
                                (&quot;Terms&quot;) govern your access to and
                                use of our portfolio management platform. By
                                creating an account or using our services, you
                                agree to be bound by these Terms. Please read
                                them carefully.
                            </p>
                        </section>

                        {/* Acceptance of Terms */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Acceptance of Terms
                                </h2>
                            </div>

                            <p className="text-zinc-700 dark:text-zinc-300">
                                By accessing or using Codefolio, you acknowledge
                                that you have read, understood, and agree to be
                                bound by these Terms and our Privacy Policy. If
                                you do not agree to these Terms, you may not use
                                our services.
                            </p>

                            <div className="mt-4 space-y-3">
                                <p className="text-zinc-700 dark:text-zinc-300">
                                    You must be at least 13 years old to use
                                    Codefolio. By using our platform, you
                                    represent and warrant that you meet this age
                                    requirement.
                                </p>
                            </div>
                        </section>

                        {/* Account Responsibilities */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <UserCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Account Responsibilities
                                </h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Account Creation and Security
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        When you create an account, you agree
                                        to:
                                    </p>
                                    <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                                        <li>
                                            Provide accurate, current, and
                                            complete information
                                        </li>
                                        <li>
                                            Maintain and promptly update your
                                            account information
                                        </li>
                                        <li>
                                            Keep your password confidential and
                                            secure
                                        </li>
                                        <li>
                                            Notify us immediately of any
                                            unauthorized access
                                        </li>
                                        <li>
                                            Accept responsibility for all
                                            activities under your account
                                        </li>
                                        <li>
                                            Not share your account credentials
                                            with others
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Account Restrictions
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        You may not:
                                    </p>
                                    <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                                        <li>
                                            Create multiple accounts for the
                                            same person
                                        </li>
                                        <li>
                                            Use another person&apos;s account
                                            without permission
                                        </li>
                                        <li>
                                            Create accounts through automated
                                            means or false pretenses
                                        </li>
                                        <li>
                                            Sell, transfer, or sublicense your
                                            account
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Portfolio Submission Guidelines */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Portfolio Submission Guidelines
                                </h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Content Standards
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        All portfolio content must:
                                    </p>
                                    <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                                        <li>
                                            Be your original work or work you
                                            have rights to display
                                        </li>
                                        <li>
                                            Accurately represent the projects
                                            and your involvement
                                        </li>
                                        <li>
                                            Include proper attribution for
                                            collaborative projects
                                        </li>
                                        <li>
                                            Be professional and appropriate for
                                            a public platform
                                        </li>
                                        <li>
                                            Not contain malicious code or links
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Quality Requirements
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        To maintain platform quality, portfolios
                                        should:
                                    </p>
                                    <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                                        <li>
                                            Include clear, high-quality
                                            screenshots
                                        </li>
                                        <li>
                                            Provide meaningful project
                                            descriptions
                                        </li>
                                        <li>
                                            Use relevant tags and categories
                                        </li>
                                        <li>
                                            Link to live demos or repositories
                                            when possible
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Acceptable Use Policy */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <AlertTriangle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Acceptable Use Policy
                                </h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Prohibited Activities
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        You agree not to:
                                    </p>
                                    <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                                        <li>Violate any laws or regulations</li>
                                        <li>
                                            Infringe on intellectual property
                                            rights
                                        </li>
                                        <li>
                                            Post harmful, offensive, or
                                            inappropriate content
                                        </li>
                                        <li>
                                            Harass, threaten, or harm other
                                            users
                                        </li>
                                        <li>
                                            Spam or send unsolicited messages
                                        </li>
                                        <li>
                                            Attempt to gain unauthorized access
                                            to our systems
                                        </li>
                                        <li>
                                            Use automated tools to scrape or
                                            collect data
                                        </li>
                                        <li>
                                            Interfere with platform operation or
                                            security
                                        </li>
                                        <li>
                                            Impersonate others or misrepresent
                                            your identity
                                        </li>
                                        <li>
                                            Upload viruses, malware, or harmful
                                            code
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Content Moderation
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        We reserve the right to review, modify,
                                        or remove any content that violates
                                        these Terms or our community standards,
                                        with or without notice.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Intellectual Property Rights */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <Gavel className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Intellectual Property Rights
                                </h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Your Content
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        You retain all ownership rights to the
                                        content you submit to Codefolio. By
                                        publishing your portfolio, you grant us
                                        a non-exclusive, worldwide, royalty-free
                                        license to:
                                    </p>
                                    <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                                        <li>
                                            Display your portfolio on our
                                            platform
                                        </li>
                                        <li>
                                            Feature your work in the Observatory
                                            and Works sections
                                        </li>
                                        <li>
                                            Include your portfolio in search
                                            results and recommendations
                                        </li>
                                        <li>
                                            Showcase featured portfolios as Card
                                            of the Day (COTD)
                                        </li>
                                        <li>
                                            Use your content for platform
                                            promotion and marketing
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Platform Content
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        Codefolio and its original content,
                                        features, and functionality are owned by
                                        us and protected by intellectual
                                        property laws. You may not copy, modify,
                                        distribute, or create derivative works
                                        based on our platform without
                                        permission.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Trademark Usage
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        The Codefolio name, logo, and branding
                                        are our trademarks. You may not use our
                                        trademarks without written permission.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Limitation of Liability */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <XCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Limitation of Liability
                                </h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Service Disclaimer
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        Codefolio is provided &quot;as is&quot;
                                        and &quot;as available&quot; without
                                        warranties of any kind, either express
                                        or implied. We do not guarantee that:
                                    </p>
                                    <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                                        <li>
                                            The service will be uninterrupted or
                                            error-free
                                        </li>
                                        <li>
                                            All bugs or defects will be
                                            corrected
                                        </li>
                                        <li>
                                            The service is free from viruses or
                                            harmful components
                                        </li>
                                        <li>
                                            The results obtained from using the
                                            service will be accurate or reliable
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Limitation of Damages
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        To the maximum extent permitted by law,
                                        Codefolio and its affiliates shall not
                                        be liable for any indirect, incidental,
                                        special, consequential, or punitive
                                        damages, including but not limited to:
                                    </p>
                                    <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                                        <li>Loss of profits or revenue</li>
                                        <li>Loss of data or content</li>
                                        <li>Loss of business opportunities</li>
                                        <li>
                                            Damage to reputation or goodwill
                                        </li>
                                        <li>
                                            Cost of procuring substitute
                                            services
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Third-Party Content
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        We are not responsible for the accuracy,
                                        completeness, or reliability of any
                                        third-party content displayed on our
                                        platform, including user-submitted
                                        portfolios and external links.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Account Termination */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <XCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Account Termination
                                </h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Your Right to Terminate
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        You may close your account at any time
                                        by accessing your account settings or
                                        contacting us. Upon account closure:
                                    </p>
                                    <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                                        <li>
                                            Your portfolio will be unpublished
                                            and removed from public view
                                        </li>
                                        <li>
                                            Your account data will be handled
                                            according to our Privacy Policy
                                        </li>
                                        <li>
                                            You will lose access to all account
                                            features
                                        </li>
                                        <li>
                                            Backup copies may remain in our
                                            systems for a limited time
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Our Right to Terminate
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        We reserve the right to suspend or
                                        terminate your account at our
                                        discretion, with or without notice, if:
                                    </p>
                                    <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                                        <li>You violate these Terms</li>
                                        <li>
                                            You engage in prohibited activities
                                        </li>
                                        <li>
                                            Your account is used for fraudulent
                                            or illegal purposes
                                        </li>
                                        <li>
                                            You repeatedly upload inappropriate
                                            content
                                        </li>
                                        <li>
                                            Your actions harm other users or the
                                            platform
                                        </li>
                                        <li>
                                            You fail to respond to our
                                            communications
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Effect of Termination
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        Upon termination, all rights granted to
                                        you under these Terms will immediately
                                        cease. Provisions that by their nature
                                        should survive termination (including
                                        intellectual property rights,
                                        disclaimers, and limitations of
                                        liability) will remain in effect.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Dispute Resolution */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <Scale className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Dispute Resolution
                                </h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Informal Resolution
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        If you have a dispute with Codefolio, we
                                        encourage you to contact us first to
                                        seek an informal resolution. We commit
                                        to working with you in good faith to
                                        resolve any issues.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Governing Law
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        These Terms shall be governed by and
                                        construed in accordance with applicable
                                        laws, without regard to conflict of law
                                        principles. Any legal action or
                                        proceeding arising under these Terms
                                        will be brought exclusively in the
                                        appropriate courts.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Arbitration Agreement
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        For disputes that cannot be resolved
                                        informally, you agree to resolve any
                                        claims through binding arbitration in
                                        accordance with established arbitration
                                        rules, except where prohibited by law.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Class Action Waiver
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        You agree to bring claims against us
                                        only in your individual capacity and not
                                        as part of any class or representative
                                        action. Class arbitrations and class
                                        actions are not permitted.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Changes to Terms */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Changes to These Terms
                                </h2>
                            </div>

                            <p className="text-zinc-700 dark:text-zinc-300">
                                We reserve the right to modify these Terms at
                                any time. We will notify you of material changes
                                by:
                            </p>
                            <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                                <li>
                                    Updating the &quot;Last updated&quot; date
                                    at the top of this page
                                </li>
                                <li>
                                    Sending an email notification to your
                                    registered email address
                                </li>
                                <li>
                                    Displaying a prominent notice on our
                                    platform
                                </li>
                            </ul>

                            <p className="mt-4 text-zinc-700 dark:text-zinc-300">
                                Your continued use of Codefolio after changes
                                become effective constitutes your acceptance of
                                the revised Terms. If you do not agree to the
                                new Terms, you must stop using our services.
                            </p>
                        </section>

                        {/* General Provisions */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <Gavel className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    General Provisions
                                </h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Entire Agreement
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        These Terms, together with our Privacy
                                        Policy, constitute the entire agreement
                                        between you and Codefolio regarding your
                                        use of our services.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Severability
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        If any provision of these Terms is found
                                        to be invalid or unenforceable, the
                                        remaining provisions will remain in full
                                        force and effect.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Waiver
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        Our failure to enforce any right or
                                        provision of these Terms will not be
                                        deemed a waiver of such right or
                                        provision.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Assignment
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        You may not assign or transfer these
                                        Terms or your account without our prior
                                        written consent. We may assign these
                                        Terms without restriction.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Contact Information */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Contact Us
                                </h2>
                            </div>

                            <p className="text-zinc-700 dark:text-zinc-300">
                                If you have any questions about these Terms of
                                Service, please contact us:
                            </p>

                            <div className="mt-6 space-y-4 rounded-lg bg-zinc-50 p-6 dark:bg-zinc-900">
                                <div className="flex items-start gap-3">
                                    <Shield className="mt-1 h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    <div>
                                        <p className="font-medium text-zinc-900 dark:text-white">
                                            Codefolio Support
                                        </p>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                            Our team is here to help with any
                                            questions or concerns
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Back to Home Button */}
                        <div className="mt-12 flex justify-center">
                            <Link
                                href="/"
                                className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footerdemo />
        </>
    );
}
