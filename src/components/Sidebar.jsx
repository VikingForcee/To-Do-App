// Sidebar.jsx
export default function Sidebar({ selectedDate, setSelectedDate, todoData, theme, isDark }) {
  const dates = Object.keys(todoData).sort().reverse();

  return (
    <div className={`w-64 shadow-lg p-4 space-y-4 h-full fixed top-0 left-0 transition-all duration-300 ${
      isDark 
        ? 'bg-gray-800 border-r border-gray-700' 
        : 'bg-white border-r border-gray-200'
    }`}>
      {/* Header */}
      <div className={`text-lg font-bold transition-colors duration-300 ${
        isDark ? 'text-white' : 'text-gray-700'
      }`}>
        ToDo App
      </div>

      {/* Sign In/Up Button */}
      <div className="space-y-2">
        <button className={`w-full text-white py-2 rounded-lg font-medium transition-all duration-200 ${
          theme.primary
        } ${theme.hover}`}>
          Sign In / Sign Up
        </button>
      </div>

      {/* Date Lists Section */}
      <div className="mt-6">
        <h3 className={`text-sm font-semibold mb-2 transition-colors duration-300 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Date Lists
        </h3>
        
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {dates.length === 0 ? (
            <li className={`text-sm transition-colors duration-300 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              No data yet
            </li>
          ) : (
            dates.map(date => (
              <li key={date}>
                <button
                  onClick={() => setSelectedDate(date)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                    date === selectedDate
                      ? isDark 
                        ? `${theme.itemBg} ${theme.text} font-semibold border border-gray-600`
                        : `${theme.itemBg} ${theme.text} font-semibold`
                      : isDark
                        ? "hover:bg-gray-700 text-gray-300"
                        : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {date}
                  {todoData[date] && (
                    <span className={`ml-2 text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
                      isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {todoData[date].length}
                    </span>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

    </div>
  );
}