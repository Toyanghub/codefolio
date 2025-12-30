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

export default function Observatory() {
    return (
        <>
            <Head title="Observatory" />

            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
                <Navbar />

                {/* Observatory Content */}
                <div className="mx-auto max-w-6xl px-4 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                            Here is the Observatory page
                        </h1>
                    </div>
                </div>

                <Footerdemo />
            </div>
        </>
    );
}
