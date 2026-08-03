 



// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate
// } from "react-router-dom";
// import { useEffect } from "react";
// import { AuthProvider } from "./pages/AuthContext";
// import { CartProvider, useCart } from "./context/CartContext";
// import { Toaster } from "react-hot-toast";
// import { GoogleOAuthProvider } from '@react-oauth/google';


// // Main Components
// import Navbar from "./component/Navbar";
// import Home from "./component/Homeall";
// import Productmain from "./component/Productmain";
// import Cart from "./component/CartPage";
// import ProductDetails from "./pages/ProductDetails";
// import MiniCart from './component/MiniCart';

// // User Pages
// import LoginPage from "./pages/UserLogin";
// import RegisterPage from "./pages/UserRegister";
// import VerifyEmailPage from "./pages/VerifyEmail";
// import UserProfile from "./component/Dashboard";
// import Order from "./pages/MyOrders";
// import Wishlist from "./pages/Mywishlist";
// import Reviews from "./pages/Myreviews";
// import Addresses from "./pages/MyAddress";

// // Seller Pages
// import SellerLogin from "./pages/SellerLogin";
// import SellerRegister from "./pages/SellerRegister";
// import SellerDashboard from "./pages/SellerDashboard";
// import SellerSetPassword from "./pages/SellerSetPassword";

// // Admin Pages
// import AdminLogin from "./pages/AdminLogin";
// import AdminDashboard from "./pages/AdminDashboard";
// import SuperAdminDashboard from "./pages/SuperAdminDashboard";

// // -------------------------
// // Route Protection
// // -------------------------

// const UserRoute = ({ children }) => {
//   const user = JSON.parse(localStorage.getItem("user") || "null");
//   const token = localStorage.getItem("token");

//   if (!token || !user) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// const SellerRoute = ({ children }) => {
//   const token =
//     localStorage.getItem("sellerToken") || localStorage.getItem("token");

//   const role =
//     localStorage.getItem("sellerRole") || localStorage.getItem("role");

//   const status = localStorage.getItem("sellerStatus");

//   if (!token || role !== "seller") {
//     return <Navigate to="/seller/login" replace />;
//   }

//   if (status !== "approved") {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center">
//           <p className="text-xl font-semibold text-gray-700 mb-4">
//             Your seller account is{" "}
//             <span className="text-orange-500 capitalize">{status}</span>
//           </p>
//           <p className="text-gray-600">
//             Please wait for admin approval to access the dashboard.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return children;
// };

// const AdminRoute = ({ children }) => {
//   const token = localStorage.getItem("adminToken");
//   const role = localStorage.getItem("adminRole");

//   if (!token) {
//     return <Navigate to="/admin/login" replace />;
//   }

//   if (role !== "admin" && role !== "super_admin") {
//     return <Navigate to="/admin/login" replace />;
//   }

//   return children;
// };

// const SuperAdminRoute = ({ children }) => {
//   const token = localStorage.getItem("adminToken");
//   const role = localStorage.getItem("adminRole");

//   if (!token || role !== "super_admin") {
//     return <Navigate to="/admin/login" replace />;
//   }

//   return children;
// };

// // -------------------------
// // Admin Redirect
// // -------------------------

// const AdminRedirect = () => {
//   const role = localStorage.getItem("adminRole");

//   useEffect(() => {}, []);

//   if (role === "super_admin") {
//     return <Navigate to="/super-admin/dashboard" replace />;
//   }

//   return <Navigate to="/admin/dashboard" replace />;
// };

// // -------------------------
// // Main App Content Component (has access to CartContext)
// // -------------------------

// const AppContent = () => {
//   const { isMiniCartOpen, closeMiniCart } = useCart();

//   const handleLogin = (seller) => {
//     console.log("Seller logged in:", seller);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("sellerToken");
//     localStorage.removeItem("sellerRole");
//     localStorage.removeItem("sellerStatus");
//     localStorage.removeItem("sellerData");
//   };

//   const handleAdminLogout = () => {
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("adminRole");
//     localStorage.removeItem("admin");
//     localStorage.removeItem("permissions");
//   };

//   return (
//     <>
//       <Navbar />

//       <Toaster
//         position="top-center"
//         reverseOrder={false}
//         toastOptions={{
//           duration: 3000,
//           style: {
//             background: "#363636",
//             color: "#fff"
//           },
//           success: {
//             iconTheme: {
//               primary: "#10b981",
//               secondary: "#fff"
//             }
//           },
//           error: {
//             duration: 4000,
//             iconTheme: {
//               primary: "#ef4444",
//               secondary: "#fff"
//             }
//           }
//         }}
//       />

//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/shop" element={<Productmain />} />
//         <Route path="/product/:id" element={<ProductDetails />} />
//         <Route path="/cart" element={<Cart />} />

//         {/* User Auth */}
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/verify-email" element={<VerifyEmailPage />} />

//         {/* Protected User Routes */}
//         <Route
//           path="/user"
//           element={
//             <UserRoute>
//               <UserProfile />
//             </UserRoute>
//           }
//         />

//         <Route
//           path="/orders"
//           element={
//             <UserRoute>
//               <Order />
//             </UserRoute>
//           }
//         />

//         <Route
//           path="/wishlist"
//           element={
//             <UserRoute>
//               <Wishlist />
//             </UserRoute>
//           }
//         />

//         <Route
//           path="/reviews"
//           element={
//             <UserRoute>
//               <Reviews />
//             </UserRoute>
//           }
//         />

//         <Route
//           path="/addresses"
//           element={
//             <UserRoute>
//               <Addresses />
//             </UserRoute>
//           }
//         />

//         {/* Seller Routes */}
//         <Route
//           path="/seller/login"
//           element={<SellerLogin onLogin={handleLogin} />}
//         />

