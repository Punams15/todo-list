import { useState, useEffect } from "react";
function TodosViewForm({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  const preventRefresh = (e) => e.preventDefault()

    //new local state for debouncing
  const [localQuery, setLocalQuery] = useState(queryString)

  // new debounce useEffect
  useEffect(() => {
    const handler = setTimeout(() => {
      setQueryString(localQuery) // // update App's queryString only after 500ms of no typing
    }, 500)

    return () => clearTimeout(handler); // cleanup previous timeout if user types again
  }, [localQuery, setQueryString])


  return (
    <form onSubmit={preventRefresh} style={{ marginBottom: "20px" }}>
      {/* Search box */}
      <div>
  <label htmlFor="todo-search">Search todos: </label>
  <input
    id="todo-search"
    type="text"
    placeholder="Type to search..."
    value={localQuery}  //changed ( queryString to LocalQuery)
    onChange={(e) => setLocalQuery(e.target.value)}
  />
  <button type="button" onClick={() => setLocalQuery("")}>
    Clear
  </button>
</div>

      {/* Sort field */}
      <div>
        <label htmlFor="sort-field">Sort by: </label>
        <select id= "sort-field" value={`${sortField}-${sortDirection}`} 
 onChange={(e) => {
    const [field, dir] = e.target.value.split("-");
    setSortField(field);      // → "Title"
    setSortDirection(dir);    // → "asc" or "desc"
  }}
>
       <option value="createdTime">Time Added</option>
            <option value="Title-asc">Title A–Z</option>
            <option value="Title-desc">Title Z–A</option>
        </select>
      </div>

      {/* Sort direction */}
      <div>
        <label htmlFor="sort-direction">Direction: </label>
        <select id="sort-direction"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        
      </div>
    </form>
  );
}

export default TodosViewForm;

//Imported useState + useEffect.

//Added localQuery state.

//Added useEffect with a setTimeout (500ms) + cleanup (clearTimeout).

//Changed input/clear button to work with localQuery instead of queryString.

//500 ms (milliseconds) is half a second
//1 second = 1000 ms
//500 ms = 0.5 seconds