//Action constants
const actions = {
    //actions in useEffect that loads todos
    fetchTodos: 'fetchTodos',
    loadTodos: 'loadTodos',
    //found in useEffect and addTodo to handle failed requests
    setLoadError: 'setLoadError',
    //actions found in addTodo
    startRequest: 'startRequest',
    addTodo: 'addTodo',
    endRequest: 'endRequest',
    //found in helper functions 
    updateTodo: 'updateTodo',
    completeTodo: 'completeTodo',
    //reverts todos when requests fail
    revertTodo: 'revertTodo',
    //action on Dismiss Error button
    clearError: 'clearError',
};

// export InitialState combines all useState pieces from App
const initialState = {
  todoList: [],      // previously useState([])
  isLoading: false,  // previously useState(false)
  isSaving: false,   // previously useState(false)
  errorMessage: '',  // previously useState('')
};
// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return { ...state, isLoading: true, errorMessage: '' };

    case actions.loadTodos:
      return { ...state, isLoading: false, todoList: action.payload };

    case actions.setLoadError:
      return { ...state, isLoading: false, errorMessage: action.payload };

    case actions.startRequest:
      return { ...state, isSaving: true };

    case actions.addTodo:
      return { ...state, isSaving: false, todoList: [...state.todoList, action.payload] };

    case actions.endRequest:
      return { ...state, isSaving: false };

    case actions.updateTodo:
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, ...action.payload } // merge updates, preserve isCompleted if included
            : todo
        ),
      };

    case actions.completeTodo:
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.payload
            ? { ...todo, isCompleted: !todo.isCompleted } // toggle completion
            : todo
        ),
      };

    case actions.revertTodo:
      return { ...state, todoList: action.payload };

    case actions.clearError:
      return { ...state, errorMessage: '' };

    default:
      return state;
  }
}

export { initialState, actions, reducer };