import { DeletePortfolioDialog } from '@/components/admin/delete-portfolio-dialog';
import { Button } from '@/components/ui/button';
import { Footerdemo } from '@/components/ui/footer-section';
import { Input } from '@/components/ui/input';
import { useAppearance } from '@/hooks/use-appearance';
import { login, logout, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Calendar,
    ExternalLink,
    Moon,
    Search,
    Star,
    StarOff,
    Sun,
    Trash2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

interface Portfolio {
    id: number;
    name: string;
    email: string;
    profile_picture: string | null;
    portfolio_desktop_image: string;
    portfolio_mobile_image: string | null;
    website_url: string | null;
    portfolio_description: string | null;
    is_featured: boolean;
    featured_at: string | null;
    skills: string[];
    techStack: string[];
    professions: string[];
}

interface AdminCotdProps {
    portfolios: Portfolio[];
    search: string;
    filter: string;
}

function Navbar({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { appearance, updateAppearance } = useAppearance();

    const handleLogout = () => {
        router.post(logout.url());
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
                            transition={{ duration: 0.3, delay: index * 0.1 }}
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
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
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
                                        onClick={() => setUserMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                                        <div className="space-y-1 p-2">
                                            {/* User Info Header */}
                                            <div className="flex items-center gap-3 px-2 py-3">
                                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-zinc-200 bg-zinc-900 text-white dark:border-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">
                                                    {auth.user
                                                        .profile_picture ? (
                                                        <img
                                                            src={`/storage/${auth.user.profile_picture}`}
                                                            alt={auth.user.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-base font-semibold">
                                                            {auth.user.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-1 flex-col overflow-hidden">
                                                    <span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                        {auth.user.name}
                                                    </span>
                                                    <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
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
                                                        className="flex items-center gap-2 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-amber-600 hover:to-orange-600 hover:shadow-md"
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
                            <Link
                                href={login.url()}
                                className="rounded-full px-5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                            >
                                Log in
                            </Link>
                            {canRegister && (
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Link
                                        href={register.url()}
                                        className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                    >
                                        Sign up
                                    </Link>
                                </motion.div>
                            )}
                        </>
                    )}
                </motion.div>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center gap-2 md:hidden">
                    <motion.button
                        className="rounded-md p-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        whileTap={{ scale: 0.9 }}
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

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-white px-6 pt-24 md:hidden dark:bg-zinc-950"
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
                                <div className="mb-4 flex items-center gap-3 rounded-lg bg-zinc-50 px-4 py-3 dark:bg-zinc-900">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                                        {auth.user.profile_picture ? (
                                            <img
                                                src={`/storage/${auth.user.profile_picture}`}
                                                alt={auth.user.name}
                                                className="h-full w-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="font-semibold">
                                                {auth.user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                            {auth.user.name}
                                        </p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                            {auth.user.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Mobile Menu Items */}
                                <div className="space-y-1">
                                    {!!auth.user.is_admin && (
                                        <Link
                                            href="/admin/cotd"
                                            className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:from-amber-600 hover:to-orange-600"
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

                                    <button
                                        onClick={toggleTheme}
                                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                    >
                                        {isDark ? (
                                            <>
                                                <Sun className="h-5 w-5" />
                                                Light Mode
                                            </>
                                        ) : (
                                            <>
                                                <Moon className="h-5 w-5" />
                                                Dark Mode
                                            </>
                                        )}
                                    </button>

                                    <Link
                                        href="/settings/profile"
                                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                        onClick={() => setMobileMenuOpen(false)}
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
                                            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Settings
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
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
                                            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Log out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-8 space-y-2 border-t border-zinc-200 pt-8 dark:border-zinc-700">
                                <Link
                                    href={login.url()}
                                    className="block rounded-lg px-4 py-3 text-center text-base font-medium text-zinc-900 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register.url()}
                                        className="block rounded-lg bg-zinc-900 px-4 py-3 text-center text-base font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                    >
                                        Sign up
                                    </Link>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function AdminCotd({
    portfolios,
    search: initialSearch,
    filter: initialFilter,
}: AdminCotdProps) {
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [processing, setProcessing] = useState<number | null>(null);
    const [activeFilter, setActiveFilter] = useState(initialFilter);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [portfolioToDelete, setPortfolioToDelete] =
        useState<Portfolio | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/cotd', {
            search: searchQuery,
            filter: activeFilter,
        });
    };

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        router.get('/admin/cotd', { search: searchQuery, filter });
    };

    const toggleFeatured = (portfolio: Portfolio) => {
        if (processing) return;

        setProcessing(portfolio.id);
        router.post(
            `/admin/cotd/${portfolio.id}/toggle`,
            {
                is_featured: !portfolio.is_featured,
            },
            {
                onFinish: () => setProcessing(null),
            },
        );
    };

    const handleDeleteClick = (portfolio: Portfolio) => {
        setPortfolioToDelete(portfolio);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!portfolioToDelete) return;

        setIsDeleting(true);
        router.delete(`/admin/cotd/${portfolioToDelete.id}`, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setPortfolioToDelete(null);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const featuredCount = portfolios.filter((p) => p.is_featured).length;

    return (
        <>
            <Head title="COTD Management - Admin" />
            <div className="min-h-screen bg-zinc-50 dark:bg-black">
                <Navbar />

                {/* Main Content */}
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                                Card of the Day Management
                            </h1>
                            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                Select portfolios to feature on the Works page.{' '}
                                <span className="font-semibold">
                                    {featuredCount} portfolio
                                    {featuredCount !== 1 ? 's' : ''} currently
                                    featured
                                </span>
                            </p>
                        </div>
                        <Link
                            href="/admin/contacts"
                            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
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
                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Contact Messages
                        </Link>
                    </div>

                    {/* Filter Tabs */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            {[
                                {
                                    value: 'all',
                                    label: 'All Portfolios',
                                    icon: '📚',
                                },
                                {
                                    value: 'featured',
                                    label: 'Currently Featured',
                                    icon: '⭐',
                                },
                                {
                                    value: 'not_featured',
                                    label: 'Never Featured',
                                    icon: '🆕',
                                },
                                {
                                    value: 'recent',
                                    label: 'Recently Featured',
                                    icon: '🕐',
                                },
                            ].map((tab) => (
                                <button
                                    key={tab.value}
                                    onClick={() =>
                                        handleFilterChange(tab.value)
                                    }
                                    className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                                        activeFilter === tab.value
                                            ? 'bg-zinc-900 text-white shadow-md dark:bg-zinc-100 dark:text-zinc-900'
                                            : 'bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                                    } border ${
                                        activeFilter === tab.value
                                            ? 'border-zinc-900 dark:border-zinc-100'
                                            : 'border-zinc-200 dark:border-zinc-700'
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Filter Info */}
                        <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                            {activeFilter === 'all' && (
                                <p>Showing all published portfolios</p>
                            )}
                            {activeFilter === 'featured' && (
                                <p>
                                    Showing portfolios currently active as Card
                                    of the Day
                                </p>
                            )}
                            {activeFilter === 'not_featured' && (
                                <p>
                                    Showing portfolios that have never been
                                    featured before
                                </p>
                            )}
                            {activeFilter === 'recent' && (
                                <p>
                                    Showing portfolios featured within the last
                                    30 days
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            <Input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </form>

                    {/* Portfolio Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {portfolios.map((portfolio) => (
                            <div
                                key={portfolio.id}
                                className={`group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md dark:bg-zinc-900 ${
                                    portfolio.is_featured
                                        ? 'border-amber-400 ring-2 ring-amber-400/20 dark:border-amber-500 dark:ring-amber-500/20'
                                        : 'border-zinc-200 dark:border-zinc-800'
                                }`}
                            >
                                {/* Featured Badge */}
                                {portfolio.is_featured && (
                                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 shadow-lg">
                                        <Star className="h-3.5 w-3.5 fill-white text-white" />
                                        <span className="text-xs font-bold text-white">
                                            FEATURED
                                        </span>
                                    </div>
                                )}

                                {/* Portfolio Image */}
                                <div className="relative h-40 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                    {portfolio.portfolio_desktop_image && (
                                        <img
                                            src={`/storage/${portfolio.portfolio_desktop_image}`}
                                            alt={`${portfolio.name}'s portfolio`}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    )}
                                </div>

                                {/* Portfolio Info */}
                                <div className="p-4">
                                    <div className="mb-3 flex items-center gap-3">
                                        {portfolio.profile_picture ? (
                                            <img
                                                src={`/storage/${portfolio.profile_picture}`}
                                                alt={portfolio.name}
                                                className="h-10 w-10 rounded-full ring-2 ring-zinc-200 dark:ring-zinc-700"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-600 ring-2 ring-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:ring-zinc-600">
                                                {portfolio.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                                                {portfolio.name}
                                            </h3>
                                            <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                                {portfolio.professions[0] ||
                                                    'Developer'}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mb-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                                        {portfolio.portfolio_description ||
                                            'No description provided'}
                                    </p>

                                    {/* Tech Stack */}
                                    {portfolio.techStack.length > 0 && (
                                        <div className="mb-3 flex flex-wrap gap-1.5">
                                            {portfolio.techStack
                                                .slice(0, 3)
                                                .map((tech) => (
                                                    <span
                                                        key={tech}
                                                        className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            {portfolio.techStack.length > 3 && (
                                                <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                    +
                                                    {portfolio.techStack
                                                        .length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Featured Date */}
                                    {portfolio.is_featured &&
                                        portfolio.featured_at && (
                                            <div className="mb-3 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>
                                                    Featured:{' '}
                                                    {new Date(
                                                        portfolio.featured_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() =>
                                                toggleFeatured(portfolio)
                                            }
                                            disabled={
                                                processing === portfolio.id
                                            }
                                            variant={
                                                portfolio.is_featured
                                                    ? 'outline'
                                                    : 'default'
                                            }
                                            size="sm"
                                            className="flex-1"
                                        >
                                            {processing === portfolio.id ? (
                                                'Processing...'
                                            ) : portfolio.is_featured ? (
                                                <>
                                                    <StarOff className="mr-1.5 h-4 w-4" />
                                                    Unfeature
                                                </>
                                            ) : (
                                                <>
                                                    <Star className="mr-1.5 h-4 w-4" />
                                                    Feature
                                                </>
                                            )}
                                        </Button>
                                        <Link
                                            href={`/portfolio/${portfolio.id}`}
                                        >
                                            <Button variant="outline" size="sm">
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleDeleteClick(portfolio)
                                            }
                                            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {portfolios.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="mb-4 text-zinc-400 dark:text-zinc-600">
                                <svg
                                    className="h-16 w-16"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                No Portfolios Found
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                {searchQuery
                                    ? 'Try adjusting your search query'
                                    : 'No published portfolios available yet'}
                            </p>
                        </div>
                    )}

                    {/* Delete Confirmation Dialog */}
                    <DeletePortfolioDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                        onConfirm={handleDeleteConfirm}
                        portfolioName={portfolioToDelete?.name || ''}
                        isDeleting={isDeleting}
                    />
                </div>

                <Footerdemo />
            </div>
        </>
    );
}
