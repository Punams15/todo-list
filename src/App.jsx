import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useReducer, useState, useCallback } from "react";
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
  actions,
} from "./reducers/todos.reducer";
import TodosPage from "./pages/TodosPage";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Header from "./shared/Header";
import AppStyles from './App.module.css';

import floralBg from './assets/floral.jpg'; //Import background image and css
import './App.css';

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  // const [todoList, setTodoList] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [isSaving, setIsSaving] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');

  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState("");

  const location = useLocation();  // Keep track of page location (URL)
  const [title, setTitle] = useState("Todo List");

  // Update title based on current path
  useEffect(() => {
    if (location.pathname === "/") setTitle("Todo List");
    else if (location.pathname === "/about") setTitle("About");
    else setTitle("Not Found");
  }, [location]);

  // Encode Airtable URL with sorting & filtering
  const encodeUrl = useCallback(() => {
    let searchQuery = "";
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    const sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [url, sortField, sortDirection, queryString]);

  // Fetch todos from Airtable
  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });
      try {
        const resp = await fetch(encodeUrl(), {
          method: "GET",
          headers: { Authorization: token },
        });

        //  Edited: standard error message
        if (!resp.ok) throw new Error("NetworkError when attempting to fetch resource..Reverting todo..");

        const { records } = await resp.json();

        //  Edited: flatten records
        const todos = records.map(record => ({
          id: record.id,
          ...record.fields
        }));

        dispatch({ type: todoActions.loadTodos, payload: todos }); // Edited
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error: error.message }); //  Edited for consistency
      }
    };
    fetchTodos();
  }, [encodeUrl, token]);

  // Add a new todo
  const addTodo = async (title) => {
   
  if (!title.trim()) return; // prevent empty

  dispatch({ type: actions.startRequest });
    const payload = {
      records: [
    { fields: { Title: title, IsCompleted: false } }
      ]
    };
    
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Edited: standard error message
      if (!resp.ok) throw new Error("NetworkError when attempting to fetch resource..Reverting todo..");

      const { records } = await resp.json();

      // Edited: flatten records and pick first
      const newTodo = records.map(record => ({
        id: record.id,
        ...record.fields
      }))[0];

      dispatch({ type: actions.addTodo, payload: newTodo }); // Edited: use payload
    } catch (error) {
      dispatch({ type: actions.setLoadError, error: error.message });
    } finally {
      dispatch({ type: actions.endRequest });
    }
  };

  // Complete a todo
  const completeTodo = async (id) => {
    const todo = todoState.todoList.find((t) => t.id === id);
    if (!todo) return;

    // Edited: use payload
    dispatch({ type: actions.completeTodo, payload: id }); 

    dispatch({ type: actions.startRequest });

    const payload = {
  records: [
    { 
      id: editedTodo.id, 
      fields: { 
        Title: editedTodo.Title, 
        IsCompleted: editedTodo.IsCompleted 
      } 
    }
  ]
};


    try {
      const resp = await fetch(url, {
        method: "PATCH",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Edited: standard error message
      if (!resp.ok) throw new Error("NetworkError when attempting to fetch resource..Reverting todo..");
    } catch (error) {
      dispatch({ type: actions.revertTodo, originalTodo: todo, error: error.message });
    } finally {
      dispatch({ type: actions.endRequest });
    }
  };

  const updateTodo = async (editedTodo) => {
  const originalTodo = todoState.todoList.find(t => t.id === editedTodo.id);
  if (!originalTodo) return;

  dispatch({ type: actions.updateTodo, payload: editedTodo });
  dispatch({ type: actions.startRequest });

  const payload = {
    records: [
      {
        id: editedTodo.id,
        fields: {
          Title: editedTodo.Title,
          isCompleted: editedTodo.isCompleted
        }
      }
    ]
  };

  try {
    const resp = await fetch(url, {
      method: "PATCH",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) throw new Error("NetworkError when attempting to fetch resource..Reverting todo..");

  } catch (error) {
    dispatch({ type: actions.revertTodo, originalTodo, error: error.message });
  } finally {
    dispatch({ type: actions.endRequest });
  }
};


  // ---------------- JSX with background image ----------------
  return (
    <div
      style={{
        backgroundImage: `url(${floralBg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        minHeight: "100vh",

     display: "flex",
    justifyContent: "center", // horizontal center
    alignItems: "flex-start", // vertical align to top
    paddingTop: "5rem",       // add some space from top
      }}
    >
    <div className={AppStyles.appContainer}>
      {/*<Header title={title} />*/}
</div>

      <Routes>
        <Route
          path="/"
          element={
            <TodosPage
              todoState={todoState}
              addTodo={addTodo}
              completeTodo={completeTodo}
              updateTodo={updateTodo}
              sortField={sortField}
              setSortField={setSortField}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              queryString={queryString}
              setQueryString={setQueryString}
              dispatch={dispatch}
            />
          }
        />
        <Route path="/about" element={<h1>About</h1>} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>

      {todoState.errorMessage && (
       <div className={AppStyles.errorMessage}>
          {/* Edited: standardized message in UI */}
          <p style={{ color: "red" }}>{"NetworkError when attempting to fetch resource..Reverting todo.."}</p>
          <button onClick={() => dispatch({ type: actions.clearError })}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;






// ------------------ Fetch todos ------------------
//dispatch({ type: todoActions.loadTodos, payload: todos });

// ------------------ Add Todo ------------------
//dispatch({ type: todoActions.addTodo, payload: savedTodo });

// ------------------ Toggle Complete ------------------
//dispatch({ type: todoActions.completeTodo, payload: id });

// ------------------ Update Todo ------------------
//dispatch({ type: todoActions.updateTodo, payload: editedTodo });



//Removed duplicate imports of reducer, actions, etc.

//Replaced all useState variables (todoList, isLoading, isSaving, errorMessage) with the reducer’s todoState.

//Used:const { todoList, isLoading, isSaving, errorMessage } = todoState;

//Replaced setTodoList, setIsLoading, setIsSaving, setErrorMessage with dispatch(...).

//Kept sortField, sortDirection, queryString as local state (not in reducer).

//Cleaned up fetch logic to use dispatch(todoActions.loadTodos, records) instead of setTodoList.

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


//https://spoonacular.com/food-api
//https://spoonacular.com/food-api/pricing
//https://github.com/Code-the-Dream-School/ctd-ingredient-recipes