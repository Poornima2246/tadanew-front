// import React, { useState } from "react";
// import axios from "axios";

// const SellerLogin = ({ onLogin, onNavigateToRegister }) => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showSetPassword, setShowSetPassword] = useState(false);
//   const [activationToken, setActivationToken] = useState("");

//   const apiUrl =   "http://localhost:5000";

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (showSetPassword) {
//       await handleSetPassword();
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const response = await axios.post(
//         `${apiUrl}/api/sellers/login`,
//         formData,
//         { headers: { "Content-Type": "application/json" } }
//       );

//       // if (response.data.token) {
//       //   localStorage.setItem("sellerToken", response.data.token);
//       //   localStorage.setItem("sellerData", JSON.stringify(response.data.seller));

//       //   // Safe function call with fallback
//       //   if (typeof onLogin === 'function') {
//       //     onLogin(response.data.seller);
//       //   } else {
//       //     console.warn('onLogin is not a function. Login successful, but no callback executed.');
//       //     // Default redirect fallback
//       //     window.location.href = '/seller-dashboard';
//       //   }
//       // }
//       if (response.data.token) {
//         localStorage.setItem("sellerToken", response.data.token);
//         localStorage.setItem(
//           "sellerData",
//           JSON.stringify(response.data.seller)
//         );

//         if (typeof onLogin === "function") {
//           onLogin(response.data.seller);
//         } else {
//           // Fallback redirect
//           window.location.href = "/seller/dashboard";
//         }
//       }
//     } catch (err) {
//       console.error("Login error:", err);

//       if (err.response) {
//         setError(err.response.data.message || "Invalid credentials");
//       } else if (err.request) {
//         setError("No response from server. Check API URL or CORS settings.");
//       } else {
//         setError("Request error: " + err.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSetPassword = async () => {
//     if (!activationToken) {
//       setError("Please enter your activation token from email");
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError("Password must be at least 6 characters long");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const response = await axios.post(`${apiUrl}/api/sellers/activate`, {
//         token: activationToken,
//         password: formData.password
//       });

//       if (response.data.success) {
//         setError("Password set successfully! You can now login.");
//         setShowSetPassword(false);
//         setActivationToken("");
//         setFormData({ email: "", password: "" });
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to set password. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNavigateToRegister = () => {
//     if (typeof onNavigateToRegister === "function") {
//       onNavigateToRegister();
//     } else {
//       console.warn("onNavigateToRegister is not a function");
//       window.location.href = "/seller/register";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4 sm:p-6 lg:p-8">
//       <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md border border-gray-200">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
//             Jaggery Shop
//           </h1>
//           <p className="text-gray-600 text-base sm:text-lg">
//             {showSetPassword ? "Set Your Password" : "Seller Login"}
//           </p>
//         </div>

//         {/* Error/Success Message */}
//         {error && (
//           <div
//             className={`p-3 rounded-lg mb-6 flex items-start space-x-2 ${
//               error.includes("successfully")
//                 ? "bg-green-50 text-green-800 border border-green-200"
//                 : "bg-red-50 text-red-800 border border-red-200"
//             }`}
//           >
//             <span className="text-lg flex-shrink-0">
//               {error.includes("successfully") ? "✅" : "⚠️"}
//             </span>
//             <span className="text-sm">{error}</span>
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {showSetPassword ? (
//             <>
//               {/* Activation Token Input */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Activation Token *
//                 </label>
//                 <input
//                   type="text"
//                   value={activationToken}
//                   onChange={(e) => setActivationToken(e.target.value)}
//                   required
//                   className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
//                   placeholder="Enter token from your email"
//                 />
//                 <small className="text-gray-500 text-xs block mt-1">
//                   Check your email for the activation token sent after approval
//                 </small>
//               </div>

//               {/* New Password Input */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   New Password *
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                     minLength="6"
//                     className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
//                     placeholder="Enter your new password (min. 6 characters)"
//                   />
//                   <button
//                     type="button"
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 text-lg"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? "🙈" : "👁️"}
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <>
//               {/* Email Input */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Email Address *
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
//                   placeholder="Enter your email"
//                 />
//               </div>

//               {/* Password Input */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Password *
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
//                     placeholder="Enter your password"
//                   />
//                   <button
//                     type="button"
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 text-lg"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? "🙈" : "👁️"}
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-4 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-3 ${
//               loading
//                 ? "bg-gray-400 cursor-not-allowed opacity-70"
//                 : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//             }`}
//           >
//             {loading ? (
//               <>
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 <span>
//                   {showSetPassword ? "Setting Password..." : "Logging in..."}
//                 </span>
//               </>
//             ) : showSetPassword ? (
//               "Set Password"
//             ) : (
//               "Login to Dashboard"
//             )}
//           </button>
//         </form>

//         {/* Footer Links */}
//         <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-4">
//           {!showSetPassword ? (
//             <>
//               <p className="text-gray-600 text-sm">
//                 Don't have an account?{" "}
//                 <button
//                   type="button"
//                   onClick={handleNavigateToRegister}
//                   className="text-green-600 hover:text-green-700 font-semibold underline bg-transparent border-none cursor-pointer transition-colors duration-200"
//                 >
//                   Register as Seller
//                 </button>
//               </p>
//               <p className="text-gray-600 text-sm">
//                 Approved but no password?{" "}
//                 <button
//                   type="button"
//                   onClick={() => setShowSetPassword(true)}
//                   className="text-green-600 hover:text-green-700 font-semibold underline bg-transparent border-none cursor-pointer transition-colors duration-200"
//                 >
//                   Set Password Here
//                 </button>
//               </p>
//             </>
//           ) : (
//             <p className="text-gray-600 text-sm">
//               Remember your password?{" "}
//               <button
//                 type="button"
//                 onClick={() => setShowSetPassword(false)}
//                 className="text-green-600 hover:text-green-700 font-semibold underline bg-transparent border-none cursor-pointer transition-colors duration-200"
//               >
//                 Back to Login
//               </button>
//             </p>
//           )}

//           <p className="text-gray-500 text-xs mt-4">
//             Forgot password? Contact admin support at support@jaggeryshop.com
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Default props to prevent runtime errors
// SellerLogin.defaultProps = {
//   onLogin: () => {
//     console.warn(
//       "onLogin function not provided - redirecting to default dashboard"
//     );
//     window.location.href = "/seller-dashboard";
//   },
//   onNavigateToRegister: () => {
//     console.warn(
//       "onNavigateToRegister function not provided - redirecting to registration"
//     );
//     window.location.href = "/seller-register";
//   }
// };

// export default SellerLogin;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SellerLogin = ({ onLogin, onNavigateToRegister }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [activationToken, setActivationToken] = useState("");

  const navigate = useNavigate();
  const apiUrl = "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (showSetPassword) {
      await handleSetPassword();
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", formData);
      const response = await axios.post(
        `${apiUrl}/api/sellers/login`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login response:", response.data);

      if (response.data.token && response.data.seller) {
        const { token, seller } = response.data;

        // Store token, role, and status in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", "seller");
        localStorage.setItem("sellerStatus", seller.isApproved ? "approved" : "pending");
        localStorage.setItem("sellerData", JSON.stringify(seller));

        // Set default authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Verify localStorage values
        console.log("localStorage after login:", {
          token: localStorage.getItem("token"),
          role: localStorage.getItem("role"),
          sellerStatus: localStorage.getItem("sellerStatus"),
          sellerData: localStorage.getItem("sellerData"),
        });

        // Call onLogin if provided
        if (typeof onLogin === "function") {
          console.log("Calling onLogin with seller:", seller);
          onLogin(seller);
        } else {
          console.warn("onLogin function not provided, proceeding with navigation");
        }

        // Navigate directly to dashboard without additional API calls
        console.log("Navigating to /seller/dashboard");
        navigate("/seller/dashboard", { replace: true });

      } else {
        setError("Invalid response from server: Missing token or seller data");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        setError(err.response.data.message || "Invalid credentials");
      } else if (err.request) {
        setError("No response from server. Check API URL or CORS settings.");
      } else {
        setError("Request error: " + err.message);
      }
      
      // Clear any partial authentication data on error
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("sellerStatus");
      localStorage.removeItem("sellerData");
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async () => {
    if (!activationToken) {
      setError("Please enter your activation token from email");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Fixed the double slash in URL
      const response = await axios.post(`${apiUrl}/api/sellers/set-password`, {
        token: activationToken,
        password: formData.password,
      });

      console.log("Set password response:", response.data);

      if (response.data.success) {
        setError("Password set successfully! You can now login.");
        setShowSetPassword(false);
        setActivationToken("");
        setFormData({ email: "", password: "" });
      } else {
        setError("Failed to set password: Invalid response from server");
      }
    } catch (err) {
      console.error("Set password error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to set password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToRegister = () => {
    if (typeof onNavigateToRegister === "function") {
      console.log("Calling onNavigateToRegister");
      onNavigateToRegister();
    } else {
      console.warn("onNavigateToRegister is not a function, using navigate");
      navigate("/seller/register", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
            Jaggery Shop
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            {showSetPassword ? "Set Your Password" : "Seller Login"}
          </p>
        </div>
        {error && (
          <div
            className={`p-3 rounded-lg mb-6 flex items-start space-x-2 ${
              error.includes("successfully")
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <span className="text-lg flex-shrink-0">
              {error.includes("successfully") ? "✅" : "⚠️"}
            </span>
            <span className="text-sm">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {showSetPassword ? (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Activation Token *
                </label>
                <input
                  type="text"
                  value={activationToken}
                  onChange={(e) => setActivationToken(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  placeholder="Enter token from your email"
                />
                <small className="text-gray-500 text-xs block mt-1">
                  Check your email for the activation token sent after approval
                </small>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    placeholder="Enter your new password (min. 6 characters)"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 text-lg"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 text-lg"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            </>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-3 ${
              loading
                ? "bg-gray-400 cursor-not-allowed opacity-70"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>
                  {showSetPassword ? "Setting Password..." : "Logging in..."}
                </span>
              </>
            ) : showSetPassword ? (
              "Set Password"
            ) : (
              "Login to Dashboard"
            )}
          </button>
        </form>
        <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-4">
          {!showSetPassword ? (
            <>
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={handleNavigateToRegister}
                  className="text-green-600 hover:text-green-700 font-semibold underline bg-transparent border-none cursor-pointer transition-colors duration-200"
                >
                  Register as Seller
                </button>
              </p>
              <p className="text-gray-600 text-sm">
                Approved but no password?{" "}
                <button
                  type="button"
                  onClick={() => setShowSetPassword(true)}
                  className="text-green-600 hover:text-green-700 font-semibold underline bg-transparent border-none cursor-pointer transition-colors duration-200"
                >
                  Set Password Here
                </button>
              </p>
            </>
          ) : (
            <p className="text-gray-600 text-sm">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => setShowSetPassword(false)}
                className="text-green-600 hover:text-green-700 font-semibold underline bg-transparent border-none cursor-pointer transition-colors duration-200"
              >
                Back to Login
              </button>
            </p>
          )}
          <p className="text-gray-500 text-xs mt-4">
            Forgot password? Contact admin support at support@jaggeryshop.com
          </p>
        </div>
      </div>
    </div>
  );
};

SellerLogin.defaultProps = {
  onLogin: () => {
    console.warn("onLogin function not provided, relying on navigate");
  },
  onNavigateToRegister: () => {
    console.warn("onNavigateToRegister function not provided, relying on navigate");
  },
};

export default SellerLogin;