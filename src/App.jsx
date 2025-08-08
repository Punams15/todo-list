import './App.css'
import { useState } from 'react'
import TodoList from './TodoList'
import TodoForm from './TodoForm'
function App() {
// Creates the new todo and updates the list
  const [todoList, setTodoList] = useState([]);   //empty array is used because todolist is empty at first and will be added later

  function addTodo(title) {
    const newTodo = {
      title: title,              // The string passed in from the form
      id: Date.now()            // Unique ID based on timestamp
                    
    }
    setTodoList([...todoList, newTodo]);    //spread operator.. is used as updating the state todoList with a new item added to the end without mutating the original array

  }

  return (
    <div>
      <h1>Todo App</h1>
     
      <TodoForm onAddTodo={addTodo}/>  {/*Pass the function to an onAddTodo props on the TodoForm instance */}

     
      <TodoList todoList={todoList}/>   {/*Renders the TodoList component, passing in todoList as a prop with the current todoList state */}  
    </div>
  )
}

export default App
//parent App.jsx
//chilld TodoForm.jsx
