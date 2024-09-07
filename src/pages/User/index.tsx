import "./user.scss"
import { NavLink, useParams } from "react-router-dom"
import { IUser } from "../../types"
import { useEffect, useState } from "react"
import axios from "axios"
import Button from "../components/Button"
import AddUser from "../../components/AddUser"
import { config } from "../../utils/config"
import Toaster from "../../components/Toaster"

const SingleUser: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<IUser | null>(null)
  const [info, setInfo] = useState<object>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const token = localStorage.getItem("token")
  const openEditModal = () => {
    setModalOpen(true)
  }
  useEffect(() => {
    const getUser = async () => {
      const usersApi = `${import.meta.env.VITE_API_URL}/api/user/${id}`
      const data = await axios.get<IUser>(usersApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUser(data.data)
      setInfo({
        Active: data.data.active ? "Yes" : "No",
        Email: data.data.email || "N/A",
        Name: data.data.name || "N/A",
        "House Names": data.data.houses
          ?.map((house) => house.description)
          .join(", "),
      })
    }
    getUser()
  }, [id, refresh])
  return (
    <div className="single">
      <div className="view">
        <div className="info">
          <div className="top-info">
            <img
              src={user?.image || "/noavatar.svg"}
              alt={user?.name || "user"}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                (e.currentTarget.src = "/noavatar.svg")
              }
            />
            <h1>{user?.username}</h1>
            <Button text="Update" onClick={openEditModal} />
          </div>
          <div className="details">
            {Object.entries(info).map((item) => (
              <div className="item" key={item[0]}>
                <span className="item-title">{item[0]}:</span>
                {item[0] === "House Names" ? (
                  <span>
                    {user?.houses?.length ? (
                      user?.houses?.map((house, index) => {
                        return (
                          <NavLink
                            to={`/Houses/${house._id}`}
                            key={house._id}
                            style={{
                              display: "inline-block",
                              paddingRight: 10,
                              marginRight: 10,
                              fontWeight: "bold",
                              borderRight:
                                index === (user?.houses?.length ?? 0) - 1
                                  ? "none"
                                  : "1px solid #000",
                            }}
                          >
                            <span style={{ fontWeight: "bold" }}>
                              {house.description}
                            </span>
                          </NavLink>
                        )
                      })
                    ) : (
                      <span>No joined houses!</span>
                    )}
                  </span>
                ) : (
                  <span className="item-value">{item[1]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <AddUser
        editData={user}
        setModalOpen={setModalOpen}
        setRefresh={setRefresh}
        columns={config.userFields}
        modalOpen={modalOpen}
      />
      <Toaster />
    </div>
  )
}

export default SingleUser
