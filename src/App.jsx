import './App.css'
import { useState } from 'react'
import TodoList from './TodoList'
import TodoForm from './TodoForm'
function App() {
  const [newTodo, setNewTodo] = useState("Example Text")

  return (
  <div>
      <h1>Todo List</h1>
      <TodoForm />
      <p>{newTodo}</p>
      <TodoList />
    </div>
  )
}


export default App;
