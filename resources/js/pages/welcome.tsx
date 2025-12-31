import FaqSection from '@/components/faq-sections';
import {
    Stories,
    StoriesContent,
    Story,
    StoryAuthor,
    StoryAuthorImage,
    StoryAuthorName,
    StoryImage,
    StoryOverlay,
} from '@/components/stories-carousel';
import { Footerdemo } from '@/components/ui/footer-section';
import { login, logout, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

function Navbar({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = () => {
        router.post(logout.url());
    };

    return (
        <div className="flex w-full justify-center px-4 py-6">
            <nav className="relative z-50 flex w-full max-w-6xl items-center justify-between rounded-full bg-white px-6 py-3 shadow-lg dark:bg-zinc-950">
                {/* Logo/Brand */}
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <Link
                        href="/"
                        className="flex items-center space-x-2 text-xl font-semibold tracking-tight text-zinc-900 transition-colors hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
                    >
                        <span>Codefolio</span>
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
                            whileHover={{ scale: 1.05 }}
                        >
                            <Link
                                href={item.href}
                                className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
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
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                                    <span className="text-sm font-semibold">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </span>
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
                                className="rounded-full px-5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                            >
                                Log in
                            </Link>
                            {canRegister && (
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Link
                                        href={register()}
                                        className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                    >
                                        Sign up
                                    </Link>
                                </motion.div>
                            )}
                        </>
                    )}
                </motion.div>

                {/* Mobile Menu Button */}
                <motion.button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    whileTap={{ scale: 0.9 }}
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
                </motion.button>
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

                        <div className="flex flex-col space-y-6">
                            {/* Mobile Navigation Links */}
                            {[
                                { href: '/', label: 'Lobby' },
                                { href: '/observatory', label: 'Observatory' },
                                { href: '/works', label: 'Works' },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: index * 0.1 + 0.1,
                                    }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <Link
                                        href={item.href}
                                        className="block rounded-md px-4 py-2 text-base font-medium text-zinc-900 dark:text-zinc-100"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}

                            {/* Mobile Auth Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="space-y-3 pt-6"
                            >
                                {auth.user ? (
                                    <button
                                        onClick={handleLogout}
                                        className="w-full rounded-full bg-red-600 px-5 py-3 text-base font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="block w-full rounded-full border border-zinc-300 px-5 py-3 text-center text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            Log in
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-5 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                Sign up
                                            </Link>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Sample portfolio data
const portfolioData = [
    {
        id: 1,
        name: 'rizamb',
        role: 'Fullstack Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rizamb',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
    },
    {
        id: 2,
        name: 'elliottprgrammer',
        role: 'Fullstack Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elliott',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    },
    {
        id: 3,
        name: 'Jammore123',
        role: 'Fullstack Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jammore',
        image: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=400&h=300&fit=crop',
    },
    {
        id: 4,
        name: 'Deepak',
        role: 'Web Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=deepak',
        image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop',
    },
    {
        id: 5,
        name: 'samilanojeff98',
        role: 'Web Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=samilano',
        image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400&h=300&fit=crop',
    },
    {
        id: 6,
        name: 'elkoh',
        role: 'Fullstack Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elkoh',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    },
    {
        id: 7,
        name: 'JazzMase',
        role: 'Fullstack Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jazzmase',
        image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop',
    },
    {
        id: 8,
        name: 'Dock',
        role: 'Frontend Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dock',
        image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop',
    },
    {
        id: 9,
        name: 'quinchy',
        role: 'Fullstack Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=quinchy',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop',
    },
    {
        id: 10,
        name: 'klynesjido',
        role: 'Software Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=klynes',
        image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=300&fit=crop',
    },
];

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
            <div className="min-h-screen">
                <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center bg-zinc-50 p-6 dark:bg-zinc-950">
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

            {/* Latest Portfolios Section */}
            <div className="bg-zinc-100 py-16 dark:bg-zinc-950">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                            Latest Codefolios
                        </h2>
                        <Link
                            href="/works"
                            className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-white dark:hover:text-zinc-300"
                        >
                            Explore More
                        </Link>
                    </div>

                    <Stories>
                        <StoriesContent>
                            {portfolioData.map((portfolio, index) => (
                                <Link
                                    key={index}
                                    href={`/portfolio/${portfolio.id}`}
                                >
                                    <Story>
                                        <div className="relative h-[200px] w-[280px] overflow-hidden rounded-xl">
                                            <StoryImage
                                                src={portfolio.image}
                                                alt={`${portfolio.name}'s portfolio`}
                                            />
                                            <StoryOverlay side="bottom" />
                                            <StoryAuthor>
                                                <StoryAuthorImage
                                                    src={portfolio.avatar}
                                                    name={portfolio.name}
                                                />
                                                <div className="flex flex-col">
                                                    <StoryAuthorName className="font-semibold drop-shadow-lg">
                                                        {portfolio.name}
                                                    </StoryAuthorName>
                                                    <span className="text-xs text-white/70">
                                                        {portfolio.role}
                                                    </span>
                                                </div>
                                            </StoryAuthor>
                                        </div>
                                    </Story>
                                </Link>
                            ))}
                        </StoriesContent>
                    </Stories>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white py-16 dark:bg-zinc-950">
                <FaqSection />
            </div>

            {/* Footer */}
            <Footerdemo />
        </>
    );
}
