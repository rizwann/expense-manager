// @ts-nocheck
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
import { CategoryName, House } from "../../types"
import "./bigChart.scss"
import { useEffect, useState } from "react"
import {
  fetchPopularCategoryExpenses,
} from "../../utils/chartDataFetch"
import { useAuth } from "../../hooks/useAuth"
import { set } from "react-hook-form"
import { getCurrencySymbol } from "../../utils/utils"
import { config } from "../../utils/config"
import { useThemeContext } from "../../context/ThemeContext"

const categories = Object.values(CategoryName).map((item, index) => {
  const randomColor = () => {
    const hue = Math.floor(Math.random() * 360); // 0–360 degree color wheel
    return `hsl(${hue}, 90%, 70%)`; // bright, vibrant colors
  }
  const color = config.colors[index] ? config.colors[index] : randomColor();
  return { name: item, color };
});


type Props = {
  selectedHouse: House
  dataKey: string
  month: number
  year: number
}

const BigChart: React.FC<Props> = ({ selectedHouse, dataKey, month, year }) => {
  const [data, setData] = useState<object[]>([])
  const {getToken, recall} = useAuth()
  const { colors } = useThemeContext()

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken()
      const response = await fetchPopularCategoryExpenses(
        selectedHouse,
        token || "",
        month,
        year
      )
      if (response.length === 0) {
        setData([])
      }
      const enrichedData = response?.result.map((item: any) => {
        const category = categories.find((cat) => cat.name === item.name)
        return { ...item, color: category ? category.color : "#8884d8" } // Default color if not found
      })
      setData(enrichedData)
      console.log("Enriched Data:", enrichedData)
    }
    fetchData()
  }, [selectedHouse, month, year, recall])

  return (
    <div className="bigchart-box">
      <h1>In-house Expenses by Category</h1>
      <div className="chart">
        <ResponsiveContainer width="99%" height="100%">
          <BarChart data={data}>
            <Tooltip
              labelStyle={{ display: "none" }}
              cursor={{ fill: "none" }}
              content={({ active, payload, label }) => {
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
            <XAxis dataKey="name" tick={{ fill: colors.text }} stroke={colors.muted} />
            <Bar dataKey={dataKey} radius={[5, 5, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
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
}

export default BigChart
