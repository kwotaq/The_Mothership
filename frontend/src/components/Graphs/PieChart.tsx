import { ResponsivePie } from '@nivo/pie';

export const PieChart = ({ data }: { data: { id: string, value: number }[] }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);

    return (
        <div className="h-[300px]">
            <ResponsivePie
                data={data}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                innerRadius={0.4}
                padAngle={2}
                cornerRadius={0}
                activeOuterRadiusOffset={8}

                colors={['#00f2ff', '#00ff66', '#00ccbb', '#009944', '#064e3b']}

                enableArcLinkLabels={false}
                arcLabelsSkipAngle={20}
                arcLabel="id"

                arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [['darker', 5]],
                }}

                theme={{
                    labels: {
                        text: {
                            fontFamily: 'JetBrains Mono, monospace',
                            fontWeight: '1000',
                            fontSize: 14,
                        },
                    },
                    tooltip: {
                        container: {
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            border: '1px solid #00ff66',
                            fontFamily: 'JetBrains Mono, monospace',
                            borderRadius: '0px'
                        }
                    }
                }}

                tooltip={({ datum }) => {
                    const percentage = ((datum.value / total) * 100).toFixed(1);
                    return (
                        <div className="bg-bg-primary p-[9px] border border-alien-primary rounded text-text-primary whitespace-nowrap">
                            <strong className="text-alien-primary">{datum.id}</strong>
                            <div>{percentage}%</div>
                        </div>
                    );
                }}
            />
        </div>
    );
};