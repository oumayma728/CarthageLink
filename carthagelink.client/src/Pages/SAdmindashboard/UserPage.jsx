import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/Layouts/DashboardLayout.jsx";
import UsersTable from "../../components/features/users/UsersTable.jsx";
import DeleteModal from "../../components/ui/DeleteModal.jsx";
import useUsers from "../../hooks/useUsers.js";

export default function UserPage() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  const { 
    users, 
    isLoading, 
    error, 
    deleteUser
    // Removed fetchUsers since it's handled internally by the hook
  } = useUsers();

  const handleDelete = async () => {
    try {
      const success = await deleteUser(selectedUserId);
      if (success) {
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedUserId(id);
    setIsDeleteModalOpen(true);
  };

  return (
    <DashboardLayout activePage="/User">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-xl font-bold mb-2 sm:mb-0 dark:text-white">Users</h1>
          <Link 
            to="/add-user"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Add User
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
            Error: {error}
          </div>
        )}

        <UsersTable 
          users={users}
          isLoading={isLoading}
          onDelete={openDeleteModal}
        />
      </div>
      
      <DeleteModal 
        isOpen={isDeleteModalOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}