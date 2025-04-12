import { LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LogoutLink() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Link
      to="#logout" // or use onClick with preventDefault
      onClick={(e) => {
        e.preventDefault();
        handleLogout();
      }}
      className="flex items-center gap-2 px-3 py-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
    >
      <LogOut className="w-5 h-5" />
      <span>Logout</span>
    </Link>
  );
}