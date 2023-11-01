import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import "./pieChartBox.scss";

interface PieChartBoxProps {}

const data = [
  { name: "Aldi", value: 900, color: "#0088FE" },
  { name: "Netto", value: 300, color: "#86f8e3" },
  { name: "Lidl", value: 300, color: "#FFBB28" },
  { name: "BAK-AL", value: 700, color: "#839b94" },
  { name: "Edeka", value: 278, color: "#2b9d55" },
  { name: "Rewe", value: 189, color: "#FF8042" },
  { name: "Penny", value: 239, color: "#FF8042" },
  { name: "Kaufland", value: 349, color: "#aa9616" },
  { name: "Real", value: 149, color: "#4e1122" },
];

const PieChartBox: React.FC<PieChartBoxProps> = ({}) => {
  return (
    <div className="pieChartBox">
      <h1>Leads by Source</h1>
      <div className="chart">
        <ResponsiveContainer width="99%" height={300}>
          <PieChart>
            <Tooltip
              contentStyle={{ background: "white", borderRadius: "5px" }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div
                      style={{
                        background: "#2a2447",
                        borderRadius: "5px",
                        padding: "10px",
                      }}
                    >
                      <p
                        style={{
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "bold",
                          marginBottom: "0px",
                        }}
                      >{`${payload[0].payload.name}`}</p>
                      <p
                        style={{
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "bold",
                          marginBottom: "0px",
                        }}
                      >{`${payload[0].value}€`}</p>
                    </div>
                  );
                }
              }}
            />
            <Pie
              data={data}
              innerRadius={"70%"}
              outerRadius={"90%"}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="options">
        {data.map((item) => (
          <div className="option" key={item.name}>
            <div className="title">
              <div className="dot" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
            {/* <span>{item.value}</span> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartBox;
