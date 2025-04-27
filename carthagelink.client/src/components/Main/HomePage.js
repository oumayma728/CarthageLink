import { useEffect, useState } from "react";
import ThemeToggle from "../themeToggle.js"; // Import the ThemeToggle component
import logo from "../../assets/carthageLinkLogo.png"
const Home = () => {
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
      {/* Modern IoT Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-blue-100 dark:bg-gray-800/80 dark:border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center"> {/* justify-between to align items to left and right */}
            <div className="flex items-center space-x-2">
              <div className="text-center p-8">
          {/* Logo without circular container */}
          <img
            src={logo}
            alt="Logo"
            className="mx-auto mb-4 w-28 h-auto object-contain"
          />
        </div>
            </div>

            {/* Right-aligned Buttons */}
            <div className="flex items-center space-x-4 ml-auto"> {/* ml-auto to push items to the right */}
              <a href="/login">
                <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
                  Login
                </button>
              </a>
              <a href="/NotFoundPage">
                <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Purchase Device
                </button>
              </a>
              
              {/* Theme Toggle Button */}
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </div>
          </div>
        </div>
      </nav>

      {/* IoT Hero Section */}
      <main className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 z-10">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                <span className="text-blue-600">Smart Connectivity</span> for the IoT Era
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg">
                Carthage Link provides seamless device integration, real-time monitoring.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="/login">
                  <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium shadow-md">
                    Monitor Your Devices
                  </button>
                </a>
              </div>
            </div>

            {/* Right Content - IoT Visualization */}
            <div className="relative h-80 lg:h-96">
              <div className="absolute inset-0 bg-blue-100 dark:bg-blue-800 rounded-2xl"></div>
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="relative w-full h-full">
                  {/* Network nodes */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
                    </svg>
                  </div>

                  {[30, 90, 150, 210, 270, 330].map((angle, i) => (
                    <div key={i}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translate(120px) rotate(-${angle}deg)`,
                      }}>
                      <div className={`w-12 h-12 rounded-full ${i % 2 === 0 ? 'bg-yellow-400' : 'bg-blue-400'} flex items-center justify-center shadow-md`}>
                        {i % 2 === 0 ? (
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>



          </div>
        </div>
      </main>
       {/* IoT Features Section */}
       <section className="py-20 bg-white dark:bg-gray-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">IoT Platform Features</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Powerful tools to connect, monitor, and manage your devices
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          icon: (
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          ),
          title: 'Device Integration',
          description: 'Connect any IoT device with our universal protocols'
        },
        {
          icon: (
            <svg className="w-8 h-8 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          ),
          title: 'Real-Time Analytics',
          description: 'Process and visualize data streams instantly'
        },
        {
          icon: (
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          ),
          title: 'Enterprise Security',
          description: 'End-to-end encryption and access controls'
        }
      ].map((item, index) => (
        <div 
          key={index} 
          className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-600"
        >
          <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900 flex items-center justify-center mb-4">
            {item.icon}
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{item.title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>


    
    </div>
  );
};

export default Home;
