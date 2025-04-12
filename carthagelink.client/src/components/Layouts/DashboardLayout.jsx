import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useAuth } from '../../contexts/AuthContext';
import SidebarSuperAdmin from '../Layouts/Sidebar/SAdminSidebar';
import SidebarFactoryAdmin from '../Layouts/Sidebar/FAdminSidebar';

export default function DashboardLayout({ children, activePage }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const { user } = useAuth();
  console.log('User role:', user?.role); // Log role for debugging

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const forceCloseSidebar = () => setIsSidebarOpen(false);

  const renderSidebar = () => {
    const normalizedRole = user?.role ? user?.role.toLowerCase().trim() : "";  // Normalize role

    switch (normalizedRole) {
      case 'superadmin':
        return (
          <SidebarSuperAdmin
            isOpen={isSidebarOpen}
            onClose={forceCloseSidebar}
            isCollapsed={isCollapsed}
            onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
            activePage={activePage}
            darkMode={darkMode}
          />
        );
      case 'factoryadmin':
        return (
          <SidebarFactoryAdmin
            isOpen={isSidebarOpen}
            onClose={forceCloseSidebar}
            isCollapsed={isCollapsed}
            onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
            activePage={activePage}
            darkMode={darkMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div
        className={`transition-all duration-300 ease-in-out h-full ${isCollapsed ? 'w-10' : 'w-10'} lg:w-10`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        {renderSidebar()}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <Navbar
          darkMode={darkMode}
          onToggleTheme={toggleDarkMode}
          onRefresh={() => {}}
          loading={false}
        />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="min-h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}



DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  activePage: PropTypes.string.isRequired,
};
