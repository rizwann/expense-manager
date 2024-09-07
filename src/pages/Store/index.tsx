import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import "./store.scss"
import { toast, ToastContainer } from "react-toastify"
import Button from "../components/Button"
import { Store } from "../../types"
import { config } from "../../utils/config"
import Loading from "../../components/Loading"
import AddStore from "../../components/AddStore"

const StoreDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [store, setStore] = useState<Store | null>(null)
  const token = localStorage.getItem("token")
  const [modalOpen, setModalOpen] = useState(false)
  const [refresh, setRefresh] = useState(false)

  // Open modal in edit mode
  const openEditModal = () => {
    setModalOpen(true)
  }

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/stores/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setStore(response.data)
      } catch (error) {
        console.error("Error fetching store:", error)
        toast.error("Failed to load store details.")
      }
    }

    fetchStore()
  }, [id, token, refresh])

  if (!store) {
    return <Loading />
  }

  const isEditable = true

  return (
    <div className="store-detail">
      <div className="store-header">
        <button className="back-button" onClick={() => navigate("/stores")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8.707 12.707a1 1 0 0 0 0-1.414L5.414 8l3.293-3.293a1 1 0 0 0-1.414-1.414L4 7.586a2 2 0 0 0 0 2.828l3.293 3.293a1 1 0 0 0 1.414 0z"
            />
          </svg>
          All Stores
        </button>
        {isEditable && <Button text={"Edit"} onClick={() => openEditModal()} />}
      </div>
      <div className="content">
        <div className="image">
      <h1>Store Details</h1>
          <img
            src={store.image || "/app.svg"}
            alt={store.name}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
              (e.currentTarget.src = "/app.svg")
            }
          />
        </div>
        <div className="details">
          <label>
            Store Name:
            <span>{store.name}</span>
          </label>
         
        </div>
      </div>
        <AddStore
          columns={config.storeFields}
          setModalOpen={setModalOpen}
          editData={store}
          setRefresh={setRefresh}
          modalOpen={modalOpen}
        />
      <ToastContainer />
    </div>
  )
}

export default StoreDetail
