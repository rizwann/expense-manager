import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import "./house.scss"
import { toast, ToastContainer } from "react-toastify"
import Button from "../components/Button"
import { House } from "../../types"
import { config } from "../../utils/config"
import Loading from "../../components/Loading"
import AddHouse from "../../components/AddHouse"
import { useAuth } from "../../hooks/useAuth"

const HouseDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [house, setHouse] = useState<House | null>(null)
  const { getToken } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)
  const [refresh, setRefresh] = useState(false)

  // Open modal in edit mode
  const openEditModal = () => {
    setModalOpen(true)
  }

  useEffect(() => {
    const fetchHouse = async () => {
      const token = await getToken()
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/houses/house/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setHouse(response.data)
      } catch (error) {
        console.error("Error fetching house:", error)
        toast.error("Failed to load house details.")
        navigate("/houses", { replace: true })

      }
    }

    fetchHouse()
  }, [id, refresh])

  if (!house) {
    return <Loading />
  }

  const isEditable = true

  return (
    <div className="house-detail">
      <div className="house-header">
        <button className="back-button" onClick={() => navigate("/houses")}>
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
          All Houses
        </button>
        {isEditable && <Button text={"Edit"} onClick={() => openEditModal()} />}
      </div>
      <div className="content">
        <div className="image">
      <h1>House Details</h1>
          <img
            src={house.image}
            alt={house.description}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
              (e.currentTarget.src = "/app.svg")
            }
          />
        </div>
        <div className="details">
          <label>
            House Name:
            <span>{house.description}</span>
          </label>
          <label>
            Code:
            <span>{house.code}</span>
          </label>
          <label>
            Members:
            <div className="users">
              {house.userNames.map((user: any) => {
                return (
                  <div className="user">
                    <p>{user}</p>
                  </div>
                )
              })}
            </div>
          </label>
         
        </div>
      </div>
        <AddHouse
          columns={config.houseFields}
          setModalOpen={setModalOpen}
          editData={house}
          setRefresh={setRefresh}
          modalOpen={modalOpen}
        />
      <ToastContainer />
    </div>
  )
}

export default HouseDetail
