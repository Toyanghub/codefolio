import { Footerdemo } from '@/components/ui/footer-section';
import { login, logout, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

interface Portfolio {
    id: number;
    name: string;
    role: string;
    avatar: string;
    image: string;
    skills: string[];
    techStack: string[];
    isCotd?: boolean;
    description?: string;
    bio?: string;
    email?: string;
    website?: string;
    github?: string;
    projects?: {
        title: string;
        description: string;
        technologies: string[];
        image?: string;
    }[];
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
                                className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
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
    return (
        <>
            <Head title={`${portfolio.name} - Portfolio`} />

            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
                <Navbar canRegister={canRegister} />

                <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 p-8 dark:from-zinc-900 dark:to-zinc-800">
                            {/* COTD Badge */}
                            {portfolio.isCotd && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 200,
                                        delay: 0.2,
                                    }}
                                    className="absolute top-6 right-6"
                                >
                                    <div className="flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                                        <svg
                                            className="h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        COTD
                                    </div>
                                </motion.div>
                            )}

                            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                                {/* Avatar */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 200,
                                        delay: 0.3,
                                    }}
                                >
                                    <img
                                        src={portfolio.avatar}
                                        alt={portfolio.name}
                                        className={`h-32 w-32 rounded-full border-4 ${
                                            portfolio.isCotd
                                                ? 'border-amber-400 ring-4 ring-amber-400/20'
                                                : 'border-white dark:border-zinc-700'
                                        } shadow-xl`}
                                    />
                                </motion.div>

                                {/* Info */}
                                <div className="flex-1">
                                    <motion.h1
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-3xl font-bold text-zinc-900 dark:text-zinc-100"
                                    >
                                        {portfolio.name}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="mt-2 text-lg text-zinc-600 dark:text-zinc-400"
                                    >
                                        {portfolio.role}
                                    </motion.p>

                                    {/* Skills Tags */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="mt-4 flex flex-wrap gap-2"
                                    >
                                        {portfolio.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content Grid */}
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Left Column - Main Content */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Cover Image */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="overflow-hidden rounded-2xl"
                            >
                                <img
                                    src={portfolio.image}
                                    alt={`${portfolio.name}'s work`}
                                    className="h-80 w-full object-cover"
                                />
                            </motion.div>

                            {/* About Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900"
                            >
                                <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                    About
                                </h2>
                                <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                                    {portfolio.description ||
                                        portfolio.bio ||
                                        `${portfolio.name} is a talented ${portfolio.role} specializing in ${portfolio.skills.join(', ')}. With expertise in modern technologies and a passion for creating exceptional digital experiences, they bring creativity and technical excellence to every project.`}
                                </p>
                            </motion.div>

                            {/* Projects Section (if available) */}
                            {portfolio.projects &&
                                portfolio.projects.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.9 }}
                                        className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900"
                                    >
                                        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                            Featured Projects
                                        </h2>
                                        <div className="space-y-6">
                                            {portfolio.projects.map(
                                                (project, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{
                                                            opacity: 0,
                                                            x: -20,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            x: 0,
                                                        }}
                                                        transition={{
                                                            delay:
                                                                1 + idx * 0.1,
                                                        }}
                                                        className="border-b border-zinc-200 pb-6 last:border-0 last:pb-0 dark:border-zinc-800"
                                                    >
                                                        {project.image && (
                                                            <img
                                                                src={
                                                                    project.image
                                                                }
                                                                alt={
                                                                    project.title
                                                                }
                                                                className="mb-4 h-48 w-full rounded-lg object-cover"
                                                            />
                                                        )}
                                                        <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                                            {project.title}
                                                        </h3>
                                                        <p className="mb-3 text-zinc-600 dark:text-zinc-400">
                                                            {
                                                                project.description
                                                            }
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {project.technologies.map(
                                                                (tech) => (
                                                                    <span
                                                                        key={
                                                                            tech
                                                                        }
                                                                        className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                                                                    >
                                                                        {tech}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                ),
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6">
                            {/* Tech Stack */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900"
                            >
                                <h3 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                    Tech Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {portfolio.techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="rounded-full bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Contact Information */}
                            {(portfolio.email ||
                                portfolio.website ||
                                portfolio.github) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900"
                                >
                                    <h3 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                        Contact
                                    </h3>
                                    <div className="space-y-3">
                                        {portfolio.email && (
                                            <a
                                                href={`mailto:${portfolio.email}`}
                                                className="flex items-center gap-3 text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
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
                                                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-sm">
                                                    {portfolio.email}
                                                </span>
                                            </a>
                                        )}
                                        {portfolio.website && (
                                            <a
                                                href={portfolio.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
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
                                                    <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                </svg>
                                                <span className="text-sm">
                                                    Visit Website
                                                </span>
                                            </a>
                                        )}
                                        {portfolio.github && (
                                            <a
                                                href={portfolio.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                            >
                                                <svg
                                                    className="h-5 w-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                                <span className="text-sm">
                                                    GitHub Profile
                                                </span>
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Stats Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-6 dark:from-blue-950/20 dark:to-purple-950/20"
                            >
                                <h3 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                    Quick Stats
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-600 dark:text-zinc-400">
                                            Skills
                                        </span>
                                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                            {portfolio.skills.length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-600 dark:text-zinc-400">
                                            Technologies
                                        </span>
                                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                            {portfolio.techStack.length}
                                        </span>
                                    </div>
                                    {portfolio.projects && (
                                        <div className="flex justify-between">
                                            <span className="text-zinc-600 dark:text-zinc-400">
                                                Projects
                                            </span>
                                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                                {portfolio.projects.length}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Back Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                            >
                                <Link
                                    href="/observatory"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
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
                                        <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to Observatory
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <Footerdemo />
            </div>
        </>
    );
}
