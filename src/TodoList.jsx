import TodoListItem from "./TodoListItem";
function TodoList({todoList}) {  
  
  return (
  
     
      <ul>
            {todoList.map(todo => <TodoListItem key={todo.id} todo={todo} />)}
        </ul>
      
    
  )
   
}
export default TodoList;

//Destructure todoList out of the component's props argument"means you're taking out the todoList prop directly inside the function parameters instead of accessing it through props.todoList.