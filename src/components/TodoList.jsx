import { memo } from "react";
import TodoItem from "./TodoItem";

const TodoList = memo(function TodoList({ 
  todos, 
  onToggleComplete, 
  onDeleteClick, 
  showNumbers, 
  theme, 
  isDark,
  disabled = false 
}) {
  if (todos.length === 0) {
    return (
      <div className={`text-center py-8 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        <p className="text-lg">No tasks yet!</p>
        <p className="text-sm mt-1">Add a task above to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1" role="list" aria-label="Todo items">
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
          disabled={disabled}
        />
      ))}
    </div>
  );
});

export default TodoList;