import { useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout.jsx";
import FactoriesTable from "../../components/features/factories/FactoriesTable.jsx";
import DeleteModal from "../../components/ui/DeleteModal.jsx";
import useFactories from "../../hooks/useFactories.js";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function FactoryPage() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFactoryId, setSelectedFactoryId] = useState(null);
  
  const { 
    factories, 
    isLoading, 
    error, 
    deleteFactory, 
    fetchFactories 
  } = useFactories();

  const handleDelete = async () => {
    try {
      await deleteFactory(selectedFactoryId);
      setIsDeleteModalOpen(false);
      fetchFactories(); // Refresh the list after deletion
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedFactoryId(id);
    setIsDeleteModalOpen(true);
  };

  return (
    <DashboardLayout activePage="/Factory">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold mb-2 sm:mb-0 dark:text-white">Factories</h1>
          <Link 
            to="/factories/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
          >
            <Plus size={16} />
            Add Factory
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
            Error: {error}
          </div>
        )}

        <FactoriesTable 
          factories={factories}
          isLoading={isLoading}
          onDelete={openDeleteModal}
        />
      </div>

      <DeleteModal 
        isOpen={isDeleteModalOpen}
        title="Delete Factory"
        message="Are you sure you want to delete this factory? This action cannot be undone."
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}