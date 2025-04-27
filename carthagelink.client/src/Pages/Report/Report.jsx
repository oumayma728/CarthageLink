// src/components/ReportsDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { getAllReports } from '../../api/ReportApi';
import { format } from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Helper function to check and return valid date
const formatDate = (date) => {
  const validDate = new Date(date);
  return validDate instanceof Date && !isNaN(validDate) ? validDate : null;
};

const ReportsDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getAllReports();
        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'dateRange',
      headerName: 'Date Range',
      width: 250,
      valueGetter: (params) => {
        const { row } = params;
        // Check if row and the required fields are valid
        if (row && row.StartDate && row.EndDate) {
          const startDate = formatDate(row.StartDate);
          const endDate = formatDate(row.EndDate);
          if (startDate && endDate) {
            return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
          }
        }
        return 'Invalid Date Range'; // Fallback if the dates are not valid
      },
    },
    { field: 'TotalSensorDataPoints', headerName: 'Data Points', width: 150 },
    { field: 'TotalAlerts', headerName: 'Alerts', width: 150 },
    {
      field: 'MostCommonAlertType',
      headerName: 'Common Alert',
      width: 200,
    },
  ];
  

  const handleRowClick = (params) => {
    navigate(`/report/${params.row.id}`);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // Prepare data for the chart
  const chartData = reports
    .map((report) => {
      const startDate = formatDate(report.StartDate);
      if (startDate) {
        return {
          name: format(startDate, 'MMM d'),
          dataPoints: report.TotalSensorDataPoints,
          alerts: report.TotalAlerts,
        };
      }
      return null; // Skip invalid reports
    })
    .filter((item) => item !== null); // Filter out invalid items

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Weekly Reports Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Data Points & Alerts Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="dataPoints" fill="#4a6fa5" name="Data Points" />
                  <Bar dataKey="alerts" fill="#ff7e5f" name="Alerts" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Summary Statistics
              </Typography>
              {reports.length > 0 && (
                <div>
                  <Typography>Total Reports: {reports.length}</Typography>
                  <Typography>
                    Latest Report: {formatDate(reports[0].StartDate) ? format(new Date(reports[0].StartDate), 'MMM d, yyyy') : 'Invalid Date'} -{' '}
                    {formatDate(reports[0].EndDate) ? format(new Date(reports[0].EndDate), 'MMM d, yyyy') : 'Invalid Date'}
                  </Typography>
                  <Typography>
                    Average Data Points: {Math.round(reports.reduce((acc, r) => acc + r.TotalSensorDataPoints, 0) / reports.length)}
                  </Typography>
                  <Typography>
                    Average Alerts: {Math.round(reports.reduce((acc, r) => acc + r.TotalAlerts, 0) / reports.length)}
                  </Typography>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={reports}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          onRowClick={handleRowClick}
          sx={{ cursor: 'pointer' }}
        />
      </div>
    </Container>
  );
};

export default ReportsDashboard;
