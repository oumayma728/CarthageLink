import { useEffect, useState } from "react";
import ThemeToggle from "../themeToggle.js";
import logo from "../../assets/carthageLinkLogo.png";

const PurchaseDevice = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-blue-100 dark:bg-gray-800/80 dark:border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-2">
              <div className="text-center p-8">
                <img
                  src={logo}
                  alt="Logo"
                  className="mx-auto mb-4 w-28 h-auto object-contain"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4 ml-auto">
              <a href="/login">
                <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
                  Login
                </button>
            </a>
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Purchase Device
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with Lab 619 to purchase your device and get full SDK access.
          </p>
        </div>

        {/* Contact + Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-600">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Lab 619 Contact</h2>
              <p className="text-gray-600 dark:text-gray-300">📍 Address: 123 Innovation Street, Tunis, Tunisia</p>
              <p className="text-gray-600 dark:text-gray-300">☎️ Phone: +216 12 345 678</p>
              <p className="text-gray-600 dark:text-gray-300">✉️ Email: contact@lab619.tn</p>
            </div>

            {/* SDK Info */}
            <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-2xl shadow-md border border-blue-100 dark:border-blue-600">
              <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">SDK Available</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Full access to the Software Development Kit (SDK) is provided with each device purchase to allow easy integration into your systems.
              </p>
            </div>

            {/* Cart Info */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-600">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Device Description</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Our electronic cart uses LoRa technology for long-range communication and provides real-time sensor data monitoring, even in remote areas.
              </p>
            </div>
          </div>

          {/* Google Map */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-600">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3122.7368581556505!2d10.16596231531693!3d36.80649537995421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13029bd75df7ee05%3A0xe68d34f55b1ef4b5!2sTunis!5e0!3m2!1sen!2stn!4v1714295780700!5m2!1sen!2stn"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lab 619 Location"
            ></iframe>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PurchaseDevice;
