import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
import style from './TodoListItem.module.css'; 

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.Title);

  function handleCancel() {
    setWorkingTitle(todo.Title);
    setIsEditing(false);
  }

  function handleEdit(e) {
    setWorkingTitle(e.target.value);
  }

  function handleUpdate(e) {
    if (!isEditing) return;
    e.preventDefault();
    onUpdateTodo({ ...todo, Title: workingTitle });
    setIsEditing(false);
  }

  return (
    <li className={style.item}>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              value={workingTitle}
              onChange={handleEdit}
              elementId={todo.id}
              label
            />
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit">Update</button>
          </>
        ) : (
          <>
            <label className={style.customCheckbox}>
              <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
              <span className={style.checkmark}></span>
              <span
                onClick={() => setIsEditing(true)}
                className={todo.isCompleted ? style.completed : ''}
              >
                {todo.Title}
              </span>
            </label>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
