import React, { useEffect, useState } from "react"
import Select, { StylesConfig } from "react-select"
import { House, StoreNameData } from "../../types"
import { fetchSixMonthsExpensesByStoreName } from "../../utils/chartDataFetch"
import { useAuth } from "../../hooks/useAuth"
import { getCurrencySymbol } from "../../utils/utils"
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import "./stores.scss"
import { useThemeContext } from "../../context/ThemeContext"
type StoreOption = { value: string; label: string }

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
  const [storeOptions, setStoreOptions] = useState<StoreOption[]>([])
  const [selectedStoreName, setSelectedStoreName] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const { getToken, recall } = useAuth()
  const { colors } = useThemeContext()

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
    selectedOption: StoreOption | null
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
        <div
          style={{
            background: colors.tooltipBg,
            color: colors.text,
            padding: "8px 12px",
            borderRadius: 8,
            border: `1px solid ${colors.border}`,
          }}
        >
          <p style={{ fontWeight: 600, marginBottom: 4 }}>
            {props.payload[0].payload.month}
          </p>
          <p style={{ fontWeight: 500 }}>
            {currencySymbol}
            {props.payload[0].value.toFixed(2)}
          </p>
        </div>
      )
    }
    return null
  }

  const selectThemeStyles: StylesConfig<StoreOption, false> = {
    control: (styles, state) => ({
      ...styles,
      backgroundColor: "var(--color-surface)",
      borderColor: state.isFocused ? "var(--color-primary)" : "var(--color-secondary)",
      color: "var(--color-text)",
      boxShadow: state.isFocused ? "0 0 0 1px var(--color-primary)" : styles.boxShadow,
      "&:hover": {
        borderColor: "var(--color-primary)",
      },
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "var(--color-primary)"
        : isFocused
        ? "rgba(0, 106, 220, 0.15)"
        : "var(--color-surface)",
      color: isSelected ? "var(--color-button-text)" : "var(--color-text)",
    }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: "var(--color-surface)",
      color: "var(--color-text)",
    }),
    singleValue: (styles) => ({
      ...styles,
      color: "var(--color-text)",
    }),
    input: (styles) => ({
      ...styles,
      color: "var(--color-text)",
    }),
    placeholder: (styles) => ({
      ...styles,
      color: "var(--color-secondary)",
    }),
    dropdownIndicator: (styles) => ({
      ...styles,
      color: "var(--color-text)",
      "&:hover": {
        color: "var(--color-primary)",
      },
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      backgroundColor: "var(--color-secondary)",
    }),
    clearIndicator: (styles) => ({
      ...styles,
      color: "var(--color-text)",
      "&:hover": {
        color: "var(--color-primary)",
      },
    }),
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: "rgba(0, 106, 220, 0.15)",
      color: "var(--color-text)",
    }),
    menuList: (styles) => ({
      ...styles,
      backgroundColor: "var(--color-surface)",
    }),
  }

  return (
    <div className="store-expense">
      <h2>Store Expenses by Month</h2>
      <div className="store-selector">
        <label htmlFor="store-select">Store</label>
        <Select
          options={storeOptions}
          onChange={handleChange}
          placeholder="Search and select a store..."
          value={storeOptions.find(
            (option) => option.value === selectedStoreName
          )}
          styles={selectThemeStyles}
          isClearable
          inputId="store-select"
        />
      </div>

      {loading ? (
        <p className="category-empty">Loading...</p>
      ) : filteredExpenses ? (
        <div className="chart-container">
          <h3 className="store-summary">{filteredExpenses.name} Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={filteredExpenses.expenses}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="month"
                stroke={colors.muted}
                tick={{ fill: colors.text }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.tooltipBg,
                  borderColor: colors.border,
                  color: colors.text,
                }}
                itemStyle={{ color: colors.text }}
                formatter={(value: number) =>
                  `${currencySymbol}${value.toFixed(2)}`
                }
                cursor={{ fill: "none" }}
                content={renderTooltip}
              />
              <Bar
                dataKey="expenses"
                fill={colors.primary}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="category-empty">
          Select a store to view expenses
        </p>
      )}
    </div>
  )
}

export default StoreExpenseViewer
