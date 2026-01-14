import { Footerdemo } from '@/components/ui/footer-section';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Cookie,
    Database,
    Eye,
    FileText,
    Lock,
    Mail,
    Shield,
    Users,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

function Navbar() {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = () => {
        router.post('/logout');
    };

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
                                    href="/login"
                                    className="rounded-full px-5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                >
                                    Log in
                                </Link>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                    >
                                        Sign up
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </motion.div>

                    {/* Mobile Search & Menu Buttons */}
                    <div className="flex items-center gap-2 md:hidden">
                        {/* Mobile Menu Button */}
                        <motion.button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            whileTap={{ scale: 0.9 }}
                            className="inline-flex items-center justify-center rounded-md p-2 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:ring-2 focus:ring-zinc-500 focus:outline-none focus:ring-inset dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
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
                        </motion.button>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-[9999] bg-white px-6 pt-20 md:hidden dark:bg-zinc-950"
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 300,
                        }}
                    >
                        <motion.button
                            className="absolute top-6 right-6 rounded-md p-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            onClick={() => setMobileMenuOpen(false)}
                            whileTap={{ scale: 0.9 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
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
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.button>

                        <div className="space-y-2">
                            {/* Mobile Navigation Links */}
                            {[
                                { href: '/', label: 'Lobby' },
                                { href: '/observatory', label: 'Observatory' },
                                { href: '/works', label: 'Works' },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: index * 0.1,
                                    }}
                                >
                                    <Link
                                        href={item.href}
                                        className="block rounded-lg px-4 py-3 text-base font-medium text-zinc-900 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {auth.user ? (
                            <div className="mt-8 border-t border-zinc-200 pt-8 dark:border-zinc-700">
                                {/* User Info in Mobile Menu */}
                                <div className="mb-4 flex items-center gap-3 rounded-lg bg-zinc-50 px-4 py-3 dark:bg-zinc-950">
                                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                                        {auth.user.profile_picture ? (
                                            <img
                                                src={`/storage/${auth.user.profile_picture}`}
                                                alt={auth.user.name}
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

                                {/* Admin Link - Only visible to admins */}
                                {!!auth.user.is_admin && (
                                    <Link
                                        href="/admin/cotd"
                                        className="mb-2 block rounded-lg bg-amber-500 px-4 py-3 text-center text-base font-semibold text-white shadow-sm hover:bg-amber-600"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        🛡️ Admin Panel
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
                                    onClick={handleLogout}
                                    className="mt-2 w-full rounded-lg px-4 py-3 text-left text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="mt-8 space-y-2 border-t border-zinc-200 pt-8 dark:border-zinc-700">
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
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default function PrivacyPolicy() {
    return (
        <>
            <Head title="Privacy Policy - Codefolio" />
            <Navbar />

            <div className="min-h-screen bg-white dark:bg-zinc-950">
                {/* Header */}
                <div className="border-b bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/50">
                                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
                                    Privacy Policy
                                </h1>
                                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                                    Last updated: January 14, 2026
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
                                Welcome to Codefolio. We are committed to
                                protecting your privacy and ensuring the
                                security of your personal information. This
                                Privacy Policy explains how we collect, use,
                                disclose, and safeguard your information when
                                you use our portfolio management platform.
                            </p>
                        </section>

                        {/* Information We Collect */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Information We Collect
                                </h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Account Information
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        When you create an account, we collect:
                                    </p>
                                    <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                                        <li>Name and email address</li>
                                        <li>Profile picture (optional)</li>
                                        <li>
                                            Username and password (encrypted)
                                        </li>
                                        <li>
                                            Professional information (job title,
                                            bio, location)
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Portfolio Content
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        When you create and manage your
                                        portfolio, we collect:
                                    </p>
                                    <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                                        <li>
                                            Project descriptions and details
                                        </li>
                                        <li>
                                            Desktop and mobile screenshots you
                                            upload
                                        </li>
                                        <li>
                                            Skills and technology stack
                                            selections
                                        </li>
                                        <li>Project links and repositories</li>
                                        <li>
                                            Tags and categories for your work
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Usage Information
                                    </h3>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        We automatically collect certain
                                        information when you use our platform:
                                    </p>
                                    <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                                        <li>Browser type and version</li>
                                        <li>
                                            Device information and operating
                                            system
                                        </li>
                                        <li>
                                            IP address and general location data
                                        </li>
                                        <li>
                                            Pages visited and time spent on
                                            pages
                                        </li>
                                        <li>
                                            Search queries within the
                                            Observatory
                                        </li>
                                        <li>
                                            Interaction with featured portfolios
                                            (COTD)
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* How We Use Your Information */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    How We Use Your Information
                                </h2>
                            </div>

                            <p className="text-zinc-700 dark:text-zinc-300">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                                <li>Create and manage your account</li>
                                <li>Display your portfolio to other users</li>
                                <li>
                                    Enable portfolio discovery through the
                                    Observatory feature
                                </li>
                                <li>
                                    Feature outstanding portfolios as "Card of
                                    the Day" (COTD)
                                </li>
                                <li>
                                    Provide search and filtering functionality
                                </li>
                                <li>
                                    Send important account notifications and
                                    updates
                                </li>
                                <li>
                                    Improve our platform and develop new
                                    features
                                </li>
                                <li>
                                    Analyze usage patterns and optimize user
                                    experience
                                </li>
                                <li>
                                    Prevent fraud and ensure platform security
                                </li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        {/* Data Storage and Security */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Data Storage and Security
                                </h2>
                            </div>

                            <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
                                <p>
                                    We implement industry-standard security
                                    measures to protect your information:
                                </p>
                                <ul className="list-disc space-y-2 pl-6">
                                    <li>
                                        All passwords are encrypted using bcrypt
                                        hashing
                                    </li>
                                    <li>
                                        Uploaded images are stored securely on
                                        our servers
                                    </li>
                                    <li>Database connections are encrypted</li>
                                    <li>Regular security audits and updates</li>
                                    <li>
                                        Access controls and authentication
                                        measures
                                    </li>
                                    <li>
                                        HTTPS encryption for all data
                                        transmission
                                    </li>
                                </ul>
                                <p>
                                    Your uploaded content (screenshots, images)
                                    is stored in our secure file storage system.
                                    We maintain regular backups to prevent data
                                    loss.
                                </p>
                            </div>
                        </section>

                        {/* Information Sharing */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Information Sharing and Visibility
                                </h2>
                            </div>

                            <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Public Information
                                    </h3>
                                    <p>
                                        The following information is publicly
                                        visible to all users:
                                    </p>
                                    <ul className="list-disc space-y-2 pl-6">
                                        <li>Your name and profile picture</li>
                                        <li>
                                            Professional information (bio, job
                                            title, location)
                                        </li>
                                        <li>
                                            Portfolio projects and their details
                                        </li>
                                        <li>Skills and technology stack</li>
                                        <li>Projects featured as COTD</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Private Information
                                    </h3>
                                    <p>
                                        The following information remains
                                        private:
                                    </p>
                                    <ul className="list-disc space-y-2 pl-6">
                                        <li>Email address</li>
                                        <li>Password</li>
                                        <li>
                                            Account settings and preferences
                                        </li>
                                        <li>Admin status</li>
                                    </ul>
                                </div>

                                <p>
                                    We do not sell, rent, or trade your personal
                                    information to third parties for marketing
                                    purposes.
                                </p>
                            </div>
                        </section>

                        {/* COTD Feature */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Card of the Day (COTD) Feature
                                </h2>
                            </div>

                            <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
                                <p>
                                    Our COTD feature highlights exceptional
                                    portfolios on the platform:
                                </p>
                                <ul className="list-disc space-y-2 pl-6">
                                    <li>
                                        Portfolio selection is at the discretion
                                        of our administrators
                                    </li>
                                    <li>
                                        Featured portfolios receive enhanced
                                        visibility across the platform
                                    </li>
                                    <li>
                                        COTD status is indicated by special
                                        badges and displays
                                    </li>
                                    <li>
                                        We track and display the date when
                                        portfolios were featured
                                    </li>
                                    <li>
                                        Featured status may be granted or
                                        revoked at any time
                                    </li>
                                </ul>
                                <p>
                                    Being featured as COTD increases your
                                    portfolio's visibility but does not change
                                    your privacy settings or share additional
                                    private information.
                                </p>
                            </div>
                        </section>

                        {/* Cookies and Tracking */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <Cookie className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Cookies and Tracking Technologies
                                </h2>
                            </div>

                            <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
                                <p>
                                    We use cookies and similar tracking
                                    technologies to:
                                </p>
                                <ul className="list-disc space-y-2 pl-6">
                                    <li>Maintain your login session</li>
                                    <li>Remember your preferences</li>
                                    <li>
                                        Analyze platform usage and performance
                                    </li>
                                    <li>Improve user experience</li>
                                </ul>
                                <p>
                                    You can control cookie settings through your
                                    browser preferences. Note that disabling
                                    cookies may limit certain platform features.
                                </p>
                            </div>
                        </section>

                        {/* Your Rights */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Your Rights and Choices
                                </h2>
                            </div>

                            <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
                                <p>You have the right to:</p>
                                <ul className="list-disc space-y-2 pl-6">
                                    <li>
                                        <strong>Access:</strong> Request a copy
                                        of your personal data
                                    </li>
                                    <li>
                                        <strong>Correction:</strong> Update or
                                        correct your information through your
                                        account settings
                                    </li>
                                    <li>
                                        <strong>Deletion:</strong> Request
                                        deletion of your account and associated
                                        data
                                    </li>
                                    <li>
                                        <strong>Portability:</strong> Request
                                        your data in a portable format
                                    </li>
                                    <li>
                                        <strong>Opt-out:</strong> Unsubscribe
                                        from marketing communications
                                    </li>
                                    <li>
                                        <strong>Privacy Settings:</strong>{' '}
                                        Control what information is displayed in
                                        your portfolio
                                    </li>
                                </ul>
                                <p>
                                    To exercise these rights, please contact us
                                    through the information provided below or
                                    through your account settings.
                                </p>
                            </div>
                        </section>

                        {/* Data Retention */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Data Retention
                                </h2>
                            </div>

                            <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
                                <p>
                                    We retain your information for as long as
                                    your account is active or as needed to
                                    provide you services. If you request account
                                    deletion:
                                </p>
                                <ul className="list-disc space-y-2 pl-6">
                                    <li>
                                        Your account data will be permanently
                                        deleted within 30 days
                                    </li>
                                    <li>
                                        Your portfolio content and uploaded
                                        images will be removed
                                    </li>
                                    <li>
                                        Some information may be retained for
                                        legal compliance or security purposes
                                    </li>
                                    <li>
                                        Anonymized usage data may be retained
                                        for analytics
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Children's Privacy */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Children's Privacy
                                </h2>
                            </div>

                            <p className="text-zinc-700 dark:text-zinc-300">
                                Our platform is not intended for users under the
                                age of 13. We do not knowingly collect personal
                                information from children under 13. If you
                                believe we have collected information from a
                                child under 13, please contact us immediately,
                                and we will take steps to delete such
                                information.
                            </p>
                        </section>

                        {/* Changes to Privacy Policy */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Changes to This Privacy Policy
                                </h2>
                            </div>

                            <p className="text-zinc-700 dark:text-zinc-300">
                                We may update this Privacy Policy from time to
                                time. We will notify you of any changes by:
                            </p>
                            <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
                                <li>
                                    Updating the "Last updated" date at the top
                                    of this policy
                                </li>
                                <li>
                                    Sending you an email notification for
                                    significant changes
                                </li>
                                <li>
                                    Displaying a prominent notice on our
                                    platform
                                </li>
                            </ul>
                            <p className="text-zinc-700 dark:text-zinc-300">
                                Your continued use of the platform after changes
                                become effective constitutes acceptance of the
                                updated Privacy Policy.
                            </p>
                        </section>

                        {/* Contact Information */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Contact Us
                                </h2>
                            </div>

                            <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
                                <p>
                                    If you have any questions, concerns, or
                                    requests regarding this Privacy Policy or
                                    our data practices, please contact us:
                                </p>
                                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
                                    <p className="mb-2">
                                        <strong>Email:</strong>{' '}
                                        privacy@codefolio.com
                                    </p>
                                    <p className="mb-2">
                                        <strong>Support:</strong>{' '}
                                        support@codefolio.com
                                    </p>
                                    <p>
                                        <strong>Response Time:</strong> We aim
                                        to respond to all inquiries within 48
                                        hours
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Additional Information */}
                        <section className="mb-12">
                            <div className="mb-4 flex items-center gap-3">
                                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                <h2 className="m-0 text-2xl font-bold text-zinc-900 dark:text-white">
                                    Additional Information
                                </h2>
                            </div>

                            <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        International Users
                                    </h3>
                                    <p>
                                        Your information may be transferred to
                                        and processed in countries other than
                                        your own. We ensure appropriate
                                        safeguards are in place to protect your
                                        data in accordance with this Privacy
                                        Policy.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Third-Party Links
                                    </h3>
                                    <p>
                                        Our platform may contain links to
                                        third-party websites or services. We are
                                        not responsible for the privacy
                                        practices of these external sites. We
                                        encourage you to review their privacy
                                        policies.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Account Security
                                    </h3>
                                    <p>
                                        You are responsible for maintaining the
                                        security of your account credentials.
                                        Please use a strong, unique password and
                                        never share your login information with
                                        others.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Closing Statement */}
                        <section className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/30 dark:bg-blue-900/10">
                            <p className="text-zinc-700 dark:text-zinc-300">
                                <strong>
                                    Thank you for trusting Codefolio with your
                                    portfolio.
                                </strong>{' '}
                                We are committed to protecting your privacy and
                                providing a secure platform for showcasing your
                                work. If you have any questions or concerns,
                                please don't hesitate to reach out to us.
                            </p>
                        </section>
                    </div>
                </div>

                <Footerdemo />
            </div>
        </>
    );
}
