import {useCallback, useRef, useState} from "react";
import {useGesture} from "@use-gesture/react";
import {useWheelZoom} from "./useWheelZoom.ts";

export function usePlotInteraction() {
    const chartRef = useRef<HTMLDivElement>(null);
    const [domain, setDomain] = useState({
        x: [-11, 11] as [number, number],
        y: [-11, 11] as [number, number]
    });

    const pan = useCallback((dx: number, dy: number) => {
        setDomain(({x, y}) => {
            const xRange = x[1] - x[0];
            const yRange = y[1] - y[0];
            const xShift = (dx / chartRef.current!.clientWidth) * xRange * -1;
            const yShift = (dy / chartRef.current!.clientHeight) * yRange;
            return {
                x: [x[0] + xShift, x[1] + xShift],
                y: [y[0] + yShift, y[1] + yShift]
            };
        });
    }, []);

    const zoom = useCallback((zoomFactor: number) => {
        setDomain(({x, y}) => {
            const xCenter = (x[0] + x[1]) / 2;
            const yCenter = (y[0] + y[1]) / 2;
            const xRange = (x[1] - x[0]) * zoomFactor;
            const yRange = (y[1] - y[0]) * zoomFactor;
            return {
                x: [xCenter - xRange / 2, xCenter + xRange / 2],
                y: [yCenter - yRange / 2, yCenter + yRange / 2]
            };
        });
    }, []);

    useWheelZoom(chartRef, zoom);

    const bind = useGesture({
        onDrag: ({delta: [dx, dy]}) => {
            pan(dx, dy);
        },
        onPinch: ({delta: [dScale]}) => zoom(1 - dScale * 0.01),
    }, {
        drag: {filterTaps: true},
        pinch: {scaleBounds: {min: 0.1, max: 10}}
    });

    return {chartRef, domain, bind};
}