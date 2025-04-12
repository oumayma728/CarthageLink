import PropTypes from 'prop-types';

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-lg transform transition-all duration-300 scale-100 hover:scale-105">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to delete this item? This action is irreversible.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-200 ease-in-out"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 ease-in-out"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Prop type validation
DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};
