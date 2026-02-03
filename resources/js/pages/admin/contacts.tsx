import { Footerdemo } from '@/components/ui/footer-section';
import { useAppearance } from '@/hooks/use-appearance';
import { login, logout, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Mail, Moon, Search, Sun, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    message: string;
    created_at: string;
}

interface PaginatedMessages {
    data: ContactMessage[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface AdminContactsProps {
    messages: PaginatedMessages;
    search?: string;
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

export default function AdminContacts({
    messages,
    search: initialSearch = '',
}: AdminContactsProps) {
    const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState(initialSearch);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const handleSelectAll = () => {
        if (selectedMessages.length === messages.data.length) {
            setSelectedMessages([]);
        } else {
            setSelectedMessages(messages.data.map((msg) => msg.id));
        }
    };

    const handleSelectMessage = (id: number) => {
        if (selectedMessages.includes(id)) {
            setSelectedMessages(
                selectedMessages.filter((msgId) => msgId !== id),
            );
        } else {
            setSelectedMessages([...selectedMessages, id]);
        }
    };

    const handleDeleteClick = () => {
        if (selectedMessages.length > 0) {
            setDeleteDialogOpen(true);
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedMessages.length === 0) return;

        setIsDeleting(true);
        router.post(
            '/admin/contacts/delete',
            {
                message_ids: selectedMessages,
            },
            {
                onSuccess: () => {
                    setSelectedMessages([]);
                    setDeleteDialogOpen(false);
                },
                onFinish: () => {
                    setIsDeleting(false);
                },
            },
        );
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setSelectedMessages([]); // Clear selections when searching
        router.get(
            '/admin/contacts',
            { search: value },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSelectedMessages([]);
        router.get(
            '/admin/contacts',
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const allSelected =
        messages.data.length > 0 &&
        selectedMessages.length === messages.data.length;

    return (
        <>
            <Head title="Contact Messages - Admin" />
            <div className="min-h-screen bg-zinc-50 dark:bg-black">
                <Navbar />

                {/* Main Content */}
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                                Contact Messages
                            </h1>
                            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                View and manage contact form submissions.{' '}
                                <span className="font-semibold">
                                    {messages.total} total message
                                    {messages.total !== 1 ? 's' : ''}
                                </span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {selectedMessages.length > 0 && (
                                <button
                                    onClick={handleDeleteClick}
                                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Selected ({selectedMessages.length})
                                </button>
                            )}
                            <Link
                                href="/admin/cotd"
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
                                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                COTD Admin
                            </Link>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
                                <Mail className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
                            </div>
                            <div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    Total Messages
                                </p>
                                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                    {messages.total}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mb-6"
                    >
                        <div className="relative max-w-md">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search by name, email, or message..."
                                className="w-full rounded-lg border border-zinc-300 bg-white py-2 pr-10 pl-10 text-sm text-zinc-900 placeholder-zinc-500 transition-colors focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        {searchQuery && (
                            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                Showing results for "{searchQuery}"
                            </p>
                        )}
                    </motion.div>

                    {/* Messages Table */}
                    {messages.data.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800">
                                        <tr>
                                            <th className="w-12 px-6 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={allSelected}
                                                    onChange={handleSelectAll}
                                                    className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:focus:ring-zinc-400"
                                                />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-700 uppercase dark:text-zinc-300">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-700 uppercase dark:text-zinc-300">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-700 uppercase dark:text-zinc-300">
                                                Message
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-700 uppercase dark:text-zinc-300">
                                                Received
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                        {messages.data.map((message) => (
                                            <tr
                                                key={message.id}
                                                className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                            >
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedMessages.includes(
                                                            message.id,
                                                        )}
                                                        onChange={() =>
                                                            handleSelectMessage(
                                                                message.id,
                                                            )
                                                        }
                                                        className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:focus:ring-zinc-400"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                        {message.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <a
                                                        href={`mailto:${message.email}`}
                                                        className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
                                                    >
                                                        {message.email}
                                                    </a>
                                                </td>
                                                <td className="max-w-md px-6 py-4">
                                                    <div className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                                                        {message.message}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                                        {formatDate(
                                                            message.created_at,
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {messages.last_page > 1 && (
                                <div className="border-t border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                            Showing{' '}
                                            {(messages.current_page - 1) *
                                                messages.per_page +
                                                1}{' '}
                                            to{' '}
                                            {Math.min(
                                                messages.current_page *
                                                    messages.per_page,
                                                messages.total,
                                            )}{' '}
                                            of {messages.total} messages
                                        </div>
                                        <div className="flex gap-2">
                                            {messages.current_page > 1 && (
                                                <Link
                                                    href={`/admin/contacts?page=${messages.current_page - 1}`}
                                                    className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                >
                                                    Previous
                                                </Link>
                                            )}
                                            {messages.current_page <
                                                messages.last_page && (
                                                <Link
                                                    href={`/admin/contacts?page=${messages.current_page + 1}`}
                                                    className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                >
                                                    Next
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="rounded-lg border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                        >
                            <Mail className="mx-auto h-12 w-12 text-zinc-400" />
                            <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
                                No messages yet
                            </h3>
                            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                Contact messages will appear here once users
                                submit the contact form.
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Delete Confirmation Dialog */}
                <AnimatePresence>
                    {deleteDialogOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 bg-black/50"
                                onClick={() =>
                                    !isDeleting && setDeleteDialogOpen(false)
                                }
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                            >
                                <div className="mb-4">
                                    <div className="mb-2 flex items-center gap-3">
                                        <div className="rounded-full bg-red-100 p-2 dark:bg-red-950">
                                            <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                            Delete Messages
                                        </h3>
                                    </div>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                        Are you sure you want to delete{' '}
                                        {selectedMessages.length} message
                                        {selectedMessages.length !== 1
                                            ? 's'
                                            : ''}
                                        ? This action cannot be undone.
                                    </p>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() =>
                                            setDeleteDialogOpen(false)
                                        }
                                        disabled={isDeleting}
                                        className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteConfirm}
                                        disabled={isDeleting}
                                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-800"
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                <Footerdemo />
            </div>
        </>
    );
}
