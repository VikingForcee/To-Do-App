// TodoInput.jsx
import { useState } from "react";

export default function TodoInput({ onAdd, theme, isDark }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a new task..."
        className={`flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 ${
          isDark 
            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-gray-500' 
            : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-blue-500'
        }`}
      />
      <button
        type="submit"
        className={`${theme.primary} text-white px-6 py-3 rounded-lg ${theme.hover} transition-all duration-200 font-medium`}
      >
        Add
      </button>
    </form>
  );
}