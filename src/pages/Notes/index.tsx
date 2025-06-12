import React, { useEffect, useState } from 'react';
import NoteCard from '../../components/NoteCard';
import NoteFormModal from '../NoteFromModal';
import { House, Note } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, LocalDining, PlusOne } from '@mui/icons-material';
import Loading from '../../components/Loading';

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [houses, setHouses] = useState<House[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchHouses = async () => {
      const token = await getToken();
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/houses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHouses(response.data);
        setSelectedHouse(response.data[0]?.code || null);
      } catch (error) {
        console.error('Error fetching houses:', error);
      }
    };

    fetchHouses();
  }, []);

  const fetchNotes = async () => {
    const token = await getToken();
    setLoading(true);
    try {
      const response = await axios.get<Note[]>(
        `${import.meta.env.VITE_API_URL}/api/notes/house/${selectedHouse}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const token = await getToken();
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  useEffect(() => {
    if (selectedHouse) fetchNotes();
  }, [selectedHouse]);

  return (
    <div className="min-h-screen p-4 text-white bg-gradient-to-br">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-wide text-white">Notes Dashboard</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition duration-200 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
          onClick={() => {
            setSelectedNote(null);
            setModalOpen(true);
          }}
        >
          <PlusOne fontSize='medium' /> Add Note
        </button>
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-300">
          <span className="flex items-center gap-1">
            <Home fontSize='medium' /> Select House
          </span>
        </label>
        <select
          className="w-full p-3 text-white bg-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedHouse || ''}
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
        <div className="flex items-center justify-center py-20">
          <Loading />
        </div>
      ) : (
        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    setSelectedNote(note);
                    setModalOpen(true);
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
            setModalOpen(false);
            fetchNotes();
          }}
        />
      )}
    </div>
  );
};

export default NotesPage;
