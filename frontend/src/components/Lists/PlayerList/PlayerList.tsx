import type {Player} from '../../../types/player.ts';
import {PlayerCard} from './PlayerCard.tsx';
import {useEffect, useRef, useState} from "react";
import {useVirtualizer} from '@tanstack/react-virtual';

interface PlayerListProps {
    players: Player[];
    onToggle: (player: Player) => void;
    activePlayer: Player | null;

}

export const PlayerList = ({players, activePlayer, onToggle}: PlayerListProps) => {
    const listContainerRef = useRef<HTMLDivElement>(null);

    const firstItemRef = useRef<HTMLDivElement>(null);
    const [estimatedSize, setEstimatedSize] = useState(88);

    useEffect(() => {
        if (firstItemRef.current) {
            setEstimatedSize(firstItemRef.current.getBoundingClientRect().height);
        }
    }, [players]);

    const virtualizer = useVirtualizer({
        count: players?.length ?? 0,
        getScrollElement: () => listContainerRef.current,
        estimateSize: () => estimatedSize,
        measureElement: (el) => el.getBoundingClientRect().height,
        overscan: 5
    });

    useEffect(() => {
        if (!activePlayer) return;
        const index = players.findIndex(p => p._id === activePlayer._id);
        if (index !== -1) virtualizer.scrollToIndex(index, {behavior: 'smooth'});
    }, [activePlayer, players, virtualizer]);

    return (
        <div className="flex flex-col h-full">
            <div
                ref={listContainerRef}
                className="h-[calc(160vh)] overflow-y-auto overflow-x-hidden overscroll-contain pr-3"
            >
                <div style={{height: virtualizer.getTotalSize(), position: 'relative'}}>
                    {virtualizer.getVirtualItems().map(virtualItem => {
                        const player = players[virtualItem.index];
                        return (
                            <div
                                key={virtualItem.key}
                                data-index={virtualItem.index}
                                ref={(el) => {
                                    virtualizer.measureElement(el);
                                    if (virtualItem.index === 0 && el) firstItemRef.current = el;
                                }}
                                style={{
                                    position: 'absolute',
                                    top: virtualItem.start,
                                    width: '100%',
                                    paddingBottom: '1rem'
                                }}
                            >
                                <PlayerCard
                                    player={player}
                                    index={virtualItem.index + 1}
                                    onToggle={onToggle}
                                    isActive={activePlayer?._id === player._id}
                                    data-id={player._id}
                                />
                            </div>
                        );
                    })}
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