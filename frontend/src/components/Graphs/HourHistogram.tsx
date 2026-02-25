import { ResponsiveBar } from '@nivo/bar';

export const HourHistogram = ({ data }: { data: { hour: string, count: number }[] }) => (
    <div style={{ height: '400px', width: '100%' }}>
        <ResponsiveBar
            data={data}
            keys={['count']}
            indexBy="hour"
            isInteractive={false}
            margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
            padding={0.4}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={'var(--alien-primary)'}
            theme={{
                axis: {
                    ticks: {
                        text: {
                            fill: 'var(--text-primary)',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 10
                        }
                    },
                    legend: { text: { fill: 'var(--text-primary)' } }
                },
                grid: {
                    line: { stroke: 'var(--bg-tertiary)', strokeWidth: 1 }
                },
                labels: {
                    text: {
                        fill: 'var(--bg-primary)',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontWeight: 'bold'
                    }
                }
            }}
            axisBottom={{
                tickSize: 0,
                tickPadding: 15,
            }}
            axisLeft={null}
            enableLabel={true}
            role="application"
        />
    </div>
);