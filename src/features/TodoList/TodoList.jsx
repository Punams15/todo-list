import TodoListItem from "./TodoListItem";

function TodoList({ todoList, onCompleteTodo }) {
  const filteredTodoList = todoList.filter(todo => !todo.isCompleted);

  return todoList.length === 0 ? (       //Syntax: return condition ? (expressionIfTrue) : (expressionIfFalse);
    <p>Add todo above to get started</p>
  ) : (
    <ul>
      {filteredTodoList.map(todo => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  )
}
export default TodoList;

