import { useState } from 'react';
import { useRef } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
import styled from "styled-components";

function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState(''); // step:1 :Create Local state for input value
  const todoTitleInput = useRef(null); //keeping ref object to focus the input after submission

  //step 2: Update handleAddTodo to use state, not event.target
  function handleAddTodo(event) {
    event.preventDefault(); // Prevents page reload....... <Prevent or stops page/form from refresh when a user clicks the Add Todo button.

    onAddTodo(workingTodoTitle); // Pass state value instead of reading from DOM
    setWorkingTodoTitle(''); // Clear the input state to reset form

    todoTitleInput.current.focus(); //This line tells the browser to put the cursor back inside the input box, so the user can immediately start typing the next todo without clicking the input again.
  }
  return (
   <StyledForm onSubmit={handleAddTodo}>
    <TextInputWithLabel
      elementId="todoTitle"
      labelText="Todo"
      ref={todoTitleInput}
      value={workingTodoTitle} // Controlled input value
      onChange={(e) => setWorkingTodoTitle(e.target.value)} //Update state on change
    />
    <StyledButton type="submit" disabled={workingTodoTitle.trim() === '' || isSaving}>
      {isSaving ? 'Saving...' : 'Add Todo'}
    </StyledButton>
  </StyledForm>
);
    
}
export default TodoForm;

/*  Styled Components  */
const StyledForm = styled.form`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 5px solid #80c2ceff;
  border-radius: 9px;
`;
/*const StyledInput = styled.input`
  flex: 1;
  padding: 0.5rem;
`; */

const StyledButton = styled.button`
  padding: 0.5rem 1rem;

  &:disabled {
    font-style: italic; 
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

//try this:
//<button disabled={workingTodoTitle.trim() === ''}>
//{isSaving ? 'Saving...' : 'Add Todo'}
//</button>
//or
//<button type="submit" disabled={workingTodoTitle === '' || isSaving}>
 // {isSaving ? 'Saving...' : 'Add Todo'}
//</button>