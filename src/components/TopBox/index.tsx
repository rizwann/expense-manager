import { useEffect, useState } from "react"
import { Expense, House, IUser } from "../../types"
import "./topBox.scss"
import axios from "axios"
import { NavLink } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { getCurrencySymbol, getImage } from "../../utils/utils"
import useMediaQuery from "../../hooks/userMediaQuery"

interface IProps {
  user: IUser
  houseCode: string
  month: number
  year: number
  selectedHouse: House
}

const TopBox: React.FC<IProps> = ({ user, houseCode, month, year, selectedHouse }) => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [lastTenExpenses, setLastTenExpenses] = useState<Expense[]>([])
  const {getToken} = useAuth()
  const selectedMonth = month - 1
  const isNotBigScreen = useMediaQuery(1024)

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = await getToken()
      try {
        const URI = `${import.meta.env.VITE_API_URL}/api/expenses/house/${
          houseCode
        }`
        const response = await axios.get<Expense[]>(URI, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
       
        setExpenses(response.data)
      } catch (error) {
        console.error("Error fetching expenses:", error)
      }
    }
    fetchExpenses()
  }, [user])

  useEffect(() => {
    const limit = isNotBigScreen ? 10 : 15
    const lastExpenses = expenses
      ?.filter(
        (expense) =>
          new Date(expense.date).getMonth() === selectedMonth &&
          new Date(expense.date).getFullYear() === year
      )
      .slice(0, limit)
    setLastTenExpenses(lastExpenses)
  }, [month, year, expenses, isNotBigScreen])

  return (
    <div className="top-box">
      <h1>Expenses</h1>
    <div className="list">
        {lastTenExpenses?.map((expense) => {
          const date = new Date(expense.date).toLocaleDateString("en-DE", {
            month: "short",
            day: "numeric",
          })
          return (
            <div className="list-item" key={expense._id}>
              <NavLink className="user" to={`/expenses/${expense._id}`}>
                <img
                  src={getImage(expense.category)}
                  alt={user?.name || "user"}
                />

                <div className="user-texts">
                  <span className="storename">{expense.storeName}</span>
                  <span className="date">{date}</span>
                </div>
              </NavLink>
              <span className="amount">{getCurrencySymbol(selectedHouse)}{expense.cost.toFixed(2)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TopBox
