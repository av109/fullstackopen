
const Filter = ({searchValue, handleSearchInput}) => {
  return (
    <form action="">
    <label htmlFor="search">Filter for: </label>
    <input
      type="text"
      name="search"
      id="search"
      value={searchValue}
      onChange={handleSearchInput}
    />
  </form>
  )
}

export default Filter