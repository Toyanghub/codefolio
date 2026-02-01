import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Mail } from 'lucide-react';
import { motion } from 'motion/react';

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

export default function AdminContacts({
    messages,
}: {
    messages: PaginatedMessages;
}) {
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

    return (
        <>
            <Head title="Contact Messages - Admin" />
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
                {/* Header */}
                <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Site
                                </Link>
                                <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
                                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                    Contact Messages
                                </h1>
                            </div>
                            <Link
                                href="/admin/cotd"
                                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                            >
                                COTD Admin
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Stats */}
                    <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
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
                    </div>

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
                        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <Mail className="mx-auto h-12 w-12 text-zinc-400" />
                            <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
                                No messages yet
                            </h3>
                            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                Contact messages will appear here once users
                                submit the contact form.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
