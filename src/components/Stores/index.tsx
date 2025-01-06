import React, { useEffect, useState } from "react"
import { House, StoreNameData } from "../../types"
import { fetchSixMonthsExpensesByStoreName } from "../../utils/chartDataFetch"
import { useAuth } from "../../hooks/useAuth"
import { getCurrencySymbol } from "../../utils/utils"

interface StoreExpenseViewerProps {
  selectedHouse: House
  month: number
  year: number
}

const StoreExpenseViewer: React.FC<StoreExpenseViewerProps> = ({selectedHouse, month, year}) => {
  const [chartData, setChartData] = useState<StoreNameData[]>([])
  const [allStoreNames, setAllStoreNames] = useState<string[] | []>([])
  const [selectedStoreName, setSelectedStoreName] = useState<string | "">("")
  const {getToken} = useAuth()

useEffect(() => {
    const fetchData = async () => {
        const token = await getToken()
        const data = await fetchSixMonthsExpensesByStoreName(selectedHouse, token || "", month, year)
        setChartData(data.storeComparison)
        setAllStoreNames(data.storeNames)
    }
    fetchData()
} , [selectedHouse, month, year])
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStoreName(event.target.value)
  }


    let filteredExpenses: StoreNameData | undefined
        if (chartData?.length > 0) {
            filteredExpenses = chartData.find((data) => data.name === selectedStoreName)
        }

  return (
    <div className="max-w-lg p-6 mx-auto text-gray-100 rounded-lg shadow-lg">
      <h2 className="mb-3 text-2xl font-bold text-center">
        Store Expenses By Month
      </h2>
      <div className="mb-2">
        <select
          id="storeName"
          value={selectedStoreName}
          onChange={handleChange}
          className="w-full p-3 text-gray-100 bg-gray-900 border border-gray-600 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
        >
          <option value="" className="bg-gray-800">
            -- Select a Store --
          </option>
          {allStoreNames.map((storeName:string) => (
            <option
              key={storeName}
              value={storeName}
              className="text-gray-100 bg-gray-800"
            >
              {storeName}
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
                  {getCurrencySymbol(selectedHouse)}{expense.expenses.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-center text-gray-400">
          Select a store to view expenses.
        </p>
      )}
    </div>
  )
}

export default StoreExpenseViewer

