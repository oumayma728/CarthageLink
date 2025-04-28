import { useState } from 'react';
import { Container, Alert, TextField, Button, Box, Typography, Paper } from '@mui/material';
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { generateReport } from '../../api/ReportApi';
import jsPDF from 'jspdf';  // Import jsPDF

const ReportsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [generatedReport, setGeneratedReport] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
        setError("Please select both start and end dates!");
        return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
        setError("Start date must be before end date");
        return;
    }

    setLoading(true);
    setError(null);

    try {
        const reportData = await generateReport(start, end);

        if (!reportData) {
            setError("No data available for the selected date range");
            setShowReport(false);
            return;
        }

        // Transform data if needed to match frontend expectations
        const transformedData = {
            startDate: reportData.startDate,
            endDate: reportData.endDate,
            totalSensorDataPoints: reportData.totalSensorDataPoints,
            totalAlerts: reportData.totalAlerts,
            mostCommonAlertType: reportData.mostCommonAlertType,
            averageSensorValues: reportData.averageSensorValues || {}
        };

        setGeneratedReport(transformedData);
        setShowReport(true);
    } catch (err) {
        setError(err.message || "Failed to generate report");
        setShowReport(false);
    } finally {
        setLoading(false);
    }
};

// Enhanced PDF generation
const generatePDF = () => {
    if (!generatedReport) return;

    const doc = new jsPDF();
    
    // Add logo or header
    doc.setFontSize(20);
    doc.setTextColor(40, 53, 147);
    doc.text("Industrial Monitoring Report", 105, 20, { align: 'center' });
    
    // Report metadata
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Report Period: ${formatDate(startDate)} to ${formatDate(endDate)}`, 20, 40);
    doc.line(20, 45, 190, 45);
    
    // Key metrics
    doc.setFontSize(14);
    doc.text("Key Metrics", 20, 60);
    
    doc.setFontSize(12);
    doc.text(`• Total Sensor Data Points: ${generatedReport.totalSensorDataPoints || 0}`, 20, 70);
    doc.text(`• Total Alerts: ${generatedReport.totalAlerts || 0}`, 20, 80);
    doc.text(`• Most Common Alert: ${generatedReport.mostCommonAlertType || "None"}`, 20, 90);
    
    // Sensor averages
    doc.setFontSize(14);
    doc.text("Average Sensor Values", 20, 110);
    
    if (generatedReport.averageSensorValues) {
        let y = 120;
        Object.entries(generatedReport.averageSensorValues).forEach(([sensor, value]) => {
            doc.text(`• ${sensor}: ${value.toFixed(2)}`, 20, y);
            y += 10;
        });
    }
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 280, { align: 'center' });
    
    doc.save(`Report_${startDate}_to_${endDate}.pdf`);
};

// Helper function
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
};


  return (
    <DashboardLayout>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        {/* Date Range Inputs */}
        <div className="mb-4">
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
        </div>

        <Button
          onClick={handleGenerateReport}
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? "Generating..." : "Generate Report"}
        </Button>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        {/* Report Summary */}
        {showReport && generatedReport && (
          <Paper sx={{ mt: 4, p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Report Summary
            </Typography>

            <Typography variant="body1" sx={{ mt: 2 }}>
              <strong>Total Sensor Data Points:</strong> {generatedReport.totalSensorDataPoints || 0}
            </Typography>

            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Total Alerts:</strong> {generatedReport.totalAlerts || 0}
            </Typography>

            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Most Common Alert Type:</strong> {generatedReport.mostCommonAlertType || "None"}
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Average Sensor Values
              </Typography>
              {generatedReport.averageSensorValues && Object.keys(generatedReport.averageSensorValues).length > 0 ? (
                Object.entries(generatedReport.averageSensorValues).map(([sensor, value], index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      <strong>{sensor}:</strong> {value}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2">No sensor data available for the selected date range.</Typography>
              )}
            </Box>

            {/* Button to download PDF */}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 4 }}
              onClick={generatePDF}
            >
              Download PDF
            </Button>
          </Paper>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default ReportsPage;
