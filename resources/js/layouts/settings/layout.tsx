import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn, isSameUrl, resolveUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { KeyRound, Palette, ShieldCheck, User } from 'lucide-react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: User,
    },
    {
        title: 'Password',
        href: editPassword(),
        icon: KeyRound,
    },
    {
        title: 'Two-Factor',
        href: show(),
        icon: ShieldCheck,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: Palette,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Settings
                </h1>
                <p className="mt-2 text-sm text-muted-foreground md:text-base">
                    Manage your profile and account settings
                </p>
            </div>

            {/* Navigation Tabs - Horizontal on desktop, scrollable on mobile */}
            <Card className="mb-8 overflow-hidden">
                <nav className="flex overflow-x-auto">
                    {sidebarNavItems.map((item, index) => {
                        const isActive = isSameUrl(currentPath, item.href);
                        return (
                            <Button
                                key={`${resolveUrl(item.href)}-${index}`}
                                variant="ghost"
                                asChild
                                className={cn(
                                    'relative min-w-[120px] flex-1 rounded-none border-b-2 border-transparent px-4 py-6 transition-all duration-200',
                                    {
                                        'border-primary bg-muted/50 font-semibold':
                                            isActive,
                                        'hover:bg-muted/50': !isActive,
                                    },
                                )}
                            >
                                <Link
                                    href={item.href}
                                    className="flex flex-col items-center gap-2"
                                >
                                    {item.icon && (
                                        <item.icon
                                            className={cn('h-5 w-5', {
                                                'text-primary': isActive,
                                                'text-muted-foreground':
                                                    !isActive,
                                            })}
                                        />
                                    )}
                                    <span className="text-sm whitespace-nowrap">
                                        {item.title}
                                    </span>
                                </Link>
                            </Button>
                        );
                    })}
                </nav>
            </Card>

            {/* Content Card */}
            <Card className="mx-auto max-w-3xl">
                <div className="p-6 md:p-8 lg:p-10">
                    <div className="space-y-8">{children}</div>
                </div>
            </Card>
        </div>
    );
}
