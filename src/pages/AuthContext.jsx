 
// import React, { createContext, useState, useContext, useEffect } from 'react';

// const AuthContext = createContext();

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [admin, setAdmin] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Load user from localStorage on app start
//     const userData = localStorage.getItem('user');
//     const adminData = localStorage.getItem('admin');
    
//     if (userData) {
//       try {
//         setUser(JSON.parse(userData));
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//         localStorage.removeItem('user');
//         localStorage.removeItem('token');
//       }
//     }
    
//     if (adminData) {
//       try {
//         setAdmin(JSON.parse(adminData));
//       } catch (error) {
//         console.error('Error parsing admin data:', error);
//         localStorage.removeItem('admin');
//         localStorage.removeItem('adminToken');
//         localStorage.removeItem('adminRole');
//       }
//     }
//     setLoading(false);
//   }, []);

//   const login = (userData, token) => {
//     localStorage.setItem('user', JSON.stringify(userData));
//     localStorage.setItem('token', token);
//     setUser(userData);
//   };

//   const adminLogin = (adminData, token) => {
//     localStorage.setItem('adminToken', token);
//     localStorage.setItem('admin', JSON.stringify(adminData));
//     localStorage.setItem('adminRole', adminData.role);
//     setAdmin(adminData);
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   const adminLogout = () => {
//     localStorage.removeItem('adminToken');
//     localStorage.removeItem('admin');
//     localStorage.removeItem('adminRole');
//     localStorage.removeItem('permissions');
//     setAdmin(null);
//   };

//   const value = {
//     // User auth
//     user,
//     login,
//     logout,
//     isAuthenticated: !!user,
    
//     // Admin auth
//     admin,
//     adminLogin,
//     adminLogout,
//     isAdminAuthenticated: !!admin,
//     adminRole: admin?.role,
    
//     loading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [adminToken, setAdminToken] = useState(null);

  useEffect(() => {
    // Load user from localStorage on app start
    const userData = localStorage.getItem('user');
    const userToken = localStorage.getItem('token');
    const adminData = localStorage.getItem('admin');
    const adminTokenData = localStorage.getItem('adminToken');
    
    if (userData && userToken) {
      try {
        setUser(JSON.parse(userData));
        setToken(userToken);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    if (adminData && adminTokenData) {
      try {
        setAdmin(JSON.parse(adminData));
        setAdminToken(adminTokenData);
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('admin');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRole');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    setUser(userData);
    setToken(authToken);
  };

  const adminLogin = (adminData, authToken) => {
    localStorage.setItem('adminToken', authToken);
    localStorage.setItem('admin', JSON.stringify(adminData));
    localStorage.setItem('adminRole', adminData.role);
    setAdmin(adminData);
    setAdminToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('permissions');
    setAdmin(null);
    setAdminToken(null);
  };

  const getAuthHeader = () => {
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };

  const getAdminAuthHeader = () => {
    if (adminToken) {
      return { Authorization: `Bearer ${adminToken}` };
    }
    return {};
  };

  const value = {
    // User auth
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    getAuthHeader,
    
    // Admin auth
    admin,
    adminToken,
    adminLogin,
    adminLogout,
    isAdminAuthenticated: !!admin && !!adminToken,
    adminRole: admin?.role,
    getAdminAuthHeader,
    
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};