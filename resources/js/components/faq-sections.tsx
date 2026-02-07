import React from 'react';

const App = () => {
    const [openIndex, setOpenIndex] = React.useState<number | null>(null);

    const faqs = [
        {
            question: 'What is Codefolio?',
            answer: 'Codefolio is an online platform where developers can upload, organize, and showcase their portfolios in one public place. It allows your work to be seen by recruiters, clients, and other developers around the world.',
        },
        {
            question: 'Who can use Codefolio?',
            answer: 'Codefolio is built for developers of all levels—students, junior developers, freelancers, and experienced professionals—who want a simple and professional way to showcase their projects.',
        },
        {
            question: 'Do I need coding skills to use Codefolio?',
            answer: 'No. Codefolio is designed to be easy to use. You can upload your projects and create a portfolio without writing any code.',
        },
        {
            question: 'Is my portfolio public?',
            answer: 'Yes. By default, your portfolio is publicly accessible, which means anyone can view your work and share your portfolio link.',
        },
        {
            question: 'What kind of projects can I upload?',
            answer: 'You can upload any type of development work, including web applications, mobile apps, personal projects, school projects, and professional work.',
        },
        {
            question: 'Can recruiters and clients view my portfolio?',
            answer: 'Yes. Codefolio is designed to help developers get noticed. Recruiters and clients can view your portfolio without needing an account.',
        },
        {
            question: 'Can I update my portfolio anytime?',
            answer: 'Absolutely. You can edit, add, or remove projects from your portfolio at any time.',
        },
        {
            question: 'Is Codefolio free to use?',
            answer: 'Yes, Codefolio offers free access so developers can start showcasing their work easily.',
        },
    ];
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
            <div className="mx-auto flex max-w-4xl flex-col items-start justify-center gap-8 px-4 md:flex-row md:px-0">
                {/* <img
                    className="max-w-sm w-full rounded-xl h-auto"
                    src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=830&h=844&auto=format&fit=crop"
                    alt=""
                /> */}
                <div>
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        FAQ's
                    </p>
                    <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
                        Frequently Asked Questions
                    </h1>
                    <p className="mt-2 pb-4 text-sm text-slate-500 dark:text-zinc-400">
                        Everything you need to know about Codefolio and how it
                        helps developers showcase their work.
                    </p>
                    {faqs.map((faq, index) => (
                        <div
                            className="cursor-pointer border-b border-slate-200 py-4 dark:border-zinc-700"
                            key={index}
                            onClick={() =>
                                setOpenIndex(openIndex === index ? null : index)
                            }
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                                    {faq.question}
                                </h3>
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`${openIndex === index ? 'rotate-180' : ''} transition-all duration-500 ease-in-out dark:stroke-zinc-400`}
                                >
                                    <path
                                        d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="stroke-zinc-800 dark:stroke-zinc-300"
                                    />
                                </svg>
                            </div>
                            <p
                                className={`max-w-md text-sm text-slate-500 transition-all duration-500 ease-in-out dark:text-zinc-400 ${openIndex === index ? 'max-h-[300px] translate-y-0 pt-4 opacity-100' : 'max-h-0 -translate-y-2 opacity-0'}`}
                            >
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default App;
