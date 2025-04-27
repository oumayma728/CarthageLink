import { useAuth } from "../contexts/AuthContext";
import DashboardSuperAdmin from "./SAdmindashboard/DashboardPage";
import DashboardFactoryAdmin from "./FAdmindashboard/FactoryDashbaordPage";
import DashboardOperator from "./Operatordashboard/OperatordashboardPage"

export default function DashboardRedirect() {
  const { user } = useAuth();
  const role = user?.role;
  const deviceId = "6617f12e4d1f4a1d88c6c9a1";

  if (!role) return null; // Or a loader/spinner

  if (role === "SuperAdmin") return <DashboardSuperAdmin />;
  if (role === "FactoryAdmin") return <DashboardFactoryAdmin />;
  if (role === "Operator") return <DashboardOperator deviceId={deviceId} />;


  return (
    <div className="p-6 text-center text-gray-600">
      You do not have access to a dashboard.
    </div>
  );
}
