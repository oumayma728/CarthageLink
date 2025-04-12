import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Edit3, Trash2 } from "lucide-react";
import { DataFilter } from '../../ui/DataFilter';
import { useState, useEffect } from 'react';
import AddFactory from '../../Factory/AddFactory';
import Pagination from '../../ui/Pagination';  // Import the Pagination component

export default function FactoriesTable({ factories, isLoading, onDelete }) {
  const [filteredFactories, setFilteredFactories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [totalPages, setTotalPages] = useState(1);

  const filterConfig = [
    { field: 'name', label: 'Name', type: 'text' },
    { field: 'licenseKey', label: 'License Key', type: 'text' },
    { field: 'taxNumber', label: 'Tax Number', type: 'text' }
  ];

  useEffect(() => {
    setFilteredFactories(factories);
    setCurrentPage(1);
  }, [factories]);

  useEffect(() => {
    const pages = Math.ceil(filteredFactories.length / itemsPerPage) || 1;
    setTotalPages(pages);

    // Clamp current page
    if (currentPage > pages) {
      setCurrentPage(1);
    }
  }, [filteredFactories]);

  const handleFilterChange = ({ searchTerm, filters }) => {
    const results = factories.filter((factory) => {
      const matchesSearch = !searchTerm ||
        Object.values(factory).some(
          val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesFilters = Object.entries(filters).every(([field, value]) => {
        const fieldValue = factory[field];
        return fieldValue && fieldValue.toString().toLowerCase().includes(value.toLowerCase());
      });

      return matchesSearch && matchesFilters;
    });

    setFilteredFactories(results);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilteredFactories(factories);
    setCurrentPage(1);
  };

  const currentItems = filteredFactories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!factories || factories.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No factories found</p>
      </div>
    );
  }

  return (
    <>
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
            <AddFactory closeModal={() => setShowAddModal(false)} />
          </div>
        </div>
      )}

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
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Tax Number</th>
                  <th className="px-4 py-3">License</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No licenses match your filters
                    </td>
                  </tr>
                ) : (
                  currentItems.map((factory) => (
                    <tr key={factory.id} className="border-b hover:bg-muted/50 dark:hover:bg-gray-800">
                      <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{factory.name}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{factory.factoryEmail || "-"}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{factory.location || "-"}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{factory.taxNumber || "-"}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700">
                          {factory.licenseKey}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right flex justify-end gap-3">
                        <Link
                          to={`/factories/edit/${factory.id}`}
                          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-400"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <button
                          onClick={() => onDelete(factory.id)}
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

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}

FactoriesTable.propTypes = {
  factories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      factoryEmail: PropTypes.string,
      location: PropTypes.string,
      taxNumber: PropTypes.string,
      licenseKey: PropTypes.string
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired
};
