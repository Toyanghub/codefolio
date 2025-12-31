import Navbar from '@/components/navbar';
import { Footerdemo } from '@/components/ui/footer-section';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface SettingsAppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children }: SettingsAppLayoutProps) => (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">{children}</main>
        <Footerdemo />
    </div>
);
