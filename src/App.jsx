import './App.css'
import { useState } from 'react'
import TodoList from './features/TodoList/TodoList'
import TodoForm from './features/TodoForm'
function App() {
// Creates the new todo and updates the list
  const [todoList, setTodoList] = useState([]);   //empty array is used because todolist is empty at first and will be added later

  function addTodo(title) {
    const newTodo = {
      title: title,              // The string passed in from the form
      id: Date.now(),            // Unique ID based on timestamp
      isCompleted: false          //new property added    
    }
    setTodoList([...todoList, newTodo]);    //spread operator.. is used as updating the state todoList with a new item added to the end without mutating the original array

  }
  // Helper function to mark a todo as complete
  function CompleteTodo(id) {
    const updatedTodos = todoList.map(todo => 
      todo.id === id ? {...todo, isCompleted: true }: todo )
    //update 'todos' state with 'updatedTodos
    setTodoList(updatedTodos)    //calling the setTodoList function (the React state updater) and passing it the new list of todos (updatedTodos).That updates your component’s todoList state with the latest version.
  }

  // Update an existing todo
  function updateTodo(editedTodo) {
    const updatedTodos = todoList.map(todo =>
      todo.id === editedTodo.id ? { ...editedTodo } : todo
    );
    setTodoList(updatedTodos);
  }

  return (
    <div>
      <h1>Todo List</h1>
     
      <TodoForm onAddTodo={addTodo}/>  {/*Pass the function to an onAddTodo props on the TodoForm instance */}

     {/* Pass the helper function as a prop named onCompleteTodo and added updateTodo*/}
      <TodoList todoList={todoList} onCompleteTodo={CompleteTodo} onUpdateTodo= {updateTodo}/>   {/*Renders the TodoList component, passing in todoList as a prop with the current todoList state */}  
    </div>
  )
}

export default App
//parent App.jsx
//chilld TodoForm.jsx
