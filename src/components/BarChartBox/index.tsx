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
import React from "react"
import { months } from "../../menu-item"
import { getCurrencySymbol } from "../../utils/utils"

interface BarChartBoxProps {
  title: string
  color: string
  dataKey: string
  chartData: object[]
  user: IUser
  type: string
  selectedHouse: House
  month: number
  year: number
}

const BarChartBox: React.FC<BarChartBoxProps> = ({
  title,
  color,
  dataKey,
  user,
  type,
  selectedHouse,
  month,
  year
}) => {
  const {getToken} = useAuth()
  const [chartData, setChartData] = useState<object[]>([])

  const monthName = months[month  - 1]

  useEffect(() => {
    const fetchChartData = async () => {
      const token = await getToken()
      let chartData
      switch (type) {
        case "contribution":
          chartData = await fetchUserContribution(selectedHouse, token || "", month, year)
          break
        case "userSixMonths":
          chartData = await fetchUserSixMonthsExpenses(
            selectedHouse,
            token || "",
            month, year
          )
          break

        default:
          chartData = await fetchUserContribution(selectedHouse, token || "", month, year)
          break
      }

      setChartData(chartData)
    }
    fetchChartData()
  }, [user, type, month, year])

  return (
    <div className="barchart-box">
      <h1>{type === 'contribution' ? `Member Contributions of ${monthName}` : title}</h1>
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
                      >{`${payload[0].value}${getCurrencySymbol(selectedHouse)}`}</p>
                    </div>
                  )
                }

                return null
              }}
            />
            <XAxis dataKey="name" />
            <Bar dataKey={dataKey} fill={color} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BarChartBox
