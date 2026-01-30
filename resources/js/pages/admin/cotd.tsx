import { DeletePortfolioDialog } from '@/components/admin/delete-portfolio-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    ExternalLink,
    Search,
    Star,
    StarOff,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/cotd',
    },
    {
        title: 'COTD Management',
        href: '/admin/cotd',
    },
];

interface Portfolio {
    id: number;
    name: string;
    email: string;
    profile_picture: string | null;
    portfolio_desktop_image: string;
    portfolio_mobile_image: string | null;
    website_url: string | null;
    portfolio_description: string | null;
    is_featured: boolean;
    featured_at: string | null;
    skills: string[];
    techStack: string[];
    professions: string[];
}

interface AdminCotdProps {
    portfolios: Portfolio[];
    search: string;
    filter: string;
}

export default function AdminCotd({
    portfolios,
    search: initialSearch,
    filter: initialFilter,
}: AdminCotdProps) {
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [processing, setProcessing] = useState<number | null>(null);
    const [activeFilter, setActiveFilter] = useState(initialFilter);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [portfolioToDelete, setPortfolioToDelete] =
        useState<Portfolio | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/cotd', {
            search: searchQuery,
            filter: activeFilter,
        });
    };

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        router.get('/admin/cotd', { search: searchQuery, filter });
    };

    const toggleFeatured = (portfolio: Portfolio) => {
        if (processing) return;

        setProcessing(portfolio.id);
        router.post(
            `/admin/cotd/${portfolio.id}/toggle`,
            {
                is_featured: !portfolio.is_featured,
            },
            {
                onFinish: () => setProcessing(null),
            },
        );
    };

    const handleDeleteClick = (portfolio: Portfolio) => {
        setPortfolioToDelete(portfolio);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!portfolioToDelete) return;

        setIsDeleting(true);
        router.delete(`/admin/cotd/${portfolioToDelete.id}`, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setPortfolioToDelete(null);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const featuredCount = portfolios.filter((p) => p.is_featured).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="COTD Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="mb-4">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                        Card of the Day Management
                    </h1>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        Select portfolios to feature on the Works page.{' '}
                        <span className="font-semibold">
                            {featuredCount} portfolio
                            {featuredCount !== 1 ? 's' : ''} currently featured
                        </span>
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        {[
                            {
                                value: 'all',
                                label: 'All Portfolios',
                                icon: '📚',
                            },
                            {
                                value: 'featured',
                                label: 'Currently Featured',
                                icon: '⭐',
                            },
                            {
                                value: 'not_featured',
                                label: 'Never Featured',
                                icon: '🆕',
                            },
                            {
                                value: 'recent',
                                label: 'Recently Featured',
                                icon: '🕐',
                            },
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => handleFilterChange(tab.value)}
                                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                                    activeFilter === tab.value
                                        ? 'bg-zinc-900 text-white shadow-md dark:bg-zinc-100 dark:text-zinc-900'
                                        : 'bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                                } border ${
                                    activeFilter === tab.value
                                        ? 'border-zinc-900 dark:border-zinc-100'
                                        : 'border-zinc-200 dark:border-zinc-700'
                                }`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Filter Info */}
                    <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                        {activeFilter === 'all' && (
                            <p>Showing all published portfolios</p>
                        )}
                        {activeFilter === 'featured' && (
                            <p>
                                Showing portfolios currently active as Card of
                                the Day
                            </p>
                        )}
                        {activeFilter === 'not_featured' && (
                            <p>
                                Showing portfolios that have never been featured
                                before
                            </p>
                        )}
                        {activeFilter === 'recent' && (
                            <p>
                                Showing portfolios featured within the last 30
                                days
                            </p>
                        )}
                    </div>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <Input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </form>

                {/* Portfolio Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {portfolios.map((portfolio) => (
                        <div
                            key={portfolio.id}
                            className={`group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md dark:bg-zinc-900 ${
                                portfolio.is_featured
                                    ? 'border-amber-400 ring-2 ring-amber-400/20 dark:border-amber-500 dark:ring-amber-500/20'
                                    : 'border-zinc-200 dark:border-zinc-800'
                            }`}
                        >
                            {/* Featured Badge */}
                            {portfolio.is_featured && (
                                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 shadow-lg">
                                    <Star className="h-3.5 w-3.5 fill-white text-white" />
                                    <span className="text-xs font-bold text-white">
                                        FEATURED
                                    </span>
                                </div>
                            )}

                            {/* Portfolio Image */}
                            <div className="relative h-40 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                {portfolio.portfolio_desktop_image && (
                                    <img
                                        src={`/storage/${portfolio.portfolio_desktop_image}`}
                                        alt={`${portfolio.name}'s portfolio`}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                )}
                            </div>

                            {/* Portfolio Info */}
                            <div className="p-4">
                                <div className="mb-3 flex items-center gap-3">
                                    {portfolio.profile_picture ? (
                                        <img
                                            src={`/storage/${portfolio.profile_picture}`}
                                            alt={portfolio.name}
                                            className="h-10 w-10 rounded-full ring-2 ring-zinc-200 dark:ring-zinc-700"
                                        />
                                    ) : (
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-600 ring-2 ring-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:ring-zinc-600">
                                            {portfolio.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                                            {portfolio.name}
                                        </h3>
                                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                            {portfolio.professions[0] ||
                                                'Developer'}
                                        </p>
                                    </div>
                                </div>

                                <p className="mb-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    {portfolio.portfolio_description ||
                                        'No description provided'}
                                </p>

                                {/* Tech Stack */}
                                {portfolio.techStack.length > 0 && (
                                    <div className="mb-3 flex flex-wrap gap-1.5">
                                        {portfolio.techStack
                                            .slice(0, 3)
                                            .map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        {portfolio.techStack.length > 3 && (
                                            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                +
                                                {portfolio.techStack.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Featured Date */}
                                {portfolio.is_featured &&
                                    portfolio.featured_at && (
                                        <div className="mb-3 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>
                                                Featured:{' '}
                                                {new Date(
                                                    portfolio.featured_at,
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() =>
                                            toggleFeatured(portfolio)
                                        }
                                        disabled={processing === portfolio.id}
                                        variant={
                                            portfolio.is_featured
                                                ? 'outline'
                                                : 'default'
                                        }
                                        size="sm"
                                        className="flex-1"
                                    >
                                        {processing === portfolio.id ? (
                                            'Processing...'
                                        ) : portfolio.is_featured ? (
                                            <>
                                                <StarOff className="mr-1.5 h-4 w-4" />
                                                Unfeature
                                            </>
                                        ) : (
                                            <>
                                                <Star className="mr-1.5 h-4 w-4" />
                                                Feature
                                            </>
                                        )}
                                    </Button>
                                    <Link href={`/portfolio/${portfolio.id}`}>
                                        <Button variant="outline" size="sm">
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleDeleteClick(portfolio)
                                        }
                                        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {portfolios.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="mb-4 text-zinc-400 dark:text-zinc-600">
                            <svg
                                className="h-16 w-16"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                            No Portfolios Found
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {searchQuery
                                ? 'Try adjusting your search query'
                                : 'No published portfolios available yet'}
                        </p>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <DeletePortfolioDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={handleDeleteConfirm}
                    portfolioName={portfolioToDelete?.name || ''}
                    isDeleting={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
