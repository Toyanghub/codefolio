import Navbar from '@/components/navbar';
import { Footerdemo } from '@/components/ui/footer-section';
import { resend, verify } from '@/routes/verify-otp';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Mail, RefreshCw, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

interface Props {
    remainingTime: number | null;
    canRequestOtp: boolean;
    rateLimitMessage: string | null;
    canRegister?: boolean;
}

export default function VerifyEmailOtp({
    remainingTime,
    canRequestOtp,
    rateLimitMessage,
    canRegister = true,
}: Props) {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(remainingTime || 0);
    const [resending, setResending] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { processing, errors } = useForm({
        otp: '',
    });

    // Get flash messages from Inertia
    const { props } = usePage<{
        flash?: { success?: string; error?: string };
    }>();
    const flashSuccess = props.flash?.success;
    const flashError = props.flash?.error;

    useEffect(() => {
        // Focus first input on mount
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        // Countdown timer
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => Math.max(0, prev - 1));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    const handleChange = (index: number, value: string) => {
        // Only allow digits
        const digit = value.replace(/\D/g, '').slice(-1);

        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);

        // Auto-focus next input
        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all 6 digits are entered
        if (newOtp.every((d) => d !== '') && newOtp.join('').length === 6) {
            // Submit after a short delay to show complete code
            setTimeout(() => {
                router.post(verify.url(), {
                    otp: newOtp.join(''),
                });
            }, 100);
        }
    };

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, 6);

        if (pastedData.length === 6) {
            const newOtp = pastedData.split('');
            setOtp(newOtp);
            inputRefs.current[5]?.focus();

            // Auto-submit after paste
            setTimeout(() => {
                router.post(verify.url(), {
                    otp: pastedData,
                });
            }, 100);
        }
    };

    const handleResend = () => {
        if (!canRequestOtp || resending) {
            return;
        }

        setResending(true);
        router.post(
            resend.url(),
            {},
            {
                onSuccess: () => {
                    setTimeLeft(900); // Reset to 15 minutes
                    setOtp(['', '', '', '', '', '']);
                    inputRefs.current[0]?.focus();
                    setResending(false);
                },
                onError: () => {
                    setResending(false);
                },
            },
        );
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length === 6) {
            router.post(verify.url(), {
                otp: otpCode,
            });
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <>
            <Head title="Verify Email - Codefolio" />

            <div className="min-h-screen bg-white dark:bg-zinc-950">
                {/* Navbar */}
                <Navbar canRegister={canRegister} />

                {/* Main Content */}
                <div className="flex items-center justify-center px-4 py-12 sm:py-16 md:py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-2xl"
                    >
                        {/* Header Section */}
                        <div className="mb-8 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 200,
                                    damping: 15,
                                    delay: 0.2,
                                }}
                                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900"
                            >
                                <ShieldCheck className="h-10 w-10 text-zinc-900 dark:text-zinc-100" />
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mb-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100"
                            >
                                Verify Your Email
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-base text-zinc-600 sm:text-lg dark:text-zinc-400"
                            >
                                We've sent a 6-digit verification code to your
                                email address.
                                <br />
                                Enter the code below to complete your
                                registration.
                            </motion.p>
                        </div>

                        {/* OTP Form Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
                        >
                            <form onSubmit={submit} className="space-y-6">
                                {/* OTP Input Section */}
                                <div>
                                    <label className="mb-4 block text-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                        Enter 6-Digit Code
                                    </label>
                                    <div className="flex justify-center gap-2 sm:gap-3">
                                        {otp.map((digit, index) => (
                                            <motion.input
                                                key={index}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{
                                                    delay: 0.6 + index * 0.05,
                                                    type: 'spring',
                                                    stiffness: 200,
                                                }}
                                                ref={(el) => {
                                                    inputRefs.current[index] =
                                                        el;
                                                }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) =>
                                                    handleChange(
                                                        index,
                                                        e.target.value,
                                                    )
                                                }
                                                onKeyDown={(e) =>
                                                    handleKeyDown(index, e)
                                                }
                                                onPaste={handlePaste}
                                                className="h-12 w-10 rounded-lg border-2 border-zinc-300 bg-white text-center text-xl font-bold text-zinc-900 transition-all focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900 focus:outline-none sm:h-14 sm:w-12 sm:text-2xl dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
                                                disabled={processing}
                                            />
                                        ))}
                                    </div>
                                    {/* Error Message */}
                                    {(errors.otp || flashError) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-3 rounded-lg bg-red-50 p-3 dark:bg-red-900/20"
                                        >
                                            <p className="text-center text-sm font-medium text-red-600 dark:text-red-400">
                                                {errors.otp || flashError}
                                            </p>
                                        </motion.div>
                                    )}

                                    {/* Success Message */}
                                    {flashSuccess && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/20"
                                        >
                                            <p className="text-center text-sm font-medium text-green-600 dark:text-green-400">
                                                {flashSuccess}
                                            </p>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Timer Display */}
                                {timeLeft > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center justify-center gap-2 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800"
                                    >
                                        <Mail className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                            Code expires in:{' '}
                                            <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                                                {formatTime(timeLeft)}
                                            </span>
                                        </p>
                                    </motion.div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-3">
                                    <button
                                        type="submit"
                                        disabled={
                                            processing ||
                                            otp.some((d) => d === '')
                                        }
                                        className="flex w-full justify-center rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-100"
                                    >
                                        {processing
                                            ? 'Verifying...'
                                            : 'Verify Email'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={resending || !canRequestOtp}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:focus:ring-zinc-100"
                                    >
                                        <RefreshCw
                                            className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`}
                                        />
                                        {resending
                                            ? 'Sending...'
                                            : 'Resend Code'}
                                    </button>
                                </div>

                                {/* Rate Limit Message */}
                                {!canRequestOtp && rateLimitMessage && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20"
                                    >
                                        <p className="text-center text-sm text-amber-700 dark:text-amber-400">
                                            {rateLimitMessage}
                                        </p>
                                    </motion.div>
                                )}
                            </form>

                            {/* Help Text */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9 }}
                                className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50"
                            >
                                <p className="text-center text-xs text-zinc-600 dark:text-zinc-400">
                                    <strong>Didn't receive the code?</strong>
                                    <br />
                                    Check your spam folder or click "Resend
                                    Code" to request a new verification code.
                                </p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Footer */}
                <Footerdemo />
            </div>
        </>
    );
}
