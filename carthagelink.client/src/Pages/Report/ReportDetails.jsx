// src/components/ReportDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardContent, CircularProgress, Alert, Chip, Divider } from '@mui/material';
import { getReportById } from '../services/api';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#4a6fa5', '#ff7e5f', '#6a8caf', '#ff9e7d', '#8da9c4'];

const ReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getReportById(id);
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

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

  if (!report) {
    return (
      <Container>
        <Alert severity="warning">Report not found</Alert>
      </Container>
    );
  }

  // Prepare data for charts
  const sensorData = Object.entries(report.AverageSensorValues).map(([key, value]) => ({
    name: key,
    value: value,
  }));

  const alertData = [
    { name: 'Alerts', value: report.TotalAlerts },
    { name: 'Data Points', value: report.TotalSensorDataPoints },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Weekly Report Details
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {format(new Date(report.StartDate), 'MMM d, yyyy')} - {format(new Date(report.EndDate), 'MMM d, yyyy')}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Data Points
                  </Typography>
                  <Typography variant="h5">{report.TotalSensorDataPoints}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Alerts
                  </Typography>
                  <Typography variant="h5">{report.TotalAlerts}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Most Common Alert
                  </Typography>
                  <Chip
                    label={report.MostCommonAlertType || 'None'}
                    color="secondary"
                    sx={{ mt: 1 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sensor Data Averages
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sensorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#4a6fa5" name="Average Value" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Data Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={alertData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {alertData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sensor Averages
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {Object.entries(report.AverageSensorValues).map(([key, value]) => (
                  <Grid item xs={6} key={key}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2">{key}</Typography>
                        <Typography variant="h6">{value.toFixed(2)}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReportDetails;