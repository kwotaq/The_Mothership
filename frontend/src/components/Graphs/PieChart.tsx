import {ResponsivePie} from '@nivo/pie';

export const PieChart = ({data}: { data: { id: string, value: number }[] }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);

    return (
        <div className="h-[300px]">
            <ResponsivePie
                data={data}
                margin={{top: 20, right: 40, bottom: 20, left: 60}}
                innerRadius={0.3}
                padAngle={2}
                cornerRadius={0}
                activeOuterRadiusOffset={8}

                colors={[
                    '#00f2ff', '#00ff66', '#84cc16', '#2dd4bf',
                    '#fbbf24', '#3b82f6', '#f97316', '#a855f7',
                    '#bc13fe', '#ef4444', '#ff0055', '#6366f1'
                ]}

                enableArcLabels={false}
                enableArcLinkLabels={true}

                arcLinkLabel="id"
                arcLinkLabelsOffset={0}
                arcLinkLabelsDiagonalLength={8}
                arcLinkLabelsStraightLength={10}
                arcLinkLabelsSkipAngle={15}
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{from: 'color'}}
                arcLinkLabelsTextColor="var(--text-primary)"

                theme={{
                    labels: {
                        text: {
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 12,
                        },
                    },
                }}

                tooltip={({datum}) => {
                    const percentage = ((datum.value / total) * 100).toFixed(1);
                    return (
                        <div
                            className="bg-bg-primary p-[9px] border border-alien-primary rounded text-text-primary whitespace-nowrap">
                            <strong className="text-alien-primary">{datum.id}</strong>
                            <div>{percentage}%</div>
                        </div>
                    );
                }}
            />
        </div>
    );
};