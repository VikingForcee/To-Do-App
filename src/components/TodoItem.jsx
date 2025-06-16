// TodoItem.jsx
import { FaTrash } from "react-icons/fa";

export default function TodoItem({ todo, onToggleComplete, onDeleteClick, theme, isDark, showNumber, number }) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 mb-2 rounded-lg transition-all duration-300 shadow-sm border ${
        todo.markedForDelete
          ? 'bg-red-50 border-red-300 animate-pulse'
          : isDark 
            ? `${theme.darkItemBg} border-gray-600` 
            : `${theme.itemBg} border-gray-200`
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        {showNumber && (
          <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} min-w-[24px]`}>
            {number}.
          </span>
        )}
        <span
          onClick={() => onToggleComplete(todo.id)}
          className={`cursor-pointer select-none text-base transition-all duration-200 flex-1 ${
            todo.markedForDelete
              ? "line-through text-red-500"
              : todo.completed
              ? "line-through text-gray-400"
              : isDark ? "text-gray-100" : "text-gray-800"
          }`}
        >
          {todo.text}
        </span>
      </div>

      <button
        onClick={() => onDeleteClick(todo.id)}
        className={`p-2 rounded-full text-lg transition-all duration-200 ${
          todo.markedForDelete 
            ? "text-red-700 bg-red-100" 
            : "text-red-500 hover:text-red-700 hover:bg-red-50"
        }`}
        aria-label="Delete task"
      >
        <FaTrash />
      </button>
    </div>
  );
}