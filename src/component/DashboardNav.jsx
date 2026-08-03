// import React from "react";
// import {
//   LayoutDashboard,
//   History,
//   Heart,
//   ShoppingBag,
//   Settings,
//   LogOut,
// } from "lucide-react";

// const navItems = [
//   { label: "Dashboard", icon: <LayoutDashboard size={20} /> },
//   { label: "Order History", icon: <History size={20} /> },
//   { label: "Wishlist", icon: <Heart size={20} /> },
//   { label: "Shopping Cart", icon: <ShoppingBag size={20} /> },
//   { label: "Settings", icon: <Settings size={20} /> },
//   { label: "Log-out", icon: <LogOut size={20} /> },
// ];

// const DashboardSidebar = ({ active = "Dashboard", onNavigate }) => {
//   return (
//     <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden h-fit">
//       <h2 className="p-5 text-lg font-bold border-b border-gray-50">
//         Navigation
//       </h2>

//       <nav className="flex flex-col">
//         {navItems.map((item) => (
//           <NavItem
//             key={item.label}
//             icon={item.icon}
//             label={item.label}
//             active={active === item.label}
//             onClick={() => onNavigate?.(item.label)}
//           />
//         ))}
//       </nav>
//     </div>
//   );
// };

// const NavItem = ({ icon, label, active, onClick }) => (
//   <div
//     onClick={onClick}
//     className={`flex items-center gap-3 px-6 py-4 cursor-pointer transition-colors ${
//       active
//         ? "bg-pink-100 text-gray-900 border-l-4 border-pink-500"
//         : "text-gray-500 hover:bg-gray-50"
//     }`}
//   >
//     {icon}
//     <span className="font-medium">{label}</span>
//   </div>
// );

// export default DashboardSidebar;


import React from "react";
import {
  LayoutDashboard,
  History,
  Heart,
  ShoppingBag,
  Settings,
  LogOut,
  User,
  MapPin
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "dashboard" },
  { label: "Order History", icon: <History size={20} />, path: "orders" },
  { label: "Wishlist", icon: <Heart size={20} />, path: "wishlist" },
  // { label: "Shopping Cart", icon: <ShoppingBag size={20} />, path: "cart" },
  { label: "Addresses", icon: <MapPin size={20} />, path: "addresses" },
  { label: "Profile Settings", icon: <Settings size={20} />, path: "settings" },
];

const DashboardSidebar = ({ active = "Dashboard", onNavigate, onLogout, user }) => {
  const handleItemClick = (item) => {
    if (item.label === "Log-out") {
      onLogout();
    } else {
      onNavigate?.(item.path || item.label);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden h-fit">
      {/* User Info Summary */}
      <div className="p-5 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
            <User size={20} className="text-pink-600" />
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-gray-800 truncate">{user?.name || "User"}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={active === item.path || active === item.label}
            onClick={() => handleItemClick(item)}
          />
        ))}
        
        {/* Logout Button */}
        <NavItem
          icon={<LogOut size={20} />}
          label="Log-out"
          active={false}
          onClick={onLogout}
          className="border-t border-gray-50 mt-2 text-red-500 hover:bg-red-50"
        />
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick, className = "" }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-4 cursor-pointer transition-colors ${className} ${
      active
        ? "bg-pink-100 text-gray-900 border-l-4 border-pink-500"
        : "text-gray-500 hover:bg-gray-50"
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </div>
);

export default DashboardSidebar;