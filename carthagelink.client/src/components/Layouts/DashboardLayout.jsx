import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  FaHome, 
  FaChevronRight,
  FaChartLine,
  FaUserCog,
  FaWarehouse,
  // Add more icons as needed
} from 'react-icons/fa';
import Navbar from './Navbar';
import { useAuth } from '../../contexts/AuthContext';
import SidebarSuperAdmin from '../Layouts/Sidebar/SAdminSidebar';
import SidebarFactoryAdmin from '../Layouts/Sidebar/FAdminSidebar';
//import VisualAlert from '../../components/Layouts/Dashboard/Alerts/VisualAlert';

export default function DashboardLayout({ children, activePage }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const { user } = useAuth();
  const location = useLocation();

  // Set dark mode class on HTML element
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const forceCloseSidebar = () => setIsSidebarOpen(false);

  // Get icon for each breadcrumb segment
  const getBreadcrumbIcon = (path) => {
    switch(path.toLowerCase()) {
      case 'dashboard': return <FaChartLine className="mr-2" />;
      case 'admin': return <FaUserCog className="mr-2" />;
      case 'factory': return <FaWarehouse className="mr-2" />;
      default: return null;
    }
  };

  // Generate breadcrumbs based on current route
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(path => path !== '');
    
    // Don't show breadcrumbs on home page
    if (paths.length === 0) return null;

    return (
      <nav className={`flex items-center text-sm mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <Link 
          to="/main" 
          className={`flex items-center ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
        >
          <FaHome className="mr-2" />
          <span>Home</span>
        </Link>
        
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;
          const routeTo = `/${paths.slice(0, index + 1).join('/')}`;
          const displayName = path.replace(/-/g, ' ');

          return (
            <div key={index} className="flex items-center">
              <FaChevronRight className="mx-3 text-xs opacity-50" />
              {isLast ? (
                <span className="flex items-center font-medium capitalize">
                  {getBreadcrumbIcon(path)}
                  {displayName}
                </span>
              ) : (
                <Link 
                  to={routeTo} 
                  className={`flex items-center capitalize ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
                >
                  {getBreadcrumbIcon(path)}
                  {displayName}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    );
  };

  // Render appropriate sidebar based on user role
  const renderSidebar = () => {
    const normalizedRole = user?.role?.toLowerCase().trim() || "";

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
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
        {/* Sidebar - Perfectly sized */}
        <div
          className={`h-full transition-all duration-300 ease-in-out z-10 flex-shrink-0
            ${isCollapsed ? 'w-[50px]' : 'w-[130px]'}`}
        >
          {renderSidebar()}
        </div>
    
        {/* Main Content - Responsive to sidebar state */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar darkMode={darkMode} onToggleTheme={toggleDarkMode} />
          
          <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out
            ${isCollapsed ? 'ml-[70px]' : 'ml-[10px]'}`}
          >
            <div className="p-6 md:p-8">
              {generateBreadcrumbs()}
              <div className="min-h-full">
                {children}
              </div>
            </div>
          </main>
            </div>
      </div>
    );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  activePage: PropTypes.string.isRequired,
};