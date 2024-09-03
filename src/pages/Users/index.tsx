import { GridColDef } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import DataTable from "../../components/DataTable"
import "./users.scss"
import axios from "axios"
import { IUser } from "../../types"
import { toast } from "react-toastify"
import Toaster from "../../components/Toaster"
import AddUser from "../../components/AddUser"
import { config } from "../../utils/config"
import Button from "../components/Button"
import Spinner from "../../components/Spinner"
type Props = {}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "name",
    type: "string",
    headerName: "Name",
    width: 150,
  },
  {
    field: "username",
    type: "string",
    headerName: "Username",
    width: 150,
  },

  {
    field: "email",
    type: "string",
    headerName: "Email",
    width: 200,
  },

  {
    field: "active",
    headerName: "Verified",
    width: 150,
    type: "boolean",
  },
  {
    field: "houseNames",
    headerName: "House Names",
    width: 250,
    type: "array",
    renderCell: (params) => {
      return (
        <>
          {params.row.houseNames.length > 0 ? (
            <div className="houses">
              {params.row.houseNames.slice(0, 2).map((house: any) => {
                return (
                  <div className="house">
                    <p>{house}</p>
                  </div>
                )
              })}
              {params.row.houseNames.length > 2 && (
                <div className="more">
                  +{params.row.houseNames.length - 2} more
                </div>
              )}
            </div>
          ) : (
            <p>No houses</p>
          )}
        </>
      )
    },
  },
]

const Users = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const token = localStorage.getItem("token")
  const [refresh, setRefresh] = useState(false)
  const [users, setUsers] = useState<IUser[]>([])
  const [spinner, setSpinner] = useState(false)

  useEffect(() => {
    //fetch users
    const fetchStores = async () => {
      setSpinner(true)
      const usersApi = `${import.meta.env.VITE_API_URL}/api/user/all`
      try {
        const data = await axios.get<IUser[]>(usersApi, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUsers(data.data)
        setSpinner(false)
      } catch (error: any) {
        console.error("Error fetching users:", error)
        toast.error(
          error.response.data.message ||
            "An error occurred while fetching the users."
        )
        setSpinner(false)
      }
    }

    fetchStores()
  }, [refresh, token])

  const handleDelete = async (id: string, name: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUsers(users.filter((user) => user._id !== id))
      toast.success(`User → ${name} ← deleted successfully.`)
      setRefresh(!refresh)
    } catch (error: any) {
      console.error("Error deleting User:", error)
      toast.error(
        error.response.data.message ||
          "An error occurred while deleting the User."
      )
    }
  }
  return (
    <div className="users">
      <div className="info">
        <h1>Users</h1>
        <Button text="Add New User" onClick={() => setModalOpen(true)} />
      </div>
      {spinner && <Spinner />}
      <DataTable
        slug="users"
        columns={columns}
        rows={users.map((user) => ({ ...user, id: user._id }))}
        handleDelete={handleDelete}
      />
      {modalOpen && (
        <AddUser
          setModalOpen={setModalOpen}
          setRefresh={setRefresh}
          columns={config.userFields}
        />
      )}
      <Toaster />
    </div>
  )
}

export default Users
