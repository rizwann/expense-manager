import React, { useState } from 'react';
import { Note } from '../../types';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import ClearIcon from '@mui/icons-material/Clear';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { motion } from 'framer-motion';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

type Props = {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
};

const statusBadge = {
  done: {
    icon: <DoneOutlineIcon fontSize="small" />,
    color: 'bg-green-500/20 text-green-400',
  },
  pending: {
    icon: <HourglassEmptyIcon fontSize="small" />,
    color: 'bg-yellow-500/20 text-yellow-300',
  },
  rejected: {
    icon: <ClearIcon fontSize="small" />,
    color: 'bg-red-500/20 text-red-400',
  },
};

const NoteCard: React.FC<Props> = ({ note, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

  const visibleTodos = note.todos.slice(0, 2);
  const remainingCount = note.todos.length - visibleTodos.length;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        className="flex flex-col justify-between p-4 sm:p-5 transition-all duration-300 border shadow-xl bg-gray-800/60 backdrop-blur-md rounded-2xl border-white/10 hover:shadow-2xl cursor-pointer min-h-[240px] max-h-[240px]"
      >
        {/* Title & Delete */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-white truncate sm:text-lg">{note.title}</h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-400 hover:text-red-300"
          >
            <DeleteOutlineIcon />
          </button>
        </div>

        {/* Description */}
        <p className="mb-2 text-sm text-gray-400 line-clamp-2">{note.description}</p>

        {/* Todos */}
        <ul className="flex-1 space-y-1 overflow-hidden">
          {visibleTodos.map((todo) => (
            <li
              key={todo._id}
              className="flex items-center justify-between px-2 py-1 text-xs rounded-md sm:text-sm bg-gray-700/40"
            >
              <span
                className={`flex-1 truncate ${
                  todo.status === 'done'
                    ? 'line-through text-green-300'
                    : todo.status === 'rejected'
                    ? 'text-red-300'
                    : 'text-gray-200'
                }`}
              >
                {todo.text}
              </span>
             {todo.status === 'pending' && <span
                className={`ml-2 flex items-center gap-1 px-1.5 py-0.5 text-xs rounded-md font-medium ${statusBadge[todo.status].color}`}
              >
                {statusBadge[todo.status].icon}
              </span>}
            </li>
          ))}
          {remainingCount > 0 && (
            <li className="px-2 py-1 text-xs text-center text-gray-400 rounded-md bg-gray-700/20">
              +{remainingCount} more
            </li>
          )}
        </ul>

        {/* Edit Button */}
        <button
  onClick={(e) => {
    e.stopPropagation();
    onEdit();
  }}
  className="flex items-center gap-2 px-4 py-2 mt-1 text-sm font-medium text-blue-300 transition-all duration-200 shadow-md bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl hover:shadow-lg hover:from-gray-700 hover:to-gray-600 hover:text-blue-200"
>
  <EditOutlinedIcon fontSize="small" />
  Edit
</button>

      </motion.div>

      {/* Full Note Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box className="absolute top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white p-5 rounded-xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold">{note.title}</h2>
          <p className="text-sm text-gray-300">{note.description}</p>
          <ul className="space-y-2">
            {note.todos.map((todo) => (
              <li
                key={todo._id}
                className="flex items-center justify-between px-3 py-2 text-sm rounded-md bg-gray-700/40"
              >
                <span
                  className={`flex-1 ${
                    todo.status === 'done'
                      ? 'line-through text-green-300'
                      : todo.status === 'rejected'
                      ? 'text-red-300'
                      : 'text-gray-200'
                  }`}
                >
                  {todo.text}
                </span>
                <span
                  className={`ml-3 flex items-center gap-1 px-2 py-0.5 text-xs rounded-md font-medium ${statusBadge[todo.status].color}`}
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
  );
};

export default NoteCard;
