import DashboardLayout from "../../components/Layouts/DashboardLayout"; 
import ActivityFeed from "../../components/Layouts/Dashbaord/ActivityFeed"; // Fixed typo
import Header from "../../components/Layouts/Dashbaord/DashboardHeader"; // Fixed typo
import useDashboardData from "../../hooks/useDashboardData";
import BarChartOne from "../../components/Charts/BarChart";
import LineChartOne from "../../components/Charts/LineChart";
export default function DashboardPage() {
const { 
    data: dashboardData = {}, 
    loading, 
    error, 
    lastUpdated, 
    refreshData 
} = useDashboardData();

return (
    <DashboardLayout activePage="/dashboard">      
    <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
        <Header 
        title="Dashboard Overview"
        onRefresh={refreshData}
        loading={loading}
        />

        <main className="flex-1 overflow-y-auto p-6">
        {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
            Error: {error}
            </div>
        )}

        {lastUpdated && (
            <div className="text-sm text-muted-foreground mb-4">
            Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ActivityFeed 
              activities={dashboardData.recentActivities} 
              className="lg:col-span-2"
            />
          </div>
          <BarChartOne />
          <LineChartOne/>
          
        </main>
      </div>
    </DashboardLayout>
  );
}
