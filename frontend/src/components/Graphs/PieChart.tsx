import {ResponsivePie} from '@nivo/pie';
import styles from "./ScatterPlot/ScatterPlot.module.css";

interface PieData {
    id: string;
    value: number;
}

interface PieChartProps {
    data: PieData[];
}

export const PieChart = ({data}: PieChartProps) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);

    return (
        <div style={{height: '300px'}}>
            <ResponsivePie
                data={data}
                margin={{top: 20, right: 20, bottom: 20, left: 20}}
                innerRadius={0.6}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{scheme: 'nivo'}}
                enableArcLinkLabels={false}
                arcLabelsSkipAngle={20}
                arcLabel="id"

                arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [['darker', 2.5]]
                }}

                theme={{
                    labels: {
                        text: {
                            fontWeight: '705',
                            fontSize: 11,
                        },
                    },
                }}

                tooltip={({datum}) => {
                    const percentage = ((datum.value / total) * 100).toFixed(1);
                    return (
                        <div className={styles.hoverPopup}>
                            <strong>{datum.id}</strong>
                            <div>({percentage}%)</div>
                        </div>
                    );
                }}
            />
        </div>
    );
};