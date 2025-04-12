import PropTypes from 'prop-types';

export default function ReusableCard({
  title,
  onEdit,
  children,
  headerActions,
  footer,
  className = '',
  titleClassName = '',
  bodyClassName = '',
  footerClassName = '',
  hoverEffect = false,
  border = false,
  shadow = 'md',
}) {
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-2xl 
        ${shadowClasses[shadow]} 
        ${border ? 'border border-gray-200 dark:border-gray-700' : ''}
        ${hoverEffect ? 'transition-transform hover:scale-[1.01]' : ''}
        ${className}
      `}
    >
      {(title || onEdit || headerActions) && (
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-100 dark:border-gray-700">
          {title && (
            <h3 className={`text-lg font-semibold text-gray-800 dark:text-white ${titleClassName}`}>
              {title}
            </h3>
          )}
          <div className="flex items-center space-x-4">
            {headerActions}
            {onEdit && (
              <button
                onClick={onEdit}
                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center text-sm"
                aria-label="Edit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h18"
                  />
                </svg>
                Edit
              </button>
            )}
          </div>
        </div>
      )}
      <div className={`p-4 md:p-6 ${bodyClassName}`}>{children}</div>
      {footer && (
        <div className={`p-4 md:p-6 border-t border-gray-100 dark:border-gray-700 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
}

ReusableCard.propTypes = {
  title: PropTypes.string,
  onEdit: PropTypes.func,
  children: PropTypes.node.isRequired,
  headerActions: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string,
  titleClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  footerClassName: PropTypes.string,
  hoverEffect: PropTypes.bool,
  border: PropTypes.bool,
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
};

ReusableCard.defaultProps = {
  title: null,
  onEdit: null,
  headerActions: null,
  footer: null,
  className: '',
  titleClassName: '',
  bodyClassName: '',
  footerClassName: '',
  hoverEffect: false,
  border: false,
  shadow: 'md',
};