import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress, Alert, Snackbar } from '@mui/material';
import ServiceList from '../components/ServiceList';
import AddServiceForm from '../components/AddServiceForm';
import { getServices, addService, deleteService, checkSingleService, Service } from '../services/api';

const Dashboard: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch services. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = async (service: Omit<Service, 'status' | 'last_checked'>) => {
    try {
      await addService(service);
      await fetchServices();
      setSnackbar({ open: true, message: 'Service added successfully' });
    } catch (err) {
      setError('Failed to add service. Please try again.');
      console.error(err);
    }
  };

  const handleDeleteService = async (name: string) => {
    try {
      await deleteService(name);
      setServices(services.filter(s => s.name !== name));
      setSnackbar({ open: true, message: 'Service deleted successfully' });
    } catch (err) {
      setError('Failed to delete service. Please try again.');
      console.error(err);
    }
  };

  const handleCheckService = async (name: string) => {
    try {
      setLoading(true);
      const updatedService = await checkSingleService(name);
      setServices(services.map(s => 
        s.name === name ? { ...s, ...updatedService } : s
      ));
      setSnackbar({ open: true, message: `Checked service: ${name}` });
    } catch (err) {
      setError(`Failed to check service ${name}. Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        DevOps Health Dashboard
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Button 
        variant="contained" 
        onClick={() => setOpenAddDialog(true)}
        sx={{ mb: 2 }}
      >
        Add Service
      </Button>
      
      {loading ? (
        <CircularProgress />
      ) : (
        <ServiceList 
          services={services} 
          onDelete={handleDeleteService}
          onRefresh={fetchServices}
          onCheckService={handleCheckService}
        />
      )}
      
      <AddServiceForm 
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddService}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default Dashboard;