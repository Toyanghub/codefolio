import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface SettingsAppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children }: SettingsAppLayoutProps) => (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">{children}</main>
    </div>
);
