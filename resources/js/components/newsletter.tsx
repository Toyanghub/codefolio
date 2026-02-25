import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{
        text: string;
        type: 'success' | 'error';
    } | null>(null);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage({
                text: 'Please enter a valid email address',
                type: 'error',
            });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        router.post(
            '/newsletter/subscribe',
            { email },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setMessage({
                        text: 'Thank you for subscribing! Check your email for confirmation.',
                        type: 'success',
                    });
                    setEmail('');
                },
                onError: (errors) => {
                    setMessage({
                        text:
                            errors.email ||
                            'Something went wrong. Please try again.',
                        type: 'error',
                    });
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            },
        );
    };

    return (
        <div className="flex w-full flex-col items-center justify-center bg-white py-16 text-center md:py-24 dark:bg-zinc-950">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <p className="font-medium text-zinc-600 dark:text-zinc-400">
                    Stay Updated
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
                    Subscribe to our newsletter
                </h2>
                <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                    Get the latest updates, news, and exclusive content
                    delivered to your inbox
                </p>
                <form
                    onSubmit={handleSubscribe}
                    className="mx-auto mt-10 w-full max-w-md space-y-4"
                >
                    {/* Mobile: Stacked Layout, Desktop: Side-by-side Layout */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0">
                        {/* Email Input - Full width on mobile, flexible on desktop */}
                        <div className="relative w-full sm:flex-1">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="h-12 w-full rounded-full border-2 border-zinc-200 bg-white px-5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:rounded-l-full sm:rounded-r-none sm:border-r-0 sm:px-6 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-100"
                                placeholder="Enter your email address"
                            />
                        </div>

                        {/* Subscribe Button - Full width on mobile, auto width on desktop */}
                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="flex h-12 w-full items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:w-auto sm:rounded-l-none sm:rounded-r-full sm:px-8 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                            {isLoading ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </div>

                    {/* Message Display */}
                    {message && (
                        <p
                            className={cn(
                                'text-sm font-medium',
                                message.type === 'success'
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400',
                            )}
                        >
                            {message.text}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
