import { memo } from "react";
import { Link } from "react-router-dom";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

const Sidebar = memo(function Sidebar({ selectedDate, setSelectedDate, todoData, theme, isDark }) {
  const { isSignedIn, user } = useUser();
  
  // Sort dates and memoize to prevent unnecessary re-sorts
  const dates = Object.keys(todoData).sort().reverse();

  const handleDateClick = (date) => {
    if (date !== selectedDate) {
      setSelectedDate(date);
    }
  };

  return (
    <div className={`w-64 shadow-lg p-4 space-y-4 h-screen fixed top-0 left-0 transition-all duration-300 overflow-y-auto ${
      isDark 
        ? 'bg-gray-800 border-r border-gray-700' 
        : 'bg-white border-r border-gray-200'
    }`}>
      {/* Header */}
      <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-700'}`}>
        ToDo App
      </div>

      {/* Sign In / Sign Up / User Button */}
      <div className="space-y-2">
        {isSignedIn ? (
          <div className="flex items-center gap-2">
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
            <p className={`text-sm truncate ${isDark ? "text-gray-200" : "text-gray-800"}`}>
              Hello, {user?.firstName || user?.username || "User"}!
            </p>
          </div>
        ) : (
          <>
            {/* Option 1: Modal buttons (current approach) */}
            <SignInButton mode="modal">
              <button 
                className={`w-full text-white py-2 rounded-lg font-medium transition-colors ${theme.primary} ${theme.hover}`}
                type="button"
              >
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button 
                className={`w-full text-white py-2 rounded-lg font-medium transition-colors ${theme.primary} ${theme.hover}`}
                type="button"
              >
                Sign Up
              </button>
            </SignUpButton>
            
            {/* Option 2: Link buttons (alternative approach) */}
            {/* Uncomment these and comment out the modal buttons above if you prefer page navigation */}
            {/*
            <Link to="/sign-in">
              <button 
                className={`w-full text-white py-2 rounded-lg font-medium transition-colors ${theme.primary} ${theme.hover}`}
                type="button"
              >
                Sign In
              </button>
            </Link>
            <Link to="/sign-up">
              <button 
                className={`w-full text-white py-2 rounded-lg font-medium transition-colors ${theme.primary} ${theme.hover}`}
                type="button"
              >
                Sign Up
              </button>
            </Link>
            */}
          </>
        )}
      </div>

      {/* Date Lists - Only show when signed in */}
      {isSignedIn && (
        <div className="mt-6">
          <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Date Lists
          </h3>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {dates.length === 0 ? (
              <div className={`text-sm py-4 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                No tasks yet
              </div>
            ) : (
              <ul className="space-y-1">
                {dates.map(date => {
                  const taskCount = todoData[date]?.length || 0;
                  const completedCount = todoData[date]?.filter(task => task.completed)?.length || 0;
                  
                  return (
                    <li key={date}>
                      <button
                        onClick={() => handleDateClick(date)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                          date === selectedDate
                            ? isDark 
                              ? `${theme.darkItemBg} ${theme.text} font-semibold border border-gray-600`
                              : `${theme.itemBg} ${theme.text} font-semibold`
                            : isDark
                              ? "hover:bg-gray-700 text-gray-300"
                              : "hover:bg-gray-100 text-gray-700"
                        }`}
                        type="button"
                        aria-label={`View tasks for ${date}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{date}</span>
                          {taskCount > 0 && (
                            <div className="flex items-center gap-1">
                              {completedCount > 0 && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                  isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
                                }`}>
                                  ✓{completedCount}
                                </span>
                              )}
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                              }`}>
                                {taskCount}
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Welcome message for signed out users */}
      {!isSignedIn && (
        <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Welcome!
          </h3>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Sign in to start managing your daily tasks and stay organized!
          </p>
        </div>
      )}
    </div>
  );
});

export default Sidebar;