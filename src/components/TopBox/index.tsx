import { useEffect, useState } from "react"
import { Expense, IUser } from "../../types"
import "./topBox.scss"
import axios from "axios"
import { NavLink } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { getImage } from "../../utils/utils"

interface IProps {
  user: IUser
  houseCode: string
}

const TopBox: React.FC<IProps> = ({ user, houseCode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const {getToken} = useAuth()

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
        const lastTenExpenses = response.data.slice(0, 10)
        setExpenses(lastTenExpenses)
      } catch (error) {
        console.error("Error fetching expenses:", error)
      }
    }
    fetchExpenses()
  }, [user])

  return (
    <div className="top-box">
      <h1>Expenses</h1>
      <div className="list">
        {expenses?.map((expense) => {
          const date = new Date(expense.date).toLocaleDateString("en-DE", {
            month: "short",
            day: "numeric",
          })
          return (
            <div className="list-item" key={expense._id}
              
            >
              <NavLink className="user" to={`/expenses/${expense._id}`}>
                <img  src={
                  getImage(expense.category)
                }
            alt={user?.name || "user"}
            // onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
            //   (e.currentTarget.src = "/storeName.svg")
            // }
            />

                <div className="user-texts">
                  <span className="storename">{expense.storeName}</span>
                  <span className="date">{date}</span>
                </div>
              </NavLink>
              <span className="amount">€{expense.cost.toFixed(2)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TopBox
