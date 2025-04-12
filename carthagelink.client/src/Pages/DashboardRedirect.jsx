import { useAuth } from "../contexts/AuthContext";
import DashboardSuperAdmin from "./SAdmindashboard/DashboardPage";
import DashboardFactoryAdmin from "./FAdmindashboard/FactoryDashbaordPage";

export default function DashboardRedirect() {
  const { user } = useAuth();
  const role = user?.role;

  if (!role) return null; // Or a loader/spinner

  if (role === "SuperAdmin") return <DashboardSuperAdmin />;
  if (role === "FactoryAdmin") return <DashboardFactoryAdmin />;

  return (
    <div className="p-6 text-center text-gray-600">
      You do not have access to a dashboard.
    </div>
  );
}
