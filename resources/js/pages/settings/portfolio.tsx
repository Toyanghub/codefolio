import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Monitor, Smartphone, Upload, Wand2, X } from 'lucide-react';
import { useRef, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    MultiSelect,
    type MultiSelectOption,
} from '@/components/ui/multi-select';
import { Textarea } from '@/components/ui/textarea';
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
    website_url?: string | null;
    portfolio_description?: string | null;
    availableSkills?: MultiSelectOption[];
    selectedSkills?: string[];
    availableTechStacks?: MultiSelectOption[];
    selectedTechStacks?: string[];
    availableProfessions?: MultiSelectOption[];
    selectedProfessions?: string[];
}

export default function Portfolio({
    portfolio_desktop_image,
    portfolio_mobile_image,
    website_url,
    portfolio_description,
    availableSkills = [],
    selectedSkills = [],
    availableTechStacks = [],
    selectedTechStacks = [],
    availableProfessions = [],
    selectedProfessions = [],
}: PortfolioProps) {
    const [desktopPreview, setDesktopPreview] = useState<string | null>(null);
    const [mobilePreview, setMobilePreview] = useState<string | null>(null);
    const [desktopFile, setDesktopFile] = useState<File | null>(null);
    const [mobileFile, setMobileFile] = useState<File | null>(null);
    const [processingDesktop, setProcessingDesktop] = useState(false);
    const [processingMobile, setProcessingMobile] = useState(false);
    const [generatingScreenshots, setGeneratingScreenshots] = useState(false);
    const [errors, setErrors] = useState<{ desktop?: string; mobile?: string }>(
        {},
    );

    const desktopInputRef = useRef<HTMLInputElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        patch,
        errors: formErrors,
    } = useForm({
        website_url: website_url || '',
        portfolio_description: portfolio_description || '',
    });

    const {
        data: skillsData,
        setData: setSkillsData,
        patch: patchSkills,
        errors: skillsErrors,
    } = useForm({
        skills: selectedSkills,
    });

    const {
        data: techStacksData,
        setData: setTechStacksData,
        patch: patchTechStacks,
        errors: techStacksErrors,
    } = useForm({
        tech_stacks: selectedTechStacks,
    });

    const {
        data: professionsData,
        setData: setProfessionsData,
        patch: patchProfessions,
        errors: professionsErrors,
    } = useForm({
        professions: selectedProfessions,
    });

    const [savingAll, setSavingAll] = useState(false);
    const [allSavedSuccessfully, setAllSavedSuccessfully] = useState(false);

    const handleSaveAll = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingAll(true);
        setAllSavedSuccessfully(false);

        let hasErrors = false;

        // Save all sections sequentially
        await new Promise<void>((resolve) => {
            patch('/settings/portfolio/website-url', {
                preserveScroll: true,
                onError: () => {
                    hasErrors = true;
                },
                onFinish: () => resolve(),
            });
        });

        await new Promise<void>((resolve) => {
            patch('/settings/portfolio/description', {
                preserveScroll: true,
                onError: () => {
                    hasErrors = true;
                },
                onFinish: () => resolve(),
            });
        });

        await new Promise<void>((resolve) => {
            patchSkills('/settings/portfolio/skills', {
                preserveScroll: true,
                onError: () => {
                    hasErrors = true;
                },
                onFinish: () => resolve(),
            });
        });

        await new Promise<void>((resolve) => {
            patchTechStacks('/settings/portfolio/tech-stacks', {
                preserveScroll: true,
                onError: () => {
                    hasErrors = true;
                },
                onFinish: () => resolve(),
            });
        });

        await new Promise<void>((resolve) => {
            patchProfessions('/settings/portfolio/professions', {
                preserveScroll: true,
                onError: () => {
                    hasErrors = true;
                },
                onFinish: () => resolve(),
            });
        });

        setSavingAll(false);
        
        // Only show success message if there were no errors
        if (!hasErrors) {
            setAllSavedSuccessfully(true);
            setTimeout(() => setAllSavedSuccessfully(false), 3000);
        }
    };

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

    const handleGenerateScreenshots = () => {
        if (!data.website_url) {
            setErrors((prev) => ({
                ...prev,
                desktop: 'Please enter a website URL first',
            }));
            return;
        }

        if (
            !confirm(
                'This will automatically generate screenshots from your website URL. This may take a few moments. Continue?',
            )
        ) {
            return;
        }

        setGeneratingScreenshots(true);
        router.post(
            '/settings/portfolio/generate-screenshots',
            {
                website_url: data.website_url,
            },
            {
                onSuccess: () => {
                    alert(
                        'Screenshot generation started! This may take 1-2 minutes. Refresh the page to see the results.',
                    );
                },
                onError: (errors) => {
                    setErrors((prev) => ({
                        ...prev,
                        desktop:
                            errors.website_url ||
                            'Failed to start screenshot generation',
                    }));
                },
                onFinish: () => {
                    setGeneratingScreenshots(false);
                },
            },
        );
    };

    return (
        <SettingsAppLayout breadcrumbs={breadcrumbs}>
            <Head title="Portfolio settings" />

            <SettingsLayout>
                <div>
                    {/* Portfolio Screenshots Section */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">
                            Portfolio Screenshots
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Upload screenshots manually or generate them
                            automatically from your portfolio URL
                        </p>

                        {/* Auto-Generate Button */}
                        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
                            <div className="flex items-start gap-3">
                                <Wand2 className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-500" />
                                <div className="flex-1">
                                    <h4 className="font-medium text-amber-900 dark:text-amber-100">
                                        Automatic Screenshot Generation
                                    </h4>
                                    <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                                        Have your portfolio URL? Click below to
                                        automatically generate desktop and
                                        mobile screenshots.
                                    </p>
                                    <Button
                                        onClick={handleGenerateScreenshots}
                                        disabled={
                                            !data.website_url ||
                                            generatingScreenshots
                                        }
                                        variant="default"
                                        size="sm"
                                        className="mt-3 bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700"
                                    >
                                        {generatingScreenshots ? (
                                            <>
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Wand2 className="mr-2 h-4 w-4" />
                                                Generate from URL
                                            </>
                                        )}
                                    </Button>
                                    {!data.website_url && (
                                        <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                                            💡 Enter your website URL in the
                                            Portfolio Link section below first
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
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

                    {/* Website URL Section */}
                    <div className="mt-8 space-y-4">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold">
                                Portfolio Link
                            </h3>
                            {/* <p className="mt-1 text-sm text-muted-foreground">
                                Enter the URL of your portfolio website
                            </p> */}
                        </div>

                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Input
                                    id="website_url"
                                    type="url"
                                    value={data.website_url}
                                    onChange={(e) =>
                                        setData('website_url', e.target.value)
                                    }
                                    placeholder="https://yourportfolio.com"
                                    className="max-w-xl"
                                />
                                <InputError
                                    className="mt-2"
                                    message={formErrors.website_url}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="mt-8 space-y-4">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold">
                                Description
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Write about your portfolio, projects, or
                                professional background
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Textarea
                                    id="portfolio_description"
                                    value={data.portfolio_description}
                                    onChange={(e) =>
                                        setData(
                                            'portfolio_description',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Write a description of your portfolio, projects, or professional background..."
                                    className="min-h-[150px] max-w-xl"
                                    maxLength={5000}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {data.portfolio_description.length}/5000
                                    characters
                                </p>
                                <InputError
                                    className="mt-2"
                                    message={formErrors.portfolio_description}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="mt-8 space-y-4">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold">Skills</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Select your skills and technologies from the
                                Observatory filters
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <MultiSelect
                                    options={availableSkills}
                                    selected={skillsData.skills}
                                    onChange={(skills) =>
                                        setSkillsData('skills', skills)
                                    }
                                    placeholder="Choose your skills..."
                                    className="max-w-xl"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Skills include technologies, tech stacks,
                                    and professions from Observatory
                                </p>
                                <InputError
                                    className="mt-2"
                                    message={skillsErrors.skills}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tech Stack Section */}
                    <div className="mt-8 space-y-4">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold">
                                Tech Stack
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Select the technologies and tools you use
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <MultiSelect
                                    options={availableTechStacks}
                                    selected={techStacksData.tech_stacks}
                                    onChange={(techStacks) =>
                                        setTechStacksData(
                                            'tech_stacks',
                                            techStacks,
                                        )
                                    }
                                    placeholder="Choose your tech stack..."
                                    className="max-w-xl"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Programming languages, frameworks, tools,
                                    and platforms
                                </p>
                                <InputError
                                    className="mt-2"
                                    message={techStacksErrors.tech_stacks}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Profession Section */}
                    <div className="mt-8 space-y-4">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold">
                                Profession
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Select your professional roles and titles
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <MultiSelect
                                    options={availableProfessions}
                                    selected={professionsData.professions}
                                    onChange={(professions) =>
                                        setProfessionsData(
                                            'professions',
                                            professions,
                                        )
                                    }
                                    placeholder="Choose your professions..."
                                    className="max-w-xl"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Your professional roles and job titles
                                </p>
                                <InputError
                                    className="mt-2"
                                    message={professionsErrors.professions}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save All Button */}
                    <div className="mt-8 border-t pt-6">
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={handleSaveAll}
                                disabled={savingAll}
                                size="lg"
                            >
                                {savingAll ? 'Saving All...' : 'Save All'}
                            </Button>
                            {allSavedSuccessfully && (
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                    All changes saved successfully!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </SettingsAppLayout>
    );
}
