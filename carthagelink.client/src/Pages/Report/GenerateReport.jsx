import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  TextField, 
  Box, 
  CircularProgress, 
  Alert,
  Paper,
  Stack,
  Divider,
  IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { generateReport } from '../../api/ReportApi';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const GenerateReport = ({ onReportGenerated }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const report = await generateReport({
        startDate,
        endDate,
        metrics: [
          'totalAlerts',
          'totalSensorData',
          'alertTypesDistribution',
          'mostCommonAlertType',
          'alertTrends'
        ]
      });
      onReportGenerated?.(report.id);
      navigate(`/reports/${report.id}`);
    } catch (err) {
      setError(err.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ 
        p: 4, 
        borderRadius: 4, 
        bgcolor: 'background.paper',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)'
      }}>
        <Stack spacing={4}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => navigate('/reports')} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h5" component="h1" fontWeight="bold">
                Create New Report
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select a date range to analyze sensor data
              </Typography>
            </Box>
          </Box>

          <Divider />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                )}
              />

              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                minDate={startDate}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                )}
              />
            </Stack>
          </LocalizationProvider>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              size="large"
              sx={{
                px: 4,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Analyzing Data...
                </>
              ) : (
                'Generate Report'
              )}
            </Button>
          </Box>

          <Box sx={{ 
            mt: 4,
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.default',
            border: '1px dashed',
            borderColor: 'divider'
          }}>
            <Typography variant="body2" color="text.secondary">
              <strong>This report will include:</strong>
            </Typography>
            <ul style={{ 
              paddingLeft: 20,
              marginTop: 8,
              marginBottom: 0 
            }}>
              <li><Typography variant="body2" color="text.secondary">Total number of alerts</Typography></li>
              <li><Typography variant="body2" color="text.secondary">Sensor data statistics</Typography></li>
              <li><Typography variant="body2" color="text.secondary">Most common alert types</Typography></li>
              <li><Typography variant="body2" color="text.secondary">Alert trends over time</Typography></li>
            </ul>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default GenerateReport;