import DashboardLayout from "../../components/Layouts/DashboardLayout"; 
import StatCard from "../../components/Layouts/Dashboard/StatCard";
import ActivityFeed from "../../components/Layouts/Dashboard/ActivityFeed";
import Header from "../../components/Layouts/Dashboard/DashboardHeader";
import useDashboardData from "../../hooks/useDashboardData";
import LineChart from "../../components/Charts/LineChart";
import DeviceOverview from "../../components/features/Devices/deviceOverview.jsx";

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
      <div className="flex-1 flex flex-col overflow-hidden">
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

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard 
              title="Connected Devices" 
              value={dashboardData.devices} 
              icon="Cpu"
            />
            <StatCard 
              title="Active Factories" 
              value={dashboardData.factories} 
              icon="Factory"
            />
            <StatCard 
              title="Registered Users" 
              value={dashboardData.users} 
              icon="Users"
            />
            <StatCard 
              title="Active Licenses" 
              value={dashboardData.licenses} 
              icon="Key"
            />
          </div>
          <DeviceOverview />

          {/* Charts and Map Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="h-full">
              <LineChart />
              <LineChart/>
            </div>
            <div className="h-full">

            </div>
          </div>

          {/* Activity Feed - Full width at bottom */}
          <div className="grid grid-cols-1">
            <ActivityFeed 
              activities={dashboardData.recentActivities || []} 
            />
          </div>

        </main>
      </div>
    </DashboardLayout>
  );
}