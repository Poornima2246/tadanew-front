import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderTimeline from "../component/OrderTimeline"; // adjust path as needed

const API_URL = "http://localhost:5000";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await axios.put(
        `${API_URL}/api/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh list after cancel
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

    return "text-gray-600"; // fallback
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-2">View and manage all your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">When you place an order, it will appear here.</p>
          <button
            onClick={() => (window.location.href = "/shop")}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Order History</h2>
            <div className="text-sm text-gray-500">
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Table */}
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
                          {openOrderId === order._id ? "Hide" : "View Details"}
                        </button>

                        {(order.orderStatus?.toLowerCase() === "pending" ||
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
                              <OrderTimeline  order={order} />
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
        </div>
      )}
    </div>
  );
}