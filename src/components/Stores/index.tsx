import React, { useEffect, useState } from "react"
import Select from "react-select"
import { House, StoreNameData } from "../../types"
import { fetchSixMonthsExpensesByStoreName } from "../../utils/chartDataFetch"
import { useAuth } from "../../hooks/useAuth"
import { getCurrencySymbol } from "../../utils/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
interface StoreExpenseViewerProps {
  selectedHouse: House
  month: number
  year: number
}

const StoreExpenseViewer: React.FC<StoreExpenseViewerProps> = ({
  selectedHouse,
  month,
  year,
}) => {
  const [chartData, setChartData] = useState<StoreNameData[]>([])
  const [storeOptions, setStoreOptions] = useState<
    { value: string; label: string }[]
  >([])
  const [selectedStoreName, setSelectedStoreName] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const { getToken, recall } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const token = await getToken()
      const data = await fetchSixMonthsExpensesByStoreName(
        selectedHouse,
        token || "",
        month,
        year
      )
      setChartData(data.storeComparison)
      setStoreOptions(
        data.storeNames.map((name) => ({ value: name, label: name }))
      )

      if (data.storeNames.length > 0) {
        setSelectedStoreName(data.storeNames[0])
      }

      setLoading(false)
    }
    fetchData()
  }, [selectedHouse, month, year, recall])

  const handleChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setSelectedStoreName(selectedOption?.value || "")
  }

  const filteredExpenses = chartData.find(
    (data) => data.name === selectedStoreName
  )

  const currencySymbol = getCurrencySymbol(selectedHouse)

  // Format tooltip content
  const renderTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
      return (
        <div className="p-2 text-gray-100 bg-gray-900 rounded shadow">
          <p className="font-semibold">{props.payload[0].payload.month}</p>
          <p>
            {currencySymbol}
            {props.payload[0].value.toFixed(2)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="max-w-3xl pt-3 pb-3 mx-auto rounded-md shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-center ">
        Store Expenses by Month
      </h2>

      {/* Searchable Dropdown */}
      <div className="mb-4">
        <Select
          options={storeOptions}
          onChange={handleChange}
          placeholder="Search and select a store..."
          className="text-black"
          value={storeOptions.find(
            (option) => option.value === selectedStoreName
          )}
          styles={{
            control: (styles) => ({
              ...styles,
              backgroundColor: "#1a202c",
              borderColor: "#2d3748",
            }),
            option: (styles, { isFocused }) => ({
              ...styles,
              backgroundColor: isFocused ? "#2d3748" : "#1a202c",
              color: "white",
            }),
            menu: (styles) => ({
              ...styles,
              backgroundColor: "#1a202c",
            }),
            singleValue: (styles) => ({
              ...styles,
              color: "white",
            }),
            input: (styles) => ({
              ...styles,
              color: "white",
            }),
          }}
          isClearable
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading...
        </p>
      ) : filteredExpenses ? (
        <>
          <h3 className="mb-3 text-lg font-semibold text-center text-blue-600 dark:text-blue-400">
            {filteredExpenses.name} Expenses
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={filteredExpenses.expenses}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="month" stroke="#FFFFFF" />
              <YAxis
                stroke="#FFFFFF"
                tickFormatter={(value) => `${currencySymbol}${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222222",
                  borderColor: "#444444",
                }}
                itemStyle={{ color: "#E0E0E0" }}
                formatter={(value: number) =>
                  `${currencySymbol}${value.toFixed(2)}`
                }
                cursor={{ fill: "none" }}
                content={renderTooltip}
              />
              <Bar
                dataKey="expenses"
                fill="#00C49F"
                stroke="#006F56"
                strokeWidth={2}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <p className="text-center">Select a store to view expenses</p>
      )}
    </div>
  )
}

export default StoreExpenseViewer
