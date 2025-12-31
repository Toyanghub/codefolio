import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import { type BreadcrumbItem } from '@/types';

import SettingsAppLayout from '@/layouts/settings-app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: editAppearance().url,
    },
];

export default function Appearance() {
    return (
        <SettingsAppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">Appearance</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Customize how your account looks and feels
                        </p>
                    </div>
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </SettingsAppLayout>
    );
}
