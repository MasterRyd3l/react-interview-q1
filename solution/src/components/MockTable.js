import React, { useState } from 'react';
import './MockTable.css';

import MockForm from './MockForm';

const MockTable = () => {
    const [data, setData] = useState([]);

    const tableRows = data.map((info) => {
        return (
            <tr>
                <td>{info.name}</td>
                <td>{info.location}</td>
            </tr>
        );
    });

    const addRows = (newData) => { // function called from form to add an entry
        const updatedData = [...data];
        updatedData.push(newData);
        setData(updatedData);
    }

    const clearEverything = () => { // function called from form to clear table
        setData([]);
    }

    return(
        <div>
            <MockForm add={addRows} clear={clearEverything} />
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>{tableRows}</tbody>
            </table>
        </div>
    )
}

export default MockTable;