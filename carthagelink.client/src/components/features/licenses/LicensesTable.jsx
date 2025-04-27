import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Edit3, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { DataFilter } from '../../ui/DataFilter';
import { useState, useEffect } from 'react';
import Pagination from '../../ui/Pagination';

export default function LicensesTable({ licenses, isLoading, onDelete }) {
  const [filteredLicenses, setFilteredLicenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);

  const filterConfig = [
    {
      field: 'key',
      label: 'License Key',
      type: 'text'
    },
    {
      field: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'All', label: 'All' },
        { value: '0', label: 'Active' },
        { value: '1', label: 'Expired' },
        { value: '2', label: 'Suspended' },
        { value: '3', label: 'Pending' }
      ]
    }
  ];

  useEffect(() => {
    setFilteredLicenses(licenses);
    setCurrentPage(1); // Reset to page 1 whenever licenses change
  }, [licenses]);

  const handleFilterChange = ({ searchTerm, filters }) => {
    const results = licenses.filter((license) => {
      const matchesSearch = !searchTerm ||
        Object.values(license).some(
          val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesFilters = Object.entries(filters).every(([field, value]) => {
        if (!value || value === 'All') return true;
        const fieldValue = license[field];
        return fieldValue && fieldValue.toString().toLowerCase().includes(value.toLowerCase());
      });

      return matchesSearch && matchesFilters;
    });

    setFilteredLicenses(results);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilteredLicenses(licenses);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  useEffect(() => {
    const pages = Math.ceil(filteredLicenses.length / itemsPerPage) || 1;
    setTotalPages(pages);

    // Clamp current page
    if (currentPage > pages) {
      setCurrentPage(1);
    }
  }, [filteredLicenses]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!licenses || licenses.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">No licenses found</p>
        <Link
          to="/licenses/new"
          className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded shadow-md hover:bg-primary-dark"
        >
          Add New License
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DataFilter
        searchPlaceholder="Search licenses..."
        filterConfig={filterConfig}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />
      <div className="bg-card rounded-lg shadow-md p-6">
        <div className="overflow-x-auto" style={{ maxWidth: 'calc(100vw - 20rem)' }}>
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3">License Key</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Expires</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!licenses || licenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No licenses match your filters
                  </td>
                </tr>
              ) : (
                filteredLicenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((license) => (
                  <tr key={license.id} className="border-b hover:bg-muted/50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 font-mono text-gray-800 dark:text-gray-200">
                      <span className="font-mono text-gray-800 dark:text-gray-200 px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">
                        {license.key}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800 dark:text-gray-200">
                        {license.assignedToName || license.assignedTo || 'Unassigned'}
                      </div>
                      {license.assignedToEmail && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {license.assignedToEmail}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={license.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {formatDate(license.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {formatDate(license.expiresAt)}
                    </td>
                    <td className="px-4 py-3 text-right flex justify-end gap-3">
                      <Link
                        to={`/licenses/edit/${license.id}`}
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-400"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button
                        onClick={() => onDelete(license.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
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
    </div>
  );
}

LicensesTable.propTypes = {
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      assignedTo: PropTypes.string,
      assignedToName: PropTypes.string,
      assignedToEmail: PropTypes.string,
      status: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      createdAt: PropTypes.string,
      expiresAt: PropTypes.string,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
};