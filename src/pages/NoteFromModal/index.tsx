import React, { useState } from "react"
import { House, Note, Todo } from "../../types"
import axios from "axios"
import { useAuth } from "../../hooks/useAuth"
import { XCircle, Plus, StickyNote, X } from "lucide-react"
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
    <div className="app-modal note-form-modal">
      <div className="app-modal__dialog app-modal__dialog--medium">
        <button
          type="button"
          className="app-modal__close"
          onClick={onClose}
          aria-label="Close note modal"
        >
          <X size={20} />
        </button>
        <div className="app-modal__header">
          <div className="app-modal__eyebrow">Shared notes</div>
          <h1>{note ? "Edit Note" : "Add Note"}</h1>
          <p>
            Save a title, description, house, and lightweight todo list for the
            whole home.
          </p>
        </div>
        <form
          className="app-modal__form"
          onSubmit={(e) => {
            e.preventDefault()
            handleSave()
          }}
        >
          <div className="app-modal__body">
            <div className="app-modal__grid app-modal__grid--single">
              <div className="app-modal__field app-modal__field--wide">
                <label className="app-modal__label" htmlFor="note-title">
                  Title
                </label>
                <input
                  id="note-title"
                  className="note-form-modal__input"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="app-modal__field app-modal__field--wide">
                <label className="app-modal__label" htmlFor="note-description">
                  Description
                </label>
                <textarea
                  id="note-description"
                  className="note-form-modal__textarea"
                  placeholder="Description"
                  value={description}
                  rows={4}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="app-modal__field app-modal__field--wide">
                <label className="app-modal__label" htmlFor="note-house"> 
                  Select House
                </label>
                <select
                  id="note-house"
                  className="note-form-modal__select"
                  value={selectedHouse || ""}
                  onChange={(e) => setSelectedHouse(e.target.value)}
                  required
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

              <div className="app-modal__field app-modal__field--wide">
                <div className="note-form-modal__todo-header">
                  <div>
                    <span className="app-modal__label">Todo list</span>
                    <p className="app-modal__hint">
                      Keep quick household tasks under the same note.
                    </p>
                  </div>
                </div>

                <div className="note-form-modal__todo-entry">
                  <input
                    className="note-form-modal__input"
                    placeholder="Add todo"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                  />
                  <button
                    type="button"
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
                          type="button"
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
            </div>
          </div>

          <div className="app-modal__footer">
            <div className="app-modal__actions">
              <button
                type="button"
                className="app-modal__ghost"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="app-modal__submit"
                disabled={!title.trim() || !selectedHouse}
              >
                <StickyNote size={18} />
                <span>{note ? "Save Changes" : "Save Note"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NoteFormModal
