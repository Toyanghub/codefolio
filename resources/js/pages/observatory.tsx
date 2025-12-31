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

// Sample portfolio data for Observatory
const observatoryPortfolios = [
    {
        id: 1,
        name: 'rizamb',
        role: 'Fullstack Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rizamb',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
        skills: ['Web', 'Fullstack'],
        techStack: ['JavaScript', 'React'],
        isCotd: true,
    },
    {
        id: 2,
        name: 'elliottprgrammer',
        role: 'Fullstack Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elliott',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
        skills: ['Web', 'Backend'],
        techStack: ['TypeScript', 'Node.js'],
    },
    {
        id: 3,
        name: 'Jammore123',
        role: 'Fullstack Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jammore',
        image: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=400&h=300&fit=crop',
        skills: ['Web', 'Mobile'],
        techStack: ['JavaScript', 'React'],
    },
    {
        id: 4,
        name: 'Deepak',
        role: 'Web Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=deepak',
        image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop',
        skills: ['Frontend', 'Web'],
        techStack: ['HTML', 'CSS'],
        isCotd: true,
    },
    {
        id: 5,
        name: 'samilanojeff98',
        role: 'Web Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=samilano',
        image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400&h=300&fit=crop',
        skills: ['Web', 'Fullstack'],
        techStack: ['React', 'TypeScript'],
    },
    {
        id: 6,
        name: 'elkoh',
        role: 'Fullstack Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elkoh',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
        skills: ['Backend', 'Fullstack'],
        techStack: ['Python', 'Django'],
    },
    {
        id: 7,
        name: 'JazzMase',
        role: 'Fullstack Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jazzmase',
        image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop',
        skills: ['Web', 'Data'],
        techStack: ['JavaScript', 'Node.js'],
        isCotd: true,
    },
    {
        id: 8,
        name: 'Dock',
        role: 'Frontend Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dock',
        image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop',
        skills: ['Frontend', 'Web'],
        techStack: ['React', 'CSS'],
    },
    {
        id: 9,
        name: 'quinchy',
        role: 'Fullstack Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=quinchy',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop',
        skills: ['Fullstack', 'Mobile'],
        techStack: ['JavaScript', 'React'],
    },
    {
        id: 10,
        name: 'klynesjido',
        role: 'Software Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=klynes',
        image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=300&fit=crop',
        skills: ['Software', 'Backend'],
        techStack: ['C++', 'Python'],
    },
];

const filterCategories = {
    skills: [
        'Web',
        'Frontend',
        'Backend',
        'Fullstack',
        'Mobile',
        'Data',
        'Software',
    ],
    techStack: [
        'JavaScript',
        'TypeScript',
        'React',
        'Node.js',
        'Python',
        'HTML',
        'CSS',
        'Django',
        'C++',
    ],
    profession: [
        'Fullstack Developer',
        'Frontend Developer',
        'Web Developer',
        'Software Developer',
    ],
};

export default function Observatory() {
    const [selectedFilters, setSelectedFilters] = useState<{
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

    const clearFilters = () => {
        setSelectedFilters({
            skills: [],
            techStack: [],
            profession: [],
        });
    };

    const filteredPortfolios = observatoryPortfolios.filter((portfolio) => {
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
            selectedFilters.profession.includes(portfolio.role);

        return skillMatch && techMatch && professionMatch;
    });

    return (
        <>
            <Head title="Observatory" />

            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
                <Navbar />

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                            Explore
                        </h1>
                        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                            Discover amazing portfolios from developers around
                            the world
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 lg:flex-row">
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 lg:hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
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
                                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Hide Filter
                        </button>

                        {/* Sidebar */}
                        <aside
                            className={`${
                                sidebarOpen ? 'block' : 'hidden'
                            } w-full space-y-6 lg:block lg:w-64`}
                        >
                            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                        Filters
                                    </h2>
                                    {(selectedFilters.skills.length > 0 ||
                                        selectedFilters.techStack.length > 0 ||
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
                                        onClick={() => toggleDropdown('skills')}
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
                                            {filterCategories.skills.map(
                                                (skill) => (
                                                    <label
                                                        key={skill}
                                                        className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedFilters.skills.includes(
                                                                skill,
                                                            )}
                                                            onChange={() =>
                                                                toggleFilter(
                                                                    'skills',
                                                                    skill,
                                                                )
                                                            }
                                                            className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800"
                                                        />
                                                        {skill}
                                                    </label>
                                                ),
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
                                            {filterCategories.techStack.map(
                                                (tech) => (
                                                    <label
                                                        key={tech}
                                                        className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedFilters.techStack.includes(
                                                                tech,
                                                            )}
                                                            onChange={() =>
                                                                toggleFilter(
                                                                    'techStack',
                                                                    tech,
                                                                )
                                                            }
                                                            className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800"
                                                        />
                                                        {tech}
                                                    </label>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Profession Filter */}
                                <div>
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
                                            {filterCategories.profession.map(
                                                (profession) => (
                                                    <label
                                                        key={profession}
                                                        className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedFilters.profession.includes(
                                                                profession,
                                                            )}
                                                            onChange={() =>
                                                                toggleFilter(
                                                                    'profession',
                                                                    profession,
                                                                )
                                                            }
                                                            className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800"
                                                        />
                                                        {profession}
                                                    </label>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </aside>

                        {/* Portfolio Grid */}
                        <div className="flex-1">
                            <div className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                                Showing {filteredPortfolios.length} of{' '}
                                {observatoryPortfolios.length} portfolios
                            </div>

                            {filteredPortfolios.length === 0 ? (
                                <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                                    <div className="text-center">
                                        <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                                            No portfolios found
                                        </p>
                                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                            Try adjusting your filters
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                    {filteredPortfolios.map((portfolio) => (
                                        <Link
                                            key={portfolio.id}
                                            href={`/portfolio/${portfolio.id}`}
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className={`group cursor-pointer overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md dark:bg-zinc-900 ${
                                                    portfolio.isCotd
                                                        ? 'border-amber-400 ring-2 ring-amber-400/20 dark:border-amber-500 dark:ring-amber-500/20'
                                                        : 'border-zinc-200 dark:border-zinc-800'
                                                }`}
                                            >
                                                {/* Portfolio Image */}
                                                <div className="relative h-48 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                                    <img
                                                        src={portfolio.image}
                                                        alt={`${portfolio.name}'s portfolio`}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    {portfolio.isCotd && (
                                                        <div className="absolute top-3 right-3">
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
                                                    )}
                                                </div>

                                                {/* Portfolio Info */}
                                                <div className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={
                                                                portfolio.avatar
                                                            }
                                                            alt={portfolio.name}
                                                            className="h-10 w-10 rounded-full"
                                                        />
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                                                                {portfolio.name}
                                                            </h3>
                                                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                                {portfolio.role}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Footerdemo />
            </div>
        </>
    );
}
