 







// import React, { useState, useEffect } from "react";
// import {
//   LayoutDashboard,
//   History,
//   Heart,
//   ShoppingBag,
//   Settings,
//   LogOut,
//   ChevronLeft,
//   ChevronRight
// } from "lucide-react";
// import DashboardSidebar from "./DashboardNav";     // your sidebar component
// import axios from "axios";
// import { useAuth } from "../pages/AuthContext"; // assuming you use this context

// const Dashboard = () => {
//   const { user, logout } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch profile & orders when component mounts
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);

//         // 1. Get user profile
//         const profileRes = await axios.get("/api/users/profile", {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//         });

//         if (profileRes.data.success) {
//           setProfile(profileRes.data.user);
//         }

//         // 2. Get recent orders (you'll need to create this endpoint)
//         // For now we simulate – replace with real call
//         // const ordersRes = await axios.get("/api/orders/recent", { ... });
//         // setOrders(ordersRes.data.orders || []);

//         // Temporary mock data (remove when you implement backend endpoint)
//         setOrders([
//           { id: "#1001", date: "12 Mar, 2025", total: "$89.00", products: 3, status: "Processing" },
//           { id: "#998",  date: "5 Mar, 2025",  total: "$245.50", products: 7, status: "Shipped"    },
//           { id: "#945",  date: "28 Feb, 2025", total: "$42.00",  products: 1, status: "Delivered"  },
//           { id: "#921",  date: "15 Feb, 2025", total: "$178.75", products: 4, status: "Delivered"  },
//         ]);

//       } catch (err) {
//         console.error("Dashboard data fetch error:", err);
//         setError("Failed to load dashboard data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user) {
//       fetchDashboardData();
//     }
//   }, [user]);

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <p className="text-lg text-gray-600">Please log in to view your dashboard.</p>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">
//         {error}
//       </div>
//     );
//   }

//   const displayName = profile?.name || "User";
//   const displayAddress = profile?.address || profile?.addresses?.[0] || null;
//   const addressText = displayAddress
//     ? `${displayAddress.street || ""}, ${displayAddress.city || ""} - ${displayAddress.zipCode || ""}`
//     : "No address added yet";

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans text-gray-800">
//       {/* Breadcrumb */}
//       <div className="flex items-center text-sm text-gray-400 mb-6">
//         <span className="mr-2">🏠</span>
//         <span className="mx-2">{">"}</span>
//         <span className="text-gray-600">Profile</span>
//       </div>

//       <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
//         {/* Sidebar Navigation */}
//         <div className="col-span-12 md:col-span-3">
//           <DashboardSidebar
//             active="Dashboard"
//             onNavigate={(item) => console.log("Navigate to:", item)}
//             onLogout={logout}
//           />
//         </div>

//         {/* Main Content Area */}
//         <div className="col-span-12 md:col-span-9 space-y-6">
//           {/* Top Cards: Profile & Address */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             {/* Profile Card */}
//             <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
//               <div className="w-24 h-24 bg-gray-100 rounded-full mb-4 overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
//                 {/* You can later add real profile picture */}
//                 <span className="text-gray-400 text-xs">No Photo</span>
//               </div>
//               <h3 className="text-xl font-bold">{displayName}</h3>
//               <p className="text-gray-500 text-sm mt-1">{profile?.email}</p>
//               <button className="text-pink-600 text-sm font-medium mt-3 hover:underline">
//                 Edit Profile
//               </button>
//             </div>

//             {/* Billing Address Card */}
//             <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-100 shadow-sm">
//               <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
//                 Default Address
//               </p>
//               <h3 className="text-lg font-bold mb-2">{displayName}</h3>
//               <p className="text-gray-600 text-sm leading-relaxed">
//                 {addressText}
//                 <br />
//                 {displayAddress?.phone && <span>{displayAddress.phone}</span>}
//               </p>
//               <p className="text-gray-700 text-sm mt-3">{profile?.email}</p>
//               <button className="text-pink-600 text-sm font-medium mt-4 hover:underline">
//                 Edit Address
//               </button>
//             </div>
//           </div>

//           {/* Recent Order History Table */}
//           <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//             <div className="p-5 flex justify-between items-center border-b border-gray-100">
//               <h2 className="text-lg font-bold">Recent Orders</h2>
//               <button className="text-pink-600 text-sm font-medium hover:underline">
//                 View All Orders
//               </button>
//             </div>

