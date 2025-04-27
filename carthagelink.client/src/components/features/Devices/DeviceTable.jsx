import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Edit3, Trash2, Eye } from "lucide-react";
import DeviceStatusButton from './DeviceStatusButton.jsx';
import { useState,useEffect } from 'react';
import { DataFilter } from '../../ui/DataFilter'; // Import the reusable filter component
import Pagination from '../../ui/Pagination.jsx';

export default function DevicesTable({ devices, isLoading, onDelete, onStatusChange, updatingStatusId }) {
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [totalPages, setTotalPages] = useState(1);
  // Filter configuration for the DataFilter component
  const filterConfig = [
    {
      field: 'macAddress',
      label: 'MAC Address',
      type: 'text'
    },
    {
      field: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'All', label: 'All' },
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'Maintenance', label: 'Maintenance' }
      ]
    }
  ];
  useEffect(() => {
    setFilteredDevices(devices);
    setCurrentPage(1);

  }, [devices]);
  // Handle filter changes
  const handleFilterChange = ({ searchTerm, filters }) => {
    console.log("Filter triggered!", searchTerm, filters);
  
    const results = devices.filter(device => {
      const matchesSearch = !searchTerm || 
        Object.values(device).some(
          val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
  
      const matchesFilters = Object.entries(filters).every(([field, value]) => {
        if (!value || value === 'All') return true;
        const fieldValue = device[field];
        return fieldValue && fieldValue.toString().toLowerCase().includes(value.toLowerCase());
      });
  
      return matchesSearch && matchesFilters;
    });
  
    setFilteredDevices(results);
    setCurrentPage(1);

  };
  

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };
  useEffect(() => {
    const pages = Math.ceil(filteredDevices.length / itemsPerPage) || 1;
    setTotalPages(pages);

    // Clamp current page
    if (currentPage > pages) {
      setCurrentPage(1);
    }
  }, [filteredDevices]);
  // Reset all filters
  const handleResetFilters = () => {
    setFilteredDevices(devices);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!devices || devices.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No devices found</p>
        <Link to="/devices/new" className="mt-6 inline-block bg-primary text-white px-5 py-2.5 rounded-xl shadow hover:bg-primary-dark transition-all">
          ➕ Add New Device
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reusable Filter Component */}
      <DataFilter 
        searchPlaceholder="Search devices..."
        filterConfig={filterConfig}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 dark:text-gray-300 overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse table-auto">
          <thead className="bg-muted/70 text-gray-700 dark:text-white">
            <tr>
              <th className="px-6 py-4 border-b border-gray-200">Name</th>
              <th className="px-6 py-4 border-b border-gray-200">Mac Address</th>
              <th className="px-6 py-4 border-b border-gray-200">Status</th>
              <th className="px-6 py-4 border-b border-gray-200">Assigned Users</th>
              <th className="px-6 py-4 border-b border-gray-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No devices match your filters
                </td>
              </tr>
            ) : (
              filteredDevices.map((device) => (
                <tr
                  key={device.id}
                  className="border-b hover:bg-muted/50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{device.name}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{device.macAddress}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                    <DeviceStatusButton
                      deviceId={device.id}
                      status={device.status}
                      isUpdating={updatingStatusId === device.id}
                      onStatusChange={(newStatus) => onStatusChange(device.id, newStatus)}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                    {Array.isArray(device.assignedUsers)
                      ? device.assignedUsers.join(', ')
                      : device.assignedUsers || '-'}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 text-sm">
                    <div className="flex justify-end gap-2 dark:text-gray-300">
                      <Link
                        to={`/devices/view/${device.id}`}
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-400 transition"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        to={`/devices/edit/${device.id}`}
                        className="p-2 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-400 transition"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button
                        onClick={() => onDelete(device.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
    </div>
  );
}

DevicesTable.propTypes = {
  devices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      macAddress: PropTypes.string.isRequired,
      status: PropTypes.oneOf(["Active", "Inactive", "Maintenance"]).isRequired,
      assignedUsers: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  updatingStatusId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

DevicesTable.defaultProps = {
  updatingStatusId: null,
};