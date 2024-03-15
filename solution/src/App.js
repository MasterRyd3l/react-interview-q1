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
  const [error, setError] = useState(null);

  useEffect(() => {
    getLocations().then(locations => {
      setLocations(locations);
    });
  }, []);

  const handleNameChange = async (event) => {
    const newName = event.target.value;
    setName(newName);

    // Validate name using mock API
    const isValid = await isNameValid(newName);
    setIsValidName(isValid);

    if (!isValid) {
      setNameErrorMessage('Name is already taken. Please choose another.');
    } else {
      setNameErrorMessage('');
    }
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Validate input fields
    if (!name) {
      setError('Name is empty');
      return;
    }

    // If validation passes, clear any previous error messages
    setError(null);

    // Add new item to content state
    setContent([...content, { name, location: selectedLocation }]);
    
    // Clear input fields
    setName('');
    setSelectedLocation('');
  };

  const handleClear = () => {
    setContent([]);
  };

  const handleAdd = () => {
    // Validate input fields
    if (!name) {
      setError('Name is empty');
      return;
    }
    if (content.map(({ name }) => name).includes(name)) {
      setError('This name has already been taken');
      return;
    }

    // If validation passes, clear any previous error messages
    setError(null);

    // Add new item to content state
    setContent([...content, { name, location: selectedLocation }]);
    
    // Clear input fields
    setName('');
    setSelectedLocation('');
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
        {error && <p className="error-message">{error}</p>}
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
         
          <button type="button" onClick={handleClear}>Clear</button>
          <button type="button" onClick={handleAdd}>Add</button>
        </div>
      </form>
      {/* Display box for contents */}
      <div className="content-box">
        <h2>Contents</h2>
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
      
    </div>
  );
}

export default App;
