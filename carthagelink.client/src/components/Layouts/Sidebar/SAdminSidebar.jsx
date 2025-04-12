import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Cpu, Key, Users, Factory, ChevronDown, LogOut } from "lucide-react";
import ProfileDropdown from '../ProfileDropdown';
import PropTypes from 'prop-types';
//import { useAuth } from "../../../contexts/AuthContext";
const navItems = [
  { 
    name: "Home", 
    icon: <Home size={18} />, 
    path: "/main" 
  },
  { 
    name: "Devices", 
    icon: <Cpu size={18} />, 
    path: "/device" 
  },
  { 
    name: "Factories", 
    icon: <Factory size={18} />, 
    path: "/factory" 
  },
  { 
    name: "Licenses", 
    icon: <Key size={18} />, 
    path: "/license" 
  },
  { 
    name: "Users", 
    icon: <Users size={18} />, 
    path: "/user" 
  },
];

export default function SAdminSidebar({ isOpen, onClose, isCollapsed}) {
  const location = useLocation();

  const sidebarRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback(
    (path) => location.pathname.includes(path),
    [location.pathname]
  );

  // Close sidebar when clicking outside (mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close sidebar when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Set initial open submenu based on current route
  useEffect(() => {
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu(index);
          }
        });
      }
    });
  }, [location, isActive]);

  // Calculate submenu height when opened
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index) => {
    setOpenSubmenu((prevOpenSubmenu) => 
      prevOpenSubmenu === index ? null : index
    );
  };

  const renderMenuItems = () => (
    <ul className="flex flex-col gap-1">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.path ? (
            <Link
              to={nav.path}
              className={`
                flex items-center px-4 py-3 rounded-lg transition-all duration-300 group
                ${!isCollapsed && !isHovered ? "justify-center" : "justify-start"}
                ${
                  isActive(nav.path)
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-medium border-l-4 border-blue-500"
                    : "text-gray-600 dark:text-gray-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-300"
                }
              `}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onClose();
                }
              }}
            >
              <span
                className={`
                  flex items-center justify-center w-6 h-6
                  ${
                    isActive(nav.path)
                      ? "text-blue-600 dark:text-blue-300"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-300"
                  }
                `}
              >
                {nav.icon}
              </span>
              {(isCollapsed || isHovered || isOpen) && (
                <span className="ml-3 text-sm">{nav.name}</span>
              )}
              {nav.subItems && (isCollapsed || isHovered || isOpen) && (
                <ChevronDown
                  className={`
                    ml-auto w-5 h-5 transition-transform duration-200
                    ${
                      openSubmenu === index
                        ? "rotate-180 text-blue-500 dark:text-blue-400"
                        : "text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400"
                    }
                  `}
                />
              )}
            </Link>
          ) : (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`
                flex items-center w-full px-4 py-3 rounded-lg transition-all duration-300 group
                ${!isCollapsed && !isHovered ? "justify-center" : "justify-start"}
                ${
                  openSubmenu === index
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-medium border-l-4 border-blue-500"
                    : "text-gray-600 dark:text-gray-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-300"
                }
              `}
            >
              <span
                className={`
                  flex items-center justify-center w-6 h-6
                  ${
                    openSubmenu === index
                      ? "text-blue-600 dark:text-blue-300"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-300"
                  }
                `}
              >
                {nav.icon}
              </span>
              {(isCollapsed || isHovered || isOpen) && (
                <span className="ml-3 text-sm">{nav.name}</span>
              )}
              {(isCollapsed || isHovered || isOpen) && (
                <ChevronDown
                  className={`
                    ml-auto w-5 h-5 transition-transform duration-200
                    ${
                      openSubmenu === index
                        ? "rotate-180 text-blue-500 dark:text-blue-400"
                        : "text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400"
                    }
                  `}
                />
              )}
            </button>
          )}
          
          {nav.subItems && (isCollapsed || isHovered || isOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu === index
                    ? `${subMenuHeight[`${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-1 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`
                        flex items-center px-3 py-2 text-sm rounded transition-all duration-300
                        ${
                          isActive(subItem.path)
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-medium"
                            : "text-gray-600 dark:text-gray-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-300"
                        }
                      `}
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          onClose();
                        }
                      }}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside
  ref={sidebarRef}
  className={`
    fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 
    ${isOpen ? "bg-white/80 dark:bg-gray-900/70 backdrop-blur-md" : "bg-white dark:bg-gray-900"}
    border-r border-gray-200 dark:border-gray-800 
    h-screen transition-all duration-300 ease-in-out z-40
    ${isCollapsed || isOpen ? "w-72 px-5" : isHovered ? "w-72 px-5" : "w-20 px-3"}
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
    shadow-lg
  `}
  onMouseEnter={() => !isCollapsed && setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>

        <div className="flex-1 overflow-y-auto py-8">
          <nav className="mb-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2
                  className={`
                    mb-4 text-xs uppercase leading-5 
                    text-gray-500 dark:text-gray-400 flex
                    ${!isCollapsed && !isHovered ? "justify-center" : "justify-start"}
                  `}
                >
                  {(isCollapsed || isHovered || isOpen) ? "Menu" : "•••"}
                </h2>
                {renderMenuItems()}
              </div>
            </div>
          </nav>
        </div>

        {/* Profile/Logout */}
        <div className={`
          p-4 border-t border-gray-200 dark:border-gray-700 
          ${!isCollapsed && !isHovered ? 'flex justify-center' : ''}
          bg-gray-50 dark:bg-gray-800/50
        `}>
          {isCollapsed || isHovered || isOpen ? (
            <ProfileDropdown user={{}} />
          ) : (
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              <LogOut size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
SAdminSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  onToggleSidebar: PropTypes.func.isRequired,
};