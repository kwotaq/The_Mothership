import React from "react";

interface Props {
    title: string;
    children?: React.ReactNode;
}

export const SectionHeader = ({ title, children }: Props) => {
    return (
        <header
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-8 pb-3 sm:pb-4 w-full
            border-b border-alien-primary
            shadow-[0_4px_10px_-10px_var(--alien-primary)]"
        >
            <h2 className="text-text-primary text-xl sm:text-2xl md:text-[2rem] m-0 uppercase tracking-[2px] sm:tracking-[3px] font-mono pl-[3px] sm:pl-[5px]">
                {title}
            </h2>

            {children && (
                <div className="flex items-center gap-3 sm:gap-4">
                    {children}
                </div>
            )}
        </header>
    );
};