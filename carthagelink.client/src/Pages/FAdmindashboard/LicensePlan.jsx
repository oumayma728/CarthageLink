import { useAuth } from "../../contexts/AuthContext";
import useLicenses from "../../hooks/useLicenses";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { BadgeCheck, Clock, XCircle, Zap, Calendar, Key, Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function LicensePlan() {
  const { user } = useAuth();
  const { licenses, isLoading, error } = useLicenses();

  // Enhanced date parser with debugging
  const parseMongoDate = (dateObj) => {
    if (!dateObj) {
      console.error("No date object provided");
      return null;
    }
    
    try {
      const date = dateObj?.$date ? new Date(dateObj.$date) : new Date(dateObj);
      console.log("Parsed date:", date, "from input:", dateObj);
      return date;
    } catch (e) {
      console.error("Date parsing error:", e, "for input:", dateObj);
      return null;
    }
  };

  // Debugging effect
  useEffect(() => {
    if (licenses.length > 0) {
      console.log("All licenses data:", licenses);
      console.log("Current time:", new Date());
    }
  }, [licenses]);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center p-6">
          <div className="text-center text-gray-600 dark:text-gray-400">
            Please sign in to view your license information
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const userLicenses = licenses.filter(
    (license) => license.factoryId === user?.factoryId
  );

  const activeLicense = userLicenses[0];
  const expiresAt = activeLicense ? parseMongoDate(activeLicense.expiresAt) : null;
  const currentTime = new Date();
  
  // Enhanced status check with debugging
  const isActive = (() => {
    if (!activeLicense) {
      console.log("No active license found");
      return false;
    }
    
    const statusCheck = activeLicense.status === 0;
    const dateCheck = expiresAt > currentTime;
    
    console.log(
      `License status check:\n` +
      `- Status: ${activeLicense.status} (${statusCheck ? "VALID" : "INVALID"})\n` +
      `- ExpiresAt: ${expiresAt}\n` +
      `- CurrentTime: ${currentTime}\n` +
      `- DateValid: ${dateCheck}\n` +
      `- FinalActiveStatus: ${statusCheck && dateCheck}`
    );
    
    return statusCheck && dateCheck;
  })();
  
  const daysRemaining = isActive && expiresAt
    ? Math.ceil((expiresAt - currentTime) / (1000 * 60 * 60 * 24))
    : 0;
  // Status display text
  const statusText = isActive ? "ACTIVE" : "EXPIRED";
  const statusDescription = isActive 
    ? "Your License is currently active" 
    : "Your License has expired. Renew to continue access";

  return (
    <DashboardLayout>
      <div className="min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Subscription Plan
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Manage your current license and subscription details
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Loading your license information...
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 text-center">
              <XCircle className="h-8 w-8 mx-auto text-red-500 mb-3" />
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
                Error loading license
              </h3>
              <p className="text-red-600 dark:text-red-300">{error}</p>
            </div>
          ) : userLicenses.length === 0 ? (
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-8 text-center">
              <Zap className="h-10 w-10 mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Active License Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                You don't have any active licenses. Please purchase a subscription to continue using our services.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                Upgrade Now
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* License Card */}
              <div className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl
                ${isActive ? "border-l-4 border-green-500" : "border-l-4 border-red-500"}`}
              >
                <div className={`p-1 ${isActive ? "bg-green-50 dark:bg-green-900/10" : "bg-red-50 dark:bg-red-900/10"}`}>
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                      ${isActive ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200"}`}
                    >
                      {isActive ? (
                        <>
                          <BadgeCheck className="h-4 w-4 mr-1" /> {statusText}
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-1" /> {statusText}
                        </>
                      )}
                    </span>
                    {isActive && (
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Expires today"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {isActive ? "Premium Subscription" : "Expired Subscription"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {isActive ? "Full access to all features" : "Please renew your subscription"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-lg mr-4 ${isActive ? "bg-green-100 text-green-600 dark:bg-green-900/20" : "bg-red-100 text-red-600 dark:bg-red-900/20"}`}>
                          <Key className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">License Key</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {activeLicense.key}
                            </code>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 mr-4">
                          <Zap className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Plan Type</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Annual Subscription
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20 mr-4">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Start Date</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {parseMongoDate(activeLicense.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="p-2 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/20 mr-4">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Expiry Date</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {expiresAt.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`px-6 py-4 ${isActive ? "bg-green-50 dark:bg-green-900/10" : "bg-red-50 dark:bg-red-900/10"} border-t border-gray-200 dark:border-gray-700`}>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className={`text-sm ${isActive ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                      {statusDescription}
                    </p>
                    <div className="flex gap-3">
                      {!isActive && (
                        <button className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                          Renew Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}