import PropTypes from 'prop-types';  // Import PropTypes for validation

export function Input({ placeholder, className, ...props }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`w-full px-4 py-2 rounded-lg border ${className}`}
      {...props}
    />
  );
}

// PropTypes validation
Input.propTypes = {
  placeholder: PropTypes.string,  // Validate that placeholder is a string
  className: PropTypes.string,    // Validate that className is a string
};

export default Input;
