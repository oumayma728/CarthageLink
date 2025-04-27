import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { DataFilter } from '../../ui/DataFilter';
import { Edit3, Trash2} from "lucide-react";
import Pagination from '../../ui/Pagination.jsx';
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.js"; 
export default function FactoryUsersTable({ factoryId }) {
  const [factoryUsers, setFactoryUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [totalPages, setTotalPages] = useState(1);
  const { register } = useAuth(); // use your existing register method
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" , role:"operator"});
  
  const filterConfig = [
    {
      field: 'email',
      label: 'Email',
      type: 'text'
    }
  ];

  // Fetch factory users
  useEffect(() => {
    const fetchFactoryUsers = async () => {
      if (!factoryId) return;

      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://localhost:7086/api/Factory/${factoryId}/Users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        setFactoryUsers(data);
        setFilteredUsers(data); // Initialize filter
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFactoryUsers();
  }, [factoryId]);

  // Pagination
  useEffect(() => {
    const pages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
    setTotalPages(pages);
    if (currentPage > pages) {
      setCurrentPage(1);
    }
  }, [filteredUsers]);

  // Filtering
  const handleFilterChange = ({ searchTerm, filters }) => {
    const results = factoryUsers.filter(user => {
      const matchesSearch = !searchTerm || 
        Object.values(user).some(val => 
          val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesFilters = Object.entries(filters).every(([field, value]) => {
        if (!value || value === 'All') return true;
        const fieldValue = user[field];
        return fieldValue && fieldValue.toString().toLowerCase().includes(value.toLowerCase());
      });

      return matchesSearch && matchesFilters;
    });

    setFilteredUsers(results);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilteredUsers(factoryUsers);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
  <h2 className="text-lg font-semibold dark:text-white">Factory Users</h2>
  <button
    onClick={() => setShowModal(true)}
    className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow"
  >
    + Add User
  </button>
</div>

      <DataFilter 
        searchPlaceholder="Search users..."
        filterConfig={filterConfig}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {filteredUsers.length === 0 ? (
        <p>No users found for this factory.</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 dark:text-gray-300 overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse table-auto">
            <thead className="bg-muted/70 text-gray-700 dark:text-white">
              <tr>
                <th className="px-6 py-4 border-b border-gray-200">Name</th>
                <th className="px-6 py-4 border-b border-gray-200">Email</th>
                <th className="px-6 py-4 border-b border-gray-200">Phone</th>
                <th className="px-6 py-4 border-b border-gray-200">Role</th>
                <th className="px-6 py-4 border-b border-gray-200">Created At</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.phone}</td>
                  <td className="py-2 px-4 border-b">{user.role}</td>
                  <td className="py-2 px-4 border-b">{new Date(user.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 text-sm">
                                      <div className="flex justify-end gap-2 dark:text-gray-300">
                                        <Link
                                          to={`/devices/edit/${user.id}`}
                                          className="p-2 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-400 transition"
                                        >
                                          <Edit3 size={16} />
                                        </Link>
                                        <button
                                          onClick={() => onDelete(user.id)}
                                          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400 transition"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Register New Operator</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await register({
              ...newUser,
              role: "operator",
              factoryId
            });
            setShowModal(false);
            setNewUser({ name: "", email: "", password: "" });
            // Refresh list
            const updatedUsers = await fetch(`https://localhost:7086/api/Factory/${factoryId}/Users`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            });
            const data = await updatedUsers.json();
            setFactoryUsers(data);
            setFilteredUsers(data);
          } catch (err) {
            console.error("Failed to register:", err);
          }
        }}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          required
          className="w-full px-4 py-2 rounded border dark:border-gray-700 dark:bg-gray-700"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
          className="w-full px-4 py-2 rounded border dark:border-gray-700 dark:bg-gray-700"
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
          className="w-full px-4 py-2 rounded border dark:border-gray-700 dark:bg-gray-700"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
}

FactoryUsersTable.propTypes = {
  factoryId: PropTypes.string.isRequired,
};
