 
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";

// export default function AdminDashboard({ onLogout }) {
//   const navigate = useNavigate();
//   const { admin, isAdminAuthenticated, adminLogout, adminRole } = useAuth();
  
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalSellers: 0,
//     totalOrders: 0,
//     totalProducts: 0,
//     totalSales: 0,
//     pendingSellers: 0
//   });
//   const [sellers, setSellers] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Check authentication on component mount
//   useEffect(() => {
//     if (!isAdminAuthenticated) {
//       navigate('/admin/login');
//       return;
//     }
//     fetchDashboardData();
//   }, [isAdminAuthenticated, navigate]);

//   const fetchDashboardData = async () => {
//     const token = localStorage.getItem("adminToken");

//     if (!token) {
//       navigate("/admin/login");
//       return;
//     }

//     try {
//       setLoading(true);
      
//       // Fetch dashboard stats
//       const statsResponse = await fetch(" https://tadanew-bac.onrender.com/api/admin/dashboard/stats", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const statsData = await statsResponse.json();
      
//       if (statsData.success) {
//         setStats({
//           totalUsers: statsData.stats.totalUsers || 0,
//           totalSellers: statsData.stats.totalSellers || 0,
//           totalOrders: statsData.stats.totalOrders || 0,
//           totalProducts: statsData.stats.totalProducts || 0,
//           totalSales: statsData.stats.totalRevenue || 0,
//           pendingSellers: statsData.stats.pendingSellers || 0
//         });
//       }

//       // Fetch sellers for approval
//       const sellersResponse = await fetch(" https://tadanew-bac.onrender.com/api/admin/sellers", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const sellersData = await sellersResponse.json();
//       if (sellersData.success) {
//         setSellers(sellersData.sellers || []);
//       }

//       // Fetch users
//       const usersResponse = await fetch(" https://tadanew-bac.onrender.com/api/admin/users", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const usersData = await usersResponse.json();
//       if (usersData.success) {
//         setUsers(usersData.users || []);
//       }

//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateSellerStatus = async (sellerId, status) => {
//     const token = localStorage.getItem("adminToken");
//     try {
//       const response = await fetch(` https://tadanew-bac.onrender.com/api/admin/sellers/${sellerId}/status`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({ status })
//       });

//       const data = await response.json();
      
//       if (data.success) {
//         fetchDashboardData(); // Refresh data
//         alert(`Seller ${status.toLowerCase()} successfully!`);
//       } else {
//         alert(data.message || "Failed to update seller status");
//       }
//     } catch (error) {
//       console.error("Error updating seller status:", error);
//       alert("Failed to update seller status");
//     }
//   };

//   const handleLogout = () => {
//     if (onLogout) {
//       onLogout();
//     }
//     adminLogout();
//   };

