import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./single.scss";

interface IProps {
  id: number;
  image?: string;
  title: string;
  info: object;
  chart: {
    dataKeys: {
      name: string;
      color: string;
    }[];
    data: object[];
  };
  activities: {
    time: string;
    text: string;
  }[];
}

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

const Single: React.FC<IProps> = ({
  id,
  image,
  title,
  info,
  chart: charts,
  activities,
}) => {
  return (
    <div className="single">
      <div className="view">
        <div className="info">
          <div className="top-info">
            <img src={image || "/noavatar.png"} alt="" />
            <h1>{title}</h1>
            <button>Update</button>
          </div>
          <div className="details">
            {Object.entries(info).map((item) => (
              <div className="item" key={item[0]}>
                <span className="item-title">{item[0]}</span>
                <span className="item-value">{item[1]}</span>
              </div>
            ))}
          </div>
        </div>
        {charts && (
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={charts.data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {charts.dataKeys.map((item) => (
                  <Line
                    type="monotone"
                    activeDot={{ r: 8 }}
                    dataKey={item.name}
                    stroke={item.color}
                    key={item.color}
                  />
                ))}
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className="activities">
        <h2>Latest Activities</h2>
        {activities && (
          <ul>
            {activities.map((activity, idX) => (
              <li key={idX}>
                <div>
                  <p>{activity.text}</p>
                  <time>{activity.time}</time>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Single;
