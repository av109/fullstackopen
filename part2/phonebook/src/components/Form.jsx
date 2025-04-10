
const Form = ({handleInput, handleSubmit, newName}) => {
  return (
    <form onSubmit={handleSubmit}>
        <div>
          name:{" "}
          <input
            onChange={handleInput}
            value={newName.name}
            name="name"
            required
          />{" "}
          {""}
          number:{" "}
          <input
            onChange={handleInput}
            value={newName.number}
            name="number"
            required
          />
          {/* <div>debug: {newName}</div> */}
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

export default Form