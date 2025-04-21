
const ShowList = ({persons, handleDelete}) => {
  return (
    <>
      {persons.map((person) => {
        return (
          <div key={person.id}>
            <p>
              Name: {person.name}, Number: {person.number}
            </p>
            <button
              onClick={() => {
                handleDelete(person.id);
              }}
            >
              delete
            </button>
          </div>
        );
      })}
    </>
  );
};

export default ShowList;