//             {orders.length === 0 ? (
//               <div className="p-10 text-center text-gray-500">
//                 No recent orders found.
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left min-w-[600px]">
//                   <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
//                     <tr>
//                       <th className="px-6 py-3">Order ID</th>
//                       <th className="px-6 py-3">Date</th>
//                       <th className="px-6 py-3">Total</th>
//                       <th className="px-6 py-3">Status</th>
//                       <th className="px-6 py-3"></th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {orders.map((order, idx) => (
//                       <tr
//                         key={idx}
//                         className="text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="px-6 py-4 font-medium">{order.id}</td>
//                         <td className="px-6 py-4">{order.date}</td>
//                         <td className="px-6 py-4">
//                           {order.total} ({order.products} items)
//                         </td>
//                         <td className="px-6 py-4">
//                           <span className={`font-medium ${
//                             order.status === "Delivered"  ? "text-green-600" :
//                             order.status === "Shipped"    ? "text-blue-600" :
//                             order.status === "Processing" ? "text-amber-600" : "text-gray-600"
//                           }`}>
//                             {order.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 text-right">
//                           <button className="text-pink-600 font-medium hover:underline">
//                             View Details
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//           {/* Pagination – placeholder (make dynamic later) */}
//           <div className="flex justify-center items-center gap-2 py-6">
//             <button className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-pink-50">
//               <ChevronLeft size={18} />
//             </button>
//             <button className="w-9 h-9 flex items-center justify-center rounded-full bg-pink-600 text-white">
//               1
//             </button>
//             <button className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-pink-50">
//               2
//             </button>
//             <span className="text-gray-400 px-2">...</span>
//             <button className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-pink-50">
//               <ChevronRight size={18} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;





// import React, { useState, useEffect } from "react";
// import DashboardLayout from "./DashboardLayout";
// import DashboardHome from "./DashboardHome";
// import OrderHistory from "../pages/MyOrders";
// import Wishlist from "../pages/Mywishlist";
// import ShoppingCart from "./ShoppingCart";
// import AddressBook from "./AddressBook";
// import ProfileSettings from "./ProfileSettings";
// import axios from "axios";
// import { useAuth } from "../pages/AuthContext";

// const Dashboard = () => {
//   const { user } = useAuth();
//   const [activePage, setActivePage] = useState("dashboard");
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch profile data
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         const profileRes = await axios.get("/api/users/profile", {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//         });

//         if (profileRes.data.success) {
//           setProfile(profileRes.data.user);
//         }
//       } catch (err) {
//         console.error("Profile fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user) {
//       fetchProfile();
//     }
//   }, [user]);

//   // Render different components based on active page
//   const renderContent = () => {
//     if (loading) {
//       return (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
//         </div>
//       );
//     }

//     switch (activePage) {
//       case "dashboard":
//        return <DashboardHome 
//            profile={profile} 
//            onPageChange={setActivePage}     
//          />;
//       case "orders":
//         return <OrderHistory />;
//       case "wishlist":
//         return <Wishlist />;
//       case "cart":
//         return <ShoppingCart />;
//       case "addresses":
//         return <AddressBook profile={profile} />;
//       case "settings":
//       case "Profile Settings":
//         return <ProfileSettings profile={profile} setProfile={setProfile} />;
//       default:
//         return <DashboardHome profile={profile} />;
//     }
//   };

//   return (
//     <DashboardLayout activePage={activePage} onPageChange={setActivePage}>
//       {renderContent()}
//     </DashboardLayout>
//   );
// };

// export default Dashboard;




import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import DashboardHome from "./DashboardHome";
import OrderHistory from "../pages/MyOrders";
import Wishlist from "../pages/Mywishlist";
import ShoppingCart from "./MiniCart";
import AddressBook from "./AddressBook";
import ProfileSettings from "./ProfileSettings";
import axios from "axios";
import { useAuth } from "../pages/AuthContext";

const API_BASE = " https://tadanew-bac.onrender.com";

const Dashboard = () => {
  const { user } = useAuth(); // still useful for auth, but not blocking fetch
  const [activePage, setActivePage] = useState("dashboard");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: Always fetch profile using token
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
          console.warn("No token found");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_BASE}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setProfile(res.data.user);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile(); // ✅ ALWAYS RUN
  }, []);

  // ✅ Loader (prevents empty UI flash)
  if (loading || !profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // Render different components
  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <DashboardHome
            profile={profile}
            onPageChange={setActivePage}
          />
        );

      case "orders":
        return <OrderHistory />;

      case "wishlist":
        return <Wishlist />;

      // case "cart":
      //   return <ShoppingCart />;

      case "addresses":
        return <AddressBook profile={profile} />;

      case "settings":
      case "Profile Settings":
        return (
          <ProfileSettings
            profile={profile}
            setProfile={setProfile}
          />
        );

      default:
        return <DashboardHome profile={profile} />;
    }
  };

  return (
    <DashboardLayout
      activePage={activePage}
      onPageChange={setActivePage}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;