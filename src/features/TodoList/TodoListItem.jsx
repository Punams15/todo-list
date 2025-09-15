import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
import style from './TodoListItem.module.css';
function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.Title); //Local state for editing

  //cancel editing -> reset back to original todo.Title
  function handleCancel() {
    setWorkingTitle(todo.Title);
    setIsEditing(false);
  }
  //update local state while typing and e variable is event here
  function handleEdit(e) {
    setWorkingTitle(e.target.value);
  }

   // Update Todo handler
  function handleUpdate(e) {
    if (!isEditing) return; // exit if not editing
    e.preventDefault();
    onUpdateTodo({ ...todo, Title: workingTitle });
    setIsEditing(false);
  }

  return (
    <li className={style.item}>
       <form onSubmit={handleUpdate}>
        {isEditing?(
          <>
            <TextInputWithLabel value={workingTitle} onChange={handleEdit} elementId={todo.id} label/>
            <button onClick={handleCancel}>Cancel</button>
              <button type="submit" onClick={handleUpdate}>Update</button>
          </>
        ) :(
          <>
            <label>
              <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
            </label>

           <span
  onClick={() => setIsEditing(true)}
  className= {todo.isCompleted ? style.completed : ''}
>
  {todo.Title}
</span>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
