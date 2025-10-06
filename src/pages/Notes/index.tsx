import { useEffect, useState } from "react"
import NoteCard from "../../components/NoteCard"
import NoteFormModal from "../NoteFromModal"
import { House, Note } from "../../types"
import { useAuth } from "../../hooks/useAuth"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Home, PlusOne } from "@mui/icons-material"
import Loading from "../../components/Loading"
import "./notes.scss"

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [houses, setHouses] = useState<House[]>([])
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchHouses = async () => {
      const token = await getToken()
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/houses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHouses(response.data)
        setSelectedHouse(response.data[0]?.code || null)
      } catch (error) {
        console.error("Error fetching houses:", error)
      }
    }

    fetchHouses()
  }, [])

  const fetchNotes = async () => {
    const token = await getToken()
    setLoading(true)
    try {
      const response = await axios.get<Note[]>(
        `${import.meta.env.VITE_API_URL}/api/notes/house/${selectedHouse}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setNotes(response.data)
    } catch (error) {
      console.error("Error fetching notes:", error)
      setNotes([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const token = await getToken()
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchNotes()
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  useEffect(() => {
    if (selectedHouse) fetchNotes()
  }, [selectedHouse])

  return (
    <div className="notes-page">
      <div className="notes-header">
        <h1>Notes Dashboard</h1>
        <button
          className="notes-add-btn"
          onClick={() => {
            setSelectedNote(null)
            setModalOpen(true)
          }}
        >
          <PlusOne fontSize="medium" />
          Add Note
        </button>
      </div>

      <div className="notes-filter">
        <label className="notes-filter__label">
          <Home fontSize="small" /> Select House
        </label>
        <select
          className="notes-filter__select"
          value={selectedHouse || ""}
          onChange={(e) => setSelectedHouse(e.target.value)}
        >
          <option value="" disabled>
            -- Choose a House --
          </option>
          {houses.map((house) => (
            <option key={house._id} value={house.code}>
              {house.description}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="notes-loading">
          <Loading />
        </div>
      ) : (
        <motion.div layout className="notes-grid">
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                key={note._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <NoteCard
                  note={note}
                  onEdit={() => {
                    setSelectedNote(note)
                    setModalOpen(true)
                  }}
                  onDelete={() => handleDelete(note._id!)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {modalOpen && (
        <NoteFormModal
          note={selectedNote}
          selectedHouse={selectedHouse}
          setSelectedHouse={setSelectedHouse}
          houses={houses}
          onClose={() => {
            setModalOpen(false)
            fetchNotes()
          }}
        />
      )}
    </div>
  )
}

export default NotesPage
