import React from "react";

interface Props {
    title: string;
    children?: React.ReactNode;
}

export const SectionHeader = ({ title, children }: Props) => {
return (
        <header
            className="flex justify-between items-center mb-8 pb-4
            border-b border-alien-primary
            shadow-[0_4px_10px_-10px_var(--alien-primary)]"
        >
            <h2 className="text--text-primary text-[2rem] m-0 uppercase tracking-[3px] font-mono pl-[5px]">
                {title}
            </h2>

            {children && (
                <div className="flex items-center gap-4">
                    {children}
                </div>
            )}
        </header>
    );
};