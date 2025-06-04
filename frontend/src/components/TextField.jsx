import React from 'react';
import { TextField as MuiTextField } from '@mui/material';

const TextField = ({ nombre, rol }) => {
  return (
    <MuiTextField
      label={nombre}
      type={rol}
      variant="outlined"
      margin="normal"
      
    />
  );
};

export default TextField;