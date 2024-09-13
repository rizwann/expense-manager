import { GridColDef } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import DataTable from "../../components/DataTable"
import "./stores.scss"
import axios from "axios"
import { Store } from "../../types"
import { config } from "../../utils/config"
import { toast } from "react-toastify"
import AddStore from "../../components/AddStore"
import Button from "../components/Button"
import Toaster from "../../components/Toaster"
import Spinner from "../../components/Spinner"
import { useAuth } from "../../hooks/useAuth"

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 200 },
  {
    field: "name",
    headerName: "Store Name",
    width: 200,
  },
  {
    field: "image",
    headerName: "Store Image",
    width: 100,
    renderCell: (params) => (
      <img
        src={
          params.row.image
            ? params.row.image
            : "/noavatar.png "
        }
        alt="store"
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
          (e.currentTarget.src = "/noavatar.png")
        }
      />
    ),
  },
]

const Stores = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [stores, setStores] = useState<Store[]>([])
  const { getToken } = useAuth()
  const [refresh, setRefresh] = useState(false)
  const [spinner, setSpinner] = useState(false)

  useEffect(() => {
    //fetch stores
    const fetchStores = async () => {
      const token = await getToken()
      const storeApi = `${import.meta.env.VITE_API_URL}/api/stores`
      setSpinner(true)
     try{
      const data = await axios.get<Store[]>(storeApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setStores(data.data)
      setSpinner(false)
     } catch (error: any) {
      console.error("Error fetching stores:", error)
      toast.error("Failed to load store details.")
      setSpinner(false)
    }
    }

    fetchStores()
  }, [refresh])

  const handleDelete = async (id: string, name: string) => {
    const token = await getToken()
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/stores/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setStores(stores.filter((store) => store._id !== id))
      toast.success(`Store → ${name} ← deleted successfully.`)
      setRefresh(!refresh)
    } catch (error: any) {
      console.error("Error deleting Store:", error)
      toast.error(
        error.response.data.message ||
          "An error occurred while saving the Store."
      )
    }
  }
  return (
    <div className="stores">
      <div className="info">
        <h1>Stores</h1>
        <Button text="Add Store" onClick={() => setModalOpen(true)} />
      </div>
      {spinner && <Spinner />}
      <DataTable
        columns={columns}
        rows={stores.map((store) => ({ ...store, id: store._id }))}
        slug="stores"
        handleDelete={handleDelete}
      />
        <AddStore
          setModalOpen={setModalOpen}
          columns={config.storeFields}
          setRefresh={setRefresh}
          modalOpen={modalOpen}
        />
       <Toaster />
    </div>
  )
}

export default Stores
