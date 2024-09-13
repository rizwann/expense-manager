// @ts-nocheck
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"
import { CategoryName, House } from "../../types"
import "./bigChart.scss"
import { useEffect, useState } from "react"
import {
  fetchPopularCategoryExpenses,
} from "../../utils/chartDataFetch"
import { useAuth } from "../../hooks/useAuth"

const categories = Object.values(CategoryName).map((item) => {
  const color = "#" + Math.floor(Math.random() * 16777215).toString(16)
  return { name: item, color: color }
})

type Props = {
  selectedHouse: House
  dataKey: string
}

const BigChart: React.FC<Props> = ({ selectedHouse, dataKey }) => {
  const [data, setData] = useState<object[]>([])
  const {getToken} = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken()
      const response = await fetchPopularCategoryExpenses(
        selectedHouse,
        token || ""
      )

      const enrichedData = response.result.map((item: any) => {
        const category = categories.find((cat) => cat.name === item.name)
        return { ...item, color: category ? category.color : "#8884d8" } // Default color if not found
      })
      setData(enrichedData)
    }
    fetchData()
  }, [selectedHouse])

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
            <XAxis dataKey="name" />
            <Bar dataKey={dataKey}>
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
