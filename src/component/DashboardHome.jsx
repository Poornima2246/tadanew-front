 
// import React, { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import axios from "axios";
// import OrderTimeline from "./OrderTimeline";

// const API_BASE = " https://tadanew-bac.onrender.com";

// const DashboardHome = ({ 
//   profile: initialProfile, 
//   onPageChange   // ← Required prop from Dashboard
// }) => {
  
//   const [profile, setProfile] = useState(initialProfile || null);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showOrderDetails, setShowOrderDetails] = useState(false);

//   useEffect(() => {
//     fetchUserProfile();
//     fetchOrders();
//   }, [currentPage]);

//   const fetchUserProfile = async () => {
//     try {
//       if (initialProfile) {
//         setProfile(initialProfile);
//         return;
//       }
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const res = await axios.get(`${API_BASE}/api/users/profile`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.data.success) {
//         setProfile(res.data.user);
//       }
//     } catch (err) {
//       console.error("Error fetching profile:", err);
//     }
//   };

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const res = await axios.get(
//         `${API_BASE}/api/orders?page=${currentPage}&limit=5`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (res.data.success) {
//         setOrders(res.data.orders || []);
//         setTotalPages(res.data.totalPages || 1);
//       } else {
//         setOrders([]);
//         setTotalPages(1);
//       }
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       // Mock data fallback
//       setOrders([
//         {
//           _id: "mock1",
//           orderNumber: "1001",
//           createdAt: "2025-03-12T10:00:00Z",
//           totalAmount: 89.0,
//           orderStatus: "Processing",
//           products: [
//             { name: "Organic Jaggery Powder", quantity: 2, price: 25.0 },
//             { name: "Coconut Jaggery Blocks", quantity: 1, price: 39.0 },
//           ],
//           shippingAddress: profile?.addresses?.find((a) => a.isDefault) || profile?.addresses?.[0],
//         },
//         {
//           _id: "mock2",
//           orderNumber: "998",
//           createdAt: "2025-03-05T14:30:00Z",
//           totalAmount: 245.5,
//           orderStatus: "Shipped",
//           products: [
//             { name: "Palm Jaggery", quantity: 3, price: 45.5 },
//             { name: "Date Palm Jaggery", quantity: 4, price: 38.5 },
//           ],
//           shippingAddress: profile?.addresses?.find((a) => a.isDefault) || profile?.addresses?.[0],
//         },
//       ]);
//       setTotalPages(3);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewDetails = (order) => {
//     setSelectedOrder(order);
//     setShowOrderDetails(true);
//   };

//   const handleCloseDetails = () => {
//     setShowOrderDetails(false);
//     setSelectedOrder(null);
//   };

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const displayName = profile?.name || "User";
//   const defaultAddress = profile?.addresses?.find((addr) => addr.isDefault) 
//                       || profile?.addresses?.[0] 
//                       || null;

//   if (loading && !profile) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Top Cards: Profile & Address */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {/* Profile Card */}
//         <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
//           <div className="w-32 h-32 rounded-full mb-4 overflow-hidden bg-[#f0f0f0] flex items-center justify-center">
//             {profile?.avatar ? (
//               <img 
//                 src={profile.avatar} 
//                 alt={displayName} 
//                 className="w-full h-full object-cover" 
//               />
//             ) : (
//               <div className="w-full h-full opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px]"></div>
//             )}
//           </div>
//           <h3 className="text-2xl font-bold text-gray-900">{displayName}</h3>
//           <button 
//             onClick={() => onPageChange("settings")}
//             className="text-pink-500 text-sm font-medium mt-2 hover:underline"
//           >
//             Edit Profile
//           </button>
//         </div>

//         {/* Billing Address Card */}
//         <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm flex flex-col">
//           <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">
//             BILLING ADDRESS
//           </p>

//           <div className="flex-grow">
//             <h3 className="text-xl font-bold text-gray-800 mb-2">
//               {defaultAddress?.name || displayName}
//             </h3>
//             {defaultAddress ? (
//               <p className="text-gray-500 text-sm leading-relaxed mb-1">
//                 {defaultAddress.street}<br />
//                 {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.zipCode}
//               </p>
//             ) : (
//               <p className="text-gray-400 text-sm mb-1 italic">No address provided</p>
//             )}
//             <p className="text-gray-800 text-sm font-medium">{profile?.email}</p>
//             <p className="text-gray-800 text-sm font-medium">
//               {profile?.phone || defaultAddress?.phone || ""}
//             </p>
//           </div>

//           <button 
//             onClick={() => onPageChange("addresses")}
//             className="text-pink-500 text-sm font-medium mt-6 text-left hover:underline w-fit"
//           >
//             Edit Address
//           </button>
//         </div>
//       </div>

//       {/* Recent Order History Table */}
//       <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//         <div className="p-5 flex justify-between items-center border-b border-gray-100">
//           <h2 className="text-lg font-bold">Recent Orders</h2>
//           <button
//             onClick={() => onPageChange("orders")}
//             className="text-pink-600 text-sm font-medium hover:underline"
//           >
//             View All Orders
//           </button>
//         </div>

//         {loading ? (
//           <div className="p-10 text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
//           </div>
//         ) : orders.length === 0 ? (
//           <div className="p-10 text-center text-gray-500">
//             <p>No recent orders found.</p>
//             <button
//               onClick={() => window.location.href = "/shop"}
//               className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
//             >
//               Start Shopping
//             </button>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left min-w-[600px]">
//               <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
//                 <tr>
//                   <th className="px-6 py-3">Order ID</th>
//                   <th className="px-6 py-3">Date</th>
//                   <th className="px-6 py-3">Total</th>
//                   <th className="px-6 py-3">Status</th>
//                   <th className="px-6 py-3"></th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {orders.map((order) => (
//                   <tr key={order._id} className="text-sm text-gray-700 hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 font-medium">
//                       #{order.orderNumber || order._id.slice(-6)}
//                     </td>
//                     <td className="px-6 py-4">
//                       {new Date(order.createdAt).toLocaleDateString("en-IN", {
//                         day: "numeric",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </td>
//                     <td className="px-6 py-4">
//                       ₹{order.totalAmount?.toFixed(2) || "—"} ({order.products?.length || 0} items)
//                     </td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`font-medium ${
//                           order.orderStatus === "Delivered"
//                             ? "text-green-600"
//                             : order.orderStatus === "Shipped"
//                             ? "text-blue-600"
//                             : order.orderStatus === "Processing" || order.orderStatus === "Packed"
//                             ? "text-amber-600"
//                             : "text-gray-600"
//                         }`}
//                       >
//                         {order.orderStatus || "Unknown"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <button
//                         onClick={() => handleViewDetails(order)}
//                         className="text-pink-600 font-medium hover:underline"
//                       >
//                         View Details
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Order Details Modal */}
//       {showOrderDetails && selectedOrder && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-100">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-xl font-bold">
//                   Order Details - #{selectedOrder.orderNumber || selectedOrder._id.slice(-6)}
//                 </h3>
//                 <button 
//                   onClick={handleCloseDetails} 
//                   className="text-gray-500 hover:text-gray-700 text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             <div className="p-6 space-y-6">
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <OrderTimeline status={selectedOrder.orderStatus} />
//               </div>

//               <div>
//                 <h4 className="font-semibold mb-3">Items Ordered</h4>
//                 <div className="space-y-3">
//                   {selectedOrder.products?.map((item, idx) => (
//                     <div key={idx} className="flex justify-between text-sm">
//                       <span>{item.name} × {item.quantity}</span>
//                       <span className="font-medium">
//                         ₹{(item.price * item.quantity).toFixed(2)}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between font-bold text-base">
//                   <span>Total</span>
//                   <span>₹{selectedOrder.totalAmount?.toFixed(2)}</span>
//                 </div>
//               </div>

//               {selectedOrder.shippingAddress && (
//                 <div>
//                   <h4 className="font-semibold mb-3">Shipping Address</h4>
//                   <p className="text-sm text-gray-600 leading-relaxed">
//                     {selectedOrder.shippingAddress.name}<br />
//                     {selectedOrder.shippingAddress.street}<br />
//                     {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} -{" "}
//                     {selectedOrder.shippingAddress.zipCode}<br />
//                     Phone: {selectedOrder.shippingAddress.phone}
//                   </p>
//                 </div>
//               )}

//               <div className="grid grid-cols-2 gap-6 text-sm">
//                 <div>
//                   <h4 className="font-semibold mb-1">Payment Method</h4>
//                   <p className="text-gray-600">{selectedOrder.paymentMethod || "—"}</p>
//                 </div>
//                 {selectedOrder.trackingNumber && (
//                   <div>
//                     <h4 className="font-semibold mb-1">Tracking Number</h4>
//                     <p className="text-gray-600">{selectedOrder.trackingNumber}</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="p-6 border-t border-gray-100">
//               <button
//                 onClick={handleCloseDetails}
//                 className="w-full px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 py-6">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className={`w-9 h-9 flex items-center justify-center rounded-full ${
//               currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-pink-50"
//             }`}
//           >
//             <ChevronLeft size={18} />
//           </button>

//           {[...Array(totalPages)].map((_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => handlePageChange(i + 1)}
//               className={`w-9 h-9 flex items-center justify-center rounded-full ${
//                 currentPage === i + 1 ? "bg-pink-600 text-white" : "text-gray-500 hover:bg-pink-50"
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}

