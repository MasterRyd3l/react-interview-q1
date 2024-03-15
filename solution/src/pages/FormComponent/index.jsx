import React, {useEffect, useState} from 'react'
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper, Button,Select,TextField,FormControl,InputLabel,MenuItem, Snackbar, Alert } from '@mui/material';

import {isNameValid, getLocations} from "../../mock-api/apis";
import { containerStyles, textFieldStyles, selectStyles, buttonStyles, tableContainerStyles, tableStyles, tableHeadCellStyles, tableBodyCellStyles, tableRowStyles } from './styles';


const FormComponent = () => {

  const [name, setName]= useState("");
  const [locations, setLocations] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [tableDataError, setTableDataError] =useState("");
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleLocationChange = (value) => setSelectedLocation(value);

  const handleNameChange = (value) => {
    setName(value);
    clearTimeout(typingTimeout);

    const timeoutId = setTimeout(async () => {
      const isValid = await isNameValid(value);
      setErrorMessage(isValid ? '' : 'Invalid name');
    }, 300);

    setTypingTimeout(timeoutId);
  };
  
  
  async function loadLocations (){
    const locations = await getLocations();
    locations.length > 0 && setLocations(locations)
  }

  const createData = (name, location) => {
    return { name, location };
  }

  useEffect(()=>{
    loadLocations();
  },[])


  const resetData = ()=>{
    setName("");
    setTableData([]);
    setSelectedLocation("");
  }

  const addRecord = ()=>{
    if(name && selectedLocation){
      const record = createData(name, selectedLocation);
      setTableData([...tableData, record]);
    }else{
      setTableDataError("Name and location must be selected to add in table")
      setOpenError(true);
    }
  }

  const handleCloseError = ()=> setOpenError(false);
  

  return (
    <div style={containerStyles}>
      <TextField
        id="Name"
        label="Name"
        variant="outlined"
        error={errorMessage.length > 0}
        helperText={errorMessage}
        value={name}
        onChange={(event) => handleNameChange(event.target.value)}
        fullWidth
        style={textFieldStyles}
      />

      <FormControl fullWidth variant="outlined" style={selectStyles}>
        <InputLabel id="location-dropdown">Select location</InputLabel>
        <Select
          labelId="location-dropdown"
          id="location-dropdown-select"
          value={selectedLocation}
          label="Location"
          onChange={(event) => handleLocationChange(event.target.value)}
        >
          {locations?.map((location, index) => (
            <MenuItem value={location} key={index}>{location}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" onClick={resetData} style={buttonStyles}>Clear</Button>
      <Button variant="contained" onClick={addRecord}>Add</Button>

      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="error" onClose={handleCloseError}>
          {tableDataError}
        </Alert>
      </Snackbar>

      <TableContainer component={Paper} style={tableContainerStyles}>
        <Table size="small" style={tableStyles}>
          <TableHead>
            <TableRow>
              <TableCell style={tableHeadCellStyles}>Name</TableCell>
              <TableCell align="right" style={tableHeadCellStyles}>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((record, index) => (
              <TableRow key={index} style={index % 2 === 0 ? tableRowStyles : {}}>
                <TableCell style={tableBodyCellStyles}>{record.name}</TableCell>
                <TableCell align="right" style={tableBodyCellStyles}>{record.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>

  );
};

export default FormComponent;