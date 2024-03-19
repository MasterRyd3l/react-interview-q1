import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';

import { isNameValid, getLocations } from './mock-api/apis';

// styled components for customizing TableCell and TableRow
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const App = () => {
  const [data, setData] = useState([]); // State for managing data
  const [name, setName] = useState(''); // State for name input
  const [location, setLocation] = useState(''); // State for location input
  const [locations, setLocations] = useState([]); // State for locations fetched from API
  const [nameValid, setNameValid] = useState(true); // State for name validity
  const [nameError, setNameError] = useState(''); // State for name input error
  const [locationError, setLocationError] = useState(''); // State for location input error

  // Effect hook to fetch locations from API on component mount
  useEffect(() => {
    getLocations().then(locations => {
      setLocations(locations);
    });
  }, []);

  // Effect hook to validate name input as the user types
  useEffect(() => {
    const validateName = async () => {
      if (name.trim() !== '') {
        const isValid = await isNameValid(name);
        setNameValid(isValid);
      } else {
        setNameValid(true); // Reset validation if name is empty
      }
    };

    validateName();
  }, [name]);

  // Effect hook to update name error message based on name validity
  useEffect(() => {
    if (!nameValid) setNameError("This name has already been taken");
    else setNameError('');
  }, [nameValid]);

  // Function to clear data
  const handleClear = () => {
    setData([]);
  };

  // Function to add data
  const handleAdd = async () => {
    if (name.trim() === '') {
      setNameError('Name is required');
      return;
    }

    if (!nameValid) {
      setNameError('This name has already been taken');
      return;
    }

    if (location.trim() === '') {
      setLocationError('Location is required');
      return;
    }

    setData([...data, { name, location }]);
    setName('');
    setLocation('');
    setNameError('');
    setLocationError('');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 10 }} />
      <Typography variant="subtitle1" gutterBottom>
        Name
      </Typography>
      
      {/* Name input field */}
      <TextField
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={!!nameError}
      />
      <Typography variant="body2" color="error" gutterBottom>
        {nameError}
      </Typography>
      <Box sx={{ mt: 2 }} />
      <Typography variant="subtitle2" gutterBottom>
        Location
      </Typography>

      {/* Select Box for Location */}
      <Select
        variant="outlined"
        fullWidth
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        error={!!locationError}
      >
        {locations.map((location, index) => (
          <MenuItem key={`${location}_${index}`} value={location}>{location}</MenuItem>
        ))}
      </Select>
      <Typography variant="body2" color="error" gutterBottom>
        {locationError}
      </Typography>
      <Box sx={{ mt: 2 }} />

      {/* Buttons for Clearing and Adding */}
      <div style={{
        textAlign: 'right'
      }}>
        <Button variant="contained" color="secondary" onClick={handleClear}>
          Clear
        </Button>
        <Button variant="contained" color="primary" onClick={handleAdd} style={{ marginLeft: '1rem' }}>
          Add
        </Button>
      </div>
      <Box sx={{ mt: 5 }} />

      {/* Data Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Location</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{item.name}</StyledTableCell>
                  <StyledTableCell>{item.location}</StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No data...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default App;
