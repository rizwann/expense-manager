import React from 'react';
import { Todo } from '../../types';

type Props = {
  todo: Todo;
  onStatusChange: (status: Todo['status']) => void;
  onDelete: () => void;
};

const TodoItem: React.FC<Props> = ({ todo, onStatusChange, onDelete }) => {
  return (
    <div className="flex items-center justify-between py-1 text-white">
      <span>{todo.text}</span>
      <div className="flex gap-2">
        <select
          className="text-white bg-gray-800 rounded"
          value={todo.status}
          onChange={(e) => onStatusChange(e.target.value as Todo['status'])}
        >
          <option value="pending">Pending</option>
          <option value="done">Done</option>
          <option value="rejected">Rejected</option>
        </select>
        <button onClick={onDelete} className="text-red-500">✕</button>
      </div>
    </div>
  );
};

export default TodoItem;