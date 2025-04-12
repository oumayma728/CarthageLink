import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
//import jwtDecode from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData'));
  
    console.log("Loaded from localStorage:", { token, userData });
  
    if (token && userData) {
      setUser({
        ...userData,
        token,
      });
      console.log("User set in state:", { ...userData, token });
    }
  
    setLoading(false);
  }, []);
  

  const login = async ({ email, password, /*rememberMe*/ }) => {
    try {
      const response = await fetch("https://localhost:7086/api/User/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) throw new Error("Invalid credentials");
      //console.log("FULL API RESPONSE DATA:", data); // Add this line

      const data = await response.json();
      console.log("API Response:", data);
  
      // EXPLICITLY include role
      const userData = {
        name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      token: data.token,
      factoryId: data.factoryId}
  
      // Save to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData); // Update state
  
      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };
  const register = async (formData) => {
    try {
      const response = await fetch("https://localhost:7086/api/User/register-user", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",//specifies the type of data that you are sending
          "Accept": "application/json" //specifies the type of data that you are expecct to receive from the server
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        // Extract validation errors if they exist
        const errorDetails = data.errors 
          ? Object.entries(data.errors).map(([field, errors]) => 
              `${field}: ${errors.join(', ')}`
            ).join('\n')
          : data.message || 'Registration failed';
        
        throw new Error(errorDetails);
      }
  
      return { success: true, data };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message,
        status: error.response?.status 
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("rememberedEmail");
    navigate("/login");
  };

  // Add a function to check specific roles
  const hasRole = (requiredRole) => {
    if (!user) return false;
    return user.role === requiredRole;
  };
  const role = user?.role;

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
  isSuperAdmin: role === "SuperAdmin",
  isFactoryAdmin: role === "FactoryAdmin",
  isOperator: role === "Operator",
    hasRole,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}