// import React, { useState } from "react";
// import { User, Phone, Mail, Lock } from "lucide-react";
// import axios from "axios";


// const API_BASE = "http://localhost:5000"; 

// const ProfileSettings = ({ profile, setProfile }) => {
//   const [activeTab, setActiveTab] = useState("profile");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });
  
//   // Profile form
//   const [profileForm, setProfileForm] = useState({
//     name: profile?.name || "",
//     phone: profile?.phone || ""
//   });

//   // Password form
//   const [passwordForm, setPasswordForm] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: ""
//   });

//   const handleProfileChange = (e) => {
//     const { name, value } = e.target;
//     setProfileForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       const res = await axios.put(`${API_BASE}/api/users/profile`, profileForm, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//       });

//       if (res.data.success) {
//         setProfile(res.data.user);
//         setMessage({ type: "success", text: "Profile updated successfully!" });
//       }
//     } catch (err) {
//       setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();
    
//     if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//       setMessage({ type: "error", text: "New passwords do not match" });
//       return;
//     }

//     if (passwordForm.newPassword.length < 6) {
//       setMessage({ type: "error", text: "Password must be at least 6 characters long" });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       const res = await axios.put("/api/users/change-password", passwordForm, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//       });

//       if (res.data.success) {
//         setMessage({ type: "success", text: "Password changed successfully!" });
//         setPasswordForm({
//           currentPassword: "",
//           newPassword: "",
//           confirmPassword: ""
//         });
//       }
//     } catch (err) {
//       setMessage({ type: "error", text: err.response?.data?.message || "Failed to change password" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//       {/* Tabs */}
//       <div className="flex border-b border-gray-100">
//         <button
//           onClick={() => setActiveTab("profile")}
//           className={`flex-1 py-4 px-6 text-sm font-medium ${
//             activeTab === "profile"
//               ? "text-pink-600 border-b-2 border-pink-600"
//               : "text-gray-500 hover:text-gray-700"
//           }`}
//         >
//           Profile Information
//         </button>
//         <button
//           onClick={() => setActiveTab("password")}
//           className={`flex-1 py-4 px-6 text-sm font-medium ${
//             activeTab === "password"
//               ? "text-pink-600 border-b-2 border-pink-600"
//               : "text-gray-500 hover:text-gray-700"
//           }`}
//         >
//           Change Password
//         </button>
//       </div>

//       {/* Message Alert */}
//       {message.text && (
//         <div className={`p-4 ${
//           message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
//         }`}>
//           {message.text}
//         </div>
//       )}

//       <div className="p-6">
//         {activeTab === "profile" ? (
//           <form onSubmit={handleProfileSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email (cannot be changed)
//               </label>
//               <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-gray-600">
//                 <Mail size={18} />
//                 <span>{profile?.email}</span>
//               </div>
//             </div>

//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                 Full Name
//               </label>
//               <div className="flex items-center gap-2">
//                 <User size={18} className="text-gray-400" />
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={profileForm.name}
//                   onChange={handleProfileChange}
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
//                 Phone Number
//               </label>
//               <div className="flex items-center gap-2">
//                 <Phone size={18} className="text-gray-400" />
//                 <input
//                   type="tel"
//                   id="phone"
//                   name="phone"
//                   value={profileForm.phone}
//                   onChange={handleProfileChange}
//                   maxLength="10"
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors disabled:bg-pink-300"
//             >
//               {loading ? "Updating..." : "Update Profile"}
//             </button>
//           </form>
//         ) : (
//           <form onSubmit={handlePasswordSubmit} className="space-y-4">
//             <div>
//               <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                 Current Password
//               </label>
//               <div className="flex items-center gap-2">
//                 <Lock size={18} className="text-gray-400" />
//                 <input
//                   type="password"
//                   id="currentPassword"
//                   name="currentPassword"
//                   value={passwordForm.currentPassword}
//                   onChange={handlePasswordChange}
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                 New Password
//               </label>
//               <div className="flex items-center gap-2">
//                 <Lock size={18} className="text-gray-400" />
//                 <input
//                   type="password"
//                   id="newPassword"
//                   name="newPassword"
//                   value={passwordForm.newPassword}
//                   onChange={handlePasswordChange}
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
//                   required
//                   minLength="6"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                 Confirm New Password
//               </label>
//               <div className="flex items-center gap-2">
//                 <Lock size={18} className="text-gray-400" />
//                 <input
//                   type="password"
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   value={passwordForm.confirmPassword}
//                   onChange={handlePasswordChange}
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
//                   required
//                   minLength="6"
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors disabled:bg-pink-300"
//             >
//               {loading ? "Changing Password..." : "Change Password"}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProfileSettings;




 
// ProfileSettings.jsx - Fixed version
import React, { useState } from "react";
import { User, Phone, Mail, Lock } from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:5000"; 

const ProfileSettings = ({ profile, setProfile }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [profileForm, setProfileForm] = useState({
    name: profile?.name || "",
    phone: profile?.phone || ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await axios.put(`${API_BASE}/api/users/profile`, profileForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setProfile(res.data.user);
        setMessage({ type: "success", text: "Profile updated successfully!" });
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || err.message || "Failed to update profile" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters long" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // FIXED: Added API_BASE to the URL
      const res = await axios.put(`${API_BASE}/api/users/change-password`, passwordForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || err.message || "Failed to change password" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 py-4 px-6 text-sm font-medium ${
            activeTab === "profile"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Profile Information
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`flex-1 py-4 px-6 text-sm font-medium ${
            activeTab === "password"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Change Password
        </button>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`p-4 ${
          message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      <div className="p-6">
        {activeTab === "profile" ? (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (cannot be changed)
              </label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-gray-600">
                <Mail size={18} />
                <span>{profile?.email}</span>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="flex items-center gap-2">
                <User size={18} className="text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  maxLength="10"
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors disabled:bg-pink-300"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-gray-400" />
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-gray-400" />
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                  minLength="6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-gray-400" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                  minLength="6"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors disabled:bg-pink-300"
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;