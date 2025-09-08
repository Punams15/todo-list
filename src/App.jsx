import './App.css'
import { useCallback } from 'react'
import { useEffect, useState } from 'react'
import TodoList from './features/TodoList/TodoList'
import TodoForm from './features/TodoForm'
import TodosViewForm from './features/TodosViewForm'
function App() {
// state Variables
  const [todoList, setTodoList] = useState([]);   // Stores all todos
  const [isLoading, setIsLoading] = useState(false)//fetching todos ;No= false and Yes:true
  const [errorMessage, setErrorMessage] = useState ("")//"" --> Start empty, no mistakes yet// Stores error messages
  const [isSaving, setIsSaving]=useState(false)//while I'm saving mode before and mark saving started or finished..false:Not saving yet

  const [sortField, setSortField] = useState("createdTime")
  const [sortDirection, setSortDirection] = useState("desc")

  const [queryString, setQueryString] = useState(""); // search filter

 //Airtable constants
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`; //like the address where we send our request to get todos
  const token = `Bearer ${import.meta.env.VITE_PAT}`;   //secret key

// encodeUrl rewritten with useCallback
const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = "";
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}", {Title})`; //capital T //+{Title} , + removed ,nothing changed in result?
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  } , [sortField, sortDirection, queryString, url]);

//Fetch todos from Airtable 
  useEffect(() => {
    console.log("Fetching todos with query:", queryString)
    
    const fetchTodos = async () => {
      setIsLoading(true); // show loading spinner/message

      const options = {
        method: "GET" ,
        headers: {
          Authorization: token             //it's like an envelope for our request, using GET methodwith my secret key
        }
      }
      try {                                  //catch the mistake if it doesn't work
        const resp = await fetch(encodeUrl(), options)
        if (!resp.ok) 
          throw new Error(resp.statusText)                                          

          const {records } = await resp.json()   //here recors holds our todos by taking the reply and turning it into an object
         console.log(records)
          const todos = records.map((record)=> {   //go through each to do from airtbale and make it match our app's style
            const todo = {
              id: record.id,                    //id comes from airtable, title and isCompleted come from fields
            ...record.fields
            }
            if (!todo.isCompleted) todo.isCompleted = false; //Airtable skips false..and if airtable forgots to send isCompleted,we force it to be false
            return todo
          })
          .filter(todo => todo.Title && todo.Title.trim() !=="") //remove empty todos
          setTodoList(todos)        //stick all the todos onto out todoList sticky note
        } catch (error) {
          console.error(error)
          setErrorMessage(error.message)   //If something went wrong, write the mistake on the error sticky note
        } finally {
          setIsLoading(false)   //At the very end (good or bad), tell the app: “We’re not busy anymore.”
        }
        }
fetchTodos()   //tells: You gotta start it!
   
}, [sortField, sortDirection, queryString])   //refresh whenever these chnage //End of useEffect. The empty [] means: “Run this only once, when the app starts.”

 // Add new todo (pessimistic update)
  async function addTodo(Title) {
    const newTodo = {
      Title: Title,
      isCompleted: false,
    };

    const payload = {       //like putting our sticky note inside an envelope
      records: [           // records: list of letters (even its just one)
        {
          fields: newTodo,      // fields : the contents of the letter (Title +isCompleted)
        },
      ],
    };

    const options = {
      method: "POST",     //POST= sedning somthing new
      headers: {
        Authorization: token,     //Authorization = my secret key so Airtbaale knowsit's me
        "Content-Type": "application/json",   //info about type: in JSON language(special way to write data so that computer can understand it)
      },
      body: JSON.stringify(payload),   //body ->the letter contents (payload) turned intro string so Airtable can read it
    };

    try {
      setIsSaving(true);    //info to user : saving your todo and change the button text to "saving"

      const resp = await fetch(url, options);  //Send the letter to Airtable and wait for the answer,If Airtable says something went wrong, we throw an error.
      if (!resp.ok) throw new Error(resp.statusText)

      const { records } = await resp.json();   //Airtable answers with the todo info.,//savedTodo = the todo from Airtable with a real unique ID
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      if (!records[0].fields.isCompleted) savedTodo.isCompleted = false; //Airtable might forget to send false.,So we make sure the new todo is marked not done.

      setTodoList([...todoList, savedTodo]); //Add the new todo to our list on the screen.
    } catch (error) {                    //catch → if anything goes wrong, show an error.
      console.error(error);
      setErrorMessage(error.message)
    } finally {                         //finally → stop showing “Saving…” on the button, no matter what happened.
      setIsSaving(false);
    }
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
     <TodoForm onAddTodo={addTodo} isSaving={isSaving} /> {/*Pass the function to an onAddTodo props on the TodoForm instance */}

       {/* Show the todos only when not loading */}
    {!isLoading && (
<TodoList todoList={todoList} onCompleteTodo={CompleteTodo} onUpdateTodo= {updateTodo}/>  
  )
  
}

      {/* Separator line */}
    <hr style={{ margin: "20px 0" }} />

         {/* Search + Sort Form */}
      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
      />

     
     {/*show loading message */}
     {isLoading && <p>Loading todos...</p>}




   

 {/* Error message section at the bottom */}
     {/*show error message if any */}
     {errorMessage && (
      <>
      <p style ={{ color: "red" }} >{"NetworkError when attempting to fetch resource..Reverting todo.."}</p>
     <button onClick={() => setErrorMessage("")}>Dismiss Error Message</button>
     </>
  ) }
</div>
  )
}
export default App

//https://airtable.com/app2RYFQ4XN5j7xYH/tblRbrnMaZvpJdPLj/viwDStds3dNFycPGd?blocks=hide



//In short (story version):
//todoList → Stores todos
//isLoading → Are we fetching from Airtable?
//errorMessage → Did something go wrong?
//isSaving → Are we saving a new todo right now?
//Make a new sticky note (todo).
//Put it in an envelope (payload).
//Send it to Airtable (POST).//user sees the message that is saving and cannot add while its saving 
//While waiting, show “Saving…” to the user.
//Airtable sends it back with a real ID.
//Add it to the list on the screen.
//If something goes wrong, show an error.
//Stop showing “Saving…”.

//after response get back-> receive created todo and add it to the array

// throw new Error(resp.statusText)  //Airtbale replies "bad request", we stop and trow an error
//replacing  if (!resp.ok) throw new Error(resp.statusText); to throw new Error("NetworkError when attempting to fetch resource..Reverting todo..");
//meanings in javascript
//resp.status → the HTTP status code, e.g., 200, 404, 500.
//resp.statusText → the text message associated with the status code, e.g.,
//200 → "OK"
//404 → "Not Found"
//500 → "Internal Server Error"


//replacing setErrorMessage(error.message)  to   setErrorMessage("NetworkError when attempting to fetch resource..Reverting todo..");

//replacing <p style ={{ color: "red" }} >{errorMessage}</p> to <p style ={{ color: "red" }} >{"NetworkError when attempting to fetch resource..Reverting todo.."}</p>