import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Monitor, Smartphone, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import SettingsAppLayout from '@/layouts/settings-app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Portfolio settings',
        href: '/settings/portfolio',
    },
];

interface PortfolioProps {
    portfolio_desktop_image?: string | null;
    portfolio_mobile_image?: string | null;
}

export default function Portfolio({
    portfolio_desktop_image,
    portfolio_mobile_image,
}: PortfolioProps) {
    const { auth } = usePage<SharedData>().props;
    const [desktopPreview, setDesktopPreview] = useState<string | null>(null);
    const [mobilePreview, setMobilePreview] = useState<string | null>(null);
    const [desktopFile, setDesktopFile] = useState<File | null>(null);
    const [mobileFile, setMobileFile] = useState<File | null>(null);
    const [processingDesktop, setProcessingDesktop] = useState(false);
    const [processingMobile, setProcessingMobile] = useState(false);
    const [errors, setErrors] = useState<{ desktop?: string; mobile?: string }>(
        {},
    );

    const desktopInputRef = useRef<HTMLInputElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);

    const handleDesktopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    desktop: 'Image must be less than 2MB',
                }));
                return;
            }
            setDesktopFile(file);
            setDesktopPreview(URL.createObjectURL(file));
            setErrors((prev) => ({ ...prev, desktop: undefined }));
        }
    };

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    mobile: 'Image must be less than 2MB',
                }));
                return;
            }
            setMobileFile(file);
            setMobilePreview(URL.createObjectURL(file));
            setErrors((prev) => ({ ...prev, mobile: undefined }));
        }
    };

    const uploadDesktopImage = () => {
        if (!desktopFile) return;

        setProcessingDesktop(true);
        const formData = new FormData();
        formData.append('desktop_image', desktopFile);

        router.post('/settings/portfolio/desktop-image', formData, {
            onSuccess: () => {
                setDesktopFile(null);
                setDesktopPreview(null);
                if (desktopInputRef.current) {
                    desktopInputRef.current.value = '';
                }
            },
            onError: (errors) => {
                setErrors((prev) => ({
                    ...prev,
                    desktop: errors.desktop_image as string,
                }));
            },
            onFinish: () => setProcessingDesktop(false),
        });
    };

    const uploadMobileImage = () => {
        if (!mobileFile) return;

        setProcessingMobile(true);
        const formData = new FormData();
        formData.append('mobile_image', mobileFile);

        router.post('/settings/portfolio/mobile-image', formData, {
            onSuccess: () => {
                setMobileFile(null);
                setMobilePreview(null);
                if (mobileInputRef.current) {
                    mobileInputRef.current.value = '';
                }
            },
            onError: (errors) => {
                setErrors((prev) => ({
                    ...prev,
                    mobile: errors.mobile_image as string,
                }));
            },
            onFinish: () => setProcessingMobile(false),
        });
    };

    const deleteDesktopImage = () => {
        if (confirm('Are you sure you want to delete the desktop image?')) {
            router.delete('/settings/portfolio/desktop-image');
        }
    };

    const deleteMobileImage = () => {
        if (confirm('Are you sure you want to delete the mobile image?')) {
            router.delete('/settings/portfolio/mobile-image');
        }
    };

    return (
        <SettingsAppLayout breadcrumbs={breadcrumbs}>
            <Head title="Portfolio settings" />

            <SettingsLayout>
                <div>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">
                            Portfolio Screenshots
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Upload screenshots of your portfolio for desktop and
                            mobile views
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Desktop Image Upload */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Monitor className="h-5 w-5 text-muted-foreground" />
                                <Label className="text-base font-semibold">
                                    Desktop Version
                                </Label>
                            </div>

                            <div className="rounded-lg border p-6">
                                {portfolio_desktop_image && !desktopPreview ? (
                                    <div className="space-y-4">
                                        <div className="relative overflow-hidden rounded-lg border">
                                            <img
                                                src={`/storage/${portfolio_desktop_image}`}
                                                alt="Desktop portfolio"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    desktopInputRef.current?.click()
                                                }
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                Replace
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={deleteDesktopImage}
                                            >
                                                <X className="mr-2 h-4 w-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                ) : desktopPreview ? (
                                    <div className="space-y-4">
                                        <div className="relative overflow-hidden rounded-lg border">
                                            <img
                                                src={desktopPreview}
                                                alt="Preview"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={uploadDesktopImage}
                                                disabled={processingDesktop}
                                            >
                                                {processingDesktop
                                                    ? 'Uploading...'
                                                    : 'Upload Desktop Image'}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setDesktopPreview(null);
                                                    setDesktopFile(null);
                                                    if (
                                                        desktopInputRef.current
                                                    ) {
                                                        desktopInputRef.current.value =
                                                            '';
                                                    }
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors hover:border-primary"
                                        onClick={() =>
                                            desktopInputRef.current?.click()
                                        }
                                    >
                                        <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                                        <p className="text-sm font-medium">
                                            Click to upload desktop screenshot
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            PNG, JPG up to 2MB
                                        </p>
                                    </div>
                                )}

                                <input
                                    ref={desktopInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleDesktopChange}
                                    className="hidden"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.desktop}
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* Mobile Image Upload */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Smartphone className="h-5 w-5 text-muted-foreground" />
                                <Label className="text-base font-semibold">
                                    Mobile Version
                                </Label>
                            </div>

                            <div className="rounded-lg border p-6">
                                {portfolio_mobile_image && !mobilePreview ? (
                                    <div className="space-y-4">
                                        <div className="relative overflow-hidden rounded-lg border">
                                            <img
                                                src={`/storage/${portfolio_mobile_image}`}
                                                alt="Mobile portfolio"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    mobileInputRef.current?.click()
                                                }
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                Replace
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={deleteMobileImage}
                                            >
                                                <X className="mr-2 h-4 w-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                ) : mobilePreview ? (
                                    <div className="space-y-4">
                                        <div className="relative overflow-hidden rounded-lg border">
                                            <img
                                                src={mobilePreview}
                                                alt="Preview"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={uploadMobileImage}
                                                disabled={processingMobile}
                                            >
                                                {processingMobile
                                                    ? 'Uploading...'
                                                    : 'Upload Mobile Image'}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setMobilePreview(null);
                                                    setMobileFile(null);
                                                    if (
                                                        mobileInputRef.current
                                                    ) {
                                                        mobileInputRef.current.value =
                                                            '';
                                                    }
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors hover:border-primary"
                                        onClick={() =>
                                            mobileInputRef.current?.click()
                                        }
                                    >
                                        <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                                        <p className="text-sm font-medium">
                                            Click to upload mobile screenshot
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            PNG, JPG up to 2MB
                                        </p>
                                    </div>
                                )}

                                <input
                                    ref={mobileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleMobileChange}
                                    className="hidden"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.mobile}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </SettingsAppLayout>
    );
}
