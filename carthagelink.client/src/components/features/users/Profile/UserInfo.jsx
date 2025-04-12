import Card from "../../../Layouts/User/Card.jsx";
import { useAuth } from "../../../../contexts/AuthContext.js";
import { useEffect } from "react";
import { FaFacebookF, FaXTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa6";

export default function UserInfo() {
  const { user } = useAuth();

  useEffect(() => {
    console.log("Current user in Navbar:", user);
  }, [user]);


  return (
    <div className="p-6">
      <Card title="">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left: Profile Info */}
          <div className="flex items-center gap-4">
            <img
              src="https://via.placeholder.com/80"
              alt="User Avatar"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user?.name }
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.role || "User Role"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {[FaFacebookF, FaXTwitter, FaLinkedinIn, FaInstagram].map((Icon, index) => (
              <button
                key={index}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
            
          </div>
        </div>
      </Card>
    </div>
  );
}
