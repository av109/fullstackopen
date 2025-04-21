import { useState, useEffect } from "react";
import personService from "./services/persons";
import { v4 as uuidv4 } from "uuid";
import Header from "./components/Header";
import ShowList from "./components/ShowList";
import Form from "./components/Form";
import Filter from "./components/Filter";
import { handleSearchInput } from "./services/function";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [noti, setNoti] = useState(null);
  const [newName, setNewName] = useState({
    name: "",
    number: "",
  });

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  useEffect(() => {
    let timeout;
    if (noti) {
      timeout = setTimeout(() => {
        setNoti(null);
      }, 5000);
    }
    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, [noti]);

  const showNotification = (message) => {
    setNoti(message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingPerson = persons.find((p) => p.name === newName.name);

    // const namearr = persons.map((p) => p.name);
    // const numarr = persons.map((p) => p.number);
    if (existingPerson) {
      // return alert(
      //   `${newName.name} & ${newName.number} is already added to phonebook`
      // );
      const isConfirmed = window.confirm(
        `Do you want to change the number of " ${newName.name}" to the new number " ${newName.number}"?`
      );

      if (isConfirmed) {
        const updatedPerson = { ...existingPerson, number: newName.number };

        personService
          .update(existingPerson.id, updatedPerson)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : response.data
              )
            );
            setNewName({ name: "", number: "" });

            // console.log("Number updated successfully");
            showNotification("User updatedd successfully");
          })
          .catch((error) => {
            setErrorMessage(
              `Person '${existingPerson.name}' was already removed from server`
            );
            console.error(error);
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          });

        // .catch((error) => {
        //   console.error("Error updating number:", error);
        //   alert(
        //     `The person '${existingPerson.name}' was already removed from the server.`
        //   );
        // });
      } else {
        return;
      }
    } else {
      const newObject = {
        ...newName,
        id: uuidv4(),
      };
      // console.log("New object to be sent in handlesubmit:", newObject); // Debugging line
      // personService
      //   .create(newObject)
      //   .then((res) => setPersons(persons.concat(res.data)));
      // // setPersons(persons.concat(newObject));
      // setNewName({
      //   name: "",
      //   number: "",
      // });
      // // console.log("User added successfully");
      // showNotification("User added successfully");
      personService
        .create(newObject)
        .then((res) => {
          setPersons(persons.concat(res.data));
          setNewName({ name: "", number: "" });
          showNotification("User added successfully");
        })
        .catch((error) => {
          console.error("Error creating person:", error);
          setErrorMessage("Failed to add person. Please try again.");
          setTimeout(() => setErrorMessage(null), 5000);
        });
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setNewName({ ...newName, [name]: value });
    // console.log("Updated newName state in handleinput function:", {
    //   ...newName,
    //   [name]: value,
    // }); // Debugging line
  };

  //  console.log(searchValue)

  const handleDelete = (id) => {
    // const url = `http://localhost:3001/persons/`;
    // const findper = persons.find(p => p.id === id)
    // const filteredPeople = persons.filter((item) => item.id !== id);
    // const changedPeople = {...filteredPeople}

    // const filter = persons.filter((i) => i.id === id);
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this person?"
    );

    if (confirmDelete) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          // console.log("User deleted successfully");
          showNotification("User deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    } else {
      // console.log("You presesd cancel");
      showNotification("You presesd cancel");
    }
    // console.log("delete id:", id, "of person: ", changedPeople)
  };
  const filteredPersons = persons.filter((person) => {
    return person.name.toLowerCase().includes(searchValue);
  });

  return (
    <div>
      <Header text="Phonebook" />
      <Notification message={errorMessage} cls="error" />
      {noti && <Notification message={noti} cls="noti" />}
      <Filter
        searchValue={searchValue}
        handleSearchInput={(e) => handleSearchInput(e, setSearchValue)}
      />
      <Header text="Add a New" />
      <Form
        handleInput={handleInput}
        newName={newName}
        handleSubmit={handleSubmit}
      />
      <Header text="Numbers" />
      {/* {filteredPersons ? <ShowList persons={filteredPersons} handleDelete={handleDelete}/> : <ShowList persons={persons} handleDelete={handleDelete}/>} */}
      <ShowList persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
