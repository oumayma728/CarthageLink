import { Bell, Settings, RefreshCw, Sun, Moon, Search, User, ChevronDown, LogOut } from "lucide-react";
import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.js"; // Import your auth context

export default function Navbar({ darkMode, onToggleTheme, onRefresh, loading }) {
  const { user, logout } = useAuth(); // Get user and logout from auth context
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  useEffect(() => {
    console.log("Current user in Navbar:", user);
  }, [user]);
  console.log("Navbar user data:", user); 

  // Handle click outside profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get user initials
  const getInitials = () => {
    if (!user) return '';
    
    // Try to get from name
    if (user?.name?.trim()) {
      const nameParts = user.name.trim().split(/\s+/);
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[nameParts.length-1][0]}`.toUpperCase();
      }
      return user.name[0].toUpperCase();
    }
    
    // Fallback to email
    if (user?.email?.trim()) {
      return user.email[0].toUpperCase();
    }
    
    // Final fallback
    return '';
  };
  useEffect(() => {
    console.log("User in Navbar:", user); 
  }, [user]);
  

  return (
    <nav className="flex items-center justify-between h-20 w-full px-4">
      {/* Middle Section - Search */}
      <div className="flex items-center gap-2">
        <div className="relative w-96">
          <div className={`absolute inset-y-0 left-2 pl-2 flex items-center pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search for dashboards, reports, analytics..."
            className={`w-full pl-12 pr-5 py-3.5 rounded-xl text-sm border focus:outline-none ${darkMode ? 'bg-gray-800/70 border-gray-700 text-white placeholder-gray-400 focus:border-primary-dark focus:ring-4 focus:ring-primary/30' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-primary focus:ring-4 focus:ring-primary/20'} shadow-inner backdrop-blur-sm`}
          />
          <div className={`absolute inset-y-0 right-0 pr-4 flex items-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <kbd className="px-2 py-1 text-xs rounded bg-gray-700/50 text-gray-300">⌘K</kbd>
          </div>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-6">
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className={`p-2 ${darkMode ? 'text-amber-300 hover:text-amber-200' : 'text-purple-600 hover:text-purple-500'}`}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className={`p-2 ${darkMode ? 'text-gray-300 hover:text-gray-200' : 'text-gray-700 hover:text-gray-800'} ${loading ? 'cursor-wait' : 'cursor-pointer'}`}
        >
          <RefreshCw className={`h-6 w-6 ${loading ? 'animate-spin' : ''}`} />
        </button>

        {/* Notification Button */}
        <div className="relative">
          <button
            className="p-2 text-gray-800 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100"
            aria-label="Notifications"
          >
            <Bell className="h-6 w-6" />
          </button>
          <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
        </div>

        {/* Settings */}
        <button
          className="p-2 text-gray-800 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100"
          aria-label="Settings"
        >
          <Settings className="h-6 w-6" />
        </button>

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
            <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-scaleIn">
              <div className="flex flex-col items-center gap-2 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  {getInitials() || <User className="w-6 h-6" />}
                </div>
                {user?.name && (
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">
                    {user.name}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email ? (
  <p className="text-xs text-gray-500 dark:text-gray-400">
    {user.email}
  </p>
) : (
  <p className="text-xs text-gray-500 dark:text-gray-400">
    Loading...
  </p> )}   </p>           
              </div>

              <div className="py-1">
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Account</h3>
                </div>
                <Link 
                  to="/profile" 
                  className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <User className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                  My Profile
                </Link>
                <Link 
                  to="/settings" 
                  className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Settings className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                  Account Settings
                </Link>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="flex items-center px-4 py-3 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>
              <div className="px-4 py-2">
  {user?.email && (
    <p className="text-xs text-gray-500 dark:text-gray-400">
      {user.email}
    </p>
  )}
 {user?.role && (
        <p className="text-xs font-medium text-blue-500 dark:text-blue-400">
          Role: {user.role}
        </p>
      
  
  )}
</div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};