import React, { useState } from "react"
import { Note } from "../../types"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import DoneOutlineIcon from "@mui/icons-material/DoneOutline"
import ClearIcon from "@mui/icons-material/Clear"
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"
import { motion } from "framer-motion"
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import "./noteCard.scss"

type Props = {
  note: Note
  onEdit: () => void
  onDelete: () => void
}

const statusBadge = {
  done: {
    icon: <DoneOutlineIcon fontSize="small" />,
    className: "note-card__badge note-card__badge--done",
  },
  pending: {
    icon: <HourglassEmptyIcon fontSize="small" />,
    className: "note-card__badge note-card__badge--pending",
  },
  rejected: {
    icon: <ClearIcon fontSize="small" />,
    className: "note-card__badge note-card__badge--rejected",
  },
}

const NoteCard: React.FC<Props> = ({ note, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false)

  const visibleTodos = note.todos.slice(0, 2)
  const remainingCount = note.todos.length - visibleTodos.length

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  return (
    <>
      {/* Note Card */}
      <motion.div
        onClick={handleOpen}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="note-card"
      >
        {/* Title & Delete */}
        <div className="note-card__header">
          <div>
            <h2 className="note-card__title">
              {note.title}
            </h2>
            <div className="note-card__timestamp">
              {new Date(note.createdAt).toLocaleDateString("en-DE", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                year: "numeric",
              })}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="note-card__delete"
          >
            <DeleteOutlineIcon />
          </button>
        </div>

        {/* Description */}
        <p className="note-card__description">
          {note.description}
        </p>

        {/* Todos */}
        <ul className="note-card__todos">
          {visibleTodos.map((todo) => (
            <li
              key={todo._id}
              className="note-card__todo"
            >
              <span
                className={`note-card__todo-text note-card__todo-text--${todo.status}`}
              >
                {todo.text}
              </span>
              {todo.status === "pending" && (
                <span
                  className={statusBadge[todo.status].className}
                >
                  {statusBadge[todo.status].icon}
                </span>
              )}
            </li>
          ))}
          {remainingCount > 0 && (
            <li className="note-card__todo-more">
              +{remainingCount} more
            </li>
          )}
        </ul>

        {/* Edit Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          className="note-card__edit-btn"
        >
          <EditOutlinedIcon fontSize="small" />
          Edit
        </button>
      </motion.div>

      {/* Full Note Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box className="note-card__modal">
          <h2 className="note-card__modal-title">{note.title}</h2>
          <p className="note-card__modal-description">{note.description}</p>
          <ul className="note-card__modal-list">
            {note.todos.map((todo) => (
              <li
                key={todo._id}
                className="note-card__modal-item"
              >
                <span
                  className={`note-card__todo-text note-card__todo-text--${todo.status}`}
                >
                  {todo.text}
                </span>
                <span
                  className={statusBadge[todo.status].className}
                >
                  {statusBadge[todo.status].icon}
                  {todo.status}
                </span>
              </li>
            ))}
          </ul>
        </Box>
      </Modal>
    </>
  )
}

export default NoteCard
