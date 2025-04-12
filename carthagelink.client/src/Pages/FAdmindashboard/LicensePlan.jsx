import { useAuth } from "../../contexts/AuthContext";
import useLicenses from "../../hooks/useLicenses";

export default function LicensePlan() {
  const { user } = useAuth();
  const { licenses, isLoading, error } = useLicenses();
  console.log("User factoryId:", user?.factoryId);
  console.log("All licenses:", licenses);
  
  // Filter licenses that belong to this factory admin
  const userLicenses = licenses.filter(
    (license) => license.factoryId === user?.factoryId// Adjust to match your backend field (maybe factoryAdminId?)
  );

  if (isLoading) return <div className="p-6">Loading license plan...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (userLicenses.length === 0) return <div className="p-6">No licenses found for your account.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your License Plan</h1>

      {userLicenses.map((license) => (
        <div key={license.id} className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 mb-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">
            {license.deviceName || "Device"}
          </h2>

          <div className="space-y-2 text-sm">
            <p><span className="font-medium">License Key:</span> {license.licenseKey}</p>
            <p><span className="font-medium">Start Date:</span> {new Date(license.startDate).toLocaleDateString()}</p>
            <p><span className="font-medium">Expiry Date:</span> {new Date(license.expiryDate).toLocaleDateString()}</p>
            <p>
              <span className="font-medium">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                license.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {license.status}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
