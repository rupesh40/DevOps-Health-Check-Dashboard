import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import ServiceList from '../components/ServiceList';
import AddServiceForm from '../components/AddServiceForm';
import { getServices, addService, deleteService, Service } from '../services/api';

const Dashboard: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

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
    
    // Set up polling every 30 seconds
    const interval = setInterval(fetchServices, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAddService = async (service: Omit<Service, 'status' | 'last_checked'>) => {
    try {
      await addService(service);
      await fetchServices();
    } catch (err) {
      setError('Failed to add service. Please try again.');
      console.error(err);
    }
  };

  const handleDeleteService = async (name: string) => {
    try {
      await deleteService(name);
      setServices(services.filter(s => s.name !== name));
    } catch (err) {
      setError('Failed to delete service. Please try again.');
      console.error(err);
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
        />
      )}
      
      <AddServiceForm 
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddService}
      />
    </Box>
  );
};

export default Dashboard;