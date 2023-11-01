import { Link } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import "./chartBox.scss";
// const data = [
//   {
//     name: "Page A",
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: "Page B",
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: "Page C",
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: "Page D",
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: "Page E",
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: "Page F",
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: "Page G",
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];

interface ChartBoxProps {
  title: string;
  number: string;
  percentage: number;
  color: string;
  dataKey: string;
  chartData: object[];
  icon: string;
}

const ChartBox: React.FC<ChartBoxProps> = ({
  title,
  number,
  percentage,
  color,
  dataKey,
  chartData,
  icon,
}) => {
  return (
    <div className="chart-box">
      <div className="box-info">
        <div className="title">
          <img src={icon} alt="" />
          <span>{title}</span>
        </div>
        <h1>{number}</h1>
        <Link to="/" style={{ color: color }}>
          {" "}
          View All
        </Link>
      </div>
      <div className="chart-info">
        <div className="chart">
          <ResponsiveContainer width="99%" height="100%">
            <LineChart data={chartData}>
              <Tooltip
                contentStyle={{ background: "transparent", border: "none" }}
                labelStyle={{ display: "none" }}
                position={{ x: 10, y: 70 }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey={"name"}
                stroke={color}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="texts">
          <span
            className="percentage"
            style={{ color: percentage < 0 ? "tomato" : "limegreen" }}
          >
            {percentage}
          </span>
          <span className="duration">current month</span>
        </div>
      </div>
    </div>
  );
};

export default ChartBox;