//   if (!isAdminAuthenticated) {
//     return null;
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <h1 className="text-2xl font-bold text-gray-900">Jaggery Shop</h1>
//                 <p className="text-sm text-gray-500 capitalize">
//                   {adminRole} Dashboard
//                   {adminRole === 'super_admin' && ' (Full Access)'}
//                   {adminRole === 'admin' && ' (View Only)'}
//                 </p>
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-4">
//               <div className="text-right">
//                 <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
//                 <p className="text-xs text-gray-500 capitalize">{adminRole}</p>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Navigation Tabs */}
//         <div className="bg-white rounded-lg shadow-sm border mb-8">
//           <nav className="flex space-x-8 px-6" aria-label="Tabs">
//             {[
//               { id: "dashboard", name: "Dashboard", icon: "📊" },
//               { id: "sellers", name: "Sellers", icon: "🏪" },
//               { id: "users", name: "Users", icon: "👤" },
//               ...(adminRole === "super_admin" ? [{ id: "admins", name: "Admins", icon: "👥" }] : [])
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`${
//                   activeTab === tab.id
//                     ? "border-blue-500 text-blue-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
//               >
//                 <span>{tab.icon}</span>
//                 <span>{tab.name}</span>
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Dashboard Content */}
//         <div className="space-y-8">
//           {/* Dashboard Tab */}
//           {activeTab === "dashboard" && (
//             <div className="space-y-6">
//               {/* Stats Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <StatCard
//                   title="Total Users"
//                   value={stats.totalUsers}
//                   icon="👤"
//                   color="blue"
//                 />
//                 <StatCard
//                   title="Total Sellers"
//                   value={stats.totalSellers}
//                   icon="🏪"
//                   color="green"
//                 />
//                 <StatCard
//                   title="Total Orders"
//                   value={stats.totalOrders}
//                   icon="📦"
//                   color="purple"
//                 />
//                 <StatCard
//                   title="Total Products"
//                   value={stats.totalProducts}
//                   icon="📦"
//                   color="orange"
//                 />
//                 <StatCard
//                   title="Total Sales"
//                   value={`₹${stats.totalSales.toLocaleString()}`}
//                   icon="💰"
//                   color="green"
//                 />
//                 <StatCard
//                   title="Pending Sellers"
//                   value={stats.pendingSellers}
//                   icon="⏳"
//                   color="yellow"
//                 />
//               </div>

//               {/* Quick Actions */}
//               <div className="bg-white rounded-lg shadow-sm border p-6">
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   <button
//                     onClick={() => setActiveTab("sellers")}
//                     className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-left"
//                   >
//                     <div className="text-blue-600 text-lg">🏪</div>
//                     <h4 className="font-medium text-gray-900">Manage Sellers</h4>
//                     <p className="text-sm text-gray-600">Approve or reject seller applications</p>
//                   </button>
                  
//                   <button
//                     onClick={() => setActiveTab("users")}
//                     className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors text-left"
//                   >
//                     <div className="text-green-600 text-lg">👤</div>
//                     <h4 className="font-medium text-gray-900">Manage Users</h4>
//                     <p className="text-sm text-gray-600">View and manage user accounts</p>
//                   </button>

//                   {adminRole === "super_admin" && (
//                     <button
//                       onClick={() => setActiveTab("admins")}
//                       className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors text-left"
//                     >
//                       <div className="text-purple-600 text-lg">👥</div>
//                       <h4 className="font-medium text-gray-900">Manage Admins</h4>
//                       <p className="text-sm text-gray-600">Create and manage admin accounts</p>
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Sellers Tab */}
//           {activeTab === "sellers" && (
//             <div className="bg-white rounded-lg shadow-sm border">
//               <div className="px-6 py-4 border-b">
//                 <h3 className="text-lg font-medium text-gray-900">Seller Management</h3>
//                 <p className="text-sm text-gray-600 mt-1">
//                   {sellers.length} seller(s) found
//                 </p>
//               </div>
//               <div className="p-6">
//                 <div className="space-y-4">
//                   {sellers.map((seller) => (
//                     <div key={seller._id} className="border border-gray-200 rounded-lg p-4">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h4 className="font-medium text-gray-900">
//                             {seller.sellerName} - {seller.shopName}
//                           </h4>
//                           <p className="text-sm text-gray-600">{seller.email}</p>
//                           <p className="text-sm text-gray-600">Product: {seller.productType}</p>
//                           <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
//                             seller.status === "Approved" ? "bg-green-100 text-green-800" :
//                             seller.status === "Rejected" ? "bg-red-100 text-red-800" :
//                             "bg-yellow-100 text-yellow-800"
//                           }`}>
//                             {seller.status}
//                           </span>
//                         </div>
//                         {seller.status === "Pending" && (
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => updateSellerStatus(seller._id, "Approved")}
//                               className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
//                             >
//                               Approve
//                             </button>
//                             <button
//                               onClick={() => updateSellerStatus(seller._id, "Rejected")}
//                               className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
//                             >
//                               Reject
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                   {sellers.length === 0 && (
//                     <p className="text-center text-gray-500 py-8">No sellers found</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Users Tab */}
//           {activeTab === "users" && (
//             <div className="bg-white rounded-lg shadow-sm border">
//               <div className="px-6 py-4 border-b">
//                 <h3 className="text-lg font-medium text-gray-900">User Management</h3>
//                 <p className="text-sm text-gray-600 mt-1">
//                   {users.length} user(s) found
//                 </p>
//               </div>
//               <div className="p-6">
//                 <div className="space-y-4">
//                   {users.map((user) => (
//                     <div key={user._id} className="border border-gray-200 rounded-lg p-4">
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <h4 className="font-medium text-gray-900">{user.name}</h4>
//                           <p className="text-sm text-gray-600">{user.email}</p>
//                           <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
//                             user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                           }`}>
//                             {user.isActive ? "Active" : "Inactive"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                   {users.length === 0 && (
//                     <p className="text-center text-gray-500 py-8">No users found</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Admins Tab (Super Admin Only) */}
//           {activeTab === "admins" && adminRole === "super_admin" && (
//             <div className="bg-white rounded-lg shadow-sm border">
//               <div className="px-6 py-4 border-b">
//                 <h3 className="text-lg font-medium text-gray-900">Admin Management</h3>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Super Admin exclusive feature
//                 </p>
//               </div>
//               <div className="p-6">
//                 <p className="text-center text-gray-500 py-8">
//                   This is where you would manage other admin accounts (create, edit, delete).
//                   <br />
//                   Only visible to Super Admin.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Stat Card Component
// function StatCard({ title, value, icon, color }) {
//   const colorClasses = {
//     blue: 'bg-blue-50 border-blue-200 text-blue-600',
//     green: 'bg-green-50 border-green-200 text-green-600',
//     purple: 'bg-purple-50 border-purple-200 text-purple-600',
//     yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
//     orange: 'bg-orange-50 border-orange-200 text-orange-600'
//   };

//   return (
//     <div className={`bg-white rounded-lg shadow-sm border p-6 ${colorClasses[color]}`}>
//       <div className="flex items-center">
//         <div className="flex-shrink-0">
//           <span className="text-2xl">{icon}</span>
//         </div>
//         <div className="ml-4">
//           <h3 className="text-sm font-medium text-gray-900">{title}</h3>
//           <p className="text-2xl font-semibold text-gray-900">{value}</p>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Icons Component
const Icon = ({ name, className = "" }) => {
  const icons = {
    dashboard: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      </svg>
    ),
    sellers: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    users: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    admins: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    logout: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    )
  };

  return icons[name] || null;
};

