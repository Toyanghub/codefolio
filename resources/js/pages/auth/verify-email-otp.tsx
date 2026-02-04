import { Head, useForm } from '@inertiajs/react';
import { Mail, RefreshCw } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

interface Props {
    remainingTime: number | null;
    canRequestOtp: boolean;
    rateLimitMessage: string | null;
}

export default function VerifyEmailOtp({
    remainingTime,
    canRequestOtp,
    rateLimitMessage,
}: Props) {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(remainingTime || 0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm({
            otp: '',
        });

    const resendForm = useForm({});

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
            setData('otp', newOtp.join(''));
            // Submit after a short delay to show complete code
            setTimeout(() => {
                post(route('verify-otp.verify'));
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
            setData('otp', pastedData);
            inputRefs.current[5]?.focus();

            // Auto-submit after paste
            setTimeout(() => {
                post(route('verify-otp.verify'));
            }, 100);
        }
    };

    const handleResend = () => {
        if (!canRequestOtp) {
            return;
        }

        resendForm.post(route('verify-otp.resend'), {
            onSuccess: () => {
                setTimeLeft(900); // Reset to 15 minutes
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            },
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length === 6) {
            setData('otp', otpCode);
            post(route('verify-otp.verify'));
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <>
            <Head title="Verify Email" />

            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                            <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
                            Verify Your Email
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            We've sent a 6-digit verification code to your email
                            address.
                        </p>
                    </div>

                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div>
                            <label className="mb-2 block text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                Enter Verification Code
                            </label>
                            <div className="flex justify-center gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) =>
                                            (inputRefs.current[index] = el)
                                        }
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) =>
                                            handleChange(index, e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            handleKeyDown(index, e)
                                        }
                                        onPaste={handlePaste}
                                        className="h-14 w-12 rounded-lg border-2 text-center text-2xl font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                        disabled={processing}
                                    />
                                ))}
                            </div>
                            {errors.otp && (
                                <p className="mt-2 text-center text-sm text-red-600 dark:text-red-400">
                                    {errors.otp}
                                </p>
                            )}
                        </div>

                        {timeLeft > 0 && (
                            <div className="text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Code expires in:{' '}
                                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                                        {formatTime(timeLeft)}
                                    </span>
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={
                                    processing || otp.some((d) => d === '')
                                }
                                className="flex w-full justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Verifying...' : 'Verify Email'}
                            </button>

                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={
                                    resendForm.processing || !canRequestOtp
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <RefreshCw className="h-4 w-4" />
                                {resendForm.processing
                                    ? 'Sending...'
                                    : 'Resend Code'}
                            </button>
                        </div>

                        {!canRequestOtp && rateLimitMessage && (
                            <p className="text-center text-sm text-amber-600 dark:text-amber-400">
                                {rateLimitMessage}
                            </p>
                        )}
                    </form>

                    <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Didn't receive the code? Check your spam folder or
                            request a new code.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
