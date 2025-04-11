import { useEffect, useState } from "react";
import axios from "axios";
import Content from "./components/Content";
import Filter from "./components/Filter";

function App() {
  const [countries, setCountries] = useState([]);
  const [allCountries, setAllCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')


  useEffect(() => {
    axios
     .get("https://studies.cs.helsinki.fi/restcountries/api/all")
     .then((response) => {
      console.log("promise fulfilled");
      setAllCountries(response.data);
    })
    .catch((error) => { return console.log(error) });
    
  }, []);


  const handleFilter = (e) => {
    setNewFilter(e.target.value);
    if (newFilter) {
      const filtered = allCountries.filter((country) =>
        country.name.common.toLowerCase().includes(newFilter.toLowerCase())
      );
      setCountries(filtered);
    }
  };

  return (
    <>
      <Filter value={newFilter} onChange={handleFilter}/>
      <Content countries={countries} setCountries={setCountries} />
    </>
  );
}

export default App;