// Sidebar Navigation Item
const SidebarItem = ({ name, active, onClick, icon, badge }) => (
  <button
    onClick={() => onClick(name)}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
      active === name
        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`}
  >
    <div className="flex items-center space-x-3">
      <Icon name={icon} className="w-5 h-5" />
      <span className="font-medium capitalize">{name}</span>
    </div>
    {badge && (
      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

// Stat Card Component
const StatCard = ({ title, value, icon, color = "blue", trend }) => {
  const colorClasses = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
    green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
    orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" }
  };

  const { bg, text, border } = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${border} p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className={`text-xs font-medium mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${bg}`}>
          <span className={`text-xl ${text}`}>{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const { admin, isAdminAuthenticated, adminLogout, adminRole } = useAuth();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalSales: 0,
    pendingSellers: 0
  });
  const [sellers, setSellers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check authentication on component mount
  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
      return;
    }
    fetchDashboardData();
  }, [isAdminAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await fetch(" https://tadanew-bac.onrender.com/api/admin/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setStats({
          totalUsers: statsData.stats.totalUsers || 0,
          totalSellers: statsData.stats.totalSellers || 0,
          totalOrders: statsData.stats.totalOrders || 0,
          totalProducts: statsData.stats.totalProducts || 0,
          totalSales: statsData.stats.totalRevenue || 0,
          pendingSellers: statsData.stats.pendingSellers || 0
        });
      }

      // Fetch sellers for approval
      const sellersResponse = await fetch(" https://tadanew-bac.onrender.com/api/admin/sellers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sellersData = await sellersResponse.json();
      if (sellersData.success) {
        setSellers(sellersData.sellers || []);
      }

      // Fetch users
      const usersResponse = await fetch(" https://tadanew-bac.onrender.com/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usersData = await usersResponse.json();
      if (usersData.success) {
        setUsers(usersData.users || []);
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSellerStatus = async (sellerId, status) => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(` https://tadanew-bac.onrender.com/api/admin/sellers/${sellerId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      
      if (data.success) {
        fetchDashboardData(); // Refresh data
        alert(`Seller ${status.toLowerCase()} successfully!`);
      } else {
        alert(data.message || "Failed to update seller status");
      }
    } catch (error) {
      console.error("Error updating seller status:", error);
      alert("Failed to update seller status");
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    adminLogout();
  };

  if (!isAdminAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Navigation items
  const navigationItems = [
    { name: "dashboard", icon: "dashboard", badge: null },
    { name: "sellers", icon: "sellers", badge: stats.pendingSellers > 0 ? stats.pendingSellers : null },
    { name: "users", icon: "users", badge: null },
    ...(adminRole === "super_admin" ? [{ name: "admins", icon: "admins", badge: null }] : [])
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo & Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {admin?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {admin?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate capitalize">
                  {adminRole} {adminRole === 'super_admin' && '• Full Access'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <SidebarItem
                key={item.name}
                name={item.name}
                active={activeTab}
                onClick={setActiveTab}
                icon={item.icon}
                badge={item.badge}
              />
            ))}
          </nav>

          {/* Logout at bottom */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
            >
              <Icon name="logout" className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {activeTab === 'dashboard' ? 'Dashboard Overview' : activeTab}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
              <button
                onClick={fetchDashboardData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard Overview */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                  title="Total Users"
                  value={stats.totalUsers}
                  icon="👤"
                  color="blue"
                  trend={5.2}
                />
                <StatCard
                  title="Total Sellers"
                  value={stats.totalSellers}
                  icon="🏪"
                  color="green"
                  trend={3.1}
                />
                <StatCard
                  title="Total Orders"
                  value={stats.totalOrders}
                  icon="📦"
                  color="purple"
                  trend={8.7}
                />
                <StatCard
                  title="Total Products"
                  value={stats.totalProducts}
                  icon="📦"
                  color="orange"
                  trend={2.4}
                />
                <StatCard
                  title="Total Sales"
                  value={`₹${stats.totalSales.toLocaleString()}`}
                  icon="💰"
                  color="green"
                  trend={12.5}
                />
                <StatCard
                  title="Pending Sellers"
                  value={stats.pendingSellers}
                  icon="⏳"
                  color="yellow"
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab("sellers")}
                    className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-left group"
                  >
                    <div className="text-blue-600 text-lg mb-2">🏪</div>
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600">Manage Sellers</h4>
                    <p className="text-sm text-gray-600 mt-1">Approve or reject seller applications</p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab("users")}
                    className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors text-left group"
                  >
                    <div className="text-green-600 text-lg mb-2">👤</div>
                    <h4 className="font-medium text-gray-900 group-hover:text-green-600">Manage Users</h4>
                    <p className="text-sm text-gray-600 mt-1">View and manage user accounts</p>
                  </button>

                  {adminRole === "super_admin" && (
                    <button
                      onClick={() => setActiveTab("admins")}
                      className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors text-left group"
                    >
                      <div className="text-purple-600 text-lg mb-2">👥</div>
                      <h4 className="font-medium text-gray-900 group-hover:text-purple-600">Manage Admins</h4>
                      <p className="text-sm text-gray-600 mt-1">Create and manage admin accounts</p>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sellers Tab */}
          {activeTab === "sellers" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Seller Management</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {sellers.length} sellers
                </span>
              </div>
              
              <div className="grid gap-4">
                {sellers.map((seller) => (
                  <div key={seller._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-bold text-lg text-gray-900">
                            {seller.sellerName} - {seller.shopName}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            seller.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : seller.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {seller.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">
                              <span className="font-medium">Email:</span> {seller.email}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Phone:</span> {seller.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">
                              <span className="font-medium">Product Type:</span> {seller.productType}
                            </p>
                            <p className="text-gray-500 text-xs">
                              Registered: {new Date(seller.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {seller.status === "Pending" && (
                        <div className="flex gap-2 ml-6">
                          <button
                            onClick={() => updateSellerStatus(seller._id, "Approved")}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateSellerStatus(seller._id, "Rejected")}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {sellers.length === 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="text-6xl mb-4">🏪</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Seller Requests</h3>
                    <p className="text-gray-500">There are no pending seller applications at the moment.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {users.length} users
                </span>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-gray-900">{user.phone || "N/A"}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                user.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Admins Tab (Super Admin Only) */}
          {activeTab === "admins" && adminRole === "super_admin" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Super Admin Exclusive
                </span>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Admin Management Panel</h3>
                <p className="text-gray-500 mb-6">
                  This section allows you to create, edit, and manage other admin accounts.
                  <br />
                  Only visible to users with Super Admin privileges.
                </p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Create New Admin
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}