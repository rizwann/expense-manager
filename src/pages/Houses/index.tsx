import { AddRounded, GroupAddRounded } from "@mui/icons-material"
import { GridColDef } from "@mui/x-data-grid"
import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import DataTable from "../../components/DataTable"
import Spinner from "../../components/Spinner"
import Toaster from "../../components/Toaster"
import AddHouse from "../../components/AddHouse"
import JoinHouse from "../../components/JoinHouse"
import { useAuth } from "../../hooks/useAuth"
import "./houses.scss"
import { House } from "../../types"
import { config } from "../../utils/config"
import { toast } from "react-toastify"

const columns: GridColDef[] = [
  {
    field: "description",
    headerName: "House",
    width: 180,
  },
  {
    field: "image",
    headerName: "Image",
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <img
        src={params.row.image ? params.row.image : "/noavatar.png"}
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
    width: 90,
  },
  {
    field: "userNames",
    headerName: "Members",
    width: 240,
    type: "array",
    renderCell: (params) => (
      <>
        {params.row.userNames.length > 0 ? (
          <div className="data-page__pill-list">
            {params.row.userNames.slice(0, 2).map((member: string) => (
              <div className="data-page__pill" key={member}>
                {member}
              </div>
            ))}
            {params.row.userNames.length > 2 && (
              <div className="data-page__pill-more">
                +{params.row.userNames.length - 2} more
              </div>
            )}
          </div>
        ) : (
          <span className="houses__empty-cell">No members</span>
        )}
      </>
    ),
  },
  {
    field: "timeZone",
    headerName: "Time Zone",
    width: 180,
  },
  {
    field: "currency",
    headerName: "Currency",
    width: 120,
  },
]

const Houses = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [joinHouseModal, setJoinHouseModal] = useState(false)
  const [houses, setHouses] = useState<House[]>([])
  const [refresh, setRefresh] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const { user, setRefresh: setUserReload, getToken } = useAuth()
  const isAdmin = user ? user.username === "RizwanKabir" : false

  useEffect(() => {
    const fetchHouses = async () => {
      const token = await getToken()
      const houseApi = isAdmin
        ? `${import.meta.env.VITE_API_URL}/api/houses/all`
        : `${import.meta.env.VITE_API_URL}/api/houses`
      setSpinner(true)
      try {
        const data = await axios.get<House[]>(houseApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setHouses(data.data)
      } catch (error: any) {
        console.error("Error fetching houses:", error)
        toast.error("Failed to load house details.")
      } finally {
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
      setHouses((prev) => prev.filter((house) => house._id !== id))
      toast.success(`House ${name} deleted successfully.`)
      setUserReload((prev) => !prev)
      setRefresh((prev) => !prev)
    } catch (error: any) {
      console.error("Error deleting house:", error)
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the house."
      )
    }
  }

  const handleLeaveHouse = async (id: string, name: string) => {
    const token = await getToken()
    const houseCode = id
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/houses/leave-house`,
        {
          houseCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      setHouses((prev) => prev.filter((house) => house.code !== houseCode))
      toast.success(`You left ${name} successfully.`)
      setUserReload((prev) => !prev)
      setRefresh((prev) => !prev)
    } catch (error: any) {
      console.error("Error leaving house:", error)
      toast.error(
        error.response?.data?.message ||
          "An error occurred while leaving the house."
      )
    }
  }

  const totalMembers = useMemo(
    () => houses.reduce((sum, house) => sum + house.userNames.length, 0),
    [houses]
  )

  const uniqueCurrencies = useMemo(
    () => new Set(houses.map((house) => house.currency)).size,
    [houses]
  )

  const joinedHouseCount = user?.houseCodes.length || 0

  return (
    <div className="houses data-page">
      {spinner && <Spinner />}

      <section className="data-page__hero">
        <div className="data-page__heading-row">
          <div className="data-page__title-block">
            <div className="data-page__eyebrow">House directory</div>
            <h1 className="data-page__title">Houses</h1>
            <p className="data-page__subtitle">
              Create, join, and manage shared houses. Review membership,
              timezones, and currencies without dropping into each house detail
              page first.
            </p>
          </div>

          <div className="data-page__actions">
            <button
              type="button"
              className="data-page__secondary-btn"
              onClick={() => setJoinHouseModal(true)}
            >
              <GroupAddRounded fontSize="small" />
              Join House
            </button>
            <button
              type="button"
              className="data-page__primary-btn"
              onClick={() => setModalOpen(true)}
            >
              <AddRounded fontSize="small" />
              Add House
            </button>
          </div>
        </div>

        <div className="data-page__stats">
          <div className="data-page__stat">
            <span className="data-page__stat-label">Visible Houses</span>
            <span className="data-page__stat-value">{houses.length}</span>
            <span className="data-page__stat-meta">
              Houses available in your current access scope
            </span>
          </div>
          <div className="data-page__stat">
            <span className="data-page__stat-label">Member Seats</span>
            <span className="data-page__stat-value">{totalMembers}</span>
            <span className="data-page__stat-meta">
              Combined visible memberships across all houses
            </span>
          </div>
          <div className="data-page__stat">
            <span className="data-page__stat-label">Currencies</span>
            <span className="data-page__stat-value">{uniqueCurrencies}</span>
            <span className="data-page__stat-meta">
              Distinct default currencies in use
            </span>
          </div>
          <div className="data-page__stat">
            <span className="data-page__stat-label">Your Houses</span>
            <span className="data-page__stat-value">{joinedHouseCount}</span>
            <span className="data-page__stat-meta">
              Houses currently linked to your profile
            </span>
          </div>
        </div>
      </section>

      <section className="data-page__table-shell">
        <div className="data-page__table-head">
          <div>
            <div className="data-page__table-kicker">Shared spaces</div>
            <div className="data-page__table-title">House overview</div>
          </div>
          <div className="data-page__table-meta">
            {houses.length} house{houses.length === 1 ? "" : "s"}
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={houses.map((house) => ({ ...house, id: house._id }))}
          slug="houses"
          handleDelete={handleDelete}
          handleLeaveHouse={handleLeaveHouse}
        />
      </section>

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
