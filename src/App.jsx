import { useEffect, useState, useCallback, useMemo } from "react";
import { SignedIn, SignedOut, SignUp } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import Sidebar from "./components/Sidebar";
import { getTasks, addTask, updateTask, deleteTask, deleteTasksByDate } from './firestore';

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

function TodoApp() {
  const { user, isLoaded } = useUser();
  const [todoData, setTodoData] = useState({});
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date().toISOString().slice(0, 10);
    return today;
  });
  const [showNumbers, setShowNumbers] = useState(false);
  const [theme, setTheme] = useState("sky");
  const [loading, setLoading] = useState(false);

  // Memoize current todos to prevent unnecessary recalculations
  const todos = useMemo(() => todoData[selectedDate] || [], [todoData, selectedDate]);

  // Memoize theme calculations
  const currentTheme = useMemo(() => themes[theme], [theme]);
  const isDark = useMemo(() => theme === 'night' || theme === 'cyber', [theme]);

  // Fetch tasks from Firestore
  useEffect(() => {
    if (!isLoaded || !user) return;

    setLoading(true);
    
    // Use consistent user ID - prefer firebaseUid if available
    const userId = user?.publicMetadata?.firebaseUid || user.id;
    
    const unsubscribe = getTasks(userId, (tasks) => {
      const formattedData = tasks.reduce((acc, task) => {
        const date = task.dayOfMaking;
        if (!acc[date]) acc[date] = [];
        acc[date].push({
          id: task.id,
          text: task.task,
          completed: task.isCompleted,
          markedForDelete: task.markedForDelete || false, // Ensure boolean
        });
        return acc;
      }, {});
      setTodoData(formattedData);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      setLoading(false);
    };
  }, [user?.id, user?.publicMetadata?.firebaseUid, isLoaded]);

  // Memoize callback functions to prevent unnecessary re-renders
  const addTodo = useCallback(async (text) => {
    if (!text.trim() || !user) return;

    setLoading(true);
    try {
      const userId = user?.publicMetadata?.firebaseUid || user.id;
      await addTask(userId, selectedDate, text);
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setLoading(false);
    }
  }, [user, selectedDate]);

  const markForDelete = useCallback(async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    setLoading(true);
    try {
      await updateTask(id, { markedForDelete: !todo.markedForDelete });
    } catch (error) {
      console.error('Failed to mark task for deletion:', error);
    } finally {
      setLoading(false);
    }
  }, [todos]);

  const toggleTodo = useCallback(async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    setLoading(true);
    try {
      await updateTask(id, { 
        isCompleted: !todo.completed,
        markedForDelete: false 
      });
    } catch (error) {
      console.error('Failed to toggle task:', error);
    } finally {
      setLoading(false);
    }
  }, [todos]);

  const deleteTodo = useCallback(async (id) => {
    setLoading(true);
    try {
      await deleteTask(id);
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteClick = useCallback(async (id) => {
    const todo = todos.find(t => t.id === id);
    if (todo?.markedForDelete) {
      await deleteTodo(id);
    } else {
      await markForDelete(id);
    }
  }, [todos, deleteTodo, markForDelete]);

  const completeAll = useCallback(async () => {
    if (!user || todos.length === 0) return;

    const allMarked = todos.every(todo => todo.markedForDelete);
    setLoading(true);
    
    try {
      if (allMarked) {
        const userId = user?.publicMetadata?.firebaseUid || user.id;
        await deleteTasksByDate(userId, selectedDate);
      } else {
        // Use Promise.allSettled to handle partial failures gracefully
        const batch = todos.map(todo => 
          updateTask(todo.id, { markedForDelete: true })
        );
        const results = await Promise.allSettled(batch);
        
        // Log any failures
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.error(`Failed to mark task ${todos[index].id}:`, result.reason);
          }
        });
      }
    } catch (error) {
      console.error('Failed to complete bulk operation:', error);
    } finally {
      setLoading(false);
    }
  }, [user, todos, selectedDate]);

  // Memoize completion stats
  const completionStats = useMemo(() => {
    const completed = todos.filter(t => t.completed).length;
    const total = todos.length;
    return { completed, total };
  }, [todos]);

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} p-4 relative transition-all duration-500`}>
      {/* Theme selector */}
      <div className="absolute top-4 right-4 z-50">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="text-sm p-2 border rounded-lg shadow-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
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
        {/* Show sidebar for both signed in and signed out users */}
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
                  disabled={loading}
                />
                Show Numbers
              </label>
            </div>

            <SignedIn>
              <TodoInput 
                onAdd={addTodo} 
                theme={currentTheme} 
                isDark={isDark}
                disabled={loading}
              />
              
              {loading && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
                  <span className="ml-2 text-sm">Loading...</span>
                </div>
              )}
              
              <TodoList
                todos={todos}
                onToggleComplete={toggleTodo}
                onDeleteClick={handleDeleteClick}
                showNumbers={showNumbers}
                theme={currentTheme}
                isDark={isDark}
                disabled={loading}
              />
            </SignedIn>
            
            <SignedOut>
              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <p className="text-lg">Please sign in to manage your tasks!</p>
              </div>
            </SignedOut>

            <SignedIn>
              <button
                onClick={completeAll}
                className={`w-full ${currentTheme.primary} text-white px-4 py-2 rounded-lg ${currentTheme.hover} disabled:opacity-50 transition-all duration-200`}
                disabled={todos.length === 0 || loading}
              >
                {todos.length > 0 && todos.every((todo) => todo.markedForDelete)
                  ? "Clear All Tasks"
                  : "Mark All for Deletion"
                }
              </button>

              {completionStats.total > 0 && (
                <div className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {completionStats.completed} of {completionStats.total} completed
                </div>
              )}
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodoApp />} />
        <Route
          path="/sign-up"
          element={
            <SignedOut>
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <SignUp redirectUrl="/" />
              </div>
            </SignedOut>
          }
        />
        <Route
          path="/sign-in"
          element={
            <SignedOut>
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <SignUp redirectUrl="/" />
              </div>
            </SignedOut>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}