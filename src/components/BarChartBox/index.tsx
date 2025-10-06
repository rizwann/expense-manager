import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
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
import { config } from "../../utils/config"
import { useThemeContext } from "../../context/ThemeContext"

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
  const { getToken, recall } = useAuth()
  const [chartData, setChartData] = useState<object[]>([])
  const { colors } = useThemeContext()

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
  }, [user, type, month, year, recall])
  
  return (
    <div className="barchart-box">
      <h1>{
        type === "contribution"
          ? `Member Contributions of ${monthName}`
          : title
      }</h1>
      <div className="chart">
        <ResponsiveContainer width="100%" 
         height={350}
        >
          <BarChart data={chartData}>
            <Tooltip
              labelStyle={{ display: "none" }}
              cursor={{ fill: "none" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div
                      style={{
                        background: colors.tooltipBg,
                        borderRadius: "5px",
                        padding: "10px",
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <p
                        style={{
                          color: colors.text,
                          fontSize: "12px",
                          fontWeight: "bold",
                          marginBottom: "0px",
                        }}
                      >{`${payload[0].payload.name}`}</p>
                      <p
                        style={{
                          color: colors.text,
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
            <CartesianGrid stroke={colors.chartGrid} strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: colors.text }} stroke={colors.muted} />
            <YAxis tick={{ fill: colors.text }} stroke={colors.muted} />
            <Bar
              dataKey={dataKey}
              fill={type !== "userSixMonths" ? color : colors.primary}
              radius={[5, 5, 0, 0]}
            >
              {type === "userSixMonths" &&
                chartData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={config.barColors[index] || colors.primary}
                    style={{ borderRadius: "5px" }}
                  />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BarChartBox
