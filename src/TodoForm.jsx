
import { useRef } from "react";
function TodoForm ({onAddTodo}) {    // ✅ Destructure props to get onAddTodo----onAddTodo is a component's prop (a function's params/parameter) passed the title from the parent component (App.jsx) to child TodoForm.jsx i.e:Destructure props to get the onAddTodo function
  const todoTitleInput = useRef(null); //Creates a ref object tied to the input...null means “no DOM element yet” (correct for refs to DOM nodes). //'' (empty string) means a string value, which isn’t appropriate here.
  function handleAddTodo(event){
    event.preventDefault()    // ✅ Prevents page reload....... <Prevent or stops page/form from refresh when a user clicks the Add Todo button.
  
    const title = event.target.title.value //✅ Get input value... ( Get the value from the input)inspect the form element in console by console.dir() but it's removed and replaced by const title = //we will use this console statement to figure out how to access the input value from the form.
     //const title = event.target.title.value grabs the value of the <input name ="title"/>
     onAddTodo(title); // ✅ Call the function from parent...Call the function passed from parent with the title
     event.target.title.value = "" ;  //✅ Clear the input...To help the user out, you then clear out the input by setting the input's value to an empty string.
      todoTitleInput.current.focus();  // from below a) todoTitleInput.current now points to or refers to that input box DOM element in the page.//.focus() is a built-in DOM method on input elements.
   }                                    //.focus() :It tells the browser "Put the blinking text cursor inside this input box, so the user can start typing immediately."
    return (                              //So, todoTitleInput.current.focus(); means:“Access the input element stored in the ref, and programmatically put the keyboard cursor inside it so the user can start typing right away.”
   <form onSubmit ={handleAddTodo}> {/*When the form submits, the event listener will fire off the function and pass it the submit event's event object.*/}
  <label  htmlFor="todoTitle" aria-label="Add todo items">Todo:</label>
  <input ref={todoTitleInput} type="text" id="todoTitle" name="title" placeholder="Enter todo..."/> {/* a) ref={todoTitleInput} means React will store the actual HTML <input> element (the text box) inside todoTitleInput.current.*/}
  <button type="submit">Add Todo</button>
</form>

    )
}
export default TodoForm