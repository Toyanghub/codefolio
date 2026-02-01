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
        <div className="flex w-full flex-col items-center justify-center bg-white px-4 py-16 text-center md:py-24 dark:bg-zinc-950">
            <div className="mx-auto max-w-7xl">
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
                    className="mx-auto mt-10 flex w-full max-w-md flex-col items-center justify-center"
                >
                    <div className="flex h-14 w-full items-center justify-center rounded-full border-2 border-zinc-200 bg-white text-sm transition-all focus-within:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:border-zinc-100">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            className="h-full flex-1 rounded-full bg-transparent px-6 text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                            placeholder="Enter your email address"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="mr-1.5 flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                            {isLoading ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </div>
                    {message && (
                        <p
                            className={cn(
                                'mt-4 text-sm font-medium',
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
