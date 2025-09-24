import React, { useEffect, useCallback, useReducer, useState } from 'react';
import './App.css';
import { reducer as todosReducer, actions as todoActions, initialState as initialTodosState } from './reducers/todos.reducer';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
import style from './App.module.css';

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const { todoList, isLoading, isSaving, errorMessage } = todoState;

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = "";
    if (queryString) {
      searchQuery = `&filterByFormula=IF(SEARCH("${queryString}", {Title}), TRUE(), FALSE())`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString, url]);

  // ------------------ Fetch todos ------------------
  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });
      try {
        const resp = await fetch(encodeUrl(), { headers: { Authorization: token } });
        if (!resp.ok) throw new Error('NetworkError when attempting to fetch resource..Reverting todo..');

        const { records } = await resp.json();
        const todos = records
          .map(record => ({
            id: record.id,
            ...record.fields,
            isCompleted: record.fields.isCompleted ?? false,
          }))
          .filter(todo => todo.Title && todo.Title.trim() !== '');

        dispatch({ type: todoActions.loadTodos, payload: todos });
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, payload: error.message });
      }
    };
    fetchTodos();
  }, [encodeUrl]);

  // ------------------ Add Todo ------------------
  async function addTodo(Title) {
    const newTodo = { Title, isCompleted: false };
    const payload = { records: [{ fields: newTodo }] };

    dispatch({ type: todoActions.startRequest });
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { Authorization: token, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error('NetworkError when attempting to fetch resource..Reverting todo..');

      const { records } = await resp.json();
      const savedTodo = { id: records[0].id, ...records[0].fields, isCompleted: records[0].fields.isCompleted ?? false };
      dispatch({ type: todoActions.addTodo, payload: savedTodo });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, payload: error.message });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  }

  // ------------------ Update Todo ------------------
  async function updateTodo(editedTodo) {
    // Update locally first
    dispatch({ type: todoActions.updateTodo, payload: editedTodo });

    // Prepare payload for Airtable
    const payload = { records: [{ id: editedTodo.id, fields: { Title: editedTodo.Title, isCompleted: editedTodo.isCompleted } }] };

    try {
      const resp = await fetch(url, {
        method: 'PATCH',
        headers: { Authorization: token, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error('Failed to update todo on Airtable');
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, payload: error.message });
    }
  }

  // ------------------ Toggle Complete ------------------
  async function CompleteTodo(id) {
    const todo = todoList.find(t => t.id === id);
    if (!todo) return;

    const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
    dispatch({ type: todoActions.completeTodo, payload: id });

    // Send update to Airtable
    const payload = { records: [{ id: id, fields: { isCompleted: updatedTodo.isCompleted } }] };
    try {
      const resp = await fetch(url, {
        method: 'PATCH',
        headers: { Authorization: token, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error('Failed to update completion status on Airtable');
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, payload: error.message });
    }
  }

  return (
    <div className={style.appContainer}>
      <h1>Todo List</h1>

      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />

      {!isLoading && (
        <TodoList todoList={todoList} onCompleteTodo={CompleteTodo} onUpdateTodo={updateTodo} />
      )}

      <hr style={{ margin: '20px 0' }} />

      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
      />

      {isLoading && <p>Loading todos...</p>}

      {errorMessage && (
        <div className={style.errorMessage}>
          <p style={{ color: 'red' }}>{errorMessage}</p>
          <button onClick={() => dispatch({ type: todoActions.clearError })}>Dismiss Error Message</button>
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