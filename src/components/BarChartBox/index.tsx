import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"
import "./barChartBox.scss"
import { House, IUser } from "../../types"
import { useEffect, useState } from "react"
import {
  fetchUserContribution,
  fetchUserSixMonthsExpenses,
} from "../../utils/chartDataFetch"
import { useAuth } from "../../hooks/useAuth"

interface BarChartBoxProps {
  title: string
  color: string
  dataKey: string
  chartData: object[]
  user: IUser
  type: string
  selectedHouse: House
}

const BarChartBox: React.FC<BarChartBoxProps> = ({
  title,
  color,
  dataKey,
  user,
  type,
  selectedHouse,
}) => {
  const {getToken} = useAuth()
  const [chartData, setChartData] = useState<object[]>([])

  useEffect(() => {
    const fetchChartData = async () => {
      const token = await getToken()
      let chartData
      switch (type) {
        case "contribution":
          chartData = await fetchUserContribution(selectedHouse, token || "")
          break
        case "userSixMonths":
          chartData = await fetchUserSixMonthsExpenses(
            selectedHouse,
            token || ""
          )
          break

        default:
          chartData = await fetchUserContribution(selectedHouse, token || "")
          break
      }

      setChartData(chartData)
    }
    fetchChartData()
  }, [user, type])

  return (
    <div className="barchart-box">
      <h1>{title}</h1>
      <div className="chart">
        <ResponsiveContainer width="99%" height={150}>
          <BarChart data={chartData}>
            <Tooltip
              labelStyle={{ display: "none" }}
              cursor={{ fill: "none" }}
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

                return null
              }}
            />
            <XAxis dataKey="firstName" />
            <Bar dataKey={dataKey} fill={color} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BarChartBox
