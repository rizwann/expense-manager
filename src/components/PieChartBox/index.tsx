import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import "./pieChartBox.scss";

interface PieChartBoxProps {}

type StoreData = {
  name: string;
  value: number;
  color?: string;
};

const data: StoreData[] = [
  { name: "Aldi", value: 900 },
  { name: "Netto", value: 300 },
  { name: "Lidl", value: 300 },
  { name: "BAK-AL", value: 700 },
  { name: "Edeka", value: 278 },
  { name: "Rewe", value: 189 },
  { name: "Penny", value: 239 },
  { name: "Kaufland", value: 349 },
  { name: "Real", value: 149 },
];

//add random color to each store
data.forEach((item) => {
  item.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
});

const PieChartBox: React.FC<PieChartBoxProps> = ({}) => {
  return (
    <div className="pieChartBox">
      <h1>Expenses by Store</h1>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartBox;
