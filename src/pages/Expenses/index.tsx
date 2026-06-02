import { AddRounded, RestartAltRounded } from "@mui/icons-material"
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid"
import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import Add from "../../components/Add"
import DataTable from "../../components/DataTable"
import Spinner from "../../components/Spinner"
import Toaster from "../../components/Toaster"
import { useAuth } from "../../hooks/useAuth"
import "./expenses.scss"
import { Expense, House } from "../../types"
import { config } from "../../utils/config"
import { getCurrencySymbolByValue, getImage } from "../../utils/utils"
import { toast } from "react-toastify"

type ExpenseRow = Expense & {
  id?: string
  currency?: string
}

const Expenses = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [expenses, setExpenses] = useState<ExpenseRow[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<ExpenseRow[]>([])
  const [myself, setMyself] = useState(false)
  const [houses, setHouses] = useState<House[]>([])
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [refresh, setRefresh] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const { user, getToken } = useAuth()

  const columns: GridColDef[] = [
    {
      field: "image",
      headerName: "Logo",
      width: 60,
      sortable: false,
      renderCell: (params) => (
        <img
          src={getImage(params.row.category)}
          alt="store"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
            (e.currentTarget.src = "/noavatar.png")
          }
        />
      ),
    },
    {
      field: "storeName",
      headerName: "Store",
      width: 160,
      type: "string",
    },
    {
      field: "category",
      headerName: "Category",
      width: 120,
      type: "string",
    },
    {
      field: "houseName",
      headerName: "House",
      width: 160,
      type: "string",
    },
    {
      field: "description",
      headerName: "Description",
      width: 220,
      type: "string",
      disableColumnMenu: true,
    },
    {
      field: "involvedUsers",
      headerName: "Split With",
      width: 220,
      type: "array",
      renderCell: (params) => (
        <>
          {params.row.involvedUsers.length > 0 ? (
            <div className="data-page__pill-list">
              {params.row.involvedUsers.slice(0, 2).map((member: string) => (
                <div className="data-page__pill" key={member}>
                  {member}
                </div>
              ))}
              {params.row.involvedUsers.length > 2 && (
                <div className="data-page__pill-more">
                  +{params.row.involvedUsers.length - 2} more
                </div>
              )}
            </div>
          ) : (
            <span className="expenses__empty-cell">No users</span>
          )}
        </>
      ),
    },
    {
      field: "user",
      headerName: "Payer",
      width: 120,
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
      width: 140,
    },
    {
      field: "cost",
      headerName: "Cost",
      type: "number",
      width: 110,
      renderCell: (params) => (
        <strong className="expenses__amount">
          {getCurrencySymbolByValue(params.row.currency)}
          {params.row.cost.toFixed(2)}
        </strong>
      ),
    },
  ]

  useEffect(() => {
    const fetchHouses = async () => {
      const token = await getToken()
      try {
        const response = await axios.get<House[]>(
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
  }, [])

  const fetchExpenses = async () => {
    const token = await getToken()
    setSpinner(true)

    try {
      const responses = await Promise.all(
        houses.map(async (house) => {
          try {
            const response = await axios.get<Expense[]>(
              `${import.meta.env.VITE_API_URL}/api/expenses/house/${house.code}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )

            return response.data.map<ExpenseRow>((expense) => ({
              ...expense,
              id: expense._id,
              currency: house.currency,
            }))
          } catch (error) {
            console.error("Error fetching expenses:", error)
            return []
          }
        })
      )

      const allExpenses = responses
        .flat()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      setExpenses(allExpenses)
      setFilteredExpenses(allExpenses)
    } finally {
      setSpinner(false)
    }
  }

  useEffect(() => {
    if (houses.length > 0) {
      fetchExpenses()
    } else {
      setExpenses([])
      setFilteredExpenses([])
    }
  }, [houses, refresh])

  useEffect(() => {
    let filtered = [...expenses]

    if (selectedHouse) {
      filtered = filtered.filter((expense) => expense.houseCode === selectedHouse)
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
          new Date(expense.date).getMonth() + 1 === Number(selectedMonth)
      )
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (expense) =>
          new Date(expense.date).getFullYear() === Number(selectedYear)
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (expense) => expense.category === selectedCategory
      )
    }

    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setFilteredExpenses(filtered)
  }, [
    selectedHouse,
    myself,
    selectedMonth,
    selectedYear,
    selectedCategory,
    expenses,
    user,
  ])

  const handleDelete = async (id: string, _name: string) => {
    const token = await getToken()
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setExpenses((prev) => prev.filter((expense) => expense._id !== id))
      toast.success("Expense deleted successfully.")
      setRefresh((prev) => !prev)
    } catch (error: any) {
      console.error("Error deleting expense:", error)
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the expense."
      )
    }
  }

  const handleResetFilters = () => {
    setSelectedHouse(null)
    setSelectedMonth(null)
    setSelectedYear(null)
    setSelectedCategory(null)
    setMyself(false)
  }

  const categoryOptions = useMemo(
    () => Array.from(new Set(expenses.map((expense) => expense.category))).sort(),
    [expenses]
  )

  const yearOptions = useMemo(
    () =>
      Array.from(
        new Set(expenses.map((expense) => new Date(expense.date).getFullYear()))
      ).sort((a, b) => b - a),
    [expenses]
  )

  const totalCostLabel = useMemo(() => {
    const totals = filteredExpenses.reduce<Record<string, number>>((acc, expense) => {
      const currency = expense.currency || "USD"
      acc[currency] = (acc[currency] || 0) + expense.cost
      return acc
    }, {})

    const entries = Object.entries(totals)
    if (entries.length === 0) return "0"

    return entries
      .map(([currency, amount]) => `${getCurrencySymbolByValue(currency)}${amount.toFixed(2)}`)
      .join(" · ")
  }, [filteredExpenses])

  const activeFilterCount = [
    selectedHouse,
    selectedMonth,
    selectedYear,
    selectedCategory,
    myself ? "myself" : null,
  ].filter(Boolean).length

  const representedHouseCount = new Set(
    filteredExpenses.map((expense) => expense.houseCode)
  ).size

  const latestExpenseLabel =
    filteredExpenses[0]?.date
      ? new Date(filteredExpenses[0].date).toLocaleDateString("en-DE", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "No expenses yet"

  return (
    <div className="expenses data-page">
      {spinner && <Spinner />}

      <section className="data-page__hero">
        <div className="data-page__heading-row">
          <div className="data-page__title-block">
            <div className="data-page__eyebrow">Expense ledger</div>
            <h1 className="data-page__title">Expenses</h1>
            <p className="data-page__subtitle">
              Review household spending across stores, categories, payers, and
              shared splits. The filters below reshape the whole ledger without
              leaving the page.
            </p>
          </div>

          <div className="data-page__actions">
            <button
              type="button"
              className="data-page__secondary-btn"
              onClick={handleResetFilters}
              disabled={activeFilterCount === 0}
            >
              <RestartAltRounded fontSize="small" />
              Reset Filters
            </button>
            <button
              type="button"
              className="data-page__primary-btn"
              onClick={() => setModalOpen(true)}
            >
              <AddRounded fontSize="small" />
              Add Expense
            </button>
          </div>
        </div>

        <div className="data-page__stats">
          <div className="data-page__stat">
            <span className="data-page__stat-label">Visible Expenses</span>
            <span className="data-page__stat-value">{filteredExpenses.length}</span>
            <span className="data-page__stat-meta">
              {activeFilterCount > 0
                ? `${activeFilterCount} active filter${activeFilterCount > 1 ? "s" : ""}`
                : "Showing the full ledger"}
            </span>
          </div>

          <div className="data-page__stat">
            <span className="data-page__stat-label">Visible Spend</span>
            <span className="data-page__stat-value">{totalCostLabel}</span>
            <span className="data-page__stat-meta">
              Combined totals grouped by house currency
            </span>
          </div>

          <div className="data-page__stat">
            <span className="data-page__stat-label">Houses in View</span>
            <span className="data-page__stat-value">{representedHouseCount}</span>
            <span className="data-page__stat-meta">
              Out of {houses.length} connected house{houses.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="data-page__stat">
            <span className="data-page__stat-label">Latest Expense</span>
            <span className="data-page__stat-value">{latestExpenseLabel}</span>
            <span className="data-page__stat-meta">
              Most recent entry in the current result set
            </span>
          </div>
        </div>
      </section>

      <section className="data-page__toolbar">
        <div className="data-page__toolbar-top">
          <div>
            <div className="data-page__toolbar-title">Refine the ledger</div>
            <div className="data-page__toolbar-copy">
              Filter by house, category, month, year, or limit the results to
              expenses that involve you.
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="data-page__chips">
              <div className="data-page__chip">
                {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
              </div>
              {selectedHouse && (
                <div className="data-page__chip">
                  House:{" "}
                  {houses.find((house) => house.code === selectedHouse)?.description ||
                    selectedHouse}
                </div>
              )}
              {selectedCategory && (
                <div className="data-page__chip">Category: {selectedCategory}</div>
              )}
            </div>
          )}
        </div>

        <div className="data-page__filter-grid">
          <div className="data-page__toggle">
            <span className="data-page__filter-label">Participation</span>
            <label className="data-page__toggle-card">
              <input
                type="checkbox"
                checked={myself}
                onChange={() => setMyself((prev) => !prev)}
              />
              <span className="data-page__toggle-copy">
                <span className="data-page__toggle-title">Only mine</span>
                <span className="data-page__toggle-meta">
                  Show expenses you paid or joined
                </span>
              </span>
            </label>
          </div>

          <div className="data-page__filter">
            <label className="data-page__filter-label" htmlFor="expense-house-filter">
              House
            </label>
            <select
              id="expense-house-filter"
              className="data-page__control"
              value={selectedHouse || ""}
              onChange={(e) => setSelectedHouse(e.target.value || null)}
            >
              <option value="">All Houses</option>
              {houses.map((house) => (
                <option key={house._id} value={house.code}>
                  {house.description}
                </option>
              ))}
            </select>
          </div>

          <div className="data-page__filter">
            <label className="data-page__filter-label" htmlFor="expense-category-filter">
              Category
            </label>
            <select
              id="expense-category-filter"
              className="data-page__control"
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
            >
              <option value="">All Categories</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="data-page__filter">
            <label className="data-page__filter-label" htmlFor="expense-month-filter">
              Month
            </label>
            <select
              id="expense-month-filter"
              className="data-page__control"
              value={selectedMonth || ""}
              onChange={(e) => setSelectedMonth(e.target.value || null)}
            >
              <option value="">All Months</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  {new Date(0, i).toLocaleString("en", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          <div className="data-page__filter">
            <label className="data-page__filter-label" htmlFor="expense-year-filter">
              Year
            </label>
            <select
              id="expense-year-filter"
              className="data-page__control"
              value={selectedYear || ""}
              onChange={(e) => setSelectedYear(e.target.value || null)}
            >
              <option value="">All Years</option>
              {yearOptions.map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="data-page__table-shell">
        <div className="data-page__table-head">
          <div>
            <div className="data-page__table-kicker">Expense records</div>
            <div className="data-page__table-title">Filtered ledger</div>
            <div className="data-page__table-note">
              Browse, search, and act on every expense entry.
            </div>
          </div>
          <div className="data-page__table-meta">
            {filteredExpenses.length} result{filteredExpenses.length === 1 ? "" : "s"}
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={filteredExpenses}
          slug="expenses"
          handleDelete={handleDelete}
        />
      </section>

      <Add
        setModalOpen={setModalOpen}
        slug="Expense"
        columns={config.expenseFields}
        setRefresh={setRefresh}
        modalOpen={modalOpen}
      />

      <Toaster />
    </div>
  )
}

export default Expenses
