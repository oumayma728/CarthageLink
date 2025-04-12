import PropTypes from 'prop-types';  
import { Link } from "react-router-dom";
import { Edit3, Trash2 } from "lucide-react";
import { useState, useEffect } from 'react';
import { DataFilter } from '../../ui/DataFilter';
import Pagination from '../../ui/Pagination';
export default function UsersTable({ users, isLoading, onDelete }) {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);

  const filterConfig = [
    {
      field: 'email',
      label: 'Email',
      type: 'text'
    },
    {
      field: 'licenseKey',
      label: 'License Key',
      type: 'text'
    },
    {
      field: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 0, label: 'Super Admin' },
        { value: 1, label: 'Factory Admin' },
        { value: 2, label: 'Operator' }
      ]
    }
  ];

  useEffect(() => {
    setFilteredUsers(users);
    setCurrentPage(1);
  }, [users]);

  const handleFilterChange = ({ searchTerm, filters }) => {
    const results = users.filter(user => {
      const matchesSearch = !searchTerm || 
        Object.values(user).some(
          val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesFilters = Object.entries(filters).every(([field, value]) => {
        if (!value || value === 'All' || value === '') return true;

        const fieldValue = user[field];

        if (field === 'email' || field === 'licenseKey') {
          return fieldValue && fieldValue.toString().toLowerCase().includes(value.toLowerCase());
        }

        if (field === 'role') {
          return roleMap[fieldValue] === value;
        }

        return fieldValue && fieldValue.toString().toLowerCase().includes(value.toLowerCase());
      });

      return matchesSearch && matchesFilters;
    });

    setFilteredUsers(results);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilteredUsers(users); 
    setCurrentPage(1);
  };

  const roleMap = {
    0: "Super Admin",
    1: "Factory Admin",
    2: "Operator"
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };
  useEffect(() => {
    const pages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
    setTotalPages(pages);

    // Clamp current page
    if (currentPage > pages) {
      setCurrentPage(1);
    }
  }, [filteredUsers]);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">No users found</p>
        <Link 
          to="/users/new" 
          className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded shadow-md hover:bg-primary-dark"
        >
          Add New User
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DataFilter 
        searchPlaceholder="Search users..."
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
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">License Key</th>
                <th className="px-4 py-3">Assigned Devices</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!users || users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No users match your filters
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{user.name}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.email || "-"}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.phone || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded font-medium ${
                        roleMap[user.role] === "Admin"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      }`}>
                        {roleMap[user.role] || user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {user.licenseKey || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {user.assignedDevices || 0} devices
                    </td>
                    <td className="px-4 py-3 text-right flex justify-end gap-3">
                      <Link
                        to={`/users/edit/${user.id}`}
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-400"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button
                        onClick={() => onDelete(user.id)}
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

UsersTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string,
      phone: PropTypes.string,
      role: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      licenseKey: PropTypes.string,
      assignedDevices: PropTypes.number
    })
  ),
  isLoading: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired
};

UsersTable.defaultProps = {
  users: []
};
