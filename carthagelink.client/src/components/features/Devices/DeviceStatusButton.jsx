import { Wrench, Loader2, Check } from "lucide-react";
import PropTypes from 'prop-types';
import { useState } from 'react';

// Define status mappings
/*const statusMappings = {
  0: "Active",
  1: "Inactive",
  2: "Maintenance"
};
*/
const statusOrder = [0, 1, 2]; // Now using numeric values

const statusStyles = {
  0: { // Active
    bg: "bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/40",
    text: "text-green-700 dark:text-green-400",
    icon: null,
    pulse: "hover:shadow-green-200/50 dark:hover:shadow-green-900/30",
    label: "Active"
  },
  1: { // Inactive
    bg: "bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40",
    text: "text-red-700 dark:text-red-400",
    icon: null,
    pulse: "hover:shadow-red-200/50 dark:hover:shadow-red-900/30",
    label: "Inactive"
  },
  2: { // Maintenance
    bg: "bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/40",
    text: "text-yellow-700 dark:text-yellow-400",
    icon: <Wrench className="w-4 h-4 mr-1.5" />,
    pulse: "hover:shadow-yellow-200/50 dark:hover:shadow-yellow-900/30",
    label: "Maintenance"
  }
};

// Default style for unknown statuses
const defaultStyle = {
  bg: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-900/20 dark:hover:bg-gray-900/40",
  text: "text-gray-700 dark:text-gray-400",
  icon: null,
  pulse: "hover:shadow-gray-200/50 dark:hover:shadow-gray-900/30",
  label: "Unknown"
};

export default function DeviceStatusButton({ deviceId, status, onStatusChange }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Safely get the style for the current status
  const getCurrentStyle = () => {
    if (status === undefined || status === null || !statusStyles[status]) {
      console.warn(`Invalid status provided: ${status}. Using default style.`);
      return defaultStyle;
    }
    return statusStyles[status];
  };

  const currentStyle = getCurrentStyle();

  const handleClick = async () => {
    if (isUpdating) return;

    // Determine next status
    const currentIndex = statusOrder.indexOf(status);
    const newStatus = currentIndex >= 0 
      ? statusOrder[(currentIndex + 1) % statusOrder.length]
      : 0; // Fallback to Active (0) if status not found

    setIsUpdating(true);
    setIsAnimating(true);

    try {
      // Call the status change handler with the new status
      onStatusChange(newStatus);
      
      const response = await fetch(`https://localhost:7086/api/Device/${deviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsAnimating(false);
      }, 1000);
    } catch (error) {
      console.error('Error updating status:', error);
      // Revert the status change in UI if API call fails
      onStatusChange(status);
      setIsAnimating(false);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isUpdating}
      className={`relative px-4 py-1.5 rounded-lg flex items-center justify-center 
        transition-all duration-300 min-w-[100px] overflow-hidden
        ${currentStyle.bg} ${currentStyle.text} ${currentStyle.pulse}
        ${isUpdating ? "cursor-wait" : "cursor-pointer"}
        ${isAnimating ? "transform scale-[0.98]" : ""}`}
      aria-label={`Change device status from ${currentStyle.label}`}
    >
      {showSuccess && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/30 dark:bg-black/30 backdrop-blur-[1px]">
          <Check className="w-5 h-5 text-green-600 dark:text-green-400 animate-pop-in" />
        </div>
      )}

      <div className={`flex items-center transition-opacity duration-200 
        ${showSuccess ? "opacity-0" : "opacity-100"}`}>
        {isUpdating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {currentStyle.icon}
            <span className="font-medium transition-all duration-200">
              {currentStyle.label}
            </span>
          </>
        )}
      </div>

      {!isUpdating && !showSuccess && (
        <span className="absolute inset-0 scale-0 rounded-full bg-current opacity-20 
          transition-transform duration-500 group-hover:scale-125" />
      )}
    </button>
  );
}

DeviceStatusButton.propTypes = {
  deviceId: PropTypes.string.isRequired,
  status: PropTypes.number, // Changed to number to match API
  onStatusChange: PropTypes.func.isRequired
};

DeviceStatusButton.defaultProps = {
  status: 0 // Default to Active
};