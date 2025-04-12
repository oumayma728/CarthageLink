import PropTypes from 'prop-types';
import { ChevronRight } from 'lucide-react';

export default function NavItem({ item, isActive, variant = 'primary' }) {
  return (
    <li>
      <a
        href={item.path}
        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
          isActive 
            ? variant === 'primary' 
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50 shadow-sm' 
              : 'bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-gray-200 border border-gray-200 dark:border-gray-600/50'
            : variant === 'primary'
              ? 'hover:bg-gray-100 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700/20 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={`p-2 rounded-lg ${
            isActive 
              ? variant === 'primary' 
                ? 'bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-300' 
                : 'bg-gray-200 dark:bg-gray-600/50 text-gray-700 dark:text-gray-300'
              : variant === 'primary'
                ? 'bg-gray-200/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 group-hover:bg-blue-100/50 dark:group-hover:bg-blue-800/20 group-hover:text-blue-600 dark:group-hover:text-blue-300'
                : 'bg-gray-200/30 dark:bg-gray-700/30 text-gray-500 dark:text-gray-500 group-hover:bg-gray-200/50 dark:group-hover:bg-gray-600/30 group-hover:text-gray-700 dark:group-hover:text-gray-300'
          }`}>
            {item.icon}
          </span>
          <span>{item.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {item.count && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              isActive 
                ? variant === 'primary' 
                  ? 'bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-300' 
                  : 'bg-gray-200 dark:bg-gray-600/50 text-gray-700 dark:text-gray-300'
                : variant === 'primary'
                  ? 'bg-gray-200/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 group-hover:bg-blue-100/50 dark:group-hover:bg-blue-800/20 group-hover:text-blue-600 dark:group-hover:text-blue-300'
                  : 'bg-gray-200/30 dark:bg-gray-700/30 text-gray-500 dark:text-gray-500 group-hover:bg-gray-200/50 dark:group-hover:bg-gray-600/30 group-hover:text-gray-700 dark:group-hover:text-gray-300'
            }`}>
              {item.count}
            </span>
          )}
          <ChevronRight 
            size={16} 
            className={`transition-transform duration-300 ${
              isActive ? 'text-blue-500 dark:text-blue-400 rotate-90' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'
            }`} 
          />
        </div>
      </a>
    </li>
  );
}

NavItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    path: PropTypes.string.isRequired,
    count: PropTypes.number
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary'])
};