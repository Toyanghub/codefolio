import { Footerdemo } from '@/components/ui/footer-section';
import { InfiniteTextMarquee } from '@/components/ui/infinite-text-marquee';
import { login, logout, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

interface Portfolio {
    id: number;
    name: string;
    email: string;
    profilePicture: string | null;
    desktopImage: string;
    mobileImage: string | null;
    description: string | null;
    websiteUrl: string | null;
    skills: string[];
    techStack: string[];
    professions: string[];
    createdAt: string;
    isFeatured?: boolean;
}

interface PageProps {
    portfolio: Portfolio;
    canRegister?: boolean;
}

function Navbar({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = () => {
        router.post(logout.url());
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
                                className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition-all duration-300 hover:text-zinc-900 hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.3)] dark:text-zinc-300 dark:hover:text-zinc-100 dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                            >
                                {item.label}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="hidden items-center space-x-2 md:flex">
                    {auth.user ? (
                        <div className="relative">
                            <motion.button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 rounded-full p-1 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
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

                            <AnimatePresence>
                                {userMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() =>
                                                setUserMenuOpen(false)
                                            }
                                        />
                                        <motion.div
                                            className="absolute top-12 right-0 z-50 w-56 rounded-md border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="space-y-1 p-2">
                                                {/* User Info Header */}
                                                <div className="flex items-center gap-3 px-2 py-3">
                                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-zinc-200 bg-zinc-900 text-white dark:border-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">
                                                        {auth.user.avatar ||
                                                        auth.user
                                                            .profile_picture ? (
                                                            <img
                                                                src={`/storage/${auth.user.avatar || auth.user.profile_picture}`}
                                                                alt={
                                                                    auth.user
                                                                        .name
                                                                }
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
                                                    className="block rounded-lg px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                >
                                                    Settings
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full rounded-lg px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link
                                    href={login.url()}
                                    className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                >
                                    Login
                                </Link>
                            </motion.div>
                            {canRegister && (
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Link
                                        href={register.url()}
                                        className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                    >
                                        Register
                                    </Link>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <motion.button
                    className="rounded-md p-2 text-zinc-700 hover:bg-zinc-100 md:hidden dark:text-zinc-300 dark:hover:bg-zinc-800"
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
                                        className="block rounded-lg px-4 py-3 text-base font-medium text-zinc-900 transition-all duration-300 hover:text-zinc-900 hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.3)] dark:text-zinc-100 dark:hover:text-zinc-100 dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
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
                                    Login
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register.url()}
                                        className="block rounded-lg bg-zinc-900 px-4 py-3 text-center text-base font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Register
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

export default function PortfolioDetail({ portfolio, canRegister }: PageProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [activeImage, setActiveImage] = useState<
        'both' | 'desktop' | 'mobile'
    >('both');

    // Get profession/role for display
    const role =
        portfolio.professions.length > 0
            ? portfolio.professions[0]
            : 'Developer';

    return (
        <>
            <Head title={`${portfolio.name} - Portfolio`} />

            <div className="min-h-screen bg-background">
                <Navbar canRegister={canRegister} />

                {/* Featured Portfolio Marquee */}
                {!!portfolio.isFeatured && (
                    <div className="w-full overflow-hidden border-y border-zinc-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:border-zinc-800 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-amber-950/20">
                        <InfiniteTextMarquee
                            text="⭐ Featured Portfolio"
                            link={`/portfolio/${portfolio.id}`}
                            speed={25}
                            showTooltip={false}
                            fontSize="3rem"
                            textColor="rgb(217 119 6)"
                            hoverColor="rgb(245 158 11)"
                        />
                    </div>
                )}

                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Feature Spotlight Layout */}
                    <div
                        className="group relative flex cursor-pointer flex-col items-center gap-8 md:flex-row md:items-start md:gap-12 lg:gap-16"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Left: Portfolio Info Block */}
                        <div className="relative z-10 flex w-full max-w-[420px] shrink-0 flex-col items-center text-center md:w-[340px] md:items-start md:text-left lg:w-[400px] lg:pt-4">
                            {/* Label with animated line */}
                            <div className="mb-6 flex items-center gap-3 md:mb-8 md:gap-4">
                                <div
                                    className="h-px bg-foreground transition-all duration-700"
                                    style={{
                                        width: isHovered ? 48 : 32,
                                        transitionTimingFunction:
                                            'cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                />
                                <span
                                    className="text-[10px] font-medium tracking-[0.25em] text-foreground uppercase transition-all duration-700 md:text-xs"
                                    style={{
                                        letterSpacing: isHovered
                                            ? '0.3em'
                                            : '0.25em',
                                        transitionTimingFunction:
                                            'cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                >
                                    Portfolio
                                </span>
                            </div>

                            {/* Profile Picture */}
                            {portfolio.profilePicture && (
                                <motion.div
                                    className="mb-6"
                                    style={{
                                        transform: isHovered
                                            ? 'scale(1.05)'
                                            : 'scale(1)',
                                        transition:
                                            'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                >
                                    <img
                                        src={`/storage/${portfolio.profilePicture}`}
                                        alt={portfolio.name}
                                        className="h-20 w-20 rounded-full object-cover md:h-24 md:w-24"
                                    />
                                </motion.div>
                            )}

                            {/* Name - responsive text sizes */}
                            <h1 className="relative mb-2">
                                <span
                                    className="block text-4xl font-normal tracking-tight text-foreground transition-all duration-700 sm:text-5xl md:text-5xl lg:text-6xl"
                                    style={{
                                        transform: isHovered
                                            ? 'translateY(-2px)'
                                            : 'translateY(0)',
                                        transitionTimingFunction:
                                            'cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                >
                                    {portfolio.name}
                                </span>
                            </h1>

                            {/* Role */}
                            <p
                                className="mb-6 text-lg font-medium text-muted-foreground transition-all duration-700"
                                style={{
                                    opacity: isHovered ? 1 : 0.7,
                                    transform: isHovered
                                        ? 'translateX(4px)'
                                        : 'translateX(0)',
                                    transitionTimingFunction:
                                        'cubic-bezier(0.16, 1, 0.3, 1)',
                                }}
                            >
                                {role}
                            </p>

                            {/* Description */}
                            {portfolio.description && (
                                <p
                                    className="mt-6 max-w-[360px] text-sm leading-relaxed transition-all duration-700 md:mt-8 md:max-w-[320px] md:text-base lg:mt-10 lg:max-w-[360px]"
                                    style={{
                                        color: isHovered
                                            ? 'hsl(var(--muted-foreground))'
                                            : 'hsl(var(--muted-foreground) / 0.6)',
                                        transform: isHovered
                                            ? 'translateY(-4px)'
                                            : 'translateY(0)',
                                        transitionTimingFunction:
                                            'cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                >
                                    {portfolio.description}
                                </p>
                            )}

                            {/* Skills Tags */}
                            {portfolio.skills.length > 0 && (
                                <div
                                    className="mt-6 flex flex-wrap justify-center gap-2 md:mt-8 md:justify-start"
                                    style={{
                                        opacity: isHovered ? 1 : 0.8,
                                        transform: isHovered
                                            ? 'translateY(0)'
                                            : 'translateY(4px)',
                                        transition:
                                            'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                >
                                    {portfolio.skills
                                        .slice(0, 4)
                                        .map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                </div>
                            )}

                            {/* Visit Website CTA */}
                            {portfolio.websiteUrl && (
                                <a
                                    href={portfolio.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 flex items-center gap-4 md:mt-8 lg:mt-10"
                                >
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 md:h-11 md:w-11 lg:h-12 lg:w-12"
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
                                                ? 'scale(1.05)'
                                                : 'scale(1)',
                                            boxShadow: isHovered
                                                ? '0 8px 32px hsl(var(--foreground) / 0.15)'
                                                : '0 0 0 transparent',
                                            transitionTimingFunction:
                                                'cubic-bezier(0.16, 1, 0.3, 1)',
                                        }}
                                    >
                                        <ArrowUpRight
                                            className="h-3.5 w-3.5 transition-transform duration-500 md:h-4 md:w-4"
                                            style={{
                                                transform: isHovered
                                                    ? 'rotate(45deg)'
                                                    : 'rotate(0deg)',
                                                transitionTimingFunction:
                                                    'cubic-bezier(0.16, 1, 0.3, 1)',
                                            }}
                                        />
                                    </div>
                                    <span
                                        className="text-[10px] font-medium tracking-widest uppercase transition-all duration-700 md:text-xs"
                                        style={{
                                            opacity: isHovered ? 1 : 0.5,
                                            transform: isHovered
                                                ? 'translateX(0)'
                                                : 'translateX(-8px)',
                                            transitionTimingFunction:
                                                'cubic-bezier(0.16, 1, 0.3, 1)',
                                            transitionDelay: isHovered
                                                ? '100ms'
                                                : '0ms',
                                        }}
                                    >
                                        Visit Site
                                    </span>
                                </a>
                            )}

                            {/* Image Toggle Buttons - Three Options */}
                            {portfolio.mobileImage && (
                                <div className="mt-8 flex gap-1.5 rounded-lg bg-muted/50 p-1">
                                    <button
                                        onClick={() => setActiveImage('both')}
                                        className={`rounded-md px-4 py-2 text-xs font-medium tracking-wider uppercase transition-all duration-300 ${
                                            activeImage === 'both'
                                                ? 'bg-foreground text-background shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Both
                                    </button>
                                    <button
                                        onClick={() =>
                                            setActiveImage('desktop')
                                        }
                                        className={`rounded-md px-4 py-2 text-xs font-medium tracking-wider uppercase transition-all duration-300 ${
                                            activeImage === 'desktop'
                                                ? 'bg-foreground text-background shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Desktop
                                    </button>
                                    <button
                                        onClick={() => setActiveImage('mobile')}
                                        className={`rounded-md px-4 py-2 text-xs font-medium tracking-wider uppercase transition-all duration-300 ${
                                            activeImage === 'mobile'
                                                ? 'bg-foreground text-background shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Mobile
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right: Portfolio Screenshot Block */}
                        <div
                            className="relative transition-all duration-700"
                            style={{
                                transform: isHovered
                                    ? 'translateX(4px) translateY(-4px)'
                                    : 'translateX(0) translateY(0)',
                                transitionTimingFunction:
                                    'cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                        >
                            {/* Frame outline */}
                            <div
                                className="absolute -inset-3 border transition-all duration-700 md:-inset-4"
                                style={{
                                    borderColor: isHovered
                                        ? 'hsl(var(--foreground) / 0.15)'
                                        : 'transparent',
                                    transform: isHovered
                                        ? 'scale(1.01)'
                                        : 'scale(1)',
                                    transitionTimingFunction:
                                        'cubic-bezier(0.16, 1, 0.3, 1)',
                                }}
                            />

                            {/* Image container - responsive sizing with support for both/desktop/mobile */}
                            {activeImage === 'both' ? (
                                /* Both Images Side by Side */
                                <div className="flex gap-4 md:gap-6">
                                    {/* Desktop Image */}
                                    <div className="relative flex-1">
                                        <div
                                            className="absolute -inset-1 transition-all duration-700"
                                            style={{
                                                boxShadow: isHovered
                                                    ? '0 24px 64px hsl(var(--foreground) / 0.1)'
                                                    : '0 0 0 transparent',
                                                transitionTimingFunction:
                                                    'cubic-bezier(0.16, 1, 0.3, 1)',
                                            }}
                                        />
                                        <div className="relative h-[280px] w-full overflow-hidden sm:h-[320px] md:h-[360px] lg:h-[420px]">
                                            <img
                                                src={`/storage/${portfolio.desktopImage}`}
                                                alt={`${portfolio.name}'s portfolio - Desktop`}
                                                className="h-full w-full object-contain transition-all duration-1000"
                                                style={{
                                                    transform: isHovered
                                                        ? 'scale(1.03)'
                                                        : 'scale(1)',
                                                    transitionTimingFunction:
                                                        'cubic-bezier(0.16, 1, 0.3, 1)',
                                                }}
                                            />
                                            <div
                                                className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent transition-opacity duration-700"
                                                style={{
                                                    opacity: isHovered ? 1 : 0,
                                                    transitionTimingFunction:
                                                        'cubic-bezier(0.16, 1, 0.3, 1)',
                                                }}
                                            />
                                        </div>
                                        <span className="mt-2 block text-center text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                            Desktop
                                        </span>
                                    </div>

                                    {/* Mobile Image */}
                                    {portfolio.mobileImage && (
                                        <div className="relative w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]">
                                            <div
                                                className="absolute -inset-1 transition-all duration-700"
                                                style={{
                                                    boxShadow: isHovered
                                                        ? '0 24px 64px hsl(var(--foreground) / 0.1)'
                                                        : '0 0 0 transparent',
                                                    transitionTimingFunction:
                                                        'cubic-bezier(0.16, 1, 0.3, 1)',
                                                }}
                                            />
                                            <div className="relative h-[280px] w-full overflow-hidden sm:h-[320px] md:h-[360px] lg:h-[420px]">
                                                <img
                                                    src={`/storage/${portfolio.mobileImage}`}
                                                    alt={`${portfolio.name}'s portfolio - Mobile`}
                                                    className="h-full w-full object-contain transition-all duration-1000"
                                                    style={{
                                                        transform: isHovered
                                                            ? 'scale(1.03)'
                                                            : 'scale(1)',
                                                        transitionTimingFunction:
                                                            'cubic-bezier(0.16, 1, 0.3, 1)',
                                                    }}
                                                />
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent transition-opacity duration-700"
                                                    style={{
                                                        opacity: isHovered
                                                            ? 1
                                                            : 0,
                                                        transitionTimingFunction:
                                                            'cubic-bezier(0.16, 1, 0.3, 1)',
                                                    }}
                                                />
                                            </div>
                                            <span className="mt-2 block text-center text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                                Mobile
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Single Image View */
                                <div
                                    className={`relative overflow-hidden ${
                                        activeImage === 'mobile'
                                            ? 'h-[420px] w-[220px] sm:h-[480px] sm:w-[260px] md:h-[540px] md:w-[300px]'
                                            : 'h-[280px] w-[360px] sm:h-[340px] sm:w-[440px] md:h-[400px] md:w-[520px] lg:h-[460px] lg:w-[600px]'
                                    }`}
                                >
                                    <div
                                        className="absolute -inset-1 transition-all duration-700"
                                        style={{
                                            boxShadow: isHovered
                                                ? '0 24px 64px hsl(var(--foreground) / 0.1)'
                                                : '0 0 0 transparent',
                                            transitionTimingFunction:
                                                'cubic-bezier(0.16, 1, 0.3, 1)',
                                        }}
                                    />
                                    <img
                                        src={`/storage/${
                                            activeImage === 'mobile' &&
                                            portfolio.mobileImage
                                                ? portfolio.mobileImage
                                                : portfolio.desktopImage
                                        }`}
                                        alt={`${portfolio.name}'s portfolio - ${activeImage}`}
                                        className="h-full w-full object-contain transition-all duration-1000"
                                        style={{
                                            transform: isHovered
                                                ? 'scale(1.03)'
                                                : 'scale(1)',
                                            transitionTimingFunction:
                                                'cubic-bezier(0.16, 1, 0.3, 1)',
                                        }}
                                    />

                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent transition-opacity duration-700"
                                        style={{
                                            opacity: isHovered ? 1 : 0,
                                            transitionTimingFunction:
                                                'cubic-bezier(0.16, 1, 0.3, 1)',
                                        }}
                                    />

                                    {/* Corner accents */}
                                    <div
                                        className="absolute top-2 left-2 h-5 w-px bg-white/80 transition-all duration-500 md:top-3 md:left-3 md:h-6"
                                        style={{
                                            opacity: isHovered ? 1 : 0,
                                            transform: isHovered
                                                ? 'scaleY(1)'
                                                : 'scaleY(0)',
                                            transformOrigin: 'top',
                                            transitionTimingFunction:
                                                'cubic-bezier(0.16, 1, 0.3, 1)',
                                            transitionDelay: '50ms',
                                        }}
                                    />
                                    <div
                                        className="absolute top-2 left-2 h-px w-5 bg-white/80 transition-all duration-500 md:top-3 md:left-3 md:w-6"
                                        style={{
                                            opacity: isHovered ? 1 : 0,
                                            transform: isHovered
                                                ? 'scaleX(1)'
                                                : 'scaleX(0)',
                                            transformOrigin: 'left',
                                            transitionTimingFunction:
                                                'cubic-bezier(0.16, 1, 0.3, 1)',
                                            transitionDelay: '100ms',
                                        }}
                                    />
                                    <div
                                        className="absolute right-2 bottom-2 h-5 w-px bg-white/80 transition-all duration-500 md:right-3 md:bottom-3 md:h-6"
                                        style={{
                                            opacity: isHovered ? 1 : 0,
                                            transform: isHovered
                                                ? 'scaleY(1)'
                                                : 'scaleY(0)',
                                            transformOrigin: 'bottom',
                                            transitionTimingFunction:
                                                'cubic-bezier(0.16, 1, 0.3, 1)',
                                            transitionDelay: '150ms',
                                        }}
                                    />
                                    <div
                                        className="absolute right-2 bottom-2 h-px w-5 bg-white/80 transition-all duration-500 md:right-3 md:bottom-3 md:w-6"
                                        style={{
                                            opacity: isHovered ? 1 : 0,
                                            transform: isHovered
                                                ? 'scaleX(1)'
                                                : 'scaleX(0)',
                                            transformOrigin: 'right',
                                            transitionTimingFunction:
                                                'cubic-bezier(0.16, 1, 0.3, 1)',
                                            transitionDelay: '200ms',
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional Details Section */}
                    <div className="mx-auto mt-24 max-w-6xl">
                        <div className="grid gap-8 md:gap-12 lg:grid-cols-3">
                            {/* Tech Stack */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-4"
                            >
                                <h3 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                                    Tech Stack
                                </h3>
                                {portfolio.techStack.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {portfolio.techStack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="rounded-md bg-muted px-3 py-1.5 text-sm font-medium text-foreground"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No tech stack listed
                                    </p>
                                )}
                            </motion.div>

                            {/* All Skills */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-4"
                            >
                                <h3 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                                    Skills
                                </h3>
                                {portfolio.skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {portfolio.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-md bg-muted px-3 py-1.5 text-sm font-medium text-foreground"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No skills listed
                                    </p>
                                )}
                            </motion.div>

                            {/* Contact Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-4"
                            >
                                <h3 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                                    Connect
                                </h3>
                                <div className="space-y-2">
                                    <a
                                        href={`mailto:${portfolio.email}`}
                                        className="block text-sm text-foreground/80 transition-colors hover:text-foreground"
                                    >
                                        {portfolio.email}
                                    </a>
                                    {portfolio.websiteUrl && (
                                        <a
                                            href={portfolio.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-sm text-foreground/80 underline underline-offset-4 transition-colors hover:text-foreground"
                                        >
                                            Visit Website →
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Back to Observatory */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-16 text-center"
                    >
                        <Link
                            href="/observatory"
                            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            ← Back to Observatory
                        </Link>
                    </motion.div>
                </div>

                <Footerdemo />
            </div>
        </>
    );
}
