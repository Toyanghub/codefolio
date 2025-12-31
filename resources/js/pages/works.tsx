import { Footerdemo } from '@/components/ui/footer-section';
import { dashboard, login, logout, register } from '@/routes';
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

                            {/* User Dropdown */}
                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-56 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                                    >
                                        <div className="border-b border-zinc-200 p-3 dark:border-zinc-800">
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                {auth.user.name}
                                            </p>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                {auth.user.email}
                                            </p>
                                        </div>
                                        <div className="p-1">
                                            <Link
                                                href={dashboard.url()}
                                                className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                            >
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                            >
                                                Log out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <>
                            <Link
                                href={login.url()}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                            >
                                Log in
                            </Link>
                            {canRegister && (
                                <Link
                                    href={register.url()}
                                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                                >
                                    Sign up
                                </Link>
                            )}
                        </>
                    )}
                </motion.div>

                {/* Mobile Menu Button */}
                <motion.button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-700 hover:bg-zinc-100 md:hidden dark:text-zinc-300 dark:hover:bg-zinc-800"
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
                        <path d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </motion.button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/50 md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="absolute top-0 right-0 h-full w-64 bg-white p-6 shadow-xl dark:bg-zinc-950"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col space-y-4">
                                <Link
                                    href="/"
                                    className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                >
                                    Lobby
                                </Link>
                                <Link
                                    href="/observatory"
                                    className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                >
                                    Observatory
                                </Link>
                                <Link
                                    href="/works"
                                    className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                >
                                    Works
                                </Link>
                                <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
                                    {auth.user ? (
                                        <>
                                            <div className="mb-4 px-4">
                                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                    {auth.user.name}
                                                </p>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                    {auth.user.email}
                                                </p>
                                            </div>
                                            <Link
                                                href={dashboard.url()}
                                                className="block rounded-md px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                            >
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full rounded-md px-4 py-2 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                            >
                                                Log out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href={login.url()}
                                                className="block rounded-md px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                            >
                                                Log in
                                            </Link>
                                            {canRegister && (
                                                <Link
                                                    href={register.url()}
                                                    className="mt-2 block rounded-lg bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                                                >
                                                    Sign up
                                                </Link>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// COTD Portfolio data
const cotdPortfolios = [
    {
        id: 1,
        name: 'rizamb',
        role: 'Fullstack Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rizamb',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
        skills: ['Web', 'Fullstack'],
        techStack: ['JavaScript', 'React'],
        description:
            'Creating seamless web experiences with modern JavaScript frameworks',
    },
    {
        id: 4,
        name: 'Deepak',
        role: 'Web Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=deepak',
        image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop',
        skills: ['Frontend', 'Web'],
        techStack: ['HTML', 'CSS'],
        description: 'Crafting beautiful and responsive user interfaces',
    },
    {
        id: 7,
        name: 'JazzMase',
        role: 'Fullstack Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jazzmase',
        image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop',
        skills: ['Web', 'Data'],
        techStack: ['JavaScript', 'Node.js'],
        description:
            'Building scalable applications with data-driven solutions',
    },
];

export default function Works() {
    return (
        <>
            <Head title="Works - COTD Showcase" />

            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
                <Navbar />

                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Introduction Section */}
                    <div className="mb-12">
                        <div className="mx-auto max-w-3xl text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
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
                                <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100">
                                    Featured Works
                                </h1>
                                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                                    Discover exceptional portfolios, handpicked
                                    by our community. Each COTD celebrates
                                    outstanding design, innovation, and
                                    craftsmanship that sets new standards. Get
                                    inspired.
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    {/* COTD Portfolio Grid */}
                    <div>
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100"
                        >
                            Standout Portfolios
                        </motion.h2>

                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {cotdPortfolios.map((portfolio, index) => (
                                <Link
                                    key={portfolio.id}
                                    href={`/portfolio/${portfolio.id}`}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.4 + index * 0.1,
                                        }}
                                        className="group relative overflow-hidden rounded-lg border border-amber-400 bg-white shadow-sm ring-2 ring-amber-400/20 transition-all hover:shadow-xl dark:border-amber-500 dark:bg-zinc-900 dark:ring-amber-500/20"
                                    >
                                        {/* COTD Badge */}
                                        <div className="absolute top-3 right-3 z-10">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                                                <svg
                                                    className="h-3 w-3"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                COTD
                                            </span>
                                        </div>

                                        {/* Portfolio Image */}
                                        <div className="relative h-56 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                            <img
                                                src={portfolio.image}
                                                alt={`${portfolio.name}'s portfolio`}
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        </div>

                                        {/* Portfolio Info */}
                                        <div className="p-6">
                                            <div className="mb-4 flex items-center gap-3">
                                                <img
                                                    src={portfolio.avatar}
                                                    alt={portfolio.name}
                                                    className="h-12 w-12 rounded-full ring-2 ring-amber-400 dark:ring-amber-500"
                                                />
                                                <div>
                                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                                                        {portfolio.name}
                                                    </h3>
                                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                        {portfolio.role}
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                                                {portfolio.description}
                                            </p>

                                            {/* Tech Stack Pills */}
                                            <div className="flex flex-wrap gap-2">
                                                {portfolio.techStack.map(
                                                    (tech) => (
                                                        <span
                                                            key={tech}
                                                            className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        </div>

                                        {/* View Portfolio Link */}
                                        <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
                                            <div className="flex w-full items-center justify-center gap-2 text-sm font-medium text-amber-600 transition-colors hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300">
                                                <span>View Portfolio</span>
                                                <svg
                                                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Call to Action */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="mt-16 rounded-lg border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-900 dark:bg-amber-950/30"
                    >
                        <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-zinc-100">
                            Want your portfolio featured?
                        </h3>
                        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
                            Submit your best work and get a chance to be
                            featured as the next Codefolio of the Day
                        </p>
                        <Link
                            href="/observatory"
                            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-600"
                        >
                            Explore More Portfolios
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </motion.div>
                </div>

                <Footerdemo />
            </div>
        </>
    );
}
