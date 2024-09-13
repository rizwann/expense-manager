import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import "./pieChartBox.scss"
import { House, IUser } from "../../types"
import { useEffect, useState } from "react"
import { fetchHouseExpByAllStore } from "../../utils/chartDataFetch"
import { generateContrastingColors } from "../../utils/utils"
import { useAuth } from "../../hooks/useAuth"

interface PieChartBoxProps {
  user: IUser
  selectedHouse: House
}

export type StoreData = {
  name: string
  expenses: number
  color?: string
}

const PieChartBox: React.FC<PieChartBoxProps> = ({ user, selectedHouse }) => {
  const { getToken } = useAuth()
  const [data, setData] = useState<StoreData[]>([])

  useEffect(() => {
    const fetchChartData = async () => {
      const token = await getToken()
      const chartData = await fetchHouseExpByAllStore(selectedHouse, token)
      const numColors = chartData.length
      const contrastingColors = generateContrastingColors(numColors)

      chartData.forEach((item, index) => {
        item.color = contrastingColors[index]
      })
      setData(chartData)
    }
    fetchChartData()
  }, [user])

  return (
    <div className="pieChartBox">
      <h1>In-house Expenses by Store</h1>

      <div className="chart">
        <ResponsiveContainer width="99%" height={300}>
          <PieChart>
            <Tooltip
              contentStyle={{ background: "white", borderRadius: "5px" }}
              content={({ active, payload }) => {
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
                  )
                }
              }}
            />
            <Pie
              data={data}
              innerRadius={"70%"}
              outerRadius={"90%"}
              paddingAngle={5}
              dataKey="expenses"
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
  )
}

export default PieChartBox
