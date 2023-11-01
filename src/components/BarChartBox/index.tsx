import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts";
import "./barChartBox.scss";

interface BarChartBoxProps {
  title: string;
  color: string;
  dataKey: string;
  chartData: object[];
}

const BarChartBox: React.FC<BarChartBoxProps> = ({
  title,
  color,
  dataKey,
  chartData,
}) => {
  return (
    <div className="barchart-box">
      <h1>{title}</h1>
      <div className="chart">
        <ResponsiveContainer width="99%" height={150}>
          <BarChart data={chartData}>
            <Tooltip
              contentStyle={{ background: "#2a2447", borderRadius: "5px" }}
              labelStyle={{ display: "none" }}
              cursor={{ fill: "none" }}
            />
            <Bar dataKey={dataKey} fill={color} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartBox;
