import React, { useState, useEffect, ReactNode } from "react"
import { House, TransactionData } from "../../types"
import axios from "axios"
import {
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material"
import {
  AttachMoney,
  ArrowForward,
  AccountBalance,
  Home,
  Euro,
} from "@mui/icons-material"
import { motion } from "framer-motion"
import { useAuth } from "../../hooks/useAuth"
import { months } from "../../menu-item"

// Helper function to get the current year and month
const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonth = () => new Date().toLocaleString('default', { month: 'long' });

const years: any[] = Array.from({ length: 6 }, (_, i) => getCurrentYear() - i)
years.unshift('All Years')

const TransactionSummary: React.FC = () => {
  const { selectedHouse, user, getToken } = useAuth()

  const [data, setData] = useState<TransactionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [houses, setHouses] = useState<House[]>([])
  const [selectedHouseLocal, setSelectedHouseLocal] = useState<string>(
    selectedHouse?.code || ""
  )
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth())
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear())
  const isAdmin = user ? !!(user.username === "RizwanKabir") : false

  // Fetch houses for the dropdown
  const fetchHouses = async () => {
    const token = await getToken()
    const houseApi = isAdmin
      ? `${import.meta.env.VITE_API_URL}/api/houses/all`
      : `${import.meta.env.VITE_API_URL}/api/houses`
    try {
      const response = await axios.get<House[]>(houseApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setHouses(response.data)
    } catch (error) {
      console.error("Error fetching houses:", error)
    }
  }

  // Fetch transaction data for selected house, month, and year
  const fetchTransactionData = async (houseCode: string, month: string, year: any) => {
    const monthNumber = month === "All Months" ? 'all' : months.indexOf(month)
    const selectedYear = year === 'All Years' ? 'all' : year
    setLoading(true)
    const token = await getToken()
    try {
      const response = await axios.get<TransactionData>(
        `${import.meta.env.VITE_API_URL}/api/expenses/balance/${houseCode}/${monthNumber}/${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setData(response.data)
    } catch (error) {
      console.error("Error fetching transaction data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHouses()
    fetchTransactionData(selectedHouseLocal, selectedMonth, selectedYear)
  }, [selectedHouseLocal, selectedMonth, selectedYear])

  const handleHouseChange = (
    event: SelectChangeEvent<string>,
    _child: ReactNode
  ) => {
    setSelectedHouseLocal(event.target.value as string)
  }

  const handleMonthChange = (event: SelectChangeEvent<string>) => {
    setSelectedMonth(event.target.value as string)
  }

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(event.target.value as number)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    )
  }

  if (!data) {
    return <div className="text-center text-white">No data available</div>
  }

  const {
    netChanges,
    givers,
    receivers,
    paymentInstructionsOptimized,
    balances,
    totalExpenseByUser,
    transactions,
  } = data

  const selectedHouseData = houses?.find(
    (house) => house.code === selectedHouseLocal
  )

  // Calculate Total Expenses
  const totalExpenses = Object.values(totalExpenseByUser).reduce(
    (acc, expense) => acc + expense,
    0
  )

  return (
    <motion.div
      className="p-6 mx-auto text-white rounded-lg shadow-lg max-w-7xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      <div className="flex flex-col items-center mb-12">
        {selectedHouseData && (
          <motion.div
            className="flex flex-col items-center justify-center mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={selectedHouseData.image || "/app.svg"}
              alt={selectedHouseData.description}
              className="object-cover w-32 h-32 border-4 border-gray-800 rounded-full shadow-lg ring-4 ring-blue-500"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                (e.currentTarget.src = "/app.svg")
              }
            />
            <h1 className="mt-4 text-3xl font-bold text-center">
              {selectedHouseData.description}
            </h1>
          </motion.div>
        )}

        <motion.div
          className="flex flex-col items-center justify-between w-full gap-5 p-4 mb-2 text-white md:flex-row "
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* House selection */}
          <FormControl variant="outlined" className="w-full mb-6">
            <InputLabel id="select-house-label">Select House</InputLabel>
            <Select
              labelId="select-house-label"
              value={selectedHouseLocal}
              onChange={handleHouseChange}
              label="Select House"
              className="text-white bg-gray-800"
              renderValue={(selected) => {
                const selectedHouse = houses.find(house => house.code === selected);
                return selectedHouse ? selectedHouse.description : '';
              }}
            >
              {houses.map((house) => (
                <MenuItem key={house.code} value={house.code}>
                  {house.image ? <img
                      src={house.image}
                      alt={house.description}
                      className="object-cover w-8 h-8 mr-2 border-4 border-gray-800 rounded-full ring-4 ring-gray-700"
                      onError={(
                        e: React.SyntheticEvent<HTMLImageElement, Event>
                      ) => (e.currentTarget.src = "/app.svg")}
                    />
                    : <Home className="mr-2 text-gray-500 rounded-full ring-4 ring-gray-700" />
                  }
                  {house.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Month selection */}
          <FormControl variant="outlined" className="w-full mb-4">
            <InputLabel id="select-month-label">Select Month</InputLabel>
            <Select
              labelId="select-month-label"
              value={selectedMonth}
              onChange={handleMonthChange}
              label="Select Month"
              className="text-white bg-gray-800"
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Year selection */}
          <FormControl variant="outlined" className="w-full mb-4">
            <InputLabel id="select-year-label">Select Year</InputLabel>
            <Select
              labelId="select-year-label"
              value={selectedYear}
              onChange={handleYearChange}
              label="Select Year"
              className="text-white bg-gray-800"
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </motion.div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Net Changes */}
        <motion.div
          className="p-4 bg-gray-800 rounded-lg"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="flex items-center mb-4 text-xl font-semibold">
            <AccountBalance className="mr-2" /> Net Changes
          </h2>
          <ul>
            {Object.entries(netChanges).map(([person, amount], index) => (
              <li key={person} className="flex justify-between">
                <span>
                  {index + 1}. {person}
                </span>
                <span>{amount >= 0 ? `+${amount}` : `${amount}`}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Balances */}
        <motion.div
          className="p-4 bg-gray-800 rounded-lg"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="flex items-center mb-4 text-xl font-semibold">
            <AccountBalance className="mr-2" /> Balances
          </h2>
          <ul>
            {Object.entries(balances).map(([person, balance], index) => (
              <li key={person} className="flex justify-between">
                <span>
                  {index + 1}. {person}
                </span>
                <span>{balance >= 0 ? `+${balance.toFixed(2)}` : `${balance.toFixed(2)}`}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Total Expenses by User */}
        <motion.div
          className="p-4 bg-gray-800 rounded-lg"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="flex items-center mb-4 text-xl font-semibold">
            <AttachMoney className="mr-2" /> Total Expenses by User
          </h2>
          <ul>
            {Object.entries(totalExpenseByUser).map(([user, total], index) => (
              <li key={user} className="flex justify-between">
                <span>
                  {index + 1}. {user}
                </span>
                <span>€{total.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Givers */}
        <motion.div
          className="p-4 bg-gray-800 rounded-lg sm:col-span-2 lg:col-span-1"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-xl font-semibold">Givers</h2>
          <ul>
            {givers.map((giver, index) => (
              <li key={giver}>
                {index + 1}. {giver}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Receivers */}
        <motion.div
          className="p-4 bg-gray-800 rounded-lg sm:col-span-2 lg:col-span-1"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-xl font-semibold">Receivers</h2>
          <ul>
            {receivers.map((receiver, index) => (
              <li key={receiver}>
                {index + 1}. {receiver}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Total Expenses */}
        <motion.div
          className="p-4 bg-gray-800 rounded-lg sm:col-span-2 lg:col-span-1"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="flex items-center mb-4 text-xl font-semibold">
            <Euro className="mr-2" /> Total House Expense
          </h2>
          <div className="text-center">
            <span className="text-2xl font-bold">
              €{totalExpenses.toFixed(2)}
            </span>
          </div>
        </motion.div>

        {/* Payment Instructions */}
        <motion.div
          className="p-4 bg-gray-800 rounded-lg sm:col-span-2"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {" "}
          <h2 className="mb-4 text-xl font-semibold">
            Payment Instructions
          </h2>{" "}
          <ul>
            {" "}
            {paymentInstructionsOptimized.map(({ from, to, amount }, index) => (
              <li key={index} className="flex justify-between">
                {" "}
                <span className="mr-2">
                  {" "}
                  {index + 1}. {from} <ArrowForward className="mx-2" /> {to}{" "}
                </span>{" "}
                <span>€{amount.toFixed(2)}</span>{" "}
              </li>
            ))}{" "}
          </ul>{" "}
        </motion.div>
        {/* Transactions */}
        <motion.div
          className="p-4 bg-gray-800 rounded-lg sm:col-span-2"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-xl font-semibold">Transactions</h2>
          <ul>
            {transactions.map(({ from, to, amount }, index) => (
              <li key={index} className="flex justify-between">
                <span className="mr-2">
                  {index + 1}. {from} <ArrowForward className="mx-2" /> {to}
                </span>
                <span>€{amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default TransactionSummary
