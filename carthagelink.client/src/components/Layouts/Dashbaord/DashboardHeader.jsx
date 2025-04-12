// components/DashboardHeader.jsx
import PropTypes from 'prop-types';
import { useAuth } from "../../../contexts/AuthContext"; // Import your auth context
import { useEffect, useState } from 'react';
export default function DashboardHeader({ title, darkMode }) {
    
  const { user} = useAuth(); // Get user and logout from auth context
  const[User,setUser]=useState([""])
  useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUser(storedUser);
      }
    }, []);
    
  return (
    <header className={`bg-white dark:bg-gray-800 shadow-sm z-10   dark:text-white transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
      <div className="flex items-center justify-between p-5  dark:text-white">
        <h1 className="text-2xl font-bold dark:text-white">
          {title}
        </h1>
        {user?.role && (
    <p className="text-xs text-gray-500 dark:text-gray-400">
      Welcome {user.role}
    </p>
        )}
      </div>
    </header>
  );
}

DashboardHeader.propTypes = {
  title: PropTypes.string.isRequired,
  darkMode: PropTypes.bool

};