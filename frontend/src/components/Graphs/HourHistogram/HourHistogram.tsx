import { ResponsiveBar } from '@nivo/bar';

const HourHistogram = ({ data }: { data: { hour: string, count: number }[] }) => (
    <div style={{ height: '350px', width: '100%' }}>
        <ResponsiveBar
            data={data}
            keys={['count']}
            indexBy="hour"
            isInteractive={false}
            margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={'var(--gold-primary)'}
            theme={{
                axis: {
                    ticks: { text: { fill: 'var(--text-muted)' } },
                    legend: { text: { fill: 'var(--text-primary)' } }
                },
                grid: {
                    line: { stroke: 'var(--bg-tertiary)', strokeWidth: 1 }
                }
            }}
            axisBottom={{
                tickSize: 5,
                tickPadding: 10,
            }}
            enableLabel={true}
            role="application"
        />
    </div>
);

export default HourHistogram;