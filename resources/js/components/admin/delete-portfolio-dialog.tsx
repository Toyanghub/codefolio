import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface DeletePortfolioDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    portfolioName: string;
    isDeleting: boolean;
}

export function DeletePortfolioDialog({
    open,
    onOpenChange,
    onConfirm,
    portfolioName,
    isDeleting,
}: DeletePortfolioDialogProps) {
    const [confirmText, setConfirmText] = useState('');
    const isConfirmed = confirmText === 'DELETE';

    const handleClose = () => {
        if (!isDeleting) {
            setConfirmText('');
            onOpenChange(false);
        }
    };

    const handleConfirm = () => {
        if (isConfirmed && !isDeleting) {
            onConfirm();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
                        </div>
                        <DialogTitle className="text-xl">
                            Delete Portfolio
                        </DialogTitle>
                    </div>
                    <DialogDescription className="space-y-3 text-left">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            You are about to permanently delete the portfolio
                            for:
                        </p>
                        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                                {portfolioName}
                            </p>
                        </div>
                        <div className="space-y-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800/50 dark:bg-red-900/10">
                            <p className="font-semibold text-red-900 dark:text-red-400">
                                ⚠️ Warning: This action cannot be undone!
                            </p>
                            <ul className="ml-4 list-disc space-y-1 text-sm text-red-800 dark:text-red-300">
                                <li>
                                    User account will be permanently deleted
                                </li>
                                <li>
                                    All portfolio data will be removed (images,
                                    description, etc.)
                                </li>
                                <li>
                                    Associated relationships will be cleared
                                </li>
                                <li>User will lose all access to their data</li>
                            </ul>
                        </div>
                        <div className="space-y-2 pt-2">
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                Type{' '}
                                <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-red-600 dark:bg-zinc-700 dark:text-red-400">
                                    DELETE
                                </span>{' '}
                                to confirm:
                            </p>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) =>
                                    setConfirmText(e.target.value.toUpperCase())
                                }
                                placeholder="Type DELETE"
                                disabled={isDeleting}
                                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm transition-colors placeholder:text-zinc-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                            />
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={!isConfirmed || isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Deleting...
                            </>
                        ) : (
                            'Delete Portfolio'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
