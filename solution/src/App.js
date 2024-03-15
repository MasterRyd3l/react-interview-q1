import React, { useState, useEffect } from 'react';
import './App.css';
import { isNameValid, getLocations } from './mock-api/apis.js';

function App() {
  const [name, setName] = useState('');
  const [isValidName, setIsValidName] = useState(true);
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [content, setContent] = useState([]);

  useEffect(() => {
    getLocations().then(locations => {
      setLocations(locations);
    });
  }, []);

  const handleNameChange = (event) => {
    const newName = event.target.value;
    setName(newName);
  };
  
  useEffect(() => {
    const validateName = async () => {
      // Validate name using mock API
      const isValid = await isNameValid(name);
      setIsValidName(isValid);
  
      if (!isValid) {
        setNameErrorMessage('Name is already taken. Please choose another.');
      } else {
        setNameErrorMessage('');
      }
    };
  
    // Call the validateName function when the name changes
    validateName();
  }, [name]);
  
  

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here, e.g., send data to server
    const newItem = {
      name: name,
      location: selectedLocation
    };
    setContent([...content, newItem]);
    setName('');
    setSelectedLocation('');
  };

  const handleClear = () => {
    setContent([]);
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        {/* Name input field */}
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input 
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={handleNameChange}
            className={!isValidName ? 'equal-dropdown invalid' : 'equal-dropdown big-input'}
          />
          {!isValidName && <p className="error-message">{nameErrorMessage}</p>}
        </div>
        {/* Location dropdown */}
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <select 
            id="location" 
            value={selectedLocation}
            onChange={handleLocationChange}
            className="equal-dropdown"
          >
            <option value="">Select location</option>
            {locations.map((location, index) => (
              <option key={index} value={location}>{location}</option>
            ))}
          </select>
        </div>
        {/* Buttons on the right side */}
        <div className="button-group">
          <button type="submit">Add</button>
          <button type="button" onClick={handleClear}>Clear</button>
        </div>
      </form>
      {/* Display box for contents */}
      <table className="my-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through content and render rows */}
          {content.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
