import { AddRounded } from "@mui/icons-material"
import { GridColDef } from "@mui/x-data-grid"
import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import DataTable from "../../components/DataTable"
import Spinner from "../../components/Spinner"
import Toaster from "../../components/Toaster"
import AddUser from "../../components/AddUser"
import { useAuth } from "../../hooks/useAuth"
import "./users.scss"
import { IUser } from "../../types"
import { config } from "../../utils/config"
import { toast } from "react-toastify"

const columns: GridColDef[] = [
  {
    field: "name",
    type: "string",
    headerName: "Name",
    width: 170,
  },
  {
    field: "username",
    type: "string",
    headerName: "Username",
    width: 170,
  },
  {
    field: "email",
    type: "string",
    headerName: "Email",
    width: 230,
  },
  {
    field: "active",
    headerName: "Verified",
    width: 130,
    type: "boolean",
  },
  {
    field: "houseNames",
    headerName: "Houses",
    width: 260,
    type: "array",
    renderCell: (params) => (
      <>
        {params.row.houseNames.length > 0 ? (
          <div className="data-page__pill-list">
            {params.row.houseNames.slice(0, 2).map((house: string) => (
              <div className="data-page__pill" key={house}>
                {house}
              </div>
            ))}
            {params.row.houseNames.length > 2 && (
              <div className="data-page__pill-more">
                +{params.row.houseNames.length - 2} more
              </div>
            )}
          </div>
        ) : (
          <span className="users__empty-cell">No houses</span>
        )}
      </>
    ),
  },
]

const Users = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const { getToken } = useAuth()
  const [refresh, setRefresh] = useState(false)
  const [users, setUsers] = useState<IUser[]>([])
  const [spinner, setSpinner] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      setSpinner(true)
      const token = await getToken()
      const usersApi = `${import.meta.env.VITE_API_URL}/api/user/all`
      try {
        const data = await axios.get<IUser[]>(usersApi, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUsers(data.data)
      } catch (error: any) {
        console.error("Error fetching users:", error)
        toast.error(
          error.response?.data?.message ||
            "An error occurred while fetching the users."
        )
      } finally {
        setSpinner(false)
      }
    }

    fetchUsers()
  }, [refresh])

  const handleDelete = async (id: string, name: string) => {
    const token = await getToken()
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUsers((prev) => prev.filter((user) => user._id !== id))
      toast.success(`User ${name} deleted successfully.`)
      setRefresh((prev) => !prev)
    } catch (error: any) {
      console.error("Error deleting user:", error)
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the user."
      )
    }
  }

  const verifiedCount = useMemo(
    () => users.filter((entry) => entry.active).length,
    [users]
  )

  const linkedHouseCount = useMemo(
    () => users.reduce((sum, entry) => sum + (entry.houseNames?.length || 0), 0),
    [users]
  )

  const standaloneCount = useMemo(
    () => users.filter((entry) => !(entry.houseNames?.length || 0)).length,
    [users]
  )

  return (
    <div className="users data-page">
      {spinner && <Spinner />}

      <section className="data-page__hero">
        <div className="data-page__heading-row">
          <div className="data-page__title-block">
            <div className="data-page__eyebrow">People directory</div>
            <h1 className="data-page__title">Users</h1>
            <p className="data-page__subtitle">
              View the full user roster, track verification state, and understand
              how members are distributed across houses.
            </p>
          </div>

          <div className="data-page__actions">
            <button
              type="button"
              className="data-page__primary-btn"
              onClick={() => setModalOpen(true)}
            >
              <AddRounded fontSize="small" />
              Add New User
            </button>
          </div>
        </div>

        <div className="data-page__stats">
          <div className="data-page__stat">
            <span className="data-page__stat-label">Users</span>
            <span className="data-page__stat-value">{users.length}</span>
            <span className="data-page__stat-meta">
              Total members currently available in the admin roster
            </span>
          </div>
          <div className="data-page__stat">
            <span className="data-page__stat-label">Verified</span>
            <span className="data-page__stat-value">{verifiedCount}</span>
            <span className="data-page__stat-meta">
              {users.length > 0
                ? `${Math.round((verifiedCount / users.length) * 100)}% of users are active`
                : "No users yet"}
            </span>
          </div>
          <div className="data-page__stat">
            <span className="data-page__stat-label">House Links</span>
            <span className="data-page__stat-value">{linkedHouseCount}</span>
            <span className="data-page__stat-meta">
              Combined number of user-to-house assignments
            </span>
          </div>
          <div className="data-page__stat">
            <span className="data-page__stat-label">Unassigned</span>
            <span className="data-page__stat-value">{standaloneCount}</span>
            <span className="data-page__stat-meta">
              Users who are not currently linked to any house
            </span>
          </div>
        </div>
      </section>

      <section className="data-page__table-shell">
        <div className="data-page__table-head">
          <div>
            <div className="data-page__table-kicker">Account roster</div>
            <div className="data-page__table-title">User directory</div>
            <div className="data-page__table-note">
              Search, inspect, edit, and remove users from one place while
              keeping each user’s linked houses visible.
            </div>
          </div>
          <div className="data-page__table-meta">
            {users.length} user{users.length === 1 ? "" : "s"}
          </div>
        </div>

        <DataTable
          slug="users"
          columns={columns}
          rows={users.map((entry) => ({ ...entry, id: entry._id }))}
          handleDelete={handleDelete}
        />
      </section>

      <AddUser
        setModalOpen={setModalOpen}
        setRefresh={setRefresh}
        columns={config.userFields}
        modalOpen={modalOpen}
      />

      <Toaster />
    </div>
  )
}

export default Users
