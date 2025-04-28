import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Divider,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Button
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  CalendarToday as CalendarIcon,
  Warning as AlertIcon,
  ShowChart as TrendIcon,
  DonutLarge as DonutIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { getReportById } from '../../api/ReportApi';
import jsPDF from 'jspdf';

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getReportById(id);
        setReport(data);
      } catch (err) {
        setError(err.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");

    // Title
    doc.text("Sensor Data Report", 20, 20);
    doc.text(`Report ID: ${id}`, 20, 30);

    // Date Range
    doc.text(`Date Range: ${format(new Date(report.startDate), 'MMM d, yyyy')} - ${format(new Date(report.endDate), 'MMM d, yyyy')}`, 20, 40);

    // Total Alerts
    doc.text(`Total Alerts: ${report.totalAlerts || 0}`, 20, 50);

    // Most Common Alert
    doc.text(`Most Common Alert: ${report.mostCommonAlertType || 'None'}`, 20, 60);

    // Alert Rate
    doc.text(`Alert Rate: ${report.alertRate ? `${report.alertRate.toFixed(1)}%` : '0%'}`, 20, 70);

    // Notes if available
    if (report.notes) {
      doc.text(`Notes: ${report.notes}`, 20, 80);
    }

    doc.save(`report_${id}.pdf`);
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
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ 
        p: 4, 
        borderRadius: 4,
        bgcolor: 'background.paper',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)'
      }}>
        <Stack spacing={4}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => navigate('/reports')} sx={{ mr: 2 }}>
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Sensor Data Report
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(report.createdAt), 'MMMM d, yyyy - h:mm a')}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Button startIcon={<DownloadIcon />} sx={{ mr: 2 }} onClick={generatePDF}>
                Download PDF
              </Button>
              <Button startIcon={<ShareIcon />} variant="outlined">
                Share
              </Button>
            </Box>
          </Box>

          <Divider />

          {/* Date Range */}
          <Box sx={{ 
            p: 3, 
            borderRadius: 2, 
            bgcolor: 'background.default',
            display: 'flex',
            alignItems: 'center'
          }}>
            <CalendarIcon color="primary" sx={{ mr: 2 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Date Range Analyzed
              </Typography>
              <Typography variant="body1">
                {format(new Date(report.startDate), 'MMM d, yyyy')} - {format(new Date(report.endDate), 'MMM d, yyyy')}
              </Typography>
            </Box>
          </Box>

          {/* Key Metrics */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <AlertIcon color="primary" />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Alerts
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {report.totalAlerts || 0}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'secondary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <DonutIcon color="secondary" />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Most Common Alert
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {report.mostCommonAlertType || 'None'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'success.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <TrendIcon color="success" />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Alert Rate
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {report.alertRate ? `${report.alertRate.toFixed(1)}%` : '0%'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {/* Alert Types */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Alert Types Distribution
            </Typography>
            <Box sx={{ mt: 2 }}>
              {report.alertTypesDistribution && Object.entries(report.alertTypesDistribution).map(([type, count]) => (
                <Box key={type} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">{type}</Typography>
                    <Typography variant="body1" fontWeight="bold">{count}</Typography>
                  </Box>
                  <Box sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'divider',
                    overflow: 'hidden'
                  }}>
                    <Box sx={{
                      height: '100%',
                      width: `${(count / report.totalAlerts) * 100}%`,
                      bgcolor: 'primary.main',
                      borderRadius: 4
                    }} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Summary */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Summary
            </Typography>
            <Typography variant="body1" paragraph>
              During this period, your system detected <strong>{report.totalAlerts} alerts</strong>, 
              with the most common being <strong>{report.mostCommonAlertType || 'no specific type'}</strong>.
            </Typography>
            {report.notes && (
              <Box sx={{ 
                mt: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: 'warning.light',
                borderLeft: '4px solid',
                borderColor: 'warning.main'
              }}>
                <Typography variant="body2">
                  <strong>Note:</strong> {report.notes}
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={() => navigate('/reports/generate')}
              sx={{ borderRadius: 2 }}
            >
              Generate New Report
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ReportDetails;
