import { Footerdemo } from '@/components/ui/footer-section';
import { login, logout, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowUpRight, Check, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

function Navbar({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const handleLogout = () => {
        router.post(logout.url());
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/observatory', { search: searchQuery });
            setSearchQuery('');
            setShowSearchResults(false);
        }
    };

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
                    {/* Search Icon/Bar */}
                    <div className="relative">
                        <motion.button
                            onClick={() => setSearchOpen(true)}
                            className="rounded-full p-2 text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
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
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </motion.button>

                        <AnimatePresence>
                            {searchOpen && (
                                <motion.form
                                    onSubmit={handleSearch}
                                    className="absolute top-0 right-0 z-50"
                                    initial={{ width: 40, opacity: 0 }}
                                    animate={{ width: 240, opacity: 1 }}
                                    exit={{ width: 40, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        onBlur={() => {
                                            setTimeout(() => {
                                                if (!searchQuery) {
                                                    setSearchOpen(false);
                                                }
                                                setShowSearchResults(false);
                                            }, 200);
                                        }}
                                        autoFocus
                                        placeholder="Search portfolios..."
                                        className="w-full rounded-full border border-zinc-200 bg-white py-1.5 pr-4 pl-4 text-sm text-zinc-900 placeholder-zinc-500 shadow-lg transition-all focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:border-zinc-700 dark:focus:ring-zinc-800"
                                    />
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    {auth.user ? (
                        <div className="relative">
                            <motion.button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-2 rounded-full p-1 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                                    {auth.user.avatar ||
                                    auth.user.profile_picture ? (
                                        <img
                                            src={`/storage/${auth.user.avatar || auth.user.profile_picture}`}
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
                                                    {auth.user.avatar ||
                                                    auth.user
                                                        .profile_picture ? (
                                                        <img
                                                            src={`/storage/${auth.user.avatar || auth.user.profile_picture}`}
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

                {/* Mobile Search & Menu Buttons */}
                <div className="flex items-center gap-2 md:hidden">
                    {/* Mobile Search Button */}
                    <motion.button
                        onClick={() => setSearchOpen(true)}
                        whileTap={{ scale: 0.9 }}
                        className="inline-flex items-center justify-center rounded-md p-2 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                        aria-label="Search"
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
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </motion.button>

                    {/* Mobile Menu Toggle */}
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

            {/* Mobile Search Overlay */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 px-4 pt-24 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery('');
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: -20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: -20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md"
                        >
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    autoFocus
                                    placeholder="Search portfolios..."
                                    className="w-full rounded-full border border-zinc-200 bg-white py-3 pr-12 pl-5 text-base text-zinc-900 placeholder-zinc-500 shadow-2xl transition-all focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-700"
                                />
                                <button
                                    type="submit"
                                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
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
                                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                                    href={login.url()}
                                    className="block rounded-lg px-4 py-3 text-center text-base font-medium text-zinc-900 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register.url()}
                                        className="block rounded-lg bg-zinc-900 px-4 py-3 text-center text-base font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                        onClick={() => setMobileMenuOpen(false)}
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

// Portfolio type definition
interface Portfolio {
    id: number;
    name: string;
    role: string;
    avatar: string;
    image: string;
    skills: string[];
    techStack: string[];
    description: string;
    profession: string[];
}

interface WorksPageProps {
    filterOptions?: {
        skills: string[];
        techStack: string[];
        profession: string[];
    };
    cotdPortfolios: Portfolio[];
}

// COTD Card Component
function COTDCard({
    portfolio,
    index,
}: {
    portfolio: Portfolio;
    index: number;
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative"
        >
            <Link href={`/portfolio/${portfolio.id}`} className="block">
                {/* Main Card Container */}
                <div className="relative overflow-hidden bg-background p-6 transition-all duration-700">
                    {/* Animated Border Frame */}
                    <div
                        className="absolute -inset-px transition-all duration-700"
                        style={{
                            background: isHovered
                                ? 'linear-gradient(90deg, hsl(var(--foreground) / 0.1), transparent)'
                                : 'transparent',
                        }}
                    />

                    {/* Content Container */}
                    <div className="relative space-y-4">
                        {/* Top Section: Label and Index */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-px bg-foreground transition-all duration-700"
                                    style={{
                                        width: isHovered ? 32 : 24,
                                        transitionTimingFunction:
                                            'cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                />
                                <span
                                    className="text-[9px] font-medium tracking-[0.2em] text-foreground/60 uppercase transition-all duration-700 md:text-[10px]"
                                    style={{
                                        letterSpacing: isHovered
                                            ? '0.25em'
                                            : '0.2em',
                                        transitionTimingFunction:
                                            'cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                >
                                    Portfolio
                                </span>
                            </div>
                        </div>

                        {/* Portfolio Image */}
                        <div className="relative">
                            <div
                                className="absolute -inset-2 transition-all duration-700"
                                style={{
                                    boxShadow: isHovered
                                        ? '0 16px 48px hsl(var(--foreground) / 0.08)'
                                        : '0 0 0 transparent',
                                    transitionTimingFunction:
                                        'cubic-bezier(0.16, 1, 0.3, 1)',
                                }}
                            />
                            <div className="relative h-48 overflow-hidden">
                                {/* COTD Badge - Always shown on works page */}
                                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 shadow-lg">
                                    <Star className="h-3.5 w-3.5 fill-white text-white" />
                                    <span className="text-xs font-bold text-white">
                                        COTD
                                    </span>
                                </div>

                                {portfolio.image ? (
                                    <img
                                        src={portfolio.image}
                                        alt={`${portfolio.name}'s portfolio`}
                                        className="h-full w-full object-contain transition-all duration-1000"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                        <svg
                                            className="h-12 w-12"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}

                                {/* Gradient Overlay */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent transition-opacity duration-700"
                                    style={{
                                        opacity: isHovered ? 1 : 0,
                                        transitionTimingFunction:
                                            'cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Author Info */}
                        <div className="flex items-center gap-3">
                            {portfolio.avatar ? (
                                <img
                                    src={portfolio.avatar}
                                    alt={portfolio.name}
                                    className="h-10 w-10 rounded-full object-cover transition-all duration-700"
                                    style={{
                                        transform: isHovered
                                            ? 'scale(1.1)'
                                            : 'scale(1)',
                                        transitionTimingFunction:
                                            'cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                />
                            ) : (
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-all duration-700"
                                    style={{
                                        transform: isHovered
                                            ? 'scale(1.1)'
                                            : 'scale(1)',
                                        transitionTimingFunction:
                                            'cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                >
                                    <span className="text-sm font-semibold">
                                        {portfolio.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div className="min-w-0 flex-1">
                                <h3
                                    className="truncate text-base font-normal tracking-tight text-foreground transition-all duration-700"
                                    style={{
                                        transform: isHovered
                                            ? 'translateX(4px)'
                                            : 'translateX(0)',
                                        transitionTimingFunction:
                                            'cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                >
                                    {portfolio.name}
                                </h3>
                                <p
                                    className="text-xs text-muted-foreground transition-all duration-700"
                                    style={{
                                        opacity: isHovered ? 1 : 0.7,
                                        transform: isHovered
                                            ? 'translateX(4px)'
                                            : 'translateX(0)',
                                        transitionTimingFunction:
                                            'cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                >
                                    {portfolio.role}
                                </p>
                            </div>
                        </div>

                        {/* Skills Preview */}
                        {portfolio.skills.length > 0 && (
                            <div
                                className="flex flex-wrap gap-1.5"
                                style={{
                                    opacity: isHovered ? 1 : 0.8,
                                    transform: isHovered
                                        ? 'translateY(0)'
                                        : 'translateY(2px)',
                                    transition:
                                        'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                                }}
                            >
                                {portfolio.skills.slice(0, 3).map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                                    >
                                        {skill}
                                    </span>
                                ))}
                                {portfolio.skills.length > 3 && (
                                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                        +{portfolio.skills.length - 3}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* View Arrow - Bottom Right */}
                        <div className="flex justify-end">
                            <div
                                className="flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-500"
                                style={{
                                    borderColor: isHovered
                                        ? 'hsl(var(--foreground))'
                                        : 'hsl(var(--muted-foreground) / 0.3)',
                                    backgroundColor: isHovered
                                        ? 'hsl(var(--foreground))'
                                        : 'transparent',
                                    color: isHovered
                                        ? 'hsl(var(--background))'
                                        : 'hsl(var(--foreground))',
                                    transform: isHovered
                                        ? 'scale(1.1)'
                                        : 'scale(1)',
                                    boxShadow: isHovered
                                        ? '0 4px 16px hsl(var(--foreground) / 0.15)'
                                        : '0 0 0 transparent',
                                    transitionTimingFunction:
                                        'cubic-bezier(0.16, 1, 0.3, 1)',
                                }}
                            >
                                <ArrowUpRight
                                    className="h-3.5 w-3.5 transition-transform duration-500"
                                    style={{
                                        transform: isHovered
                                            ? 'rotate(45deg)'
                                            : 'rotate(0deg)',
                                        transitionTimingFunction:
                                            'cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function Works({
    filterOptions = {
        skills: [],
        techStack: [],
        profession: [],
    },
    cotdPortfolios = [],
}: WorksPageProps) {
    const [selectedFilters, setSelectedFilters] = useState<{
        skills: string[];
        techStack: string[];
        profession: string[];
    }>({
        skills: [],
        techStack: [],
        profession: [],
    });

    // Temporary state for mobile filter selections (before applying)
    const [tempMobileFilters, setTempMobileFilters] = useState<{
        skills: string[];
        techStack: string[];
        profession: string[];
    }>({
        skills: [],
        techStack: [],
        profession: [],
    });

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownsOpen, setDropdownsOpen] = useState({
        skills: true,
        techStack: true,
        profession: true,
    });
    const [showAllFilters, setShowAllFilters] = useState({
        skills: false,
        techStack: false,
        profession: false,
    });

    const INITIAL_ITEMS_TO_SHOW = 8;

    const toggleShowAll = (category: 'skills' | 'techStack' | 'profession') => {
        setShowAllFilters((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const toggleDropdown = (
        category: 'skills' | 'techStack' | 'profession',
    ) => {
        setDropdownsOpen((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const toggleFilter = (
        category: 'skills' | 'techStack' | 'profession',
        value: string,
    ) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [category]: prev[category].includes(value)
                ? prev[category].filter((item) => item !== value)
                : [...prev[category], value],
        }));
    };

    // Mobile-specific filter functions
    const toggleMobileFilter = (
        category: 'skills' | 'techStack' | 'profession',
        value: string,
    ) => {
        setTempMobileFilters((prev) => ({
            ...prev,
            [category]: prev[category].includes(value)
                ? prev[category].filter((item) => item !== value)
                : [...prev[category], value],
        }));
    };

    const applyMobileFilters = () => {
        setSelectedFilters(tempMobileFilters);
        setSidebarOpen(false);
    };

    const closeMobileFilters = () => {
        setTempMobileFilters(selectedFilters);
        setSidebarOpen(false);
    };

    const clearMobileFilters = () => {
        setTempMobileFilters({
            skills: [],
            techStack: [],
            profession: [],
        });
    };

    const getMobileFilterCount = () => {
        return (
            tempMobileFilters.skills.length +
            tempMobileFilters.techStack.length +
            tempMobileFilters.profession.length
        );
    };

    const getActiveFilterCount = () => {
        return (
            selectedFilters.skills.length +
            selectedFilters.techStack.length +
            selectedFilters.profession.length
        );
    };

    // Open mobile sidebar and sync temp filters
    const openMobileFilters = () => {
        setTempMobileFilters(selectedFilters);
        setSidebarOpen(true);
    };

    const clearFilters = () => {
        setSelectedFilters({
            skills: [],
            techStack: [],
            profession: [],
        });
    };

    // Filter portfolios based on selected filters
    const filteredPortfolios = cotdPortfolios.filter((portfolio) => {
        // Filter by selected categories
        const skillMatch =
            selectedFilters.skills.length === 0 ||
            selectedFilters.skills.some((skill) =>
                portfolio.skills.includes(skill),
            );
        const techMatch =
            selectedFilters.techStack.length === 0 ||
            selectedFilters.techStack.some((tech) =>
                portfolio.techStack.includes(tech),
            );
        const professionMatch =
            selectedFilters.profession.length === 0 ||
            selectedFilters.profession.some((prof) =>
                portfolio.profession.includes(prof),
            );

        return skillMatch && techMatch && professionMatch;
    });

    return (
        <>
            <Head title="Works - COTD Showcase" />

            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
                <Navbar />

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 dark:bg-amber-950">
                            <svg
                                className="h-5 w-5 text-amber-600 dark:text-amber-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                                Codefolio of the Day
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                            Featured Works
                        </h1>
                        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                            Discover exceptional portfolios, handpicked by our
                            community
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 lg:flex-row">
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={openMobileFilters}
                            className="flex w-fit items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 transition-colors hover:bg-zinc-50 lg:hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
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
                                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filters
                            {getActiveFilterCount() > 0 && (
                                <span className="ml-1">
                                    ({getActiveFilterCount()})
                                </span>
                            )}
                        </button>

                        {/* Mobile Overlay */}
                        {sidebarOpen && (
                            <div
                                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                                onClick={closeMobileFilters}
                            />
                        )}

                        {/* Sidebar */}
                        <aside
                            className={`${
                                sidebarOpen
                                    ? 'translate-x-0'
                                    : 'translate-x-full'
                            } fixed top-0 right-0 z-50 flex h-full w-80 flex-col space-y-0 overflow-hidden bg-zinc-50 shadow-xl transition-transform duration-300 lg:relative lg:block lg:h-auto lg:w-64 lg:translate-x-0 lg:overflow-visible lg:bg-transparent lg:shadow-none dark:bg-zinc-950`}
                        >
                            {/* Mobile Header with Counter - Only on mobile */}
                            <div className="flex items-center justify-between border-b border-zinc-200 bg-white p-4 lg:hidden dark:border-zinc-800 dark:bg-zinc-900">
                                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                    Filters ({getMobileFilterCount()})
                                </h2>
                                {getMobileFilterCount() > 0 && (
                                    <button
                                        onClick={clearMobileFilters}
                                        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                    >
                                        Clear ({getMobileFilterCount()})
                                    </button>
                                )}
                            </div>

                            {/* Scrollable Filter Content */}
                            <div className="flex-1 space-y-6 overflow-y-auto p-4 lg:overflow-visible lg:p-0">
                                <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                                    {/* Desktop Header - Only on desktop */}
                                    <div className="mb-4 hidden items-center justify-between lg:flex">
                                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                            Filters
                                        </h2>
                                        {(selectedFilters.skills.length > 0 ||
                                            selectedFilters.techStack.length >
                                                0 ||
                                            selectedFilters.profession.length >
                                                0) && (
                                            <button
                                                onClick={clearFilters}
                                                className="text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                            >
                                                Clear all
                                            </button>
                                        )}
                                    </div>

                                    {/* Skills Filter */}
                                    <div className="mb-6">
                                        <button
                                            onClick={() =>
                                                toggleDropdown('skills')
                                            }
                                            className="mb-3 flex w-full items-center justify-between text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
                                        >
                                            <span>Skills</span>
                                            <svg
                                                className={`h-4 w-4 transition-transform ${
                                                    dropdownsOpen.skills
                                                        ? 'rotate-180'
                                                        : ''
                                                }`}
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {dropdownsOpen.skills && (
                                            <div className="space-y-2">
                                                {(showAllFilters.skills
                                                    ? filterOptions.skills
                                                    : filterOptions.skills.slice(
                                                          0,
                                                          INITIAL_ITEMS_TO_SHOW,
                                                      )
                                                ).map((skill) => {
                                                    // Use temp filters for mobile, regular filters for desktop
                                                    const currentSkills =
                                                        sidebarOpen
                                                            ? tempMobileFilters.skills
                                                            : selectedFilters.skills;
                                                    const isSelected =
                                                        currentSkills.includes(
                                                            skill,
                                                        );
                                                    return (
                                                        <label
                                                            key={skill}
                                                            className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                                                        >
                                                            <div
                                                                className={`flex h-4 w-4 items-center justify-center rounded border ${
                                                                    isSelected
                                                                        ? 'border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100'
                                                                        : 'border-zinc-300 dark:border-zinc-600'
                                                                }`}
                                                                onClick={() => {
                                                                    // Use mobile function on mobile, desktop on desktop
                                                                    if (
                                                                        window.innerWidth <
                                                                        1024
                                                                    ) {
                                                                        toggleMobileFilter(
                                                                            'skills',
                                                                            skill,
                                                                        );
                                                                    } else {
                                                                        toggleFilter(
                                                                            'skills',
                                                                            skill,
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                {isSelected && (
                                                                    <Check className="h-3 w-3 text-white dark:text-zinc-900" />
                                                                )}
                                                            </div>
                                                            <span>{skill}</span>
                                                        </label>
                                                    );
                                                })}
                                                {filterOptions.skills.length >
                                                    INITIAL_ITEMS_TO_SHOW && (
                                                    <button
                                                        onClick={() =>
                                                            toggleShowAll(
                                                                'skills',
                                                            )
                                                        }
                                                        className="text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                    >
                                                        {showAllFilters.skills
                                                            ? '− Show Less'
                                                            : `+ See More (${filterOptions.skills.length - INITIAL_ITEMS_TO_SHOW} more)`}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Tech Stack Filter */}
                                    <div className="mb-6">
                                        <button
                                            onClick={() =>
                                                toggleDropdown('techStack')
                                            }
                                            className="mb-3 flex w-full items-center justify-between text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
                                        >
                                            <span>Tech Stack</span>
                                            <svg
                                                className={`h-4 w-4 transition-transform ${
                                                    dropdownsOpen.techStack
                                                        ? 'rotate-180'
                                                        : ''
                                                }`}
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {dropdownsOpen.techStack && (
                                            <div className="space-y-2">
                                                {(showAllFilters.techStack
                                                    ? filterOptions.techStack
                                                    : filterOptions.techStack.slice(
                                                          0,
                                                          INITIAL_ITEMS_TO_SHOW,
                                                      )
                                                ).map((tech) => {
                                                    // Use temp filters for mobile, regular filters for desktop
                                                    const currentTechStack =
                                                        sidebarOpen
                                                            ? tempMobileFilters.techStack
                                                            : selectedFilters.techStack;
                                                    const isSelected =
                                                        currentTechStack.includes(
                                                            tech,
                                                        );
                                                    return (
                                                        <label
                                                            key={tech}
                                                            className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                                                        >
                                                            <div
                                                                className={`flex h-4 w-4 items-center justify-center rounded border ${
                                                                    isSelected
                                                                        ? 'border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100'
                                                                        : 'border-zinc-300 dark:border-zinc-600'
                                                                }`}
                                                                onClick={() => {
                                                                    // Use mobile function on mobile, desktop on desktop
                                                                    if (
                                                                        window.innerWidth <
                                                                        1024
                                                                    ) {
                                                                        toggleMobileFilter(
                                                                            'techStack',
                                                                            tech,
                                                                        );
                                                                    } else {
                                                                        toggleFilter(
                                                                            'techStack',
                                                                            tech,
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                {isSelected && (
                                                                    <Check className="h-3 w-3 text-white dark:text-zinc-900" />
                                                                )}
                                                            </div>
                                                            <span>{tech}</span>
                                                        </label>
                                                    );
                                                })}
                                                {filterOptions.techStack
                                                    .length >
                                                    INITIAL_ITEMS_TO_SHOW && (
                                                    <button
                                                        onClick={() =>
                                                            toggleShowAll(
                                                                'techStack',
                                                            )
                                                        }
                                                        className="text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                    >
                                                        {showAllFilters.techStack
                                                            ? '− Show Less'
                                                            : `+ See More (${filterOptions.techStack.length - INITIAL_ITEMS_TO_SHOW} more)`}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Profession Filter */}
                                    <div className="mb-6">
                                        <button
                                            onClick={() =>
                                                toggleDropdown('profession')
                                            }
                                            className="mb-3 flex w-full items-center justify-between text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
                                        >
                                            <span>Profession</span>
                                            <svg
                                                className={`h-4 w-4 transition-transform ${
                                                    dropdownsOpen.profession
                                                        ? 'rotate-180'
                                                        : ''
                                                }`}
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {dropdownsOpen.profession && (
                                            <div className="space-y-2">
                                                {(showAllFilters.profession
                                                    ? filterOptions.profession
                                                    : filterOptions.profession.slice(
                                                          0,
                                                          INITIAL_ITEMS_TO_SHOW,
                                                      )
                                                ).map((prof) => {
                                                    // Use temp filters for mobile, regular filters for desktop
                                                    const currentProfession =
                                                        sidebarOpen
                                                            ? tempMobileFilters.profession
                                                            : selectedFilters.profession;
                                                    const isSelected =
                                                        currentProfession.includes(
                                                            prof,
                                                        );
                                                    return (
                                                        <label
                                                            key={prof}
                                                            className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                                                        >
                                                            <div
                                                                className={`flex h-4 w-4 items-center justify-center rounded border ${
                                                                    isSelected
                                                                        ? 'border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100'
                                                                        : 'border-zinc-300 dark:border-zinc-600'
                                                                }`}
                                                                onClick={() => {
                                                                    // Use mobile function on mobile, desktop on desktop
                                                                    if (
                                                                        window.innerWidth <
                                                                        1024
                                                                    ) {
                                                                        toggleMobileFilter(
                                                                            'profession',
                                                                            prof,
                                                                        );
                                                                    } else {
                                                                        toggleFilter(
                                                                            'profession',
                                                                            prof,
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                {isSelected && (
                                                                    <Check className="h-3 w-3 text-white dark:text-zinc-900" />
                                                                )}
                                                            </div>
                                                            <span>{prof}</span>
                                                        </label>
                                                    );
                                                })}
                                                {filterOptions.profession
                                                    .length >
                                                    INITIAL_ITEMS_TO_SHOW && (
                                                    <button
                                                        onClick={() =>
                                                            toggleShowAll(
                                                                'profession',
                                                            )
                                                        }
                                                        className="text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                    >
                                                        {showAllFilters.profession
                                                            ? '− Show Less'
                                                            : `+ See More (${filterOptions.profession.length - INITIAL_ITEMS_TO_SHOW} more)`}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Action Buttons - Only on mobile */}
                            <div className="border-t border-zinc-200 bg-white p-4 lg:hidden dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="flex gap-3">
                                    <button
                                        onClick={closeMobileFilters}
                                        className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={applyMobileFilters}
                                        className="flex-1 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                    >
                                        Apply Changes
                                    </button>
                                </div>
                            </div>
                        </aside>

                        {/* Portfolio Grid */}
                        <div className="flex-1">
                            <div className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                                Showing {filteredPortfolios.length} of{' '}
                                {cotdPortfolios.length} featured portfolios
                            </div>

                            {filteredPortfolios.length === 0 ? (
                                <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                                    <div className="text-center">
                                        <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                                            No portfolios found
                                        </p>
                                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                            {cotdPortfolios.length === 0
                                                ? 'No featured portfolios yet'
                                                : 'Try adjusting your filters'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                        {filteredPortfolios.map(
                                            (portfolio, index) => (
                                                <COTDCard
                                                    key={portfolio.id}
                                                    portfolio={portfolio}
                                                    index={index}
                                                />
                                            ),
                                        )}
                                    </div>

                                    {/* End of Results & Call to Action */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.3,
                                        }}
                                        className="mt-12 space-y-6"
                                    >
                                        {/* End of Results Indicator */}
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-zinc-700" />
                                            <span className="text-sm font-medium whitespace-nowrap text-zinc-500 dark:text-zinc-400">
                                                End of results
                                            </span>
                                            <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-zinc-700" />
                                        </div>

                                        {/* Call to Action */}
                                        <div className="p-8 text-center">
                                            <div className="mx-auto max-w-2xl space-y-6">
                                                <h3 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                                                    Help us grow
                                                </h3>

                                                <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                                                    Share your portfolio with
                                                    our community! Showcase your
                                                    work and inspire others by
                                                    submitting your portfolio
                                                    today.
                                                </p>

                                                <Link
                                                    href="/settings/portfolio"
                                                    className="group inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-zinc-800 hover:shadow-lg dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                                >
                                                    Submit Your Portfolio
                                                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <Footerdemo />
            </div>
        </>
    );
}
