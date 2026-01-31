import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAppearance } from '@/hooks/use-appearance';
import { Link, router } from '@inertiajs/react';
import {
    Facebook,
    Instagram,
    Linkedin,
    Moon,
    Send,
    Sun,
    Twitter,
} from 'lucide-react';
import * as React from 'react';

function Footerdemo() {
    const { appearance, updateAppearance } = useAppearance();
    const [isChatOpen, setIsChatOpen] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [message, setMessage] = React.useState<{
        text: string;
        type: 'success' | 'error' | 'info';
    } | null>(null);

    const isDarkMode =
        appearance === 'dark' ||
        (appearance === 'system' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches);

    const toggleDarkMode = (checked: boolean) => {
        updateAppearance(checked ? 'dark' : 'light');
    };

    const handleNewsletterSubmit = (e: React.FormEvent) => {
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
                        text: 'Thank you for subscribing! You\'ll receive our latest updates.',
                        type: 'success',
                    });
                    setEmail('');
                },
                onError: (errors) => {
                    setMessage({
                        text: errors.email || 'Something went wrong. Please try again.',
                        type: 'error',
                    });
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            }
        );
    };

    return (
        <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
            <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div className="relative">
                        <h2 className="mb-4 text-3xl font-bold tracking-tight">
                            Stay Connected
                        </h2>
                        <p className="mb-6 text-muted-foreground">
                            Join our newsletter for the latest updates and
                            exclusive offers.
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="relative">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="pr-12 backdrop-blur-sm selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-900"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isLoading || !email}
                                className="absolute top-1 right-1 h-8 w-8 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Subscribe</span>
                            </Button>
                        </form>
                        {message && (
                            <p
                                className={`mt-2 text-sm ${
                                    message.type === 'success'
                                        ? 'text-green-600 dark:text-green-400'
                                        : message.type === 'error'
                                        ? 'text-red-600 dark:text-red-400'
                                        : 'text-blue-600 dark:text-blue-400'
                                }`}
                            >
                                {message.text}
                            </p>
                        )}
                        <div className="absolute top-0 -right-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                    </div>
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">
                            Quick Links
                        </h3>
                        <nav className="space-y-2 text-sm">
                            <Link
                                href="/"
                                className="block transition-colors hover:text-primary"
                            >
                                Lobby
                            </Link>
                            <Link
                                href="/observatory"
                                className="block transition-colors hover:text-primary"
                            >
                                Observatory
                            </Link>
                            <Link
                                href="/works"
                                className="block transition-colors hover:text-primary"
                            >
                                Works
                            </Link>
                            <Link
                                href="/settings/profile"
                                className="block transition-colors hover:text-primary"
                            >
                                Settings
                            </Link>
                        </nav>
                    </div>
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">
                            Contact Us
                        </h3>
                        <address className="space-y-2 text-sm not-italic">
                            <p>123 Innovation Street</p>
                            <p>Tech City, TC 12345</p>
                            <p>Phone: (123) 456-7890</p>
                            <p>Email: hello@example.com</p>
                        </address>
                    </div>
                    <div className="relative">
                        <h3 className="mb-4 text-lg font-semibold">
                            Follow Us
                        </h3>
                        <div className="mb-6 flex space-x-4">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="rounded-full"
                                        >
                                            <Facebook className="h-4 w-4" />
                                            <span className="sr-only">
                                                Facebook
                                            </span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                                        <p>Follow us on Facebook</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="rounded-full"
                                        >
                                            <Twitter className="h-4 w-4" />
                                            <span className="sr-only">
                                                Twitter
                                            </span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                                        <p>Follow us on Twitter</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="rounded-full"
                                        >
                                            <Instagram className="h-4 w-4" />
                                            <span className="sr-only">
                                                Instagram
                                            </span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                                        <p>Follow us on Instagram</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="rounded-full"
                                        >
                                            <Linkedin className="h-4 w-4" />
                                            <span className="sr-only">
                                                LinkedIn
                                            </span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                                        <p>Connect with us on LinkedIn</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() =>
                                            toggleDarkMode(!isDarkMode)
                                        }
                                        className="group relative inline-flex h-10 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
                                        aria-label="Toggle theme"
                                    >
                                        <div className="relative h-5 w-5">
                                            <Sun className="absolute inset-0 h-5 w-5 scale-100 rotate-0 text-zinc-900 transition-all duration-300 dark:scale-0 dark:-rotate-90" />
                                            <Moon className="absolute inset-0 h-5 w-5 scale-0 rotate-90 text-zinc-100 transition-all duration-300 dark:scale-100 dark:rotate-0" />
                                        </div>
                                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                            {isDarkMode ? 'Dark' : 'Light'}
                                        </span>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                                    <p>
                                        Switch to{' '}
                                        {isDarkMode ? 'light' : 'dark'} mode
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
                    <p className="text-sm text-muted-foreground">
                        © 2024 Your Company. All rights reserved.
                    </p>
                    <nav className="flex gap-4 text-sm">
                        <Link
                            href="/privacy-policy"
                            className="transition-colors hover:text-primary"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms-of-service"
                            className="transition-colors hover:text-primary"
                        >
                            Terms of Service
                        </Link>
                        <a
                            href="#"
                            className="transition-colors hover:text-primary"
                        >
                            Cookie Settings
                        </a>
                    </nav>
                </div>
            </div>
        </footer>
    );
}

export { Footerdemo };
