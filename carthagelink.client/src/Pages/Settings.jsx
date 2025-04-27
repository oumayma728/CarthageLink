import { useState } from "react";
import {
  Sun,
  Moon,
  Globe,
  Key,
  
} from "lucide-react";
import DashboardLayout from "../components/Layouts/DashboardLayout";

export default function Settings({ darkMode, onToggleTheme }) {
  const [language, setLanguage] = useState("en");
  const [accentColor, setAccentColor] = useState("blue");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setShowPasswordModal(false);
  };

  const getAccentClass = (base = "bg", hover = "hover:bg") => {
    const colorMap = {
      blue: "blue-500",
      green: "green-500",
      purple: "purple-500",
      red: "red-500",
    };
    const hoverMap = {
      blue: "blue-600",
      green: "green-600",
      purple: "purple-600",
      red: "red-600",
    };
    return `${base}-${colorMap[accentColor]} ${hover}-${hoverMap[accentColor]}`;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen px-4 sm:px-6 py-10 transition-colors duration-300 bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white">

        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">
            Settings
          </h1>

          <div className="space-y-6 md:space-y-8">
            {/* Appearance Section */}
            <div className="dark:bg-gray-800 bg-white shadow-md rounded-xl md:rounded-2xl p-4 md:p-6 transition-colors duration-300">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
                Appearance
              </h2>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-base md:text-lg">
                    {darkMode ? (
                      <Sun className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <Moon className="h-5 w-5 text-blue-500" />
                    )}
                    <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                  </div>
                  <button
                    onClick={onToggleTheme}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg md:rounded-xl text-white text-sm md:text-base shadow ${getAccentClass()}`}
                  >
                    Toggle Theme
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <label className="text-base md:text-lg">Accent Color:</label>
                  <select
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm md:text-base"
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="red">Red</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Language Section */}
            <div className="dark:bg-gray-800 bg-white shadow-md rounded-xl md:rounded-2xl p-4 md:p-6 transition-colors duration-300">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
                Language
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2 text-base md:text-lg">
                  <Globe className="h-5 w-5 text-purple-500" />
                  <span>Preferred Language:</span>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm md:text-base"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
            </div>

            {/* Security Section */}
            <div className="dark:bg-gray-800 bg-white shadow-md rounded-xl md:rounded-2xl p-4 md:p-6 transition-colors duration-300">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
                Security
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-base md:text-lg">
                  <Key className="h-5 w-5 text-orange-500" />
                  <span>Change Password</span>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white text-sm md:text-base shadow ${getAccentClass()}`}
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className={`w-full max-w-md rounded-xl p-6 ${
                darkMode
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-900"
              } transition-colors duration-300`}
            >
              <h3 className="text-xl font-semibold mb-4">Change Password</h3>
              <form onSubmit={handlePasswordChange}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-lg text-white ${getAccentClass()}`}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
