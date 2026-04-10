import {ResponsiveBar} from '@nivo/bar';

export const Histogram = ({data}: { data: { label: string | null, count: number }[] }) => {
    const chartData = data.map(d => ({
        ...d,
        label: d.label ?? "None"
    }));

    const getTickValues = () => {
        const len = chartData.length;
        if (len > 25) return 2;
        return 1;
    };

    const skipRate = getTickValues();

    return (
        <div className="h-[400px] w-full">
            <ResponsiveBar
                data={chartData}
                keys={['count']}
                indexBy="label"
                isInteractive={true}
                margin={{top: 20, right: 20, bottom: 50, left: 50}}
                padding={0.4}
                valueScale={{type: 'linear'}}
                indexScale={{type: 'band', round: true}}
                colors={'var(--alien-primary)'}

                theme={{
                    axis: {
                        ticks: {
                            text: {
                                fill: 'var(--text-primary)',
                                fontFamily: 'JetBrains Mono, monospace',
                                fontSize: 12
                            }
                        },
                        legend: {text: {fill: 'var(--text-primary)'}}
                    },
                    grid: {
                        line: {stroke: 'var(--bg-tertiary)', strokeWidth: 1}
                    }
                }}
                axisBottom={{
                    tickSize: 10,
                    tickPadding: 10,
                    tickRotation: -35,
                    tickValues: chartData
                        .map((d, i) => i % skipRate === 0 ? d.label : null)
                        .filter((v): v is string => v !== null)
                }}
                axisLeft={null}
                enableLabel={false}

                tooltip={({value, indexValue}) => {
                    return (
                        <div
                            className="bg-bg-primary p-[9px] border border-alien-primary rounded text-text-primary whitespace-nowrap">
                            <strong className="text-alien-primary">{indexValue}</strong>
                            <div>{value}</div>
                        </div>
                    );
                }}
            />
        </div>
    );
}