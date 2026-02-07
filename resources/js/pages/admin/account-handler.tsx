import { Button } from '@/components/ui/button';
import { Footerdemo } from '@/components/ui/footer-section';
import { Input } from '@/components/ui/input';
import { useAppearance } from '@/hooks/use-appearance';
import { login, logout, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    KeyRound,
    Mail,
    Moon,
    Search,
    Shield,
    ShieldCheck,
    ShieldOff,
    Sun,
    Trash2,
    User,
    UserCog,
    Users,
    X,
    XCircle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface UserAccount {
    id: number;
    name: string;
    email: string;
    email_verified: boolean;
    email_otp: string | null;
    email_otp_expires_at: string | null;
    email_otp_attempts: number;
    google_id: string | null;
    github_id: string | null;
    avatar: string | null;
    is_admin: boolean;
    profile_picture: string | null;
    website_url: string | null;
    portfolio_description: string | null;
    portfolio_published: boolean;
    is_featured: boolean;
    featured_at: string | null;
    portfolio_setup_completed: boolean;
    portfolio_desktop_image: string | null;
    portfolio_mobile_image: string | null;
    email_verified_at: string | null;
    two_factor_confirmed_at: string | null;
    remember_token: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

interface AccountHandlerProps {
    users: {
        data: UserAccount[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: {
        total: number;
        verified: number;
        unverified: number;
        admins: number;
        oauth_users: number;
    };
    search: string;
    filter: string;
    perPage: number;
}

function Navbar({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<SharedData>().props;
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
                    <button
                        onClick={toggleTheme}
                        className="rounded-full p-2 text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        aria-label="Toggle theme"
                    >
                        {isDark ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </button>

                    {auth.user ? (
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                            >
                                {auth.user.profile_picture ||
                                auth.user.avatar ? (
                                    <img
                                        src={
                                            auth.user.profile_picture
                                                ? `/storage/${auth.user.profile_picture}`
                                                : auth.user.avatar
                                                  ? `/storage/${auth.user.avatar}`
                                                  : undefined
                                        }
                                        alt={auth.user.name}
                                        className="h-7 w-7 rounded-full"
                                    />
                                ) : (
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                                        {auth.user.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                            .toUpperCase()
                                            .slice(0, 2)}
                                    </div>
                                )}
                                <span className="hidden sm:inline">
                                    {auth.user.name}
                                </span>
                            </button>

                            {userMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 rounded-lg border border-zinc-200 bg-white py-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                                    {auth.user.is_admin && (
                                        <>
                                            <Link
                                                href="/admin/cotd"
                                                className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                            >
                                                COTD Management
                                            </Link>
                                            <Link
                                                href="/admin/accounts"
                                                className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                            >
                                                Account Handler
                                            </Link>
                                            <Link
                                                href="/admin/contacts"
                                                className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                            >
                                                Contact Submissions
                                            </Link>
                                            <div className="my-2 border-t border-zinc-200 dark:border-zinc-800" />
                                        </>
                                    )}
                                    <Link
                                        href="/settings/profile"
                                        className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                    >
                                        Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                href={login.url()}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                Log in
                            </Link>
                            {canRegister && (
                                <Link
                                    href={register.url()}
                                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                >
                                    Sign up
                                </Link>
                            )}
                        </>
                    )}
                </motion.div>
            </nav>
        </div>
    );
}

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText: string;
    variant?: 'danger' | 'warning' | 'primary';
    isProcessing?: boolean;
}

function ConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    title,
    description,
    confirmText,
    variant = 'danger',
    isProcessing = false,
}: ConfirmDialogProps) {
    const variantStyles = {
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        warning: 'bg-amber-600 hover:bg-amber-700 text-white',
        primary:
            'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900',
    };

    // Handle escape key to close dialog
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                onOpenChange(false);
            }
        };

        if (open) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [open, onOpenChange]);

    return (
        <AnimatePresence mode="wait">
            {open && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                    onClick={(e) => {
                        // Close on backdrop click (but only if clicking backdrop, not the dialog)
                        if (e.target === e.currentTarget) {
                            onOpenChange(false);
                        }
                    }}
                >
                    <motion.div
                        key="confirm-dialog"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-4 flex items-start justify-between">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                {title}
                            </h3>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
                                title={isProcessing ? "Processing... Dialog will close automatically" : "Close dialog"}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
                            {description}
                        </p>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isProcessing}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={onConfirm}
                                disabled={isProcessing}
                                className={`flex-1 ${variantStyles[variant]}`}
                            >
                                {isProcessing ? 'Processing...' : confirmText}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default function AccountHandler({
    users,
    stats,
    search: initialSearch,
    filter: initialFilter,
    perPage: initialPerPage,
}: AccountHandlerProps) {
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [activeFilter, setActiveFilter] = useState(initialFilter);
    const [perPage, setPerPage] = useState(initialPerPage);
    const [processing, setProcessing] = useState<number | null>(null);
    const [dialogState, setDialogState] = useState<{
        open: boolean;
        type:
            | 'delete'
            | 'toggle-admin'
            | 'toggle-verification'
            | 'clear-otp'
            | 'clear-2fa'
            | null;
        user: UserAccount | null;
    }>({
        open: false,
        type: null,
        user: null,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/accounts', {
            search: searchQuery,
            filter: activeFilter,
            per_page: perPage,
        });
    };

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        router.get('/admin/accounts', {
            search: searchQuery,
            filter,
            per_page: perPage,
        });
    };

    const handlePerPageChange = (value: number) => {
        setPerPage(value);
        router.get('/admin/accounts', {
            search: searchQuery,
            filter: activeFilter,
            per_page: value,
        });
    };

    const openDialog = (
        type:
            | 'delete'
            | 'toggle-admin'
            | 'toggle-verification'
            | 'clear-otp'
            | 'clear-2fa',
        user: UserAccount,
    ) => {
        setDialogState({ open: true, type, user });
    };

    const closeDialog = () => {
        setDialogState({ open: false, type: null, user: null });
    };

    const handleConfirmAction = () => {
        if (!dialogState.user || !dialogState.type) return;

        setProcessing(dialogState.user.id);

        const routes = {
            delete: `/admin/accounts/${dialogState.user.id}`,
            'toggle-admin': `/admin/accounts/${dialogState.user.id}/toggle-admin`,
            'toggle-verification': `/admin/accounts/${dialogState.user.id}/toggle-verification`,
            'clear-otp': `/admin/accounts/${dialogState.user.id}/clear-otp`,
            'clear-2fa': `/admin/accounts/${dialogState.user.id}/clear-2fa`,
        };

        const method = dialogState.type === 'delete' ? 'delete' : 'post';

        router[method](
            routes[dialogState.type],
            {},
            {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => {
                    // Dialog will close in onFinish
                    console.log('Action completed successfully');
                },
                onError: (errors) => {
                    // Log error but still close dialog in onFinish
                    console.error('Action failed:', errors);
                },
                onFinish: () => {
                    // Always close dialog and reset state after request completes
                    setProcessing(null);
                    closeDialog();
                },
            },
        );
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getDialogConfig = () => {
        if (!dialogState.type || !dialogState.user) return null;

        const configs = {
            delete: {
                title: 'Delete User Account',
                description: `Are you sure you want to delete ${dialogState.user.name}'s account? This action cannot be undone.`,
                confirmText: 'Delete Account',
                variant: 'danger' as const,
            },
            'toggle-admin': {
                title: dialogState.user.is_admin
                    ? 'Remove Admin Access'
                    : 'Grant Admin Access',
                description: dialogState.user.is_admin
                    ? `Remove administrator privileges from ${dialogState.user.name}?`
                    : `Grant administrator privileges to ${dialogState.user.name}? They will have full access to admin features.`,
                confirmText: dialogState.user.is_admin
                    ? 'Remove Admin'
                    : 'Grant Admin',
                variant: 'warning' as const,
            },
            'toggle-verification': {
                title: dialogState.user.email_verified
                    ? 'Unverify Email'
                    : 'Verify Email',
                description: dialogState.user.email_verified
                    ? `Mark ${dialogState.user.name}'s email as unverified? They will need to verify again.`
                    : `Manually verify ${dialogState.user.name}'s email address?`,
                confirmText: dialogState.user.email_verified
                    ? 'Unverify'
                    : 'Verify',
                variant: 'primary' as const,
            },
            'clear-otp': {
                title: 'Clear OTP Attempts',
                description: `Reset OTP verification attempts for ${dialogState.user.name}?`,
                confirmText: 'Clear Attempts',
                variant: 'primary' as const,
            },
            'clear-2fa': {
                title: 'Clear Two-Factor Authentication',
                description: `Remove 2FA setup for ${dialogState.user.name}? They will need to set it up again.`,
                confirmText: 'Clear 2FA',
                variant: 'warning' as const,
            },
        };

        return configs[dialogState.type];
    };

    const dialogConfig = getDialogConfig();

    return (
        <>
            <Head title="Account Handler - Admin" />
            <div className="min-h-screen bg-zinc-50 dark:bg-black">
                <Navbar />

                {/* Main Content */}
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-lg bg-zinc-900 p-2 dark:bg-zinc-100">
                                <Users className="h-6 w-6 text-white dark:text-zinc-900" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                                    Account Handler
                                </h1>
                                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                                    Manage user accounts and permissions
                                </p>
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    <Users className="h-4 w-4" />
                                    <span>Total Users</span>
                                </div>
                                <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Verified</span>
                                </div>
                                <p className="mt-2 text-2xl font-bold text-green-600">
                                    {stats.verified}
                                </p>
                            </div>
                            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    <XCircle className="h-4 w-4 text-red-600" />
                                    <span>Unverified</span>
                                </div>
                                <p className="mt-2 text-2xl font-bold text-red-600">
                                    {stats.unverified}
                                </p>
                            </div>
                            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                                    <span>Administrators</span>
                                </div>
                                <p className="mt-2 text-2xl font-bold text-blue-600">
                                    {stats.admins}
                                </p>
                            </div>
                            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    <KeyRound className="h-4 w-4 text-purple-600" />
                                    <span>OAuth Users</span>
                                </div>
                                <p className="mt-2 text-2xl font-bold text-purple-600">
                                    {stats.oauth_users}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-1 gap-2"
                        >
                            <div className="relative max-w-md flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by name, email, or ID..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </form>

                        <div className="flex gap-2">
                            <select
                                value={activeFilter}
                                onChange={(e) =>
                                    handleFilterChange(e.target.value)
                                }
                                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            >
                                <option value="all">All Users</option>
                                <option value="verified">Verified Only</option>
                                <option value="unverified">
                                    Unverified Only
                                </option>
                                <option value="admin">Admins Only</option>
                                <option value="regular">Regular Users</option>
                                <option value="oauth">OAuth Users</option>
                            </select>

                            <select
                                value={perPage}
                                onChange={(e) =>
                                    handlePerPageChange(Number(e.target.value))
                                }
                                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            >
                                <option value="10">10 per page</option>
                                <option value="15">15 per page</option>
                                <option value="25">25 per page</option>
                                <option value="50">50 per page</option>
                                <option value="100">100 per page</option>
                            </select>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                                            User
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                                            Email Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                                            Auth Method
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                                            Role
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                                            Portfolio
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                                            Registered
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                        >
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    {user.profile_picture ||
                                                    user.avatar ? (
                                                        <img
                                                            src={
                                                                user.profile_picture
                                                                    ? `/storage/${user.profile_picture}`
                                                                    : `/storage/${user.avatar}`
                                                            }
                                                            alt={user.name}
                                                            className="h-10 w-10 rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                                                            {user.name
                                                                .split(' ')
                                                                .map(
                                                                    (n) => n[0],
                                                                )
                                                                .join('')
                                                                .toUpperCase()
                                                                .slice(0, 2)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                                            {user.email}
                                                        </div>
                                                        <div className="text-xs text-zinc-400 dark:text-zinc-500">
                                                            ID: {user.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    {user.email_verified ? (
                                                        <>
                                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                                            <span className="text-sm font-medium text-green-600">
                                                                Verified
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="h-4 w-4 text-red-600" />
                                                            <span className="text-sm font-medium text-red-600">
                                                                Not Verified
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                                {user.email_otp_attempts >
                                                    0 && (
                                                    <div className="mt-1 text-xs text-amber-600">
                                                        OTP Attempts:{' '}
                                                        {
                                                            user.email_otp_attempts
                                                        }
                                                    </div>
                                                )}
                                                {user.two_factor_confirmed_at && (
                                                    <div className="mt-1 flex items-center gap-1 text-xs text-blue-600">
                                                        <Shield className="h-3 w-3" />
                                                        <span>2FA Enabled</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col gap-1">
                                                    {user.google_id && (
                                                        <div className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                                                            <Mail className="h-3 w-3" />
                                                            <span>Google</span>
                                                        </div>
                                                    )}
                                                    {user.github_id && (
                                                        <div className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                                                            <svg
                                                                className="h-3 w-3"
                                                                fill="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                            </svg>
                                                            <span>GitHub</span>
                                                        </div>
                                                    )}
                                                    {!user.google_id &&
                                                        !user.github_id && (
                                                            <div className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                                                                <Mail className="h-3 w-3" />
                                                                <span>
                                                                    Email/Password
                                                                </span>
                                                            </div>
                                                        )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                {user.is_admin ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                        <ShieldCheck className="h-3 w-3" />
                                                        Administrator
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                                                        <User className="h-3 w-3" />
                                                        User
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                {user.portfolio_published ? (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs font-medium text-green-600">
                                                            Published
                                                        </span>
                                                        {user.is_featured && (
                                                            <span className="text-xs text-amber-600">
                                                                Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : user.portfolio_setup_completed ? (
                                                    <span className="text-xs text-zinc-500">
                                                        Setup Complete
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-zinc-400">
                                                        Not Set Up
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                                                    <Clock className="h-3 w-3" />
                                                    <span className="text-xs">
                                                        {formatDate(
                                                            user.created_at,
                                                        )}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            openDialog(
                                                                'toggle-verification',
                                                                user,
                                                            )
                                                        }
                                                        disabled={
                                                            processing ===
                                                            user.id
                                                        }
                                                        title={
                                                            user.email_verified
                                                                ? 'Unverify email'
                                                                : 'Verify email'
                                                        }
                                                    >
                                                        {user.email_verified ? (
                                                            <XCircle className="h-4 w-4 text-red-600" />
                                                        ) : (
                                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                                        )}
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            openDialog(
                                                                'toggle-admin',
                                                                user,
                                                            )
                                                        }
                                                        disabled={
                                                            processing ===
                                                            user.id
                                                        }
                                                        title={
                                                            user.is_admin
                                                                ? 'Remove admin'
                                                                : 'Make admin'
                                                        }
                                                    >
                                                        {user.is_admin ? (
                                                            <ShieldOff className="h-4 w-4 text-amber-600" />
                                                        ) : (
                                                            <ShieldCheck className="h-4 w-4 text-blue-600" />
                                                        )}
                                                    </Button>

                                                    {user.email_otp_attempts >
                                                        0 && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                openDialog(
                                                                    'clear-otp',
                                                                    user,
                                                                )
                                                            }
                                                            disabled={
                                                                processing ===
                                                                user.id
                                                            }
                                                            title="Clear OTP attempts"
                                                        >
                                                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                                                        </Button>
                                                    )}

                                                    {user.two_factor_confirmed_at && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                openDialog(
                                                                    'clear-2fa',
                                                                    user,
                                                                )
                                                            }
                                                            disabled={
                                                                processing ===
                                                                user.id
                                                            }
                                                            title="Clear 2FA"
                                                        >
                                                            <Shield className="h-4 w-4 text-purple-600" />
                                                        </Button>
                                                    )}

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            openDialog(
                                                                'delete',
                                                                user,
                                                            )
                                                        }
                                                        disabled={
                                                            processing ===
                                                            user.id
                                                        }
                                                        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-500 dark:hover:bg-red-950"
                                                        title="Delete user"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
                                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                    Showing{' '}
                                    {(users.current_page - 1) * users.per_page +
                                        1}{' '}
                                    to{' '}
                                    {Math.min(
                                        users.current_page * users.per_page,
                                        users.total,
                                    )}{' '}
                                    of {users.total} results
                                </div>
                                <div className="flex gap-2">
                                    {users.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                router.get('/admin/accounts', {
                                                    search: searchQuery,
                                                    filter: activeFilter,
                                                    per_page: perPage,
                                                    page:
                                                        users.current_page - 1,
                                                })
                                            }
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    <div className="flex items-center gap-1">
                                        {Array.from(
                                            {
                                                length: Math.min(
                                                    5,
                                                    users.last_page,
                                                ),
                                            },
                                            (_, i) => {
                                                let page;
                                                if (users.last_page <= 5) {
                                                    page = i + 1;
                                                } else if (
                                                    users.current_page <= 3
                                                ) {
                                                    page = i + 1;
                                                } else if (
                                                    users.current_page >=
                                                    users.last_page - 2
                                                ) {
                                                    page =
                                                        users.last_page - 4 + i;
                                                } else {
                                                    page =
                                                        users.current_page -
                                                        2 +
                                                        i;
                                                }

                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() =>
                                                            router.get(
                                                                '/admin/accounts',
                                                                {
                                                                    search: searchQuery,
                                                                    filter: activeFilter,
                                                                    per_page:
                                                                        perPage,
                                                                    page,
                                                                },
                                                            )
                                                        }
                                                        className={`rounded px-3 py-1 text-sm ${
                                                            page ===
                                                            users.current_page
                                                                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                                                                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            },
                                        )}
                                    </div>
                                    {users.current_page < users.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                router.get('/admin/accounts', {
                                                    search: searchQuery,
                                                    filter: activeFilter,
                                                    per_page: perPage,
                                                    page:
                                                        users.current_page + 1,
                                                })
                                            }
                                        >
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Empty State */}
                    {users.data.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                            <Users className="h-16 w-16 text-zinc-400 dark:text-zinc-600" />
                            <h3 className="mt-4 mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                No Users Found
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                {searchQuery
                                    ? 'Try adjusting your search query or filters'
                                    : 'No user accounts have been created yet'}
                            </p>
                        </div>
                    )}

                    {/* Confirmation Dialog */}
                    <ConfirmDialog
                        open={dialogState.open && dialogConfig !== null}
                        onOpenChange={closeDialog}
                        onConfirm={handleConfirmAction}
                        title={dialogConfig?.title ?? ''}
                        description={dialogConfig?.description ?? ''}
                        confirmText={dialogConfig?.confirmText ?? 'Confirm'}
                        variant={dialogConfig?.variant ?? 'danger'}
                        isProcessing={processing !== null}
                    />

                    {/* Admin Panel Links */}
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/admin/cotd"
                            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <UserCog className="h-4 w-4" />
                            COTD Management
                        </Link>
                        <Link
                            href="/admin/contacts"
                            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <Mail className="h-4 w-4" />
                            Contact Submissions
                        </Link>
                    </div>
                </div>

                <Footerdemo />
            </div>
        </>
    );
}
