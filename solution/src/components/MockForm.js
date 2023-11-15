import React, { useEffect, useState } from 'react';
import './MockForm.css';
import { isNameValid, getLocations } from '../mock-api/apis';


const MockForm = (props) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('Canada');
    const [options, setOptions] = useState([]);
    const [validName, setInvalidName] = useState(false);
    const [data, setData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('This name has already been taken');

    const loadOptions = async () => { // Load locations dropdown with API data
        const data = await getLocations();
        setOptions(data);
    }

    useEffect(() => { // React Hook to synchronize component
        loadOptions();
    }, [])

    const add = async (e) => { // Calls name validator API and will add if valid. I added extra validation logic to prevent duplicate names.
        e.preventDefault();
        if (await isNameValid(name) && !data.includes(name) && name != '') {
            setInvalidName(false);
            const val = {
                name,
                location,
            };
            props.add(val);
            setData([...data, name]);
            console.log(data);
            setName('');
            setLocation('Canada');
        } else {
            setInvalidName(true);
            if (name == '') {
                setErrorMessage('Name cannot be blank');
            } else {
                setErrorMessage('This name has already been taken');
            }
        }
    }

    const clear = (e) => { // clears table and resets fields
        e.preventDefault();
        setName('');
        setLocation('Canada');
        setInvalidName(false);
        props.clear();
        setData([]);
    }

    return(
        <div>
            <form>
                <div className='row'>
                    <div className='col-25'>
                        <label className='name-label' for='name'>Name</label>
                    </div>
                    <div className='col-75'>
                        <input type="text" name="name" id='name' value={name} onChange={(e) => setName(e.target.value)} />
                        {validName && <span className='error-text'>{errorMessage}</span>}
                    </div>
                </div>
                <div className='row'>
                    <div className='col-25'>
                        <label className='location-label' for='location'>Location</label>
                    </div>
                    <div className='col-75'>
                        <select id='location' value={location} onChange={(e) => setLocation(e.target.value)}>
                            {options.map((option) => {
                                return (
                                    <option key={option} value={option}>{option}</option>
                                );
                            })}
                        </select>
                    </div>
                </div>
                <div className='button-container'>
                    <button className='clear-button' onClick={clear}>Clear</button>
                    <button className='add-button' onClick={add}>Add</button>
                </div>
            </form>
        </div>
    )
}

export default MockForm;