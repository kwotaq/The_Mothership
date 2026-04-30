import {useCallback, useRef, useState} from "react";
import {useGesture} from "@use-gesture/react";
import {useWheelZoom} from "./useWheelZoom.ts";

export function useFeedInteraction(initialHours = 6) {
    const chartRef = useRef<HTMLDivElement>(null);
    const [xDomain, setXDomain] = useState<[Date, Date]>(() => {
        const now = new Date();
        return [new Date(now.getTime() - initialHours * 60 * 60 * 1000), now];
    });

    const pan = useCallback((dx: number) => {
        setXDomain(([min, max]) => {
            const range = max.getTime() - min.getTime();
            const shift = (dx / chartRef.current!.clientWidth) * range * -1;
            return [new Date(min.getTime() + shift), new Date(max.getTime() + shift)];
        });
    }, []);

    const zoom = useCallback((zoomFactor: number) => {
        setXDomain(([min, max]) => {
            const center = new Date((min.getTime() + max.getTime()) / 2);
            const range = max.getTime() - min.getTime();
            const newRange = range * zoomFactor;
            return [
                new Date(center.getTime() - newRange / 2),
                new Date(center.getTime() + newRange / 2)
            ];
        });
    }, []);

    useWheelZoom(chartRef, zoom);

    const bind = useGesture({
        onDrag: ({delta: [dx]}) => {
            pan(dx);
        },
        onPinch: ({delta: [dScale]}) => zoom(1 - dScale * 0.01),
    }, {
        drag: {filterTaps: true},
        pinch: {scaleBounds: {min: 0.1, max: 10}},
        eventOptions: {passive: false}
    });

    return {chartRef, xDomain, bind};
}