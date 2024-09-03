import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import Add from "../../components/Add"
import DataTable from "../../components/DataTable"
import Button from "../components/Button"
import "./expenses.scss"
import { config } from "../../utils/config"
import axios from "axios"
import { Expense, House } from "../../types"
import { toast } from "react-toastify"
import { useAuth } from "../../hooks/useAuth"
import Spinner from "../../components/Spinner"
import Toaster from "../../components/Toaster"

type Props = {}

// Define the columns
const columns: GridColDef[] = [
  {
    field: "image",
    headerName: "Logo",
    width: 50,
    renderCell: (params) => (
      <img
        src={
          params.row.storeImg
            ? `${import.meta.env.VITE_API_URL}/${params.row.storeImg}`
            : "/noavatar.png "
        }
        alt="store"
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
          (e.currentTarget.src = "/noavatar.png")
        }
      />
    ),
  },
  {
    field: "storeName",
    headerName: "Store name",
    width: 100,
    type: "string",
  },
  {
    field: "category",
    headerName: "Category",
    width: 100,
    type: "string",
  },
  {
    field: "houseName",
    headerName: "House",
    width: 150,
    type: "string",
  },
  {
    field: "description",
    headerName: "Description",
    width: 150,
    type: "string",
    disableColumnMenu: true,
  },
  {
    field: "involvedUsers",
    headerName: "Involved",
    width: 150,
    type: "array",
    renderCell: (params) => {
      return (
        <>
          {params.row.involvedUsers.length > 0 ? (
            <div className="houses">
              {params.row.involvedUsers.slice(0, 2).map((user: any) => {
                return (
                  <div className="house">
                    <p>{user}</p>
                  </div>
                )
              })}
              {params.row.involvedUsers.length > 2 && (
                <div className="more">
                  +{params.row.involvedUsers.length - 2} more
                </div>
              )}
            </div>
          ) : (
            <p>No Users</p>
          )}
        </>
      )
    },
  },
  {
    field: "user",
    headerName: "Payer",
    width: 100,
    type: "string",
  },
  {
    field: "date",
    headerName: "Date",
    valueGetter: (params: GridValueGetterParams) =>
      new Date(params.row.date).toLocaleDateString("en-DE", {
        hour: "2-digit",
        minute: "2-digit",
        month: "short",
        day: "numeric",
      }),
    width: 110,
  },
  {
    field: "cost",
    headerName: "Cost",
    type: "number",
    width: 80,
    renderCell: (params) => {
      return (
        <strong style={{ color: "green" }}>
          €{params.row.cost.toFixed(2)}
        </strong>
      )
    }
  },
]

const Expenses = (props: Props) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [mobileExpenses, setMobileExpenses] = useState<Expense[]>([])
  const [myself, setMyself] = useState(false)
  const [houses, setHouses] = useState<House[]>([])
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [refresh, setRefresh] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const { user } = useAuth()
  const token = localStorage.getItem("token")

  // Fetch houses
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/houses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setHouses(response.data)
      } catch (error) {
        console.error("Error fetching houses:", error)
      }
    }

    fetchHouses()
  }, [token])

  // Fetch expenses from all houses
  const fetchExpenses = async () => {
    setSpinner(true)
    try {
      const allExpenses: Expense[] = []
      // Loop through each house to fetch its expenses
      for (const house of houses) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/expenses/house/${house.code}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )

          const houseExpenses = response?.data?.map(
            (expense: Expense) => ({
              ...expense,
              id: expense._id,
            })
          )

          allExpenses.push(...houseExpenses)
        } catch (error) {
          console.error("Error fetching expenses:", error)
        }
      }
      setSpinner(false)
      setExpenses(allExpenses) // Set all combined expenses to state
      // set all the filter to null
      setSelectedHouse(null)
      setSelectedMonth(null)
      setSelectedYear(null)
      setMyself(false)
    } catch (error) {
      console.error("Error fetching expenses:", error)
      setSpinner(false)
    }
  }

  // Fetch expenses on component mount and when houses change
  useEffect(() => {
    if (houses.length > 0) {
      fetchExpenses()
    }
  }, [houses, refresh])

  // Filter expenses based on house, user involvement, month, and year
  useEffect(() => {
    let filtered = expenses

    if(expenses.length > 0) {
      if (selectedHouse) {
        filtered = filtered.filter(
          (expense) => expense.houseCode === selectedHouse
        )
      }
  
      if (myself && user) {
        filtered = filtered.filter(
          (expense) =>
            expense.involvedUsers.includes(user.username) ||
            expense.userId === user._id
        )
      }
  
      if (selectedMonth) {
        filtered = filtered.filter(
          (expense) =>
            new Date(expense.date).getMonth() + 1 === parseInt(selectedMonth)
        )
      }
  
      if (selectedYear) {
        filtered = filtered.filter(
          (expense) =>
            new Date(expense.date).getFullYear() === parseInt(selectedYear)
        )
      }
  
      setFilteredExpenses(filtered)
    }
  }, [selectedHouse, myself, selectedMonth, selectedYear, expenses, user])

  const handleDelete = async (id: string, name: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setExpenses(expenses.filter((expense) => expense._id !== id))
      toast.success(`Expense deleted successfully.`)
    } catch (error: any) {
      console.error("Error deleting expense:", error)
      toast.error(
        error.response.data.message ||
          "An error occurred while saving the expense."
      )
    }
  }
  useEffect(() => {
      const mobileExpenses = filteredExpenses.map((expense) => {
        return {
          ...expense,
          date: new Date(expense.date).toLocaleDateString("en-DE", {
            hour: "2-digit",
            minute: "2-digit",
            month: "short",
            day: "numeric",
          }),
        }
      })
  
      setMobileExpenses(mobileExpenses)
    
  } , [])
  
  return (
    <div className="expenses">
      {spinner && <Spinner />}
      <div className="info">
        <h1>Expenses</h1>
        <Button text="➕  Add Expense" onClick={() => setModalOpen(true)} size="lg" />

        {/* Myself Filter Checkbox */}
        <label className="dark-input">
          <input
            type="checkbox"
            checked={myself}
            onChange={() => setMyself(!myself)}
          />
          Myself
        </label>

        {/* House Selector */}
        <select
          className="dark-input"
          value={selectedHouse || ""}
          onChange={(e) => setSelectedHouse(e.target.value)}
        >
          <option value="">All Houses</option>
          {houses.map((house) => (
            <option key={house._id} value={house.code}>
              {house.description}
            </option>
          ))}
        </select>

        {/* Month Selector */}
        <select
          className="dark-input"
          value={selectedMonth || ""}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("en", { month: "long" })}
            </option>
          ))}
        </select>

        {/* Year Selector */}
        <select
          className="dark-input"
          value={selectedYear || ""}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">All Years</option>
          {Array.from(
            new Set(
              expenses.map((expense) => new Date(expense.date).getFullYear())
            )
          ).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        rows={filteredExpenses}
        slug="expenses"
        handleDelete={handleDelete}
      />
      {modalOpen && (
        <Add
          setModalOpen={setModalOpen}
          slug="Expense"
          columns={config.expenseFields}
          setRefresh={setRefresh}
        />
      )}
      <Toaster />
    </div>
  )
}

export default Expenses
