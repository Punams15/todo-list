import TodoForm from '../features/TodoForm.jsx';
import TodosViewForm from '../features/TodosViewForm.jsx';
import TodoList from '../features/TodoList/TodoList.jsx';
import AppStyles from '../App.module.css';
import { actions as todoActions } from '../reducers/todos.reducer.js';
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function TodosPage({
  todoState,
  addTodo,
  completeTodo,
  updateTodo,
  queryString,
  setQueryString,
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  dispatch,
}) {
  // Pagination setup
  const itemsPerPage = 15;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get current page from URL, default 1
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Filter todos by query string
  const filteredTodos = todoState.todoList.filter(todo =>
    todo.Title.toLowerCase().includes(queryString.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);

  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const indexOfLastTodo = indexOfFirstTodo + itemsPerPage;

  // Slice todos for current page
  const currentTodos =
    filteredTodos.length > 0
      ? filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo)
      : [];

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setSearchParams({ page: currentPage - 1 });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setSearchParams({ page: currentPage + 1 });
    }
  };

  // Protect against invalid page numbers
  useEffect(() => {
    if (!todoState.isLoading && totalPages > 0) {
      if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
        navigate("/");
      }
    }
  }, [currentPage, totalPages, navigate, todoState.isLoading]);

  return (
    <>
      <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />

      {todoState.isLoading ? (
        <p>Loading todos...</p>
      ) : currentTodos.length > 0 ? (
        <TodoList
          todoList={currentTodos}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          isLoading={todoState.isLoading}
          queryString={queryString}
        />
      ) : (
        <p>No todos found.</p>
      )}

      {/* Pagination controls */}
      {filteredTodos.length > 0 && (
        <div
          className="paginationControls"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      )}

      <hr />

      <TodosViewForm
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
      />

      {todoState.errorMessage && (
        <div className={AppStyles.errorMessage}>
          <hr />
          <p>{todoState.errorMessage}</p>
          <button onClick={() => dispatch({ type: todoActions.clearError })}>
            Dismiss
          </button>
        </div>
      )}
    </>
  );
}

export default TodosPage;



