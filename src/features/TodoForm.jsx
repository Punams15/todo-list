import { useState } from 'react';
import { useRef } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState(''); // step:1 :Create Local state for input value
  const todoTitleInput = useRef(null); //keeping ref object to focus the input after submission

  //step 2: Update handleAddTodo to use state, not event.target
  function handleAddTodo(event) {
    event.preventDefault(); // ✅ Prevents page reload....... <Prevent or stops page/form from refresh when a user clicks the Add Todo button.

    onAddTodo(workingTodoTitle); // Pass state value instead of reading from DOM
    setWorkingTodoTitle(''); // Clear the input state to reset form

    todoTitleInput.current.focus(); //This line tells the browser to put the cursor back inside the input box, so the user can immediately start typing the next todo without clicking the input again.
  }
  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel elementId="todoTitle"
      labelText ="Todo"
      ref={todoTitleInput}
      value={workingTodoTitle} // Controlled input value
      onChange={(e) => setWorkingTodoTitle(e.target.value)} //Update state on change
      />
      <button type="submit" disabled={workingTodoTitle === ''}>
        Add Todo
      </button>
    </form>
  );
}
export default TodoForm;
