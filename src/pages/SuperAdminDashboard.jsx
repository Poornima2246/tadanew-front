import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState("dashboard");
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    permissions: {
      view_dashboard: true,
      manage_users: false,
      manage_sellers: false,
      manage_products: false,
      manage_orders: false,
      manage_inventory: false,
      view_reports: true,
      manage_admins: false
    }
  });

  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole");

    if (!token || role !== "super_admin") {
      navigate("/admin/login");
      return;
    }

    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      
      // Fetch stats
      const statsResponse = await fetch("http://localhost:5000/api/admin/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const statsData = await statsResponse.json();
      if (statsData.success) setStats(statsData.stats);

      // Fetch admins
      const adminsResponse = await fetch("http://localhost:5000/api/admin/admins", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const adminsData = await adminsResponse.json();
      if (adminsData.success) setAdmins(adminsData.admins);

      // Fetch users
      const usersResponse = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usersData = await usersResponse.json();
      if (usersData.success) setUsers(usersData.users);

      // Fetch sellers
      const sellersResponse = await fetch("http://localhost:5000/api/admin/sellers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sellersData = await sellersResponse.json();
      if (sellersData.success) setSellers(sellersData.sellers);

      // Fetch orders
      const ordersResponse = await fetch("http://localhost:5000/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ordersData = await ordersResponse.json();
      if (ordersData.success) setOrders(ordersData.orders);

      // Fetch products
      const productsResponse = await fetch("http://localhost:5000/api/admin/inventory", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const productsData = await productsResponse.json();
      if (productsData.success) setProducts(productsData.inventory);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("admin");
    localStorage.removeItem("permissions");
    navigate("/admin/login");
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/admin/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newAdmin)
      });

      const data = await response.json();
      
      if (data.success) {
        setShowCreateAdmin(false);
        setNewAdmin({
          name: "",
          email: "",
          password: "",
          permissions: {
            view_dashboard: true,
            manage_users: false,
            manage_sellers: false,
            manage_products: false,
            manage_orders: false,
            manage_inventory: false,
            view_reports: true,
            manage_admins: false
          }
        });
        fetchDashboardData(); // Refresh admins list
        alert("Admin created successfully!");
      } else {
        alert(data.message || "Failed to create admin");
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      alert("Failed to create admin");
    }
  };

  const handleToggleAdminStatus = async (adminId, currentStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/api/admin/admins/${adminId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        fetchDashboardData(); // Refresh admins list
        alert(`Admin ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      } else {
        alert(data.message || "Failed to update admin");
      }
    } catch (error) {
      console.error("Error updating admin:", error);
      alert("Failed to update admin");
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/api/admin/admins/${adminId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        fetchDashboardData(); // Refresh admins list
        alert("Admin deleted successfully!");
      } else {
        alert(data.message || "Failed to delete admin");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Failed to delete admin");
    }
  };

  const handleUpdateSellerStatus = async (sellerId, status) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/api/admin/sellers/${sellerId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      
      if (data.success) {
        fetchDashboardData(); // Refresh sellers list
        alert(`Seller ${status.toLowerCase()} successfully!`);
      } else {
        alert(data.message || "Failed to update seller status");
      }
    } catch (error) {
      console.error("Error updating seller status:", error);
      alert("Failed to update seller status");
    }
  };

  const handleUpdateUserStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        fetchDashboardData(); // Refresh users list
        alert(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      } else {
        alert(data.message || "Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status");
    }
  };

  const handleUpdateProductStatus = async (productId, currentStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/api/admin/inventory/${productId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        fetchDashboardData(); // Refresh products list
        alert(`Product ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      } else {
        alert(data.message || "Failed to update product status");
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      alert("Failed to update product status");
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus: status })
      });

      const data = await response.json();
      
      if (data.success) {
        fetchDashboardData(); // Refresh orders list
        alert("Order status updated successfully!");
      } else {
        alert(data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">Jaggery Shop</h1>
                <p className="text-sm text-gray-500">Super Admin Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{admin?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: "dashboard", name: "Dashboard", icon: "📊" },
              { id: "admins", name: "Admins", icon: "👥" },
              { id: "users", name: "Users", icon: "👤" },
              { id: "sellers", name: "Sellers", icon: "🏪" },
              { id: "orders", name: "Orders", icon: "📦" },
              { id: "products", name: "Products", icon: "📦" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Users"
                  value={stats.totalUsers || 0}
                  icon="👤"
                  color="blue"
                />
                <StatCard
                  title="Total Sellers"
                  value={stats.totalSellers || 0}
                  icon="🏪"
                  color="green"
                />
                <StatCard
                  title="Total Orders"
                  value={stats.totalOrders || 0}
                  icon="📦"
                  color="purple"
                />
                <StatCard
                  title="Total Revenue"
                  value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}
                  icon="💰"
                  color="yellow"
                />
                <StatCard
                  title="Total Products"
                  value={stats.totalProducts || 0}
                  icon="📦"
                  color="indigo"
                />
                <StatCard
                  title="Pending Sellers"
                  value={stats.pendingSellers || 0}
                  icon="⏳"
                  color="red"
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveTab("admins")}
                    className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-left"
                  >
                    <div className="text-blue-600 text-lg">👥</div>
                    <h4 className="font-medium text-gray-900">Manage Admins</h4>
                    <p className="text-sm text-gray-600">Create and manage admin accounts</p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab("sellers")}
                    className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors text-left"
                  >
                    <div className="text-green-600 text-lg">🏪</div>
                    <h4 className="font-medium text-gray-900">Approve Sellers</h4>
                    <p className="text-sm text-gray-600">Review and approve seller applications</p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors text-left"
                  >
                    <div className="text-purple-600 text-lg">📦</div>
                    <h4 className="font-medium text-gray-900">Manage Orders</h4>
                    <p className="text-sm text-gray-600">View and update order status</p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab("products")}
                    className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors text-left"
                  >
                    <div className="text-indigo-600 text-lg">📦</div>
                    <h4 className="font-medium text-gray-900">Manage Products</h4>
                    <p className="text-sm text-gray-600">View and manage product inventory</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Admins Tab */}
          {activeTab === "admins" && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Admin Management</h3>
                <button
                  onClick={() => setShowCreateAdmin(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Create New Admin
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {admins.map((adminItem) => (
                      <tr key={adminItem._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {adminItem.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {adminItem.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {adminItem.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            adminItem.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {adminItem.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {Object.entries(adminItem.permissions || {}).filter(([_, value]) => value).length} permissions
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleToggleAdminStatus(adminItem._id, adminItem.isActive)}
                            className={`${
                              adminItem.isActive 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {adminItem.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          {adminItem.role !== 'super_admin' && (
                            <button
                              onClick={() => handleDeleteAdmin(adminItem._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <DataTable
              title="User Management"
              data={users}
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { 
                  key: 'isActive', 
                  label: 'Status',
                  render: (item) => (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  )
                }
              ]}
              actions={(item) => (
                <button
                  onClick={() => handleUpdateUserStatus(item._id, item.isActive)}
                  className={`${
                    item.isActive 
                      ? 'text-red-600 hover:text-red-900' 
                      : 'text-green-600 hover:text-green-900'
                  } text-sm font-medium`}
                >
                  {item.isActive ? 'Deactivate' : 'Activate'}
                </button>
              )}
            />
          )}

          {/* Sellers Tab */}
          {activeTab === "sellers" && (
            <DataTable
              title="Seller Management"
              data={sellers}
              columns={[
                { key: 'sellerName', label: 'Seller Name' },
                { key: 'shopName', label: 'Shop Name' },
                { key: 'email', label: 'Email' },
                { key: 'productType', label: 'Product Type' },
                { 
                  key: 'status', 
                  label: 'Status',
                  render: (item) => (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      item.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  )
                }
              ]}
              actions={(item) => (
                <div className="space-x-2">
                  {item.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateSellerStatus(item._id, 'Approved')}
                        className="text-green-600 hover:text-green-900 text-sm font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateSellerStatus(item._id, 'Rejected')}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {item.status === 'Approved' && (
                    <button
                      onClick={() => handleUpdateSellerStatus(item._id, 'Rejected')}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Reject
                    </button>
                  )}
                  {item.status === 'Rejected' && (
                    <button
                      onClick={() => handleUpdateSellerStatus(item._id, 'Approved')}
                      className="text-green-600 hover:text-green-900 text-sm font-medium"
                    >
                      Approve
                    </button>
                  )}
                </div>
              )}
            />
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <DataTable
              title="Order Management"
              data={orders}
              columns={[
                { key: 'orderNumber', label: 'Order Number' },
                { 
                  key: 'customerId', 
                  label: 'Customer',
                  render: (item) => item.customerId?.name || 'N/A'
                },
                { 
                  key: 'totalAmount', 
                  label: 'Amount',
                  render: (item) => `₹${item.totalAmount}`
                },
                { 
                  key: 'orderStatus', 
                  label: 'Status',
                  render: (item) => (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                      item.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.orderStatus}
                    </span>
                  )
                }
              ]}
              actions={(item) => (
                <select
                  value={item.orderStatus}
                  onChange={(e) => handleUpdateOrderStatus(item._id, e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              )}
            />
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <DataTable
              title="Product Management"
              data={products}
              columns={[
                { key: 'name', label: 'Product Name' },
                { 
                  key: 'sellerId', 
                  label: 'Seller',
                  render: (item) => item.sellerId?.shopName || 'N/A'
                },
                { 
                  key: 'price', 
                  label: 'Price',
                  render: (item) => `₹${item.price}`
                },
                { key: 'stock', label: 'Stock' },
                { 
                  key: 'isActive', 
                  label: 'Status',
                  render: (item) => (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  )
                }
              ]}
              actions={(item) => (
                <button
                  onClick={() => handleUpdateProductStatus(item._id, item.isActive)}
                  className={`${
                    item.isActive 
                      ? 'text-red-600 hover:text-red-900' 
                      : 'text-green-600 hover:text-green-900'
                  } text-sm font-medium`}
                >
                  {item.isActive ? 'Deactivate' : 'Activate'}
                </button>
              )}
            />
          )}
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Admin</h3>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="space-y-2">
                  {Object.entries(newAdmin.permissions).map(([key, value]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNewAdmin({
                          ...newAdmin,
                          permissions: {
                            ...newAdmin.permissions,
                            [key]: e.target.checked
                          }
                        })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {key.replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Create Admin
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateAdmin(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600',
    red: 'bg-red-50 border-red-200 text-red-600'
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${colorClasses[color]}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Reusable Data Table Component
function DataTable({ title, data, columns, actions }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item._id}>
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {actions(item)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}