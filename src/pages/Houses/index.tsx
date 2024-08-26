import { GridColDef } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import DataTable from "../../components/DataTable"
import Button from "../components/Button"
import "./houses.scss"
import { House } from "../../types"
import axios from "axios"
import { toast } from "react-toastify"
import Toaster from "../../components/Toaster"
import AddHouse from "../../components/AddHouse"
import { config } from "../../utils/config"
import Spinner from "../../components/Spinner"

type Props = {}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "description",
    headerName: "House Name",
    width: 120,
  },
  {
    field: "image",
    headerName: "House Image",
    width: 100,
    renderCell: (params) => (
      <img
        src={
          params.row.image
            ? `${import.meta.env.VITE_API_URL}/${params.row.image}`
            : "/noavatar.png "
        }
        alt="house"
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
          (e.currentTarget.src = "/noavatar.png")
        }
      />
    ),
  },
  {
    field: "code",
    headerName: "Code",
    type: "number",
    width: 60,
  },
  {
    field: "users",
    headerName: "Members",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="users">
          {params.row.userNames.map((user: any) => {
            return (
              <div className="user">
                <p>{user}</p>
              </div>
            )
          })}
        </div>
      )
    },
  },
]

const Houses = (props: Props) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [houses, setHouses] = useState<House[]>([])
  const token = localStorage.getItem("token")
  const [refresh, setRefresh] = useState(false)
  const [spinner, setSpinner] = useState(false)

  useEffect(() => {
    //fetch stores
    const fetchStores = async () => {
      const houseApi = `${import.meta.env.VITE_API_URL}/api/houses`
      setSpinner(true)
      try {
        const data = await axios.get<House[]>(houseApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setHouses(data.data)
        setSpinner(false)
      } catch (error: any) {
        console.error("Error fetching houses:", error)
        toast.error("Failed to load house details.")
        setSpinner(false)
      }
    }
    fetchStores()
  }, [refresh, token])

  const handleDelete = async (id: string, name: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/houses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setHouses(houses.filter((store) => store._id !== id))
      toast.success(`House → ${name} ← deleted successfully.`)
    } catch (error: any) {
      console.error("Error deleting Store:", error)
      toast.error(
        error.response.data.message ||
          "An error occurred while saving the Store."
      )
    }
  }
  return (
    <div className="houses">
      <div className="info">
        <h1>Houses</h1>
        <Button onClick={() => setModalOpen(true)} text="Add House" />
      </div>
      {spinner && <Spinner />}
      <DataTable
        columns={columns}
        rows={houses.map((house) => ({ ...house, id: house._id }))}
        slug="Houses"
        handleDelete={handleDelete}
      />
      {modalOpen && (
        <AddHouse
          setModalOpen={setModalOpen}
          columns={config.houseFields}
          setRefresh={setRefresh}
        />
      )}
      <Toaster />
    </div>
  )
}

export default Houses
