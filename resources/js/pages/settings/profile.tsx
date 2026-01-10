import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, router, usePage } from '@inertiajs/react';
import { Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import SettingsAppLayout from '@/layouts/settings-app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
    profile_picture,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    profile_picture?: string | null;
}) {
    const { auth } = usePage<SharedData>().props;
    const [profilePicturePreview, setProfilePicturePreview] = useState<
        string | null
    >(null);
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
        null,
    );
    const [processingPicture, setProcessingPicture] = useState(false);
    const [pictureError, setPictureError] = useState<string>('');
    const profilePictureInputRef = useRef<HTMLInputElement>(null);

    const handleProfilePictureClick = () => {
        profilePictureInputRef.current?.click();
    };

    const handleProfilePictureChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setPictureError('Please select an image file');
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            setPictureError('Image must be less than 2MB');
            return;
        }

        setPictureError('');
        setProfilePictureFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePicturePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleProfilePictureUpload = () => {
        if (!profilePictureFile) return;

        setProcessingPicture(true);
        const formData = new FormData();
        formData.append('profile_picture', profilePictureFile);

        router.post('/settings/profile/picture', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setProfilePictureFile(null);
                setProfilePicturePreview(null);
                setProcessingPicture(false);
                if (profilePictureInputRef.current) {
                    profilePictureInputRef.current.value = '';
                }
            },
            onError: (errors) => {
                setProcessingPicture(false);
                setPictureError(
                    errors.profile_picture || 'Failed to upload image',
                );
            },
        });
    };

    const handleProfilePictureDelete = () => {
        if (!confirm('Are you sure you want to delete your profile picture?'))
            return;

        setProcessingPicture(true);
        router.delete('/settings/profile/picture', {
            preserveScroll: true,
            onSuccess: () => {
                setProfilePicturePreview(null);
                setProfilePictureFile(null);
                setProcessingPicture(false);
                if (profilePictureInputRef.current) {
                    profilePictureInputRef.current.value = '';
                }
            },
            onError: () => {
                setProcessingPicture(false);
            },
        });
    };

    const cancelProfilePicturePreview = () => {
        setProfilePictureFile(null);
        setProfilePicturePreview(null);
        setPictureError('');
        if (profilePictureInputRef.current) {
            profilePictureInputRef.current.value = '';
        }
    };

    return (
        <SettingsAppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">
                            Profile Information
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Update your profile picture, name and email address
                        </p>
                    </div>

                    {/* Profile Picture Upload Section */}
                    <div className="mb-8 space-y-4">
                        <div className="flex items-start gap-6">
                            {/* Profile Picture Preview */}
                            <div className="relative">
                                <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                                    {profilePicturePreview ||
                                    profile_picture ? (
                                        <img
                                            src={
                                                profilePicturePreview ||
                                                `/storage/${profile_picture}`
                                            }
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <span className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
                                                {auth.user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Upload Controls */}
                            <div className="flex-1 space-y-3">
                                <div className="flex flex-wrap items-center gap-3">
                                    <input
                                        ref={profilePictureInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        className="hidden"
                                    />

                                    {profilePictureFile ? (
                                        <>
                                            <Button
                                                type="button"
                                                onClick={
                                                    handleProfilePictureUpload
                                                }
                                                disabled={processingPicture}
                                                size="sm"
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                {processingPicture
                                                    ? 'Uploading...'
                                                    : 'Upload Picture'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={
                                                    cancelProfilePicturePreview
                                                }
                                                disabled={processingPicture}
                                                size="sm"
                                            >
                                                <X className="mr-2 h-4 w-4" />
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={
                                                    handleProfilePictureClick
                                                }
                                                disabled={processingPicture}
                                                size="sm"
                                            >
                                                Choose Picture
                                            </Button>
                                            {profile_picture && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={
                                                        handleProfilePictureDelete
                                                    }
                                                    disabled={processingPicture}
                                                    size="sm"
                                                >
                                                    <X className="mr-2 h-4 w-4" />
                                                    Remove Picture
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    JPG, PNG or GIF. Max size 2MB.
                                </p>
                                {pictureError && (
                                    <p className="text-sm text-red-600">
                                        {pictureError}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Your email address is
                                                unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Click here to resend the
                                                    verification email.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has
                                                    been sent to your email
                                                    address.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        Save
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            Saved
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <Separator className="my-8" />

                <DeleteUser />
            </SettingsLayout>
        </SettingsAppLayout>
    );
}
