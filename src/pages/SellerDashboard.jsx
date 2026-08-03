import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });

  const navigate = useNavigate();
  const apiUrl = " https://tadanew-bac.onrender.com";

  // Get authentication token
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Authentication Check
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      const role = localStorage.getItem("role");
      const sellerStatus = localStorage.getItem("sellerStatus");

      console.log("Auth check:", { token, role, sellerStatus });

      if (!token || role !== "seller" || sellerStatus !== "approved") {
        console.log("Auth failed, redirecting to login");
        navigate("/seller/login");
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/api/sellers/profile`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
        console.log("Profile response:", response.data);
        setSeller(response.data.seller);
        await fetchProducts();
        await fetchDashboardStats();
      } catch (error) {
        console.error("Auth check failed:", error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const token = getAuthToken();
      console.log("Fetching products with token:", token);
      
      const response = await axios.get(`${apiUrl}/api/sellers/products`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      console.log("Products response:", response.data);
      
      // FIXED: Access products from response.data.products
      const productsData = response.data.products || [];
      setProducts(productsData);
      
      // Update stats
      const activeProducts = productsData.filter(p => p.isActive).length;
      setStats(prev => ({
        ...prev,
        totalProducts: productsData.length,
        activeProducts,
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${apiUrl}/api/sellers/dashboard/stats`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      
      if (response.data.success) {
        const statsData = response.data.stats;
        setStats(prev => ({
          ...prev,
          totalOrders: statsData.totalOrders || 0,
          pendingOrders: statsData.pendingOrders || 0,
          totalRevenue: statsData.totalRevenue || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("sellerStatus");
    localStorage.removeItem("sellerData");
    navigate("/seller/login");
  };

  // Image Upload Component
  const ImageUpload = ({ onImagesChange, existingImages }) => {
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleImageUpload = async (event) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setUploading(true);
      setMessage({ type: '', text: '' });

      try {
        const token = getAuthToken();
        const formData = new FormData();
        
        for (let i = 0; i < files.length; i++) {
          formData.append('images', files[i]);
        }

        const response = await axios.post(
          `${apiUrl}/api/sellers/upload-images`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.data.success) {
          const newImages = [...existingImages, ...response.data.images];
          onImagesChange(newImages);
          setMessage({ type: 'success', text: 'Images uploaded successfully!' });
        }
      } catch (error) {
        console.error('Image upload error:', error);
        setMessage({ 
          type: 'error', 
          text: 'Failed to upload images: ' + (error.response?.data?.message || error.message) 
        });
      } finally {
        setUploading(false);
      }
    };

    const removeImage = (index) => {
      const newImages = existingImages.filter((_, i) => i !== index);
      onImagesChange(newImages);
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images *
        </label>
        
        {message.text && (
          <div className={`p-3 rounded-lg mb-4 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`cursor-pointer block ${
              uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            }`}
          >
            <div className="text-4xl mb-2">📷</div>
            <p className="text-gray-600 mb-1">
              {uploading ? 'Uploading...' : 'Click to upload images'}
            </p>
            <p className="text-sm text-gray-500">
              Supports JPG, PNG, WEBP (Max 5 images, 10MB each)
            </p>
          </label>
        </div>

        {/* Preview uploaded images */}
        {existingImages.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-700 mb-2">
              Uploaded images ({existingImages.length})
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {existingImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Dashboard Header Component
  const DashboardHeader = () => (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between p-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Seller Dashboard</h1>
          <p className="text-gray-600">Welcome back, {seller?.sellerName}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-semibold text-gray-800">{seller?.shopName}</p>
            <p className="text-sm text-gray-600">{seller?.email}</p>
          </div>
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {seller?.sellerName?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );

  // Dashboard Sidebar Component
  const DashboardSidebar = () => {
    const menuItems = [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "products", label: "My Products", icon: "📦" },
      { id: "add-product", label: "Add Product", icon: "➕" },
      { id: "orders", label: "Orders", icon: "🛒" },
      { id: "profile", label: "Profile", icon: "👤" },
    ];

    return (
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-green-800 text-white shadow-lg">
        <div className="p-6 border-b border-green-700">
          <h2 className="text-2xl font-bold text-white">Jaggery Shop</h2>
          <p className="text-green-200 text-sm mt-1">Seller Portal</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-green-700 text-white shadow-md"
                      : "text-green-100 hover:bg-green-700 hover:text-white"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-700">
          <div className="mb-4 p-3 bg-green-700 rounded-lg">
            <p className="font-semibold text-sm">{seller?.shopName}</p>
            <p className="text-green-200 text-xs truncate">{seller?.email}</p>
            <p className="text-green-300 text-xs mt-1">
              Status: <span className="font-semibold capitalize">{seller?.status?.toLowerCase()}</span>
            </p>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  };

  // Dashboard Stats Component
  const DashboardStats = () => {
    const statCards = [
      {
        title: "Total Products",
        value: stats.totalProducts,
        icon: "📦",
        color: "bg-blue-500",
        description: "All your products"
      },
      {
        title: "Active Products",
        value: stats.activeProducts,
        icon: "🟢",
        color: "bg-green-500",
        description: "Currently active"
      },
      {
        title: "Total Orders",
        value: stats.totalOrders,
        icon: "🛒",
        color: "bg-purple-500",
        description: "All time orders"
      },
      {
        title: "Total Revenue",
        value: `₹${stats.totalRevenue}`,
        icon: "💰",
        color: "bg-yellow-500",
        description: "Total earnings"
      },
    ];

    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                  <span className="text-xl">{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setActiveTab("add-product")}
              className="p-4 border-2 border-dashed border-green-200 rounded-lg hover:border-green-400 transition-colors duration-200 text-center group"
            >
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">➕</span>
              <span className="text-green-700 font-medium">Add New Product</span>
            </button>
            <button 
              onClick={() => setActiveTab("products")}
              className="p-4 border-2 border-dashed border-blue-200 rounded-lg hover:border-blue-400 transition-colors duration-200 text-center group"
            >
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">📦</span>
              <span className="text-blue-700 font-medium">Manage Products</span>
            </button>
            <button 
              onClick={() => setActiveTab("orders")}
              className="p-4 border-2 border-dashed border-purple-200 rounded-lg hover:border-purple-400 transition-colors duration-200 text-center group"
            >
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">🛒</span>
              <span className="text-purple-700 font-medium">View Orders</span>
            </button>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Products</h3>
            <button 
              onClick={() => setActiveTab("products")}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 3).map((product) => (
                <div key={product._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400">📷</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{product.name}</p>
                      <p className="text-sm text-gray-600">₹{product.price}</p>
                      <p className={`text-xs px-2 py-1 rounded-full inline-block ${
                        product.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-4 block">📦</span>
              <p>No products yet. Add your first product to get started!</p>
              <button
                onClick={() => setActiveTab("add-product")}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Product
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  

  const AddProductForm = () => {
    const predefinedCategories = [
      "Jaggery",
      "Millets",
      "Pulses & Lentils",
      "Whole Pulses",
      "Edible Oils",
      "Spices",
      "Sweeteners",
      "Honey",
      "Dry Fruits",
      "Nuts & Seeds",
      "Flours",
      "Traditional Mixes",
       
    ];

    const [formData, setFormData] = useState({
      name: "",
      description: "",
      price: "",
      category: "",
      customCategory: "", // ← new field for "Other"
      stock: "",
      weight: "",
      unit: "kg",
    });

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const isOtherSelected = formData.category === "Other";

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage({ type: "", text: "" });

      try {
        const token = getAuthToken();

        // Decide final category value
        const finalCategory = isOtherSelected
          ? formData.customCategory.trim()
          : formData.category;

        if (isOtherSelected && !finalCategory) {
          throw new Error("Please enter a custom category name");
        }

        const productData = {
          ...formData,
          category: finalCategory,      // ← important: send final value
          images,
        };

        // Remove temporary fields before sending
        delete productData.customCategory;

        const response = await axios.post(`${apiUrl}/api/sellers/products`, productData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.data.success) {
          setMessage({ type: "success", text: "Product added successfully!" });

          // Reset form
          setFormData({
            name: "",
            description: "",
            price: "",
            category: "",
            customCategory: "",
            stock: "",
            weight: "",
            unit: "kg",
          });
          setImages([]);

          await fetchProducts();
          await fetchDashboardStats();
        }
      } catch (err) {
        console.error("Add product error:", err);
        setMessage({
          type: "error",
          text: err.response?.data?.message || err.message || "Failed to add product",
        });
      } finally {
        setLoading(false);
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImagesChange = (newImages) => {
      setImages(newImages);
    };

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>

          {message.text && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>

                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {predefinedCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Other">Other (add custom)</option>
                </select>

                {isOtherSelected && (
                  <input
                    type="text"
                    name="customCategory"
                    value={formData.customCategory}
                    onChange={handleChange}
                    placeholder="Type new category name..."
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe your product in detail..."
              />
            </div>

            {/* Pricing & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  name="stock"
                  required
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Weight"
                  />
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="lb">lb</option>
                    <option value="piece">piece</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <ImageUpload onImagesChange={handleImagesChange} existingImages={images} />

            {/* Submit */}
            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading || images.length === 0}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding Product...</span>
                  </>
                ) : (
                  <>
                    <span>➕</span>
                    <span>Add Product</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("products")}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Product List Component  
  const ProductList = () => {
    const [message, setMessage] = useState({ type: "", text: "" });
    const [actionLoading, setActionLoading] = useState(null);

    const toggleProductStatus = async (productId, currentStatus) => {
      setActionLoading(productId);
      setMessage({ type: "", text: "" });

      try {
        const token = getAuthToken();
        console.log(`Toggling product ${productId} from ${currentStatus} to ${!currentStatus}`);
        
        // FIX: Use the correct endpoint and method
        const response = await axios.patch(
          `${apiUrl}/api/sellers/products/${productId}/toggle-active`,
          {}, // empty body since we're just toggling
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            } 
          }
        );

        console.log("Toggle response:", response.data);
        
        if (response.data.success) {
          setMessage({ type: "success", text: response.data.message });
          
          // Refresh products and stats
          await fetchProducts();
          await fetchDashboardStats();
        } else {
          throw new Error(response.data.message || "Failed to update product");
        }
        
      } catch (err) {
        console.error("Toggle product error:", err);
        setMessage({ 
          type: "error", 
          text: "Failed to update product: " + (err.response?.data?.message || err.message) 
        });
      } finally {
        setActionLoading(null);
      }
    };

    const deleteProduct = async (productId) => {
      if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

      setActionLoading(productId);
      setMessage({ type: "", text: "" });

      try {
        const token = getAuthToken();
        console.log(`Deleting product ${productId}`);
        
        const response = await axios.delete(`${apiUrl}/api/sellers/products/${productId}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        console.log("Delete response:", response.data);
        
        if (response.data.success) {
          setMessage({ type: "success", text: response.data.message });
          
          // Refresh products and stats
          await fetchProducts();
          await fetchDashboardStats();
        } else {
          throw new Error(response.data.message || "Failed to delete product");
        }
        
      } catch (err) {
        console.error("Delete product error:", err);
        setMessage({ 
          type: "error", 
          text: "Failed to delete product: " + (err.response?.data?.message || err.message) 
        });
      } finally {
        setActionLoading(null);
      }
    };

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">
                {products.length} product{products.length !== 1 ? 's' : ''}
              </span>
              <span className="text-green-600">
                {products.filter(p => p.isActive).length} active
              </span>
            </div>
            <button
              onClick={() => setActiveTab("add-product")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <span>➕</span>
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === "success" 
              ? "bg-green-50 border border-green-200 text-green-700" 
              : "bg-red-50 border border-red-200 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        {products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first product to showcase on Jaggery Shop</p>
            <button
              onClick={() => setActiveTab("add-product")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <>
            {/* Product Filters */}
            <div className="bg-white rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-center">
              <div>
                <label className="text-sm font-medium text-gray-700 mr-2">Filter by:</label>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  onChange={(e) => {
                    // You can implement filtering logic here
                    console.log("Filter:", e.target.value);
                  }}
                >
                  <option value="all">All Products</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mr-2">Sort by:</label>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  onChange={(e) => {
                    // You can implement sorting logic here
                    console.log("Sort:", e.target.value);
                  }}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="h-48 bg-gray-200 relative">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                        <span className="text-4xl">📷</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          product.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                      {product.stock === 0 && (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 truncate" title={product.name}>
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-green-700">
                        ₹{product.price}
                      </span>
                      <span className={`text-sm ${
                        product.stock > 10 ? "text-green-600" : 
                        product.stock > 0 ? "text-orange-600" : "text-red-600"
                      }`}>
                        Stock: {product.stock}
                      </span>
                    </div>

                    {product.weight && (
                      <p className="text-sm text-gray-600 mb-3">
                        Weight: {product.weight} {product.unit}
                      </p>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleProductStatus(product._id, product.isActive)}
                        disabled={actionLoading === product._id}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          product.isActive
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300"
                            : "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {actionLoading === product._id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto"></div>
                        ) : product.isActive ? (
                          "🟡 Pause"
                        ) : (
                          "🟢 Activate"
                        )}
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        disabled={actionLoading === product._id}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-red-300"
                        title="Delete Product"
                      >
                        {actionLoading === product._id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          "🗑️"
                        )}
                      </button>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Created: {new Date(product.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  // Order Management Component
  // const OrderManagement = () => {
  //   const [orders, setOrders] = useState([]);
  //   const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     fetchOrders();
  //   }, []);

  //   const fetchOrders = async () => {
  //     try {
  //       const token = getAuthToken();
  //       const response = await axios.get(`${apiUrl}/api/sellers/orders`, {
  //         headers: { 
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json"
  //         },
  //       });
        
  //       if (response.data.success) {
  //         setOrders(response.data.orders || []);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching orders:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (loading) {
  //     return (
  //       <div className="flex justify-center items-center py-12">
  //         <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
  //       </div>
  //     );
  //   }

  //   return (
  //     <div>
  //       <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h2>

  //       {orders.length === 0 ? (
  //         <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
  //           <div className="text-6xl mb-4">🛒</div>
  //           <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h3>
  //           <p className="text-gray-600">
  //             When customers place orders for your products, they will appear here.
  //           </p>
  //         </div>
  //       ) : (
  //         <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
  //           <div className="overflow-x-auto">
  //             <table className="w-full">
  //               <thead className="bg-gray-50">
  //                 <tr>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Order ID
  //                   </th>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Customer
  //                   </th>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Amount
  //                   </th>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Status
  //                   </th>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Date
  //                   </th>
  //                 </tr>
  //               </thead>
  //               <tbody className="divide-y divide-gray-200">
  //                 {orders.map((order) => (
  //                   <tr key={order._id} className="hover:bg-gray-50">
  //                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
  //                       {order.orderNumber}
  //                     </td>
  //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
  //                       {order.customerId?.name || 'N/A'}
  //                     </td>
  //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
  //                       ₹{order.totalAmount}
  //                     </td>
  //                     <td className="px-6 py-4 whitespace-nowrap">
  //                       <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
  //                         order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
  //                         order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
  //                         order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
  //                         'bg-gray-100 text-gray-800'
  //                       }`}>
  //                         {order.orderStatus}
  //                       </span>
  //                     </td>
  //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  //                       {new Date(order.createdAt).toLocaleDateString()}
  //                     </td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };



  // Order Management Component (Seller)
const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${apiUrl}/api/sellers/orders`, {
        headers: { 
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setMessage({ type: "error", text: "Failed to load orders" });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Mark this order as "${newStatus}"?`)) return;

    setActionLoading(orderId);
    setMessage({ type: "", text: "" });

    try {
      const token = getAuthToken();
      
      const response = await axios.put(
        `${apiUrl}/api/sellers/orders/${orderId}/status`,
        { orderStatus: newStatus },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (response.data.success) {
        setMessage({ 
          type: "success", 
          text: response.data.message 
        });
        
        // Refresh the list
        await fetchOrders();
      }
    } catch (error) {
      console.error("Update order status error:", error);
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to update order status" 
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-800 border border-green-200";
      case "shipped": return "bg-blue-100 text-blue-800 border border-blue-200";
      case "confirmed": return "bg-purple-100 text-purple-800 border border-purple-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "cancelled": return "bg-red-100 text-red-800 border border-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center gap-2"
        >
          ↻ Refresh Orders
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl mb-6 ${
          message.type === "success" 
            ? "bg-green-50 border border-green-200 text-green-700" 
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border p-16 text-center">
          <div className="text-7xl mb-6">🛒</div>
          <h3 className="text-2xl font-semibold mb-3">No Orders Yet</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Orders placed by customers for your products will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-5 font-mono text-sm">#{order.orderNumber || order._id.slice(-8)}</td>
                    
                    <td className="px-6 py-5">
                      <div className="font-medium">{order.customerId?.name}</div>
                      <div className="text-xs text-gray-500">{order.customerId?.email}</div>
                    </td>

                    <td className="px-6 py-5 text-sm">
                      {order.products?.length || 0} item{(order.products?.length || 0) !== 1 ? 's' : ''}
                    </td>

                    <td className="px-6 py-5 font-semibold text-green-700">
                      ₹{order.totalAmount?.toFixed(2)}
                    </td>

                    <td className="px-6 py-5">
                      <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2 justify-end">
                        {order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled" && (
                          <>
                            {order.orderStatus === "Pending" && (
                              <button
                                onClick={() => updateOrderStatus(order._id, "Confirmed")}
                                disabled={actionLoading === order._id}
                                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-xl disabled:opacity-60 transition"
                              >
                                Confirm
                              </button>
                            )}

                            {(order.orderStatus === "Pending" || order.orderStatus === "Confirmed") && (
                              <button
                                onClick={() => updateOrderStatus(order._id, "Shipped")}
                                disabled={actionLoading === order._id}
                                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl disabled:opacity-60 transition"
                              >
                                Mark Shipped
                              </button>
                            )}

                            {order.orderStatus === "Shipped" && (
                              <button
                                onClick={() => updateOrderStatus(order._id, "Delivered")}
                                disabled={actionLoading === order._id}
                                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-xl disabled:opacity-60 transition"
                              >
                                Delivered
                              </button>
                            )}

                            <button
                              onClick={() => updateOrderStatus(order._id, "Cancelled")}
                              disabled={actionLoading === order._id}
                              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-xl disabled:opacity-60 transition"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
  // Profile Settings Component
  const ProfileSettings = () => {
    const [formData, setFormData] = useState({
      sellerName: seller?.sellerName || "",
      shopName: seller?.shopName || "",
      email: seller?.email || "",
      phone: seller?.phone || "",
      gst: seller?.gst || "",
      productType: seller?.productType || "",
      address: seller?.address || "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
      if (seller) {
        setFormData({
          sellerName: seller.sellerName || "",
          shopName: seller.shopName || "",
          email: seller.email || "",
          phone: seller.phone || "",
          gst: seller.gst || "",
          productType: seller.productType || "",
          address: seller.address || "",
        });
      }
    }, [seller]);

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage({ type: "", text: "" });

      try {
        const token = getAuthToken();
        const response = await axios.put(`${apiUrl}/api/sellers/profile`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        if (response.data.success) {
          setMessage({ type: "success", text: "Profile updated successfully!" });
          setSeller(response.data.seller);
        }
      } catch (error) {
        console.error("Update profile error:", error);
        setMessage({ 
          type: "error", 
          text: "Failed to update profile: " + (error.response?.data?.message || error.message) 
        });
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h2>

          {message.text && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.type === "success" 
                ? "bg-green-50 border border-green-200 text-green-700" 
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Seller Name *
                </label>
                <input
                  type="text"
                  name="sellerName"
                  value={formData.sellerName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Shop Name *
                </label>
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  GST Number *
                </label>
                <input
                  type="text"
                  name="gst"
                  value={formData.gst}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Type *
                </label>
                <input
                  type="text"
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your business address"
              />
            </div>

            <div className="pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Profile</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Main Render Function
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardStats />;
      case "products":
        return <ProductList />;
      case "add-product":
        return <AddProductForm />;
      case "orders":
        return <OrderManagement />;
      case "profile":
        return <ProfileSettings />;
      default:
        return <DashboardStats />;
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Main Dashboard Layout
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      
      <div className="flex-1 lg:ml-64">
        <DashboardHeader />
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default SellerDashboard;




 