//         <Route path="/seller/register" element={<SellerRegister />} />

//         <Route path="/seller/set-password" element={<SellerSetPassword />} />

//         <Route
//           path="/seller/dashboard"
//           element={
//             <SellerRoute>
//               <SellerDashboard onLogout={handleLogout} />
//             </SellerRoute>
//           }
//         />

//         {/* Admin Routes */}
//         <Route path="/admin/login" element={<AdminLogin />} />
//         <Route path="/admin" element={<AdminRedirect />} />

//         <Route
//           path="/admin/dashboard"
//           element={
//             <AdminRoute>
//               <AdminDashboard onLogout={handleAdminLogout} />
//             </AdminRoute>
//           }
//         />

//         <Route
//           path="/super-admin/dashboard"
//           element={
//             <SuperAdminRoute>
//               <SuperAdminDashboard onLogout={handleAdminLogout} />
//             </SuperAdminRoute>
//           }
//         />

//         {/* Catch All */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>

//       {/* Global Mini Cart Sidebar */}
//       <MiniCart 
//         isOpen={isMiniCartOpen} 
//         onClose={closeMiniCart} 
//       />
//     </>
//   );
// };

// // -------------------------
// // Main App
// // -------------------------

// function App() {
//   return (
//     <AuthProvider>
//       <CartProvider>
//         <Router>
//           <AppContent />
//         </Router>
//       </CartProvider>
//     </AuthProvider>
//   );
// }

// export default App;




import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./pages/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from '@react-oauth/google';

// Main Components
import Navbar from "./component/Navbar";
import Home from "./component/Homeall";
import Productmain from "./component/Productmain";
import Cart from "./component/CartPage";
import ProductDetails from "./pages/ProductDetails";
import MiniCart from './component/MiniCart';

// User Pages
import LoginPage from "./pages/UserLogin";
import RegisterPage from "./pages/UserRegister";
import VerifyEmailPage from "./pages/VerifyEmail";
import UserProfile from "./component/Dashboard";
import Order from "./pages/MyOrders";
import Wishlist from "./pages/Mywishlist";
import Reviews from "./pages/Myreviews";
import Addresses from "./pages/MyAddress";

// Seller Pages
import SellerLogin from "./pages/SellerLogin";
import SellerRegister from "./pages/SellerRegister";
import SellerDashboard from "./pages/SellerDashboard";
import SellerSetPassword from "./pages/SellerSetPassword";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";

// -------------------------
// Route Protection (unchanged)
// -------------------------

const UserRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const SellerRoute = ({ children }) => {
  const token = localStorage.getItem("sellerToken") || localStorage.getItem("token");
  const role = localStorage.getItem("sellerRole") || localStorage.getItem("role");
  const status = localStorage.getItem("sellerStatus");

  if (!token || role !== "seller") {
    return <Navigate to="/seller/login" replace />;
  }

  if (status !== "approved") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700 mb-4">
            Your seller account is{" "}
            <span className="text-orange-500 capitalize">{status}</span>
          </p>
          <p className="text-gray-600">
            Please wait for admin approval to access the dashboard.
          </p>
        </div>
      </div>
    );
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  const role = localStorage.getItem("adminRole");

  if (!token) return <Navigate to="/admin/login" replace />;
  if (role !== "admin" && role !== "super_admin") {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

const SuperAdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  const role = localStorage.getItem("adminRole");

  if (!token || role !== "super_admin") {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

const AdminRedirect = () => {
  const role = localStorage.getItem("adminRole");
  if (role === "super_admin") {
    return <Navigate to="/super-admin/dashboard" replace />;
  }
  return <Navigate to="/admin/dashboard" replace />;
};

// -------------------------
// Main App Content
// -------------------------

const AppContent = () => {
  const { isMiniCartOpen, closeMiniCart } = useCart();

  const handleLogin = (seller) => {
    console.log("Seller logged in:", seller);
  };

  const handleLogout = () => {
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerRole");
    localStorage.removeItem("sellerStatus");
    localStorage.removeItem("sellerData");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("admin");
    localStorage.removeItem("permissions");
  };

  return (
    <>
      <Navbar />

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: { background: "#363636", color: "#fff" },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error: { duration: 4000, iconTheme: { primary: "#ef4444", secondary: "#fff" } }
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Productmain />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />

        {/* User Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected User Routes */}
        <Route path="/user" element={<UserRoute><UserProfile /></UserRoute>} />
        <Route path="/orders" element={<UserRoute><Order /></UserRoute>} />
        <Route path="/wishlist" element={<UserRoute><Wishlist /></UserRoute>} />
        <Route path="/reviews" element={<UserRoute><Reviews /></UserRoute>} />
        <Route path="/addresses" element={<UserRoute><Addresses /></UserRoute>} />

        {/* Seller Routes */}
        <Route path="/seller/login" element={<SellerLogin onLogin={handleLogin} />} />
        <Route path="/seller/register" element={<SellerRegister />} />
        <Route path="/seller/set-password" element={<SellerSetPassword />} />
        <Route path="/seller/dashboard" element={<SellerRoute><SellerDashboard onLogout={handleLogout} /></SellerRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRedirect />} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard onLogout={handleAdminLogout} /></AdminRoute>} />
        <Route path="/super-admin/dashboard" element={<SuperAdminRoute><SuperAdminDashboard onLogout={handleAdminLogout} /></SuperAdminRoute>} />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <MiniCart isOpen={isMiniCartOpen} onClose={closeMiniCart} />
    </>
  );
};

// -------------------------
// Main App (with Google OAuth)
// -------------------------

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 
                        process.env.REACT_APP_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    console.warn("⚠️ Google Client ID is missing. Google Login will not work.");
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;