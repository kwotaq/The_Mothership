import {type RefObject, useEffect} from "react";

export function useWheelZoom(chartRef: RefObject<HTMLDivElement | null>, zoom: (factor: number) => void) {
    useEffect(() => {
        const el = chartRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            zoom(e.deltaY > 0 ? 1.2 : 0.8);
        };
        el.addEventListener('wheel', onWheel, {passive: false});
        return () => el.removeEventListener('wheel', onWheel);
    }, [zoom]);
}