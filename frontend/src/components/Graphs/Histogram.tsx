import {ResponsiveBar} from '@nivo/bar';
import {useEffect, useState} from 'react';

export const Histogram = ({data}: { data: { label: string | null, count: number }[] }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const chartData = data.map(d => ({
        ...d,
        label: d.label ?? "None"
    }));

    const getTickValues = () => {
        const len = chartData.length;
        if (isMobile) {
            if (len > 30) return 4;
            if (len > 15) return 3;
            return 2;
        }
        if (len > 25) return 2;
        return 1;
    };

    const skipRate = getTickValues();

    return (
        <div className="h-[300px] sm:h-[350px] md:h-[400px] w-full">
            <ResponsiveBar
                data={chartData}
                keys={['count']}
                indexBy="label"
                isInteractive={true}
                margin={isMobile ?
                    {top: 15, right: 10, bottom: 60, left: 35} :
                    {top: 20, right: 20, bottom: 50, left: 50}
                }
                padding={isMobile ? 0.3 : 0.4}
                valueScale={{type: 'linear'}}
                indexScale={{type: 'band', round: true}}
                colors={'var(--alien-primary)'}

                theme={{
                    axis: {
                        ticks: {
                            text: {
                                fill: 'var(--text-primary)',
                                fontFamily: 'JetBrains Mono, monospace',
                                fontSize: isMobile ? 9 : 12
                            }
                        },
                        legend: {text: {fill: 'var(--text-primary)'}}
                    },
                    grid: {
                        line: {stroke: 'var(--bg-tertiary)', strokeWidth: 1}
                    }
                }}
                axisBottom={{
                    tickSize: isMobile ? 5 : 10,
                    tickPadding: isMobile ? 5 : 10,
                    tickRotation: isMobile ? -45 : -35,
                    tickValues: chartData
                        .map((d, i) => i % skipRate === 0 ? d.label : null)
                        .filter((v): v is string => v !== null)
                }}
                axisLeft={{
                    tickSize: isMobile ? 3 : 5,
                    tickPadding: isMobile ? 3 : 5,
                    tickValues: isMobile ? 3 : 5,
                    format: isMobile ? (v: number) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v : undefined
                }}
                enableLabel={false}

                tooltip={({value, indexValue}) => {
                    return (
                        <div
                            className="bg-bg-primary p-[6px] sm:p-[9px] border border-alien-primary rounded text-text-primary whitespace-nowrap text-xs sm:text-sm">
                            <strong className="text-alien-primary">{indexValue}</strong>
                            <div>{value}</div>
                        </div>
                    );
                }}
            />
        </div>
    );
};