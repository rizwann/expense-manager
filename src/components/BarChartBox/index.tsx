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
              labelStyle={{ display: "none" }}
              cursor={{ fill: "none" }}
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

                return null;
              }}
            />

            <Bar dataKey={dataKey} fill={color} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartBox;
