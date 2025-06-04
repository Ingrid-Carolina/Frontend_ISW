import React from 'react';
import { Button } from '@mui/material';

const TextField = ({referencia, mensaje}) => {
  return (
    <Button
            variant='outlined'
            href={referencia}
            target='_blank'
            rel='noopener noreferrer'
            sx={{
                mr: 2,
                mt: 1,
                border: '2px solid #10045c',
                color: '#10045c',
                fontWeight: 'bold',
                            '&:hover': {
                backgroundColor: 'white',
                color: '#e06c14',
                borderColor: '#e06c14'
                                       }}}
    >
        {mensaje}
    </Button>
  );
};

export default TextField;