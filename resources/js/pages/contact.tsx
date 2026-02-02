import { Footerdemo } from '@/components/ui/footer-section';
import { useAppearance } from '@/hooks/use-appearance';
import { login, logout, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Moon, Send, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

function Navbar({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
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
                <button
                    className="rounded-md p-2 text-zinc-700 transition-colors hover:bg-zinc-100 md:hidden dark:text-zinc-300 dark:hover:bg-zinc-800"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed top-24 right-0 left-0 z-40 mx-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
                    >
                        <div className="space-y-1 p-4">
                            <Link
                                href="/"
                                className="block rounded-md px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                Lobby
                            </Link>
                            <Link
                                href="/observatory"
                                className="block rounded-md px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                Observatory
                            </Link>
                            <Link
                                href="/works"
                                className="block rounded-md px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                Works
                            </Link>
                            <div className="border-t border-zinc-200 pt-2 dark:border-zinc-800">
                                {auth.user ? (
                                    <>
                                        <Link
                                            href="/settings/profile"
                                            className="block rounded-md px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                        >
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full rounded-md px-4 py-2 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href={login.url()}
                                            className="block rounded-md px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                        >
                                            Log in
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register.url()}
                                                className="block rounded-md px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                            >
                                                Register
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Contact({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage(null);

        router.post('/contact', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitMessage({
                    type: 'success',
                    text: "Thank you for your message! We'll get back to you soon.",
                });
                setFormData({ name: '', email: '', message: '' });
                setIsSubmitting(false);
            },
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(' ');
                setSubmitMessage({
                    type: 'error',
                    text:
                        errorMessage ||
                        'Something went wrong. Please try again.',
                });
                setIsSubmitting(false);
            },
        });
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <Head title="Contact Us - Codefolio" />
            <div className="min-h-screen bg-white dark:bg-zinc-950">
                <Navbar canRegister={canRegister} />

                {/* Contact Content */}
                <div className="py-16">
                    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                    Send us a Message
                                </h2>
                                <form
                                    onSubmit={handleSubmit}
                                    className="mt-6 space-y-6"
                                >
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                        >
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
                                            placeholder="Tell us how we can help you..."
                                        />
                                    </div>

                                    {submitMessage && (
                                        <div
                                            className={`rounded-lg p-4 ${
                                                submitMessage.type === 'success'
                                                    ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                    : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                            }`}
                                        >
                                            {submitMessage.text}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex w-full items-center justify-center space-x-2 rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                    >
                                        <span>
                                            {isSubmitting
                                                ? 'Sending...'
                                                : 'Send Message'}
                                        </span>
                                        <Send className="h-4 w-4" />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <Footerdemo />
            </div>
        </>
    );
}
