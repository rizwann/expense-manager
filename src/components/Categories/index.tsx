import React, { useEffect, useState } from "react"
import { CategoryData, CategoryName, House } from "../../types"
import { fetchSixMonthsExpensesByCategory } from "../../utils/chartDataFetch"
import { useAuth } from "../../hooks/useAuth"

interface CategoryExpenseViewerProps {
  selectedHouse: House
}

const CategoryExpenseViewer: React.FC<CategoryExpenseViewerProps> = ({selectedHouse}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | "">(
    CategoryName.Grocery
  )
  const [chartData, setChartData] = useState<CategoryData[] | []>([])
  const {getToken} = useAuth()

useEffect(() => {
    const fetchData = async () => {
        const token = await getToken()
        const data = await fetchSixMonthsExpensesByCategory(selectedHouse, token || "")
        setChartData(data)
        console.log("balsal", data, typeof data)
    }
    fetchData()
} , [selectedHouse])
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value as CategoryName)
  }

  let filteredExpenses: CategoryData | undefined
    if (chartData) {
        filteredExpenses = chartData.find((data) => data.name === selectedCategory)
    }

  return (
    <div className="max-w-lg p-6 mx-auto text-gray-100 rounded-lg shadow-lg">
      <h2 className="mb-3 text-2xl font-bold text-center">
        Category Expenses By Month
      </h2>
      <div className="mb-2">
        <select
          id="category"
          value={selectedCategory}
          onChange={handleChange}
          className="w-full p-3 text-gray-100 bg-gray-900 border border-gray-600 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
        >
          <option value="" className="bg-gray-800">
            -- Select a Category --
          </option>
          {Object.values(CategoryName).map((category) => (
            <option
              key={category}
              value={category}
              className="text-gray-100 bg-gray-800"
            >
              {category}
            </option>
          ))}
        </select>
      </div>

      {filteredExpenses ? (
        <div className="p-4 rounded-md shadow-md">
          <h3 className="mb-4 text-xl font-semibold text-center text-blue-400">
            {filteredExpenses.name} Expenses
          </h3>
          <ul className="divide-y divide-gray-600">
            {filteredExpenses.expenses.map((expense) => (
              <li
                key={expense.month}
                className="flex justify-between py-2 text-sm text-gray-200"
              >
                <span>{expense.month}</span>
                <span className="font-medium text-green-300">
                  €{expense.expenses.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-center text-gray-400">
          Select a category to view expenses.
        </p>
      )}
    </div>
  )
}

export default CategoryExpenseViewer

