import React, { useEffect, useMemo, useState } from "react"
import { CategoryData, CategoryName, House } from "../../types"
import { fetchSixMonthsExpensesByCategory } from "../../utils/chartDataFetch"
import { useAuth } from "../../hooks/useAuth"
import { getCurrencySymbol } from "../../utils/utils"
import "./categories.scss"

interface CategoryExpenseViewerProps {
  selectedHouse: House
  month: number
  year: number
}

const CategoryExpenseViewer: React.FC<CategoryExpenseViewerProps> = ({
  selectedHouse,
  month,
  year,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | "">(
    CategoryName.Grocery
  )
  const [chartData, setChartData] = useState<CategoryData[] | []>([])
  const { getToken, recall } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken()
      const data = await fetchSixMonthsExpensesByCategory(
        selectedHouse,
        token || "",
        month,
        year
      )
      setChartData(data)
    }
    fetchData()
  }, [selectedHouse, month, year, recall])
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value as CategoryName)
  }

  const filteredExpenses = useMemo(() => {
    if (!chartData || chartData.length === 0) return undefined
    return chartData.find((data) => data.name === selectedCategory)
  }, [chartData, selectedCategory])

  return (
    <div className="category-expense">
      <h2>Category Expenses By Month</h2>
      <div className="category-selector">
        <label htmlFor="category">Category</label>
        <select id="category" value={selectedCategory} onChange={handleChange}>
          <option value="">-- Select a Category --</option>
          {Object.values(CategoryName).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {filteredExpenses ? (
        <div className="category-summary">
          <h3>{filteredExpenses.name} Expenses</h3>
          <ul>
            {filteredExpenses.expenses.map((expense) => (
              <li key={expense.month}>
                <span>{expense.month}</span>
                <span>
                  {getCurrencySymbol(selectedHouse)}
                  {expense.expenses.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="category-empty">
          Select a category to view expenses.
        </p>
      )}
    </div>
  )
}

export default CategoryExpenseViewer
