import React, { useState, useEffect } from 'react';
import { getLocations, isNameValid } from './mock-api/apis';

export default function FormComponent()
{
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [tableData, setTableData] = useState([]);
    const [isValid, setIsValid] = useState(true);
    const [options, setOptions] = useState([]);

    // Get list of locations from apis.js
    useEffect(() => {
        async function fetchLocations() {
            try {
                const data = await getLocations();
                setOptions(data);
            } catch (error) {
                console.error('Error getting locations:', error);
            }
        }

        fetchLocations();
    }, []);

    // Check if input is valid; currently API is set to return false if name is 'invalid name'
    const handleInputChange = async function(e) {
        const inputName = e.target.value;
        setName(inputName);

        try {
            const valid = await isNameValid(inputName);
            setIsValid(valid);
        } catch (error) {
            console.error('This name has already been taken');
        }
    }

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    }

    // Assuming clear is to clear data from table
    const handleClear = () => {
        setTableData([]);
    }

    // Handles new entries to data table 
    const handleAdd = () => {
        if (isValid && location) {
            const newData = {name, location};
            setTableData([...tableData, newData]);
            setName('');
        } else {
            alert('Name cannot be empty or taken');
        }
    }
    
    return (
        <>
            {/* Used div instead of form since we're not submitting data */}
            <div>
                <div className='input-fields'>
                    <label htmlFor="name">Name</label>
                    <input
                        id='name'
                        type='text'
                        value={name}
                        onChange={handleInputChange}
                    ></input>
                    
                    {!isValid && (
                        <p>This name has already been taken</p>
                    )}
                </div>

                <div className='input-fields'>
                    <label htmlFor="location">Location</label>
                    <select
                        id='location'
                        value={location}
                        onChange={handleLocationChange}
                    >
                        {options.map(option => {
                            return (<option key={option} value={option}>{option}</option>)
                        })}
                    </select>
                </div>

                <button onClick={handleClear}>Clear</button>
                <button onClick={handleAdd}>Add</button>                
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.name}</td>
                            <td>{entry.location}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}