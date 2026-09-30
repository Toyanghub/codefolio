import { CommentSection } from '@/components/comments/CommentSection';
import Navbar from '@/components/navbar';
import { ReactionDisplay } from '@/components/reactions';
import { Footerdemo } from '@/components/ui/footer-section';
import { InfiniteTextMarquee } from '@/components/ui/infinite-text-marquee';
import { Head } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

interface Portfolio {
    id: number;
    name: string;
    email: string;
    profilePicture: string | null;
    desktopImage: string;
    mobileImage: string | null;
    description: string | null;
    websiteUrl: string | null;
    skills: string[];
    techStack: string[];
    professions: string[];
    createdAt: string;
    isFeatured?: boolean;
}

interface PageProps {
    portfolio: Portfolio;
    portfolioOwnerId: number;
    canRegister?: boolean;
}

export default function PortfolioDetail({
    portfolio,
    portfolioOwnerId,
    canRegister,
}: PageProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [activeImage, setActiveImage] = useState<
        'both' | 'desktop' | 'mobile'
    >('both');

    // Get profession/role for display
    const role =
        portfolio.professions.length > 0
            ? portfolio.professions[0]
            : 'Developer';

    return (
        <>
            <Head title={`${portfolio.name} - Portfolio`} />

            <div className="min-h-screen bg-background">
                <Navbar canRegister={canRegister} />

                {/* Featured Portfolio Marquee */}
                {!!portfolio.isFeatured && (
                    <div className="w-full overflow-hidden">
                        <div className="mx-auto max-w-7xl border-y border-amber-200 dark:border-amber-900/50">
                            <InfiniteTextMarquee
                                text="Featured   Portfolio   ★"
                                link={`/portfolio/${portfolio.id}`}
                                speed={40}
                                showTooltip={false}
                                fontSize="1.75rem"
                                textColor="rgb(217 119 6)"
                            />
                        </div>
                    </div>
                )}

                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Feature Spotlight Layout */}
                    <div
                        className="group relative flex cursor-pointer flex-col items-center gap-8 md:flex-row md:items-start md:gap-12 lg:gap-16"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Left: Portfolio Info Block */}
                        <div className="relative z-10 flex w-full max-w-[420px] shrink-0 flex-col items-center text-center md:w-[340px] md:items-start md:text-left lg:w-[400px] lg:pt-4">
                            {/* Label with animated line */}
                            <div className="mb-6 flex items-center gap-3 md:mb-8 md:gap-4">
                                <div
                                    className="h-px bg-foreground transition-all duration-700"
                                    style={{
                                        width: isHovered ? 48 : 32,
                                        transitionTimingFunction:
                                            'cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                />
                                <span
                                    className="text-[10px] font-medium tracking-[0.25em] text-foreground uppercase transition-all duration-700 md:text-xs"
                                    style={{
                                        letterSpacing: isHovered
                                            ? '0.3em'
                                            : '0.25em',
                                        transitionTimingFunction:
                                            'cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                >
                                    Portfolio
                                </span>
                            </div>

                            {/* Profile Picture */}
                            {portfolio.profilePicture && (
                                <div className="mb-6">
                                    <img
                                        src={`/storage/${portfolio.profilePicture}`}
                                        alt={portfolio.name}
                                        className="h-20 w-20 rounded-full object-cover md:h-24 md:w-24"
                                    />
                                </div>
                            )}

                            {/* Name - responsive text sizes */}
                            <h1 className="relative mb-2">
                                <span className="block text-4xl font-normal tracking-tight text-foreground transition-all duration-700 sm:text-5xl md:text-5xl lg:text-6xl">
                                    {portfolio.name}
                                </span>
                            </h1>

                            {/* Role */}
                            <p
                                className="mb-6 text-lg font-medium text-muted-foreground transition-all duration-700"
                                style={{
                                    opacity: isHovered ? 1 : 0.7,
                                    transitionTimingFunction:
                                        'cubic-bezier(0.16, 1, 0.3, 1)',
                                }}
                            >
                                {role}
                            </p>

                            {/* Description */}
                            {portfolio.description && (
                                <p
                                    className="mt-6 max-w-[360px] text-sm leading-relaxed transition-all duration-700 md:mt-8 md:max-w-[320px] md:text-base lg:mt-10 lg:max-w-[360px]"
                                    style={{
                                        color: isHovered
                                            ? 'hsl(var(--muted-foreground))'
                                            : 'hsl(var(--muted-foreground) / 0.6)',
                                        transitionTimingFunction:
                                            'cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                >
                                    {portfolio.description}
                                </p>
                            )}

                            {/* Skills Tags */}
                            {portfolio.skills.length > 0 && (
                                <div
                                    className="mt-6 flex flex-wrap justify-center gap-2 md:mt-8 md:justify-start"
                                    style={{
                                        opacity: isHovered ? 1 : 0.8,
                                        transition:
                                            'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                >
                                    {portfolio.skills
                                        .slice(0, 4)
                                        .map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                </div>
                            )}

                            <div className="mt-4">
                                <ReactionDisplay
                                    reactableType="portfolio"
                                    reactableId={portfolioOwnerId}
                                />
                            </div>

                            {/* Visit Website CTA */}
                            {portfolio.websiteUrl && (
                                <a
                                    href={portfolio.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 flex items-center gap-4 md:mt-8 lg:mt-10"
                                >
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 md:h-11 md:w-11 lg:h-12 lg:w-12"
                                        style={{
                                            borderColor: isHovered
                                                ? 'hsl(var(--foreground))'
                                                : 'hsl(var(--muted-foreground) / 0.3)',
                                            backgroundColor: isHovered
                                                ? 'hsl(var(--foreground))'
                                                : 'transparent',
                                            color: isHovered
                                                ? 'hsl(var(--background))'
                                                : 'hsl(var(--foreground))',
                                            boxShadow: isHovered
                                                ? '0 8px 32px hsl(var(--foreground) / 0.15)'
                                                : '0 0 0 transparent',
                                            transitionTimingFunction:
                                                'cubic-bezier(0.16, 1, 0.3, 1)',
                                        }}
                                    >
                                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 md:h-4 md:w-4" />
                                    </div>
                                    <span
                                        className="text-[10px] font-medium tracking-widest uppercase transition-all duration-700 md:text-xs"
                                        style={{
                                            opacity: isHovered ? 1 : 0.5,
                                            transitionTimingFunction:
                                                'cubic-bezier(0.16, 1, 0.3, 1)',
                                            transitionDelay: isHovered
                                                ? '100ms'
                                                : '0ms',
                                        }}
                                    >
                                        Visit Site
                                    </span>
                                </a>
                            )}

                            {/* Image Toggle Buttons - Three Options */}
                            {portfolio.mobileImage && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-8 flex gap-1.5 rounded-lg bg-muted/50 p-1"
                                >
                                    <button
                                        onClick={() => setActiveImage('both')}
                                        className={`rounded-md px-4 py-2 text-xs font-medium tracking-wider uppercase transition-all duration-300 ${
                                            activeImage === 'both'
                                                ? 'bg-foreground text-background shadow-sm'
                                                : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                                        }`}
                                    >
                                        Both
                                    </button>
                                    <button
                                        onClick={() =>
                                            setActiveImage('desktop')
                                        }
                                        className={`rounded-md px-4 py-2 text-xs font-medium tracking-wider uppercase transition-all duration-300 ${
                                            activeImage === 'desktop'
                                                ? 'bg-foreground text-background shadow-sm'
                                                : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                                        }`}
                                    >
                                        Desktop
                                    </button>
                                    <button
                                        onClick={() => setActiveImage('mobile')}
                                        className={`rounded-md px-4 py-2 text-xs font-medium tracking-wider uppercase transition-all duration-300 ${
                                            activeImage === 'mobile'
                                                ? 'bg-foreground text-background shadow-sm'
                                                : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                                        }`}
                                    >
                                        Mobile
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        {/* Right: Portfolio Screenshot Block */}
                        <div className="relative flex w-full items-center justify-center transition-all duration-700">
                            {/* Image container - responsive sizing with support for both/desktop/mobile */}
                            <AnimatePresence mode="wait">
                                {activeImage === 'both' ? (
                                    /* Both Images Side by Side */
                                    <motion.div
                                        key="both"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                            duration: 0.35,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                        className="flex gap-4 md:gap-6"
                                    >
                                        {/* Desktop Image */}
                                        <motion.div
                                            className="relative flex-1"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{
                                                duration: 0.35,
                                                delay: 0.1,
                                                ease: [0.16, 1, 0.3, 1],
                                            }}
                                        >
                                            <div className="relative h-[280px] w-full overflow-hidden rounded-lg sm:h-[320px] md:h-[360px] lg:h-[420px]">
                                                <img
                                                    src={`/storage/${portfolio.desktopImage}`}
                                                    alt={`${portfolio.name}'s portfolio - Desktop`}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                            <span className="mt-2 block text-center text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                                Desktop
                                            </span>
                                        </motion.div>

                                        {/* Mobile Image */}
                                        {portfolio.mobileImage && (
                                            <motion.div
                                                className="relative w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{
                                                    duration: 0.35,
                                                    delay: 0.15,
                                                    ease: [0.16, 1, 0.3, 1],
                                                }}
                                            >
                                                <div className="relative h-[280px] w-full overflow-hidden rounded-lg sm:h-[320px] md:h-[360px] lg:h-[420px]">
                                                    <img
                                                        src={`/storage/${portfolio.mobileImage}`}
                                                        alt={`${portfolio.name}'s portfolio - Mobile`}
                                                        className="h-full w-full object-contain"
                                                    />
                                                </div>
                                                <span className="mt-2 block text-center text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                                    Mobile
                                                </span>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ) : (
                                    /* Single Image View - Centered */
                                    <motion.div
                                        key={activeImage}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                            duration: 0.35,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                        className="flex items-center justify-center"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`relative overflow-hidden rounded-lg shadow-lg ${
                                                    activeImage === 'mobile'
                                                        ? 'h-[420px] w-[220px] sm:h-[480px] sm:w-[260px] md:h-[540px] md:w-[300px]'
                                                        : 'h-[280px] w-[360px] sm:h-[340px] sm:w-[440px] md:h-[400px] md:w-[520px] lg:h-[460px] lg:w-[600px]'
                                                }`}
                                            >
                                                <motion.img
                                                    src={`/storage/${
                                                        activeImage ===
                                                            'mobile' &&
                                                        portfolio.mobileImage
                                                            ? portfolio.mobileImage
                                                            : portfolio.desktopImage
                                                    }`}
                                                    alt={`${portfolio.name}'s portfolio - ${activeImage}`}
                                                    className="h-full w-full object-contain"
                                                    initial={{
                                                        opacity: 0,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                    }}
                                                    transition={{
                                                        duration: 0.4,
                                                        delay: 0.05,
                                                        ease: [0.16, 1, 0.3, 1],
                                                    }}
                                                />
                                            </div>
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{
                                                    duration: 0.3,
                                                    delay: 0.2,
                                                }}
                                                className="mt-3 block text-center text-xs font-medium tracking-wider text-muted-foreground uppercase"
                                            >
                                                {activeImage === 'mobile'
                                                    ? 'Mobile'
                                                    : 'Desktop'}{' '}
                                                View
                                            </motion.span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Additional Details Section */}
                    <div className="mx-auto mt-24 max-w-6xl">
                        <div className="grid gap-8 md:gap-12 lg:grid-cols-3">
                            {/* Tech Stack */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-4"
                            >
                                <h3 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                                    Tech Stack
                                </h3>
                                {portfolio.techStack.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {portfolio.techStack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="rounded-md bg-muted px-3 py-1.5 text-sm font-medium text-foreground"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No tech stack listed
                                    </p>
                                )}
                            </motion.div>

                            {/* All Skills */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-4"
                            >
                                <h3 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                                    Skills
                                </h3>
                                {portfolio.skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {portfolio.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-md bg-muted px-3 py-1.5 text-sm font-medium text-foreground"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No skills listed
                                    </p>
                                )}
                            </motion.div>

                            {/* Contact Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-4"
                            >
                                <h3 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                                    Connect
                                </h3>
                                <div className="space-y-2">
                                    <a
                                        href={`mailto:${portfolio.email}`}
                                        className="block text-sm text-foreground/80 transition-colors hover:text-foreground"
                                    >
                                        {portfolio.email}
                                    </a>
                                    {portfolio.websiteUrl && (
                                        <a
                                            href={portfolio.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-sm text-foreground/80 underline underline-offset-4 transition-colors hover:text-foreground"
                                        >
                                            Visit Website →
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Bottom Featured Portfolio Marquee (Reversed) */}
                    {!!portfolio.isFeatured && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-16 w-full overflow-hidden"
                        >
                            <div className="mx-auto max-w-7xl border-y border-amber-200 dark:border-amber-900/50">
                                <InfiniteTextMarquee
                                    text="Featured   Portfolio   ★"
                                    link={`/portfolio/${portfolio.id}`}
                                    speed={40}
                                    showTooltip={false}
                                    fontSize="1.75rem"
                                    textColor="rgb(217 119 6)"
                                    reverse={true}
                                />
                            </div>
                        </motion.div>
                    )}

                    <div className="mt-16 mb-16">
                        <CommentSection portfolioOwnerId={portfolioOwnerId} />
                    </div>
                </div>

                <Footerdemo />
            </div>
        </>
    );
}