//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className={`w-9 h-9 flex items-center justify-center rounded-full ${
//               currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-pink-50"
//             }`}
//           >
//             <ChevronRight size={18} />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardHome;




import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import OrderTimeline from "./OrderTimeline";

const API_BASE = " https://tadanew-bac.onrender.com";

// Reusable OrderList component (moved inside DashboardHome.jsx)
const OrderList = ({ 
  limit = null,
  showPagination = true,
  showHeader = true,
  showViewAll = false,
  onViewAllClick = null,
  enableCancel = true,
  className = "",
}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, [currentPage, limit]);

  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const limitParam = limit ? `&limit=${limit}` : "";
      const res = await axios.get(
        `${API_BASE}/api/orders?page=${currentPage}${limitParam}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setOrders(res.data.orders || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalOrders(res.data.totalOrders || res.data.orders?.length || 0);
      } else {
        setOrders([]);
        setTotalPages(1);
        setTotalOrders(0);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
      setTotalPages(1);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await axios.put(
        `${API_BASE}/api/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Could not cancel order. Please try again.");
    }
  };

  const toggleDetails = (orderId) => {
    setOpenOrderId(openOrderId === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    if (!status) return "text-gray-600";
    const s = status.toLowerCase().trim();
    if (s === "delivered") return "text-green-600";
    if (s === "shipped") return "text-blue-600";
    if (["processing", "packed", "confirmed"].includes(s)) return "text-amber-600";
    if (s === "pending") return "text-yellow-600";
    if (s === "cancelled" || s === "canceled") return "text-red-600";
    return "text-gray-600";
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">
            {limit ? "Recent Orders" : "Order History"}
          </h2>
          <div className="flex items-center gap-4">
            {!limit && totalOrders > 0 && (
              <span className="text-sm text-gray-500">
                {totalOrders} order{totalOrders !== 1 ? "s" : ""}
              </span>
            )}
            {showViewAll && onViewAllClick && (
              <button
                onClick={onViewAllClick}
                className="text-pink-600 text-sm font-medium hover:underline"
              >
                View All Orders
              </button>
            )}
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">
            {limit ? "No recent orders found." : "When you place an order, it will appear here."}
          </p>
          <button
            onClick={() => (window.location.href = "/shop")}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium">
                        #{order.orderNumber || order._id.slice(-6)}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        ₹{order.totalAmount?.toFixed(2) || "—"}
                        <span className="text-gray-500 text-xs ml-2">
                          ({order.products?.length || 0} items)
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-4">
                        <button
                          onClick={() => toggleDetails(order._id)}
                          className="text-pink-600 hover:text-pink-800 font-medium hover:underline"
                        >
                          {openOrderId === order._id ? "Hide Details" : "View Details"}
                        </button>

                        {enableCancel && 
                          (order.orderStatus?.toLowerCase() === "pending" ||
                            order.orderStatus?.toLowerCase() === "confirmed") && (
                            <button
                              onClick={() => cancelOrder(order._id)}
                              className="text-red-600 hover:text-red-800 font-medium hover:underline"
                            >
                              Cancel
                            </button>
                          )}
                      </td>
                    </tr>

                    {/* Expanded details row */}
                    {openOrderId === order._id && (
                      <tr>
                        <td colSpan={5} className="p-0 bg-gray-50">
                          <div className="p-6 space-y-6">
                            <div className="bg-white rounded-lg p-5 shadow-sm">
                              <OrderTimeline order={order} />
                            </div>

                            <div className="bg-white rounded-lg p-5 shadow-sm">
                              <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                              <div className="space-y-3">
                                {order.products?.map((item, index) => (
                                  <div key={index} className="flex justify-between text-sm">
                                    <span className="text-gray-800">
                                      {item.name} × {item.quantity}
                                    </span>
                                    <span className="font-medium">
                                      ₹{(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                                <div className="pt-3 mt-2 border-t border-gray-200 flex justify-between font-bold">
                                  <span>Total</span>
                                  <span>₹{order.totalAmount?.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            {order.shippingAddress && (
                              <div className="bg-white rounded-lg p-5 shadow-sm">
                                <h4 className="font-semibold text-gray-900 mb-3">Shipping Address</h4>
                                <div className="text-sm text-gray-600 leading-relaxed">
                                  <p>{order.shippingAddress.name}</p>
                                  <p>{order.shippingAddress.street}</p>
                                  <p>
                                    {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                                    {order.shippingAddress.zipCode}
                                  </p>
                                  <p className="mt-1">Phone: {order.shippingAddress.phone}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {showPagination && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 py-6 border-t border-gray-100">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-9 h-9 flex items-center justify-center rounded-full ${
                  currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-pink-50"
                }`}
              >
                <ChevronLeft size={18} />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-9 h-9 flex items-center justify-center rounded-full ${
                    currentPage === i + 1 ? "bg-pink-600 text-white" : "text-gray-500 hover:bg-pink-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-9 h-9 flex items-center justify-center rounded-full ${
                  currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-pink-50"
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Main DashboardHome component
const DashboardHome = ({ 
  profile: initialProfile, 
  onPageChange
}) => {
  
  const [profile, setProfile] = useState(initialProfile || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      if (initialProfile) {
        setProfile(initialProfile);
        setLoading(false);
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_BASE}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setProfile(res.data.user);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const displayName = profile?.name || "User";
  const defaultAddress = profile?.addresses?.find((addr) => addr.isDefault) 
                      || profile?.addresses?.[0] 
                      || null;

  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Cards: Profile & Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Profile Card */}
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 rounded-full mb-4 overflow-hidden bg-[#f0f0f0] flex items-center justify-center">
            {profile?.avatar ? (
              <img 
                src={profile.avatar} 
                alt={displayName} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px]"></div>
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{displayName}</h3>
          <button 
            onClick={() => onPageChange("settings")}
            className="text-pink-500 text-sm font-medium mt-2 hover:underline"
          >
            Edit Profile
          </button>
        </div>

        {/* Billing Address Card */}
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm flex flex-col">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">
            BILLING ADDRESS
          </p>

          <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {defaultAddress?.name || displayName}
            </h3>
            {defaultAddress ? (
              <p className="text-gray-500 text-sm leading-relaxed mb-1">
                {defaultAddress.street}<br />
                {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.zipCode}
              </p>
            ) : (
              <p className="text-gray-400 text-sm mb-1 italic">No address provided</p>
            )}
            <p className="text-gray-800 text-sm font-medium">{profile?.email}</p>
            <p className="text-gray-800 text-sm font-medium">
              {profile?.phone || defaultAddress?.phone || ""}
            </p>
          </div>

          <button 
            onClick={() => onPageChange("addresses")}
            className="text-pink-500 text-sm font-medium mt-6 text-left hover:underline w-fit"
          >
            Edit Address
          </button>
        </div>
      </div>

      {/* Recent Order History - Using OrderList with limit={5} */}
      <OrderList 
        limit={5}
        showPagination={true}
        showHeader={true}
        showViewAll={true}
        onViewAllClick={() => onPageChange("orders")}
        enableCancel={true}
      />
    </div>
  );
};

export default DashboardHome;