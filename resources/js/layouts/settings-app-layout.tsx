import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface SettingsAppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children }: SettingsAppLayoutProps) => (
    <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-7xl">{children}</main>
    </div>
);
