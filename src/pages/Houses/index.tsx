import { GridColDef } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import DataTable from "../../components/DataTable"
import ButtonInternal from "../components/Button"
import "./houses.scss"
import { House } from "../../types"
import axios from "axios"
import { toast } from "react-toastify"
import Toaster from "../../components/Toaster"
import AddHouse from "../../components/AddHouse"
import { config } from "../../utils/config"
import Spinner from "../../components/Spinner"
import JoinHouse from "../../components/JoinHouse"
import { useAuth } from "../../hooks/useAuth"

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "description",
    headerName: "House Name",
    width: 180,
  },
  {
    field: "image",
    headerName: "House Image",
    width: 120,
    renderCell: (params) => (
      <img
        src={
          params.row.image
            ? params.row.image
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
    field: "userNames",
    headerName: "Members",
    width: 180,
    type: "array",
  },
]

const Houses = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [joinHouseModal, setJoinHouseModal] = useState(false)
  const [houses, setHouses] = useState<House[]>([])
  const [refresh, setRefresh] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const {user, setRefresh: setUserReload, getToken} = useAuth()
  const isAdmin = user ? !!(user.username === 'RizwanKabir') : false

  useEffect(() => {
    //fetch Houses
    const fetchHouses = async () => {
      const token = await getToken()
      const houseApi = isAdmin ? `${import.meta.env.VITE_API_URL}/api/houses/all` : `${import.meta.env.VITE_API_URL}/api/houses`
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
    fetchHouses()
  }, [refresh])

  const handleDelete = async (id: string, name: string) => {
    const token = await getToken()
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/houses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setHouses(houses.filter((store) => store._id !== id))
      toast.success(`House → ${name} ← deleted successfully.`)
      setUserReload((prev) => !prev)
      setRefresh((prev) => !prev)
    } catch (error: any) {
      console.error("Error deleting Store:", error)
      toast.error(
        error.response.data.message ||
          "An error occurred while saving the Store."
      )
    }
  }

  const handleLeaveHouse = async (id: string, name: string) => {
    const token = await getToken()
    const houseCode = id
    try {
      await axios.post
        (`${import.meta.env.VITE_API_URL}/api/houses/leave-house`, {
          houseCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

        }
        )
      setHouses(houses.filter((house) => house.code !== houseCode))
      toast.success(`You left the house → ${name} ← successfully.`)
      setUserReload((prev) => !prev)
      setRefresh((prev) => !prev)
  }
  catch (error: any) {
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
        <div className="title">
        <h1>Houses</h1>
        <ButtonInternal onClick={() => setModalOpen(true)} text="Add House" />
        </div>
        <ButtonInternal text={"Join a House"}
        onClick={() => setJoinHouseModal(true)}
       />
      </div>
      {spinner && <Spinner />}
      <DataTable
        columns={columns}
        rows={houses.map((house) => ({ ...house, id: house._id }))}
        slug="Houses"
        handleDelete={handleDelete}
        handleLeaveHouse={handleLeaveHouse}
      />
        <AddHouse
          setModalOpen={setModalOpen}
          columns={config.houseFields}
          setRefresh={setRefresh}
          modalOpen={modalOpen}
        />

        <JoinHouse
          setModalOpen={setJoinHouseModal}
          columns={config.houseFields.filter((field) => field.field === "code")}
          setRefresh={setRefresh}
          modalOpen={joinHouseModal}
        />

      <Toaster />
    </div>
  )
}

export default Houses
