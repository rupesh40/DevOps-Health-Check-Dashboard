import React from 'react';
import { Service } from '../services/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Tooltip } from '@mui/material';
import { Delete, Refresh, HealthAndSafety } from '@mui/icons-material';

interface ServiceListProps {
  services: Service[];
  onDelete: (name: string) => void;
  onRefresh: () => void;
  onCheckService: (name: string) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ services, onDelete, onRefresh, onCheckService }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Last Checked</TableCell>
            <TableCell align="right">
              <Tooltip title="Refresh All">
                <IconButton onClick={onRefresh} color="primary">
                  <Refresh />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.name}>
              <TableCell>{service.name}</TableCell>
              <TableCell>{service.url}</TableCell>
              <TableCell>
                <Chip 
                  label={service.status || 'unknown'} 
                  color={service.status === 'UP' ? 'success' : service.status === 'DOWN' ? 'error' : 'default'} 
                />
              </TableCell>
              <TableCell>{service.last_checked ? new Date(service.last_checked).toLocaleString() : 'Never'}</TableCell>
              <TableCell align="right">
                <Tooltip title="Check Health">
                  <IconButton onClick={() => onCheckService(service.name)} color="primary">
                    <HealthAndSafety />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => onDelete(service.name)} color="error">
                    <Delete />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ServiceList;