
function TodosViewForm({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  const preventRefresh = (e) => e.preventDefault();

  return (
    <form onSubmit={preventRefresh} style={{ marginBottom: "20px" }}>
      {/* Search box */}
      <div>
        <label>Search todos: </label>
        <input
          type="text"
          value={queryString}
          onChange={(e) => setQueryString(e.target.value)}
        />
        <button type="button" onClick={() => setQueryString("")}>
          Clear
        </button>
      </div>

      {/* Sort field */}
      <div>
        <label>Sort by: </label>
        <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
          <option value="title">Title</option>
          <option value="createdTime">Time Added</option>
        </select>
      </div>

      {/* Sort direction */}
      <div>
        <label>Direction: </label>
        <select
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
