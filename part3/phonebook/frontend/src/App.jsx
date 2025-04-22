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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const existingPerson = persons.find((p) => p.name === newName.name);

  //   if (existingPerson) {
  //     const isConfirmed = window.confirm(
  //       `Do you want to change the number of " ${newName.name}" to the new number " ${newName.number}"?`
  //     );

  //     if (isConfirmed) {
  //       const updatedPerson = { ...existingPerson, number: newName.number };

  //       personService
  //         .update(existingPerson.id, updatedPerson)
  //         .then((response) => {
  //           setPersons(
  //             persons.map((person) =>
  //               person.id !== existingPerson.id ? person : response.data
  //             )
  //           );
  //           setNewName({ name: "", number: "" });

  //           showNotification("User updatedd successfully");
  //         })
  //         .catch((error) => {
  //           setErrorMessage(
  //             `Person '${existingPerson.name}' was already removed from server`
  //           );
  //           console.error(error);
  //           setTimeout(() => {
  //             setErrorMessage(null);
  //           }, 5000);
  //         });
  //     } else {
  //       return;
  //     }
  //   } else {
  //     const newObject = {
  //       ...newName,
  //       id: uuidv4(),
  //     };

  //     personService
  //       .create(newObject)
  //       .then((res) => {
  //         setPersons(persons.concat(res.data));
  //         setNewName({ name: "", number: "" });
  //         showNotification("User added successfully");
  //       })
  //       .catch((error) => {
  //         console.error("Error creating person:", error);
  //         setErrorMessage("Failed to add person. Please try again.");
  //         setTimeout(() => setErrorMessage(null), 5000);
  //       });
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingPerson = persons.find((p) => p.name === newName.name);
  
    if (existingPerson) {
      const isConfirmed = window.confirm(
        `Do you want to change the number of "${newName.name}" to the new number "${newName.number}"?`
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
            showNotification("User updated successfully");
          })
          .catch((error) => {
            console.error("Error updating person:", error);
            setErrorMessage(
              error.response?.data?.error || "Failed to update person."
            );
            setTimeout(() => setErrorMessage(null), 5000);
          });
      }
    } else {
      const newObject = {
        ...newName,
        id: uuidv4(),
      };
  
      personService
        .create(newObject)
        .then((res) => {
          setPersons(persons.concat(res.data));
          setNewName({ name: "", number: "" });
          showNotification("User added successfully");
        })
        .catch((error) => {
          console.error("Error creating person:", error);
          // Display the error message from Mongoose
          setErrorMessage(
            error.response?.data?.error
          );
          setTimeout(() => setErrorMessage(null), 5000);
        });
    }
  };


  const handleInput = (e) => {
    const { name, value } = e.target;
    setNewName({ ...newName, [name]: value });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this person?"
    );

    if (confirmDelete) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          showNotification("User deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    } else {
      showNotification("You presesd cancel");
    }
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
      <ShowList persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
