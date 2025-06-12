import React, { useState } from 'react';
import { House, Note, Todo } from '../../types';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircle, XCircle, Plus, Home, StickyNote } from 'lucide-react';

type Props = {
  note: Note | null;
  onClose: () => void;
  selectedHouse: string | null;
  setSelectedHouse: (houseCode: string) => void;
  houses: House[];
};

const NoteFormModal: React.FC<Props> = ({
  note,
  onClose,
  selectedHouse,
  setSelectedHouse,
  houses,
}) => {
  const [title, setTitle] = useState(note?.title || '');
  const [description, setDescription] = useState(note?.description || '');
  const [todos, setTodos] = useState<Todo[]>(note?.todos || []);
  const [newTodo, setNewTodo] = useState('');

  const { getToken } = useAuth();

  const handleSave = async () => {
    const token = await getToken();
    const payload: Note = {
      title,
      description,
      todos,
      houseCode: note?.houseCode || selectedHouse,
    };

    if (note?._id) {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/notes/${note._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/notes`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }

    onClose();
  };

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
  <div className="w-full max-w-lg p-6 mx-4 bg-gray-900 rounded-lg shadow-lg animate-fadeIn">
        <div className="flex items-center gap-2 mb-4 text-xl font-semibold">
          <StickyNote size={20} />
          {note ? 'Edit Note' : 'Add Note'}
        </div>

        <input
          className="w-full p-3 mb-3 text-white placeholder-gray-400 bg-gray-800 rounded-lg outline-none focus:ring-2 ring-blue-500"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-3 mb-3 text-white placeholder-gray-400 bg-gray-800 rounded-lg outline-none resize-none focus:ring-2 ring-blue-500"
          placeholder="Description"
          value={description}
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* House Selector */}
        <div className="mb-4">
          <label className="flex items-center gap-1 mb-2 text-sm text-gray-300">
            <Home size={16} /> Select House
          </label>
          <select
            className="w-full p-2 text-white bg-gray-800 rounded-lg"
            value={selectedHouse || ''}
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

        {/* Todo Input */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <input
              className="flex-1 p-2 placeholder-gray-400 bg-gray-800 rounded-lg outline-none"
              placeholder="Add todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <button
              className="p-2 transition bg-blue-600 rounded-lg hover:bg-blue-700"
              onClick={() => {
                if (newTodo.trim()) {
                  setTodos([...todos, { text: newTodo, status: 'pending' }]);
                  setNewTodo('');
                }
              }}
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Todo List */}
          <div className="pr-1 space-y-2 overflow-y-auto max-h-60">
            {todos.map((todo, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-3 py-2 bg-gray-800 rounded-lg"
              >
                <span className={`flex-1 text-sm ${todo.status === 'done' ? 'line-through text-green-400' : ''}`}>
                  {todo.text}
                </span>
                <div className="flex items-center gap-2">
                  {/* Toggle switch */}
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={todo.status === 'done'}
                      onChange={(e) => {
                        const updated = [...todos];
                        updated[index].status = e.target.checked ? 'done' : 'pending';
                        setTodos(updated);
                      }}
                    />
                    <div className="relative w-10 h-5 transition bg-gray-600 rounded-full">
                      <div
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          todo.status === 'done' ? 'translate-x-5 bg-green-500' : ''
                        }`}
                      ></div>
                    </div>
                  </label>

                  <button
                    onClick={() => {
                      const updated = [...todos];
                      updated.splice(index, 1);
                      setTodos(updated);
                    }}
                    className="text-red-400 hover:text-red-600"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 text-gray-300 transition hover:text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 transition bg-green-600 rounded-lg hover:bg-green-700"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteFormModal;
