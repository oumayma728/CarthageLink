import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/themeToggle.js";
import { useAuth } from"../contexts/AuthContext.js";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    licenseKey: "",
    role: "FactoryAdmin"
  });
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
  
    setIsLoading(true);
    setError("");
    
    try {
      const result = await register(formData);
      console.log('Sending registration data:', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        licenseKey: formData.licenseKey
      });
      if (result.success) {
        navigate("/login", { state: { registrationSuccess: true } });
      } else {
        // More detailed error message
        setError(result.error || "Registration failed. Please check your details and try again.");
        console.log('Registration failed details:', result);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Card Container */}
      <div className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl overflow-hidden border border-white/20 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80">
        {/* Header Section */}
        <div className="text-center p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg mb-4 transform hover:rotate-6 transition duration-500 dark:from-blue-700 dark:to-indigo-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1 dark:text-white">CarthageLink</h1>
          <p className="text-gray-600 dark:text-white">Create your account</p>
        </div>

        {/* Form Section */}
        <div className="px-8 pb-8 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/5 rounded-full"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-500/5 rounded-full"></div>
          
          <div className="relative">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6 dark:text-white">
              Get Started
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 mx-auto mt-2 rounded-full dark:from-blue-500 dark:to-indigo-500"></div>
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="relative dark:text-white">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="peer block w-full px-4 py-3 border-0 border-b-2 border-gray-300 bg-transparent focus:border-blue-500 focus:outline-none focus:ring-0 transition duration-200"
                  placeholder=" "
                />
                <label 
                  htmlFor="name" 
                  className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-blue-600 peer-focus:text-sm dark:text-gray-300"
                >
                  Full Name
                </label>
                <div className="absolute right-0 bottom-3 text-gray-400 dark:text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Email Field */}
              <div className="relative dark:text-white">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="peer block w-full px-4 py-3 border-0 border-b-2 border-gray-300 bg-transparent focus:border-blue-500 focus:outline-none focus:ring-0 transition duration-200"
                  placeholder=" "
                />
                <label 
                  htmlFor="email" 
                  className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-blue-600 peer-focus:text-sm dark:text-gray-300"
                >
                  Email Address
                </label>
                <div className="absolute right-0 bottom-3 text-gray-400 dark:text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>

              {/* Phone Field */}
              <div className="relative dark:text-white">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="peer block w-full px-4 py-3 border-0 border-b-2 border-gray-300 bg-transparent focus:border-blue-500 focus:outline-none focus:ring-0 transition duration-200"
                  placeholder=" "
                />
                <label 
                  htmlFor="phone" 
                  className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-blue-600 peer-focus:text-sm dark:text-gray-300"
                >
                  Phone Number
                </label>
                <div className="absolute right-0 bottom-3 text-gray-400 dark:text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
              </div>

              {/* Role Field - Updated to match your enum */}
              <div className="relative dark:text-white">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="peer block w-full px-4 py-3 border-0 border-b-2 border-gray-300 bg-transparent focus:border-blue-500 focus:outline-none focus:ring-0 transition duration-200 appearance-none"
                  required
                >
                  <option value="FactoryAdmin">Factory Admin</option>
                  <option value="SuperAdmin">Super Admin</option>
                </select>
                <label 
                  htmlFor="role" 
                  className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-blue-600 peer-focus:text-sm dark:text-gray-300"
                >
                  Role
                </label>
                <div className="absolute right-0 bottom-3 text-gray-400 dark:text-gray-500 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Password Field */}
              <div className="relative dark:text-white">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="peer block w-full px-4 py-3 border-0 border-b-2 border-gray-300 bg-transparent focus:border-blue-500 focus:outline-none focus:ring-0 transition duration-200"
                  placeholder=" "
                />
                <label 
                  htmlFor="password" 
                  className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-blue-600 peer-focus:text-sm dark:text-gray-300"
                >
                  Password
                </label>
                <div className="absolute right-0 bottom-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none dark:text-gray-500 dark:hover:text-gray-400"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="relative dark:text-white">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="peer block w-full px-4 py-3 border-0 border-b-2 border-gray-300 bg-transparent focus:border-blue-500 focus:outline-none focus:ring-0 transition duration-200"
                  placeholder=" "
                />
                <label 
                  htmlFor="confirmPassword" 
                  className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-blue-600 peer-focus:text-sm dark:text-gray-300"
                >
                  Confirm Password
                </label>
                <div className="absolute right-0 bottom-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none dark:text-gray-500 dark:hover:text-gray-400"
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* License Key Field */}
              <div className="relative dark:text-white">
                <input
                  type="text"
                  id="licenseKey"
                  name="licenseKey"
                  value={formData.licenseKey}
                  onChange={handleChange}
                  className="peer block w-full px-4 py-3 border-0 border-b-2 border-gray-300 bg-transparent focus:border-blue-500 focus:outline-none focus:ring-0 transition duration-200"
                  placeholder=" "
                />
                <label 
                  htmlFor="licenseKey" 
                  className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-blue-600 peer-focus:text-sm dark:text-gray-300"
                >
                  License Key
                </label>
                <div className="absolute right-0 bottom-3 text-gray-400 dark:text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50/80 backdrop-blur-sm p-4 border border-red-100 dark:bg-red-900/30 dark:border-red-800">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400 dark:text-red-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full mt-8 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isLoading ? 'opacity-80 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                    Register Now
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/90 dark:bg-gray-800/90 px-8 py-4 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 inline-flex items-center dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign In
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;