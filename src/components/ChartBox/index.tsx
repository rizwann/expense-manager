// @ts-nocheck
import { Link } from "react-router-dom"
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"
import "./chartBox.scss"
import { useEffect, useState } from "react"
import {
  fetchHouseLastSixMonthsExpenses,
  fetchPopularCategoryExpenses,
  fetchPopularStoreExpenses,
  fetchUserMonthlyComparison,
  fetchUserWeekly,
  lastSixMonthsResponse,
} from "../../utils/chartDataFetch"
import { House, IUser } from "../../types"
import { Typography } from "@mui/material"
import { useAuth } from "../../hooks/useAuth"
import { getCurrencySymbol } from "../../utils/utils"

interface ChartBoxProps {
  title: string
  number: string
  percentage: number
  color: string
  dataKey: string
  chartData: object[]
  icon: string
  type: string
  user: IUser
  selectedHouse: House
  month: number
  year: number
}

export type Tdata = {
  totalExpensesThisMonth: number
  totalExpensesLastMonth: number
  percentage: number
}

const ChartBox: React.FC<ChartBoxProps> = ({
  title,
  color,
  dataKey,
  icon,
  type,
  user,
  selectedHouse,
  month,
  year
}) => {
  const {getToken} = useAuth()
  const [chartData, setChartData] = useState<object[]>([])
  const [image, setImage] = useState<string>("")
  const [data, setData] = useState<Tdata>({
    totalExpensesThisMonth: 0,
    totalExpensesLastMonth: 0,
    percentage: 0,
  })
  useEffect(() => {
    const fetchChartData = async () => {
      const token = await getToken()
      let chartData
      let iData
      switch (type) {
        case "weeklyUser":
          chartData = await fetchUserWeekly(selectedHouse, token || "")
          iData = await fetchUserMonthlyComparison(selectedHouse, token || "", month, year)

          break
        case "houseExpenses":
          const res = await fetchHouseLastSixMonthsExpenses(
            selectedHouse,
            token || "",
            month, year
          )
          // @ts-ignore
          chartData = res?.last6Months
          iData = res
          break
        case "popularStore":
          const resStore = await fetchPopularStoreExpenses(
            selectedHouse,
            token || "",
            month, year
          )
         // @ts-ignore
          chartData = resStore?.result
          iData = {
         // @ts-ignore 
            totalExpensesThisMonth: resStore?.highestExpense?.expenses,
            percentage: resStore?.percentage,
            popularName: resStore?.highestExpense?.name,
            image: resStore?.image,
          }
          break
          case "popularCategory":
          const resCat = await fetchPopularCategoryExpenses(
            selectedHouse,
            token || "",
            month, year
          )
          chartData = resCat?.result
          iData = {
            totalExpensesThisMonth: resCat?.highestExpense?.expenses,
            percentage: resCat?.percentage,
            popularName: resCat?.highestExpense?.name,
          }
          break
        default:
          chartData = await fetchUserWeekly(selectedHouse, token || "")
          iData = await fetchUserMonthlyComparison(selectedHouse, token || "")
          break
      }

      setChartData(chartData)
      setData(iData)
    }
    fetchChartData()
  }, [user, type, month, year])

  let cardText
  switch (type) {
    case "houseExpenses":
      cardText = "from Last 6 Months average"
      break
    case "popularStore":
    case "popularCategory":
      cardText = `of all Expenses`
      break

    default:
      cardText = "from Last Month"
      break
  }

  return (
    <div className="chart-box">
      <div className="box-info">
        <div className="title">
          <img src={icon} alt="" />
          <span>{title}</span>
        </div>
        <Typography className="text-green-400 " variant="h4">
          {getCurrencySymbol(selectedHouse)}{data?.totalExpensesThisMonth || 0}
        </Typography>
        {(type === "popularStore" || type === "popularCategory") ? (
          <div className="flex items-center gap-2 mb-2">
             <p className="font-bold">
            </p>
             <span style={{ color: color }}>Store: </span><span className="text-green-400">{data?.popularName}</span>
          </div>
        ) :
        <Link to="/expenses" style={{ color: color }}>
        {" "}
        View All
      </Link>
        }

      </div>
      <div className="chart-info">
        <div className="chart">
          <ResponsiveContainer width="99%" height="60%">
            <LineChart data={chartData}>
              <Tooltip
                contentStyle={{ background: "transparent", border: "none" }}
                labelStyle={{ display: "none" }}
                position={{ x: 10, y: -10 }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={"purple"}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey={"name"}
                stroke={"green"}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="texts">
          <span
            className="percentage"
            style={{ color: data?.percentage < 0 ? "tomato" : "limegreen" }}
          >
            {data?.percentage > 0 && "+"} {data?.percentage}%
          </span>
          <span className="duration">{cardText}</span>
        </div>
      </div>
    </div>
  )
}

export default ChartBox
