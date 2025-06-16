// TodoList.jsx
import TodoItem from "./TodoItem";

export default function TodoList({ todos, onToggleComplete, onDeleteClick, showNumbers, theme, isDark }) {
  if (todos.length === 0) {
    return (
      <div className={`text-center py-8 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        <p className="text-lg">No tasks yet!</p>
        <p className="text-sm mt-1">Add a task above to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {todos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onDeleteClick={onDeleteClick}
          theme={theme}
          isDark={isDark}
          showNumber={showNumbers}
          number={index + 1}
        />
      ))}
    </div>
  );
}