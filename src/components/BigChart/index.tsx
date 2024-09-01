import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CategoryName, House } from "../../types";
import "./bigChart.scss";
import { useEffect, useState } from "react";
import { fetchSixMonthsExpensesByCategory } from "../../utils/chartDataFetch";

// const data = [
//   {
//     name: "Jun",
//     Other: 160,
//     Grocery: 0,
//     Restaurant: 0,
//     Clothing: 0,
//     Entertainment: 0,
//     Butcher: 0,
//   },
//   {
//     name: "Jul",
//     Other: 0,
//     Grocery: 0,
//     Restaurant: 0,
//     Clothing: 0,
//     Entertainment: 0,
//     Butcher: 0,
//   },
//   {
//     name: "Aug",
//     Other: 0,
//     Grocery: 0,
//     Restaurant: 0,
//     Clothing: 0,
//     Entertainment: 0,
//     Butcher: 0,
//   },
//   {
//     name: "Sep",
//     Other: 23,
//     Grocery: 22,
//     Restaurant: 0,
//     Clothing: 0,
//     Entertainment: 0,
//     Butcher: 30,
//   },
//   {
//     name: "Oct",
//     Other: 0,
//     Grocery: 64.23,
//     Restaurant: 34.24,
//     Clothing: 0,
//     Entertainment: 0,
//     Butcher: 0,
//   },
//   {
//     name: "Nov",
//     Other: 147.75,
//     Grocery: 14.92,
//     Restaurant: 0,
//     Clothing: 0,
//     Entertainment: 0,
//     Butcher: 43.68,
//   },
// ];

const categories = Object.values(CategoryName).map((item) => {
  const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  return { name: item, color: color };
});
console.log(categories);

type Props = {
  selectedHouse: House
};

const BigChart:React.FC<Props> = ({ selectedHouse }) => {
  const [data, setdata] = useState<object[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchSixMonthsExpensesByCategory(selectedHouse, token || "")
      setdata(response);
    }
    fetchData();
  }, []);

  return (
  <div className="bigchart-box">
    <h1>In-house Expenses by Category</h1>
    <div className="chart">
      <ResponsiveContainer width="99%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            contentStyle={{ background: "white", borderRadius: "5px" }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const { name, ...rest } = payload[0].payload;
                const filtered = Object.entries(rest).filter(
                  ([key, value]) => value !== 0
                );
                return (
                  <div
                    style={{
                      background: "#2a2447",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                  >
                    <h4>{label}</h4>
                    {filtered.map(([key, value]) => (
                      <p
                        style={{
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "bold",
                          marginBottom: "0px",
                        }}
                      >{`${key}: ${value}€`}</p>
                    ))}
                  </div>
                );
              }
            }}
          />
          {categories.map((category) => (
            <Area
              key={category.name}
              type="monotone"
              dataKey={category.name}
              stackId="1"
              stroke={category.color}
              fill={category.color}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
    <div className="options">
      {categories.map((item) => (
        <div className="option" key={item.name}>
          <div className="title">
            <div className="dot" style={{ backgroundColor: item.color }} />
            <span>{item.name}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
)
};

export default BigChart;
