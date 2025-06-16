// App.jsx
import { useEffect, useState } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import Sidebar from "./components/Sidebar";
import { v4 as uuidv4 } from "uuid";

const themes = {
  sky: {
    primary: "bg-blue-500",
    hover: "hover:bg-blue-600",
    text: "text-blue-600",
    bg: "from-blue-100 to-blue-50",
    itemBg: "bg-blue-50",
    darkItemBg: "bg-blue-900/20",
  },
  mint: {
    primary: "bg-emerald-500",
    hover: "hover:bg-emerald-600",
    text: "text-emerald-600",
    bg: "from-green-100 to-green-50",
    itemBg: "bg-emerald-50",
    darkItemBg: "bg-emerald-900/20",
  },
  coral: {
    primary: "bg-orange-500",
    hover: "hover:bg-orange-600",
    text: "text-orange-600",
    bg: "from-orange-100 to-orange-50",
    itemBg: "bg-orange-50",
    darkItemBg: "bg-orange-900/20",
  },
  rose: {
    primary: "bg-rose-500",
    hover: "hover:bg-rose-600",
    text: "text-rose-600",
    bg: "from-pink-100 to-pink-50",
    itemBg: "bg-pink-50",
    darkItemBg: "bg-rose-900/20",
  },
  neon: {
    primary: "bg-lime-500",
    hover: "hover:bg-lime-600",
    text: "text-lime-600",
    bg: "from-lime-100 to-lime-50",
    itemBg: "bg-lime-50",
    darkItemBg: "bg-lime-900/20",
  },
  coffee: {
    primary: "bg-amber-700",
    hover: "hover:bg-amber-800",
    text: "text-amber-700",
    bg: "from-yellow-100 to-yellow-50",
    itemBg: "bg-amber-50",
    darkItemBg: "bg-amber-900/20",
  },
  night: {
    primary: "bg-gray-800",
    hover: "hover:bg-gray-900",
    text: "text-white",
    bg: "from-gray-900 to-gray-800",
    itemBg: "bg-gray-700",
    darkItemBg: "bg-gray-700",
  },
  cyber: {
    primary: "bg-fuchsia-700",
    hover: "hover:bg-fuchsia-800",
    text: "text-fuchsia-300",
    bg: "from-gray-900 to-gray-800",
    itemBg: "bg-gray-700",
    darkItemBg: "bg-gray-700",
  },
};

export default function App() {
  const [todoData, setTodoData] = useState({});
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date().toISOString().slice(0, 10);
    return today;
  });
  const [showNumbers, setShowNumbers] = useState(false);
  const [theme, setTheme] = useState("sky");

  const todos = todoData[selectedDate] || [];

  // Load todo data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("todoData");
      const parsed = stored ? JSON.parse(stored) : {};
      setTodoData(parsed);
    } catch (e) {
      console.error("Error parsing from localStorage", e);
      setTodoData({});
    }
  }, []);

  // Save todoData to localStorage when changed
  useEffect(() => {
    localStorage.setItem("todoData", JSON.stringify(todoData));
  }, [todoData]);

  // Add todo to selected date
  const addTodo = (text) => {
    const newTodos = [...todos, { id: uuidv4(), text, completed: false, markedForDelete: false }];
    setTodoData(prev => ({ ...prev, [selectedDate]: newTodos }));
  };

  const markForDelete = (id) => {
    const updated = todos.map(todo =>
      todo.id === id ? { ...todo, markedForDelete: !todo.markedForDelete } : todo
    );
    setTodoData(prev => ({ ...prev, [selectedDate]: updated }));
  };

  const toggleTodo = (id) => {
    const updated = todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, markedForDelete: false }
        : todo
    );
    setTodoData(prev => ({ ...prev, [selectedDate]: updated }));
  };

  const deleteTodo = (id) => {
    const updated = todos.filter(todo => todo.id !== id);
    setTodoData(prev => ({ ...prev, [selectedDate]: updated }));
  };

  const handleDeleteClick = (id) => {
    const todo = todos.find(t => t.id === id);
    if (todo?.markedForDelete) {
      deleteTodo(id);
    } else {
      markForDelete(id);
    }
  };

  const completeAll = () => {
    const allMarked = todos.length > 0 && todos.every(todo => todo.markedForDelete);
    if (allMarked) {
      setTodoData(prev => ({ ...prev, [selectedDate]: [] }));
    } else {
      const updated = todos.map(todo => ({ ...todo, markedForDelete: true }));
      setTodoData(prev => ({ ...prev, [selectedDate]: updated }));
    }
  };

  const currentTheme = themes[theme];
  const isDark = theme === 'night' || theme === 'cyber';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} p-4 relative transition-all duration-500`}>
      {/* Theme selector */}
      <div className="absolute top-4 right-4 z-50">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="text-sm p-2 border rounded-lg shadow-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.keys(themes).map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)} Theme
            </option>
          ))}
        </select>
      </div>

      {/* Sidebar + Main */}
      <div className="flex">
        <Sidebar 
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          todoData={todoData}
          theme={currentTheme}
          isDark={isDark}
        />

        <div className={`flex-1 ml-64 min-h-screen bg-gradient-to-br ${currentTheme.bg} p-4 relative transition-all duration-500`}>
          <div className={`w-full max-w-md mx-auto rounded-2xl shadow-xl p-6 space-y-4 transition-all duration-500 ${
            isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
          }`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h1 className={`text-3xl font-bold ${currentTheme.text}`}>My ToDo List</h1>
              <label className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <input
                  type="checkbox"
                  checked={showNumbers}
                  onChange={() => setShowNumbers(!showNumbers)}
                  className="h-4 w-4 accent-current"
                />
                Show Numbers
              </label>
            </div>

            <TodoInput onAdd={addTodo} theme={currentTheme} isDark={isDark} />

            <TodoList
              todos={todos}
              onToggleComplete={toggleTodo}
              onDeleteClick={handleDeleteClick}
              showNumbers={showNumbers}
              theme={currentTheme}
              isDark={isDark}
            />

            <button
              onClick={completeAll}
              className={`w-full ${currentTheme.primary} text-white px-4 py-2 rounded-lg ${currentTheme.hover} disabled:opacity-50 transition-all duration-200`}
              disabled={todos.length === 0}
            >
              {todos.length > 0 && todos.every((todo) => todo.markedForDelete)
                ? "Clear All Tasks"
                : "Mark All for Deletion"
              }
            </button>

            {todos.length > 0 && (
              <div className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {todos.filter(t => t.completed).length} of {todos.length} completed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
