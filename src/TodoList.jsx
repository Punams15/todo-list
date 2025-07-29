import TodoListItem from "./TodoListItem";
function TodoList() {  
    const todos = [
    {id: 1, title: "review resources"},
    {id: 2, title: "take notes"},
    {id: 3, title: "code out app"},
]
  return (
  <div>
     
      <ul>
        {todos.map(todo => (
          <TodoListItem key={todo.id} todo={todo}/>
        ))}
      </ul>
      
    </div>
  )
   
}
export default TodoList;