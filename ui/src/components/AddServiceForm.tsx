import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Service } from '../services/api';

interface AddServiceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (service: Omit<Service, 'status' | 'last_checked'>) => void;
}

const AddServiceForm: React.FC<AddServiceFormProps> = ({ open, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    onSubmit({ name, url });
    setName('');
    setUrl('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Service</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Service Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Service URL"
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!name || !url}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddServiceForm;