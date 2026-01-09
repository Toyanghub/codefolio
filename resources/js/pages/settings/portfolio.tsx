import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

import SettingsAppLayout from '@/layouts/settings-app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Portfolio settings',
        href: '/settings/portfolio',
    },
];

export default function Portfolio() {
    const { auth } = usePage<SharedData>().props;

    return (
        <SettingsAppLayout breadcrumbs={breadcrumbs}>
            <Head title="Portfolio settings" />

            <SettingsLayout>
                <div>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">
                            Portfolio Settings
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage your portfolio content and preferences
                        </p>
                    </div>

                    {/* Placeholder content - you can add portfolio settings here later */}
                    <div className="rounded-lg border border-dashed p-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            Portfolio settings content will be added here
                        </p>
                    </div>
                </div>
            </SettingsLayout>
        </SettingsAppLayout>
    );
}
