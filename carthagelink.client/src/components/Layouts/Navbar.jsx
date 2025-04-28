import {
  Bell, Settings, RefreshCw, Sun, Moon, Search, User,
  ChevronDown, LogOut, AlertTriangle
} from "lucide-react";
import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.js";
import { useAlertContext } from "../../contexts/AlertContext.js";

// Sensor type to unit mapping (consistent with AlertsDashboard)
const SENSOR_UNITS = {
  0: '°C',    // Temperature
  1: '%',     // Humidity
  2: ' km/h', // Speedometer
  3: ' m/s²', // Accelerometer
  4: ' cm',   // Waterlevel
  5: '',      // System
};

export default function Navbar({
  darkMode,
  onToggleTheme,
  loading = false,
  onRefresh = () => {},
}) {
  const { user, logout } = useAuth();
  const { latestAlert, alerts = [], generateSensorColor, formatRelativeTime } = useAlertContext();
  const navigate = useNavigate();
  const { reportIssue } = useAlertContext();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const isOperator = user?.role?.toLowerCase() === 'operator';
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const [messageSent, setMessageSent] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);
  const [issueType, setIssueType] = useState("");
  const [issueDesc, setIssueDesc] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Formats alert message with consistent value and unit display
   * @param {Object} alert - The alert object
   * @returns {string} Formatted message
   */
  const formatAlertMessage = (alert) => {
    if (!alert) return "";
    // Always use the mapped name based on sensorType
    const unit = SENSOR_UNITS[alert.sensorType] || '';
  
    // Extract value
    const value = alert.value !== undefined ? alert.value : 
        alert.message.match(/(\d+(?:\.\d+)?)/)?.[0] || '--';
  
    return `is too ${alert.message.includes('HIGH') ? 'HIGH' : 'LOW'}! (${value}${unit})`;
  };

  // Show notification for latest alerts
  useEffect(() => {
    if (latestAlert) {
      console.log("Raw alert data:", latestAlert); // Debug log
      setIsNotifOpen(true);

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(
          `${latestAlert.sensorName || 'Alert'}`,
          {
            body: formatAlertMessage(latestAlert),
            icon: "/notification-icon.png",
          }
        );
      }
    }
  }, [latestAlert]);

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 1500);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = () => {
    if (!user) return "";
    if (user?.name?.trim()) {
      const nameParts = user.name.trim().split(/\s+/);
      return nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : user.name[0].toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "";
  };

  return (
    <>
      <nav className="flex items-center justify-between h-20 w-full px-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 w-full max-w-xl">
          <div className="relative w-full">
            <div className={`absolute inset-y-0 left-2 pl-2 flex items-center pointer-events-none ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              <Search className="h-5 w-2" />
            </div>
            <input
              type="text"
              placeholder="Search for dashboards, reports, analytics..."
              className={`w-full pl-12 pr-5 py-3.5 rounded-xl text-sm border focus:outline-none ${darkMode ? "bg-gray-800/70 border-gray-700 text-white placeholder-gray-400 focus:border-primary-dark focus:ring-4 focus:ring-primary/30" : "bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-primary focus:ring-4 focus:ring-primary/20"} shadow-inner backdrop-blur-sm`}
            />
            <div className={`absolute inset-y-0 right-0 pr-4 flex items-center ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              <kbd className="hidden md:inline px-2 py-1 text-xs rounded bg-gray-700/50 text-gray-300">⌘K</kbd>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={onToggleTheme}
            className={`p-2 ${darkMode ? "text-amber-300 hover:text-amber-200" : "text-purple-600 hover:text-purple-500"}`}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-5 w-5 md:h-6 md:w-6" /> : <Moon className="h-5 w-5 md:h-6 md:w-6" />}
          </button>

          <button
            onClick={handleRefreshClick}
            disabled={loading || isRefreshing}
            className={`hidden sm:flex items-center gap-2 p-2 ${darkMode ? "text-gray-300 hover:text-gray-200" : "text-gray-700 hover:text-gray-800"} ${loading || isRefreshing ? "cursor-wait" : "cursor-pointer"}`}
            aria-label="Refresh"
          >
            <RefreshCw className={`h-5 w-5 md:h-6 md:w-6 ${loading || isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing && <span className="text-xs font-medium">Refreshing data...</span>}
          </button>

          {isOperator ? (
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg"
              aria-label="Report Issue"
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden md:inline">Report Issue</span>
            </button>
          ) : (
            <>
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2 text-gray-800 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5 md:h-6 md:w-6" />
                </button>
                {alerts.length > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
                )}

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-white">Alerts</h4>
                    </div>
                    <ul className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                      {alerts.length > 0 ? (
                        alerts.slice(0, 3).map((alert) => (
                          <li
                            key={alert.id}
                            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => {
                              navigate("/Alert");
                              setIsNotifOpen(false);
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <div
                                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                                style={{ backgroundColor: generateSensorColor(alert.sensorType) }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-gray-700 dark:text-gray-300 font-medium truncate">
                                  {alert.sensorName || 'Alert'}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 truncate">
                                  {formatAlertMessage(alert)}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs text-gray-400 mt-1 block">
                              {formatRelativeTime(alert.timestamp)}
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-3 text-gray-500 dark:text-gray-400">No new alerts</li>
                      )}
                      {alerts.length > 3 && (
                        <li
                          className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-center text-blue-500 dark:text-blue-400 cursor-pointer"
                          onClick={() => {
                            navigate("/alerts");
                            setIsNotifOpen(false);
                          }}
                        >
                          View All ({alerts.length})
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <Link to="/settings">
                <button className="hidden sm:flex p-2 text-gray-800 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100" aria-label="Settings">
                  <Settings className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  aria-label="Profile menu"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    {getInitials() || <User className="w-4 h-4" />}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-scaleIn">
                    <div className="flex flex-col items-center gap-2 py-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                        {getInitials() || <User className="w-6 h-6" />}
                      </div>
                      {user?.name && <p className="font-semibold text-gray-800 dark:text-white text-sm">{user.name}</p>}
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || "Loading..."}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-5 h-5 mr-3" />
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Report Issue Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6 relative animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Report an Issue</h2>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Issue Type</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="">Select Type</option>
                <option value="Connection">Connection</option>
                <option value="Device Failure">Device Failure</option>
                <option value="Sensor Alert">Sensor Alert</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                value={issueDesc}
                onChange={(e) => setIssueDesc(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                placeholder="Describe the issue..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-sm rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const success = await reportIssue(issueType, issueDesc);
                  if (success) {
                    setShowReportModal(false);
                    setIssueType("");
                    setIssueDesc("");
                    setMessageSent(true);
                    setTimeout(() => setMessageSent(false), 3000);
                  }
                }}
                disabled={!issueType || !issueDesc.trim()}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
              >
                Submit
              </button>
            </div>

            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {messageSent && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg animate-fadeIn">
          Issue report sent successfully!
        </div>
      )}
    </>
  );
}

Navbar.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  onRefresh: PropTypes.func,
};

Navbar.defaultProps = {
  loading: false,
  onRefresh: () => {},
};