import PropTypes from 'prop-types';
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect, useState } from 'react';

export default function DashboardHeader() {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState({ role: '' });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')) || user;
    if (storedUser) {
      setCurrentUser({
        role: storedUser.role || ''
      });
    }
  }, [user]);

  return (
    <header className={`sticky top-0 bg-gray-100 dark:bg-gray-900 shadow-sm z-5 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200`}>
      <div className="flex items-center justify-center p-4"> {/* Centered container */}
        {currentUser.role && (
          <div className="flex items-center">
            <p className="text-lg font-medium text-gray-800 dark:text-gray-300">
              Welcome, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentUser.role}</span>
            </p>
          </div>
        )}
      </div>
    </header>
  );
}

DashboardHeader.propTypes = {
  darkMode: PropTypes.bool
};