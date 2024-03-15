/**
 * A React component that allows users to add countries and names to a list.
 * The component fetches a list of countries from a mock API on mount,
 * and validates the entered name asynchronously.
 */

import { useState, useEffect } from "react";
import { getLocations, isNameValid } from "./mock-api/apis";
import TableComponent from "./components/TableComponent";
import "./App.css";

function App() {
  // State to store the current input for the name field.
  const [name, setName] = useState("");
  // State to store the current selected country.
  const [country, setCountry] = useState("");
  // State to store the list of country options fetched from the API.
  const [countryOptions, setCountryOptions] = useState([]);
  // State to store any error message to display to the user.
  const [errorMsg, setError] = useState(null);
  // State to store the data for the table of added countries and names.
  const [tableData, setTableData] = useState([]);
  // State to indicate if the name is currently being validated.
  const [isCheckingName, setIsCheckingName] = useState(false);

  // Effect hook to fetch countries from the mock API on component mount.
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countries = await getLocations();
        setCountryOptions(countries);
        setCountry(countries[0]);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // Event handler for changes to the name input field.
  const handleChangeName = (e) => {
    setError(null);
    setName(e.target.value);
  };

  // Event handler for changes to the country select dropdown.
  const handleChangeCountry = (e) => {
    setCountry(e.target.value);
    setError(null);
  };

  // Clears the input fields and resets the error message.
  const handleClearInputs = () => {
    setName("");
    setCountry(countryOptions[0]);
    setError(null);
  };

  // Adds a new country and name to the table if not a duplicate.
  const handleAdd = (e) => {
    e.preventDefault();
    const newItem = { name, country };
    const isDuplicate = tableData.some(
      (item) => item.name === newItem.name && item.country === newItem.country
    );

    if (isDuplicate) {
      setError("This entry already exists in the table");
    } else {
      setTableData([...tableData, newItem]);
      handleClearInputs();
    }
  };

  const handleClearTable = () => {
    handleClearInputs();
    setTableData([]);
  };

  // Effect hook to validate the name asynchronously after a delay.
  useEffect(() => {
    if (name === "") {
      setIsCheckingName(false);
      return;
    }

    const timerId = setTimeout(() => {
      setIsCheckingName(true);
      isNameValid(name).then(() => {
        const newItem = { name, country };
        const isDuplicate = tableData.some(
          (item) =>
            item.name === newItem.name && item.country === newItem.country
        );

        if (isDuplicate) {
          setError("This entry already exists in the table");
        }
        setIsCheckingName(false);
      });
    }, 500);

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, country]);

  return (
    <div className="form-container">
      <div className="d-flex">
        <div className="input-container">
          <label htmlFor="country">
            Name:
            <input
              type="text"
              id="country"
              value={name}
              onChange={handleChangeName}
            />
          </label>
          <label htmlFor="select">
            Country:
            <select value={country} id="select" onChange={handleChangeCountry}>
              {countryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="messages">
        {errorMsg && <p className="error-message">{errorMsg}</p>}
        {isCheckingName && <p>Checking name...</p>}
      </div>
      <div className="button-container">
        <div>
          <button type="button" onClick={handleClearTable}>
            Clear
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={isCheckingName || errorMsg || name === ""}
          >
            Add
          </button>
        </div>
      </div>
      <TableComponent tableData={tableData} />
    </div>
  );
}

export default App;
