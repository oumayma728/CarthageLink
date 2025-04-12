import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../Layouts/Navbar.jsx';
import PersoInfoCard from './PersoInfoCard.jsx';
import UserInfo from './UserInfo.jsx';
import Card from "../../../Layouts/User/Card.jsx";
import { Pencil, ArrowLeft } from 'lucide-react';
import Modal from '../../../ui/Modal.jsx';
import Form from '../../../ui/Form.jsx';

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [openModal, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  const profileFields = [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'text' },
    { name: 'bio', label: 'Bio', type: 'textarea' }
  ];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // ✅ Only one correct openModal function
  const openModalHandler = () => {
    setIsModalOpen(true);
    setEditMode(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setError('');
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://localhost:7086/api/User', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      const userData = {
        ...user,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        bio: updatedUser.bio
      };

      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      setEditMode(false);
      setIsModalOpen(false);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='dark:bg-gray-900 min-h-screen bg-gray-50'>
      <Navbar
        darkMode={darkMode}
        onToggleTheme={toggleDarkMode}
        onRefresh={() => {}}
        loading={false}
      />

      <div className='container mx-auto px-4 py-8'>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className='max-w-3xl mx-auto'>
          <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-6 p-6 pb-0">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Profile Information</h2>
              <button
                onClick={openModalHandler}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            </div>

            <Modal isOpen={openModal} onClose={closeModal}>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Edit Profile</h3>
              <Form
                fields={profileFields}
                values={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                buttonText={loading ? "Saving..." : "Save Changes"}
              />
            </Modal>

            <div className="space-y-6 p-6">
              <UserInfo formData={formData} handleChange={handleChange} editMode={editMode} />
              <PersoInfoCard formData={formData} handleChange={handleChange} editMode={editMode} />
            </div>
          </Card>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 p-4 bg-red-100 text-red-700 rounded-lg shadow-lg transition-opacity duration-200 dark:bg-red-900/90 dark:text-red-100 border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}
    </div>
  );
}
