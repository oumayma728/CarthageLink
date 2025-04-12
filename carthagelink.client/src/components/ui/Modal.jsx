// components/Modal.jsx
import PropTypes from 'prop-types';

export default function Modal({ children, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-xl mx-4 md:mx-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white text-xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
