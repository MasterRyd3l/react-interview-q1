import React, { useEffect, useState } from 'react';
import { getLocations, isNameValid } from './mock-api/apis';

const App = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [entries, setEntries] = useState([]);
  const [locations, setLocations] = useState([]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (error) {
      return;
    }
    setEntries([...entries, { name, location }]);
    setName('');
    setLocation(locations[0]);
    setError('');
  };

  const handleClear = () => {
    setName('');
    setLocation('');
    setError('');
  };

  useEffect(() => {
    const fetchLocations = async () => {
      const l = await getLocations();
      setLocations(l);
      console.log('hit');
      setLocation(l[0]);
    };
    fetchLocations();
  }, []);

  const handleNameChange = async (e) => {
    const newName = e.target.value;
    setName(newName);
    if (newName) {
      const isValid = await isNameValid(newName);
      if (!isValid) {
        setError('This name has already been taken');
      } else {
        setError('');
      }
    }
  };

  return (
    <div className="container">
      <form>
        <div className="form-group">
          <label className="label" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
          />
          {error && <div className="error-message">
            {error}
          </div>}
        </div>
        <div className="form-group">
          <label 
            htmlFor="location"
            className="label">
            Location
          </label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {locations.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
        <div className="button-group">
          <button type="button" onClick={handleClear}>
            Clear
          </button>
          <button 
            type="submit"
            onClick={handleAdd}
            disabled={error}
          >
            Add
          </button>
        </div>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.name}</td>
              <td>{entry.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
