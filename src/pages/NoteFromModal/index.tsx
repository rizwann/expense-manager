import React, { useState } from "react"
import { House, Note, Todo } from "../../types"
import axios from "axios"
import { useAuth } from "../../hooks/useAuth"
import { XCircle, Plus, Home, StickyNote } from "lucide-react"
import "./noteFormModal.scss"

type Props = {
  note: Note | null
  onClose: () => void
  selectedHouse: string | null
  setSelectedHouse: (houseCode: string) => void
  houses: House[]
}

const NoteFormModal: React.FC<Props> = ({
  note,
  onClose,
  selectedHouse,
  setSelectedHouse,
  houses,
}) => {
  const [title, setTitle] = useState(note?.title || "")
  const [description, setDescription] = useState(note?.description || "")
  const [todos, setTodos] = useState<Todo[]>(note?.todos || [])
  const [newTodo, setNewTodo] = useState("")

  const { getToken } = useAuth()

  const handleSave = async () => {
    const token = await getToken()
    const payload: Note = {
      title,
      description,
      todos,
      houseCode: note?.houseCode || selectedHouse,
    }

    if (note?._id) {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/notes/${note._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/notes`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
    }

    onClose()
  }

  return (
    <div className="note-form-modal">
      <div className="note-form-modal__content">
        <div className="note-form-modal__title">
          <StickyNote size={20} /> {note ? "Edit Note" : "Add Note"}
        </div>

        <input
          className="note-form-modal__input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="note-form-modal__textarea"
          placeholder="Description"
          value={description}
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="note-form-modal__field">
          <label className="note-form-modal__label">
            <Home size={16} /> Select House
          </label>
          <select
            className="note-form-modal__select"
            value={selectedHouse || ""}
            onChange={(e) => setSelectedHouse(e.target.value)}
          >
            <option value="" disabled>
              -- Select a House --
            </option>
            {houses.map((house) => (
              <option key={house._id} value={house.code}>
                {house.description}
              </option>
            ))}
          </select>
        </div>

        <div className="note-form-modal__field">
          <div className="note-form-modal__todo-entry">
            <input
              className="note-form-modal__input"
              placeholder="Add todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <button
              className="note-form-modal__icon-btn"
              onClick={() => {
                if (newTodo.trim()) {
                  setTodos([...todos, { text: newTodo, status: "pending" }])
                  setNewTodo("")
                }
              }}
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="note-form-modal__todo-list">
            {todos.map((todo, index) => (
              <div key={index} className="note-form-modal__todo-item">
                <span className={`note-form-modal__todo-text note-form-modal__todo-text--${todo.status}`}>
                  {todo.text}
                </span>
                <div className="note-form-modal__todo-actions">
                  <label className="note-form-modal__toggle">
                    <input
                      type="checkbox"
                      checked={todo.status === "done"}
                      onChange={(e) => {
                        const updated = [...todos]
                        updated[index].status = e.target.checked
                          ? "done"
                          : "pending"
                        setTodos(updated)
                      }}
                    />
                    <span className="note-form-modal__toggle-track">
                      <span
                        className={`note-form-modal__toggle-thumb ${
                          todo.status === "done" ? "is-active" : ""
                        }`}
                      />
                    </span>
                  </label>
                  <button
                    className="note-form-modal__icon-btn note-form-modal__icon-btn--danger"
                    onClick={() => {
                      const updated = [...todos]
                      updated.splice(index, 1)
                      setTodos(updated)
                    }}
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="note-form-modal__actions">
          <button
            className="note-form-modal__button note-form-modal__button--ghost"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="note-form-modal__button note-form-modal__button--primary"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default NoteFormModal
