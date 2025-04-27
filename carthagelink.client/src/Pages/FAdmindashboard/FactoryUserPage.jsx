import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/Layouts/DashboardLayout.jsx";
import FactoryUsersTable from "../../components/features/users/FactoryUsersTable.jsx";
import { useAuth } from "../../contexts/AuthContext.js";

export default function FactoryUserPage() {
  const { user } = useAuth();
  const { factoryId: paramFactoryId } = useParams();

  const factoryId = paramFactoryId || user?.factoryId;

  if (!factoryId) {
    return (
      <DashboardLayout activePage="/User">
        <p className="text-red-500">Error: Missing factoryId</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activePage="/User">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-xl font-bold mb-2 sm:mb-0 dark:text-white">Users</h1>
        </div>
        <FactoryUsersTable factoryId={factoryId} />
      </div>
    </DashboardLayout>
  );
}
