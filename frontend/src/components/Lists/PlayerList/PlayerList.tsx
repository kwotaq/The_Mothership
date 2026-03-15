import type {Player} from '../../../types/player.ts';
import {PlayerCard} from './PlayerCard.tsx';
import {useEffect, useRef} from "react";

interface PlayerListProps {
    players: Player[];
    onToggle: (player: Player) => void;
    activePlayer: Player | null;

}

export const PlayerList = ({players, activePlayer, onToggle}: PlayerListProps) => {
    const listContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activePlayer && listContainerRef.current) {
            const activeElement = listContainerRef.current.querySelector(
                `[data-id="${activePlayer._id}"]`
            );

            if (activeElement) {
                activeElement.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "start"
                });
            }
        }
    }, [activePlayer]);

    return (
        <div className="flex flex-col h-full">
            <div
                ref={listContainerRef}
                className="h-[calc(110vh)] overflow-y-auto overflow-x-hidden overscroll-contain pr-3"
            >
                <div className="flex flex-col gap-4">
                    {players.map((player, index) => (
                        <PlayerCard
                            key={player._id}
                            player={player}
                            index={index + 1}
                            onToggle={onToggle}
                            isActive={activePlayer?._id === player._id}
                            data-id={player._id}
                        />
                    ))}
                </div>
            </div>

            <div
                className="flex items-center justify-center gap-10 p-5 bg-alien-primary/5 border-t-2 border-alien-primary mt-4">
                <div className="w-1.5 h-1.5 bg-alien-primary rotate-45"/>
                <span className="font-mono uppercase tracking-[0.3em] text-text-primary">
                / --------------------- /
            </span>
                <div className="w-1.5 h-1.5 bg-alien-primary rotate-45"/>
            </div>
        </div>
    );
};