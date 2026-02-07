import { useState } from 'react';

const testimonials = [
    {
        quote: 'I stopped explaining my skills—my portfolio explains them now.',
        name: 'Alex Rivera',
        role: 'Senior Frontend Engineer at Stripe',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    },
    {
        quote: 'Codefolio made my work impossible to ignore.',
        name: 'Maya Patel',
        role: 'Product Designer at Figma',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    },
    {
        quote: 'Codefolio made my skills visible without overcomplicating the process.',
        name: 'James Chen',
        role: 'Full Stack Developer at Vercel',
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&auto=format&fit=crop&q=80',
    },
    {
        quote: 'I uploaded my projects and let Codefolio do the talking.',
        name: 'Sophie Martinez',
        role: 'Backend Engineer at Shopify',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=80',
    },
    {
        quote: 'My skills finally have a proper stage.',
        name: 'David Kim',
        role: 'DevOps Engineer at GitHub',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    },
];

export function TestimonialsMinimal() {
    const [active, setActive] = useState(0);

    return (
        <div className="mx-auto w-full max-w-xl px-6 py-8">
            {/* Quote */}
            <div className="relative mb-12 min-h-[80px]">
                {testimonials.map((t, i) => (
                    <p
                        key={i}
                        className={`absolute inset-0 text-xl leading-relaxed font-light text-zinc-900 transition-all duration-500 ease-out md:text-2xl dark:text-zinc-100 ${
                            active === i
                                ? 'blur-0 translate-y-0 opacity-100'
                                : 'pointer-events-none translate-y-4 opacity-0 blur-sm'
                        } `}
                    >
                        "{t.quote}"
                    </p>
                ))}
            </div>

            {/* Author Row */}
            <div className="flex items-center gap-6">
                {/* Avatars */}
                <div className="flex -space-x-2">
                    {testimonials.map((t, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className={`relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white transition-all duration-300 ease-out dark:ring-zinc-900 ${active === i ? 'z-10 scale-110' : 'grayscale hover:scale-105 hover:grayscale-0'} `}
                        >
                            <img
                                src={t.image}
                                alt={t.name}
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}
                </div>

                {/* Divider */}
                <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700" />

                {/* Active Author Info */}
                <div className="relative min-h-[44px] flex-1">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className={`absolute inset-0 flex flex-col justify-center transition-all duration-400 ease-out ${active === i ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-2 opacity-0'} `}
                        >
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {t.name}
                            </span>
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                {t.role}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
