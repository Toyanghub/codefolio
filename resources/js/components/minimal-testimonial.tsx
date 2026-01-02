import { useState } from 'react';

const testimonials = [
    {
        quote: 'Codefolio helped me land my dream job! The portfolio builder made showcasing my projects effortless.',
        name: 'Sarah Chen',
        role: 'Full Stack Developer',
        image: 'https://images.unsplash.com/photo-1701615004837-40d8573b6652?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D',
    },
    {
        quote: "The best platform for developers to connect and grow. I've found amazing collaborators here!",
        name: 'Marcus Johnson',
        role: 'UI/UX Designer',
        image: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D',
    },
    {
        quote: 'Codefolio helped me land my dream job! The portfolio builder made showcasing my projects effortless.',
        name: 'Sarah Chen',
        role: 'Full Stack Developer',
        image: 'https://images.unsplash.com/photo-1701615004837-40d8573b6652?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D',
    },
    {
        quote: "The best platform for developers to connect and grow. I've found amazing collaborators here!",
        name: 'Marcus Johnson',
        role: 'UI/UX Designer',
        image: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D',
    },
    {
        quote: 'Codefolio helped me land my dream job! The portfolio builder made showcasing my projects effortless.',
        name: 'Sarah Chen',
        role: 'Full Stack Developer',
        image: 'https://images.unsplash.com/photo-1701615004837-40d8573b6652?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D',
    },
    {
        quote: "The best platform for developers to connect and grow. I've found amazing collaborators here!",
        name: 'Marcus Johnson',
        role: 'UI/UX Designer',
        image: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D',
    },
    {
        quote: 'Codefolio helped me land my dream job! The portfolio builder made showcasing my projects effortless.',
        name: 'Sarah Chen',
        role: 'Full Stack Developer',
        image: 'https://images.unsplash.com/photo-1701615004837-40d8573b6652?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D',
    },
    {
        quote: "The best platform for developers to connect and grow. I've found amazing collaborators here!",
        name: 'Marcus Johnson',
        role: 'UI/UX Designer',
        image: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D',
    },
    {
        quote: 'Codefolio helped me land my dream job! The portfolio builder made showcasing my projects effortless.',
        name: 'Sarah Chen',
        role: 'Full Stack Developer',
        image: 'https://images.unsplash.com/photo-1701615004837-40d8573b6652?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D',
    },
    {
        quote: "The best platform for developers to connect and grow. I've found amazing collaborators here!",
        name: 'Marcus Johnson',
        role: 'UI/UX Designer',
        image: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D',
    },
];

export function TestimonialsMinimal() {
    const [active, setActive] = useState(0);

    return (
        <div className="mx-auto w-full max-w-xl px-6 py-16">
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
