import React from 'react';
import { Alert, AlertTitle, Collapse } from '@mui/material';

const AlertMessage = ({ 
  open = false, 
  type = 'error', 
  title, 
  message,
  onClose
}) => {
  return (
    <Collapse in={open}>
      <Alert 
        severity={type} 
        onClose={onClose}
        sx={{ mb: 2 }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Collapse>
  );
};

export default AlertMessage; 