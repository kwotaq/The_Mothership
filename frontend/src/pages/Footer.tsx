export const Footer = () => (
    <footer className="border-t border-alien-primary backdrop-blur-[15px] mt-10 py-6 px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-text-secondary text-xs font-mono">
        <span className=" tracking-widest">
            built by{' '}
            <a href="https://osu.ppy.sh/users/8195972" target="_blank" rel="noopener noreferrer"
               className="text-alien-primary hover:underline">
                kwotaq
            </a>
        </span>

        <div className="flex items-center gap-6">
            <a href="https://github.com/kwotaq/The_Mothership" target="_blank" rel="noopener noreferrer"
               className="hover:underline transition-colors uppercase tracking-widest">
                GitHub
            </a>
            <a href="https://ko-fi.com/kwotaq" target="_blank" rel="noopener noreferrer"
               className="hover:underline transition-colors uppercase tracking-widest">
                Donate
            </a>
        </div>
    </footer>
);