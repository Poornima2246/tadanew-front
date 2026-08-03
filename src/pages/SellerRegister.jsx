import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SellerRegister() {
  const [form, setForm] = useState({
    sellerName: "",
    shopName: "",
    phone: "",
    email: "",
    gst: "",
    productType: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(" https://tadanew-bac.onrender.com/api/sellers/register", form);
      
      setMessage(response.data.message);
      
      // Reset form
      setForm({
        sellerName: "",
        shopName: "",
        phone: "",
        email: "",
        gst: "",
        productType: "",
      });

      // Navigate to login after 2 seconds
      setTimeout(() => navigate("/seller/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-2xl p-10 rounded-2xl w-full max-w-lg"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Seller Registration
        </h2>

        {/* Seller Name */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">
            Seller Name
          </label>
          <input
            type="text"
            name="sellerName"
            placeholder="Enter your full name"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={form.sellerName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Shop Name */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">
            Shop Name
          </label>
          <input
            type="text"
            name="shopName"
            placeholder="Enter your shop name"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={form.shopName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter contact number"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* GST */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">
            GST Number
          </label>
          <input
            type="text"
            name="gst"
            placeholder="Enter GST number"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={form.gst}
            onChange={handleChange}
            required
          />
        </div>

        {/* Product Type */}
        <div className="mb-6">
          <label className="block mb-1 font-semibold text-gray-700">
            Products You Want to Sell
          </label>
          <select
            name="productType"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={form.productType}
            onChange={handleChange}
            required
          >
            <option value="">Select Product Category</option>
            <option value="clothing">Clothing</option>
            <option value="electronics">Electronics</option>
            <option value="groceries">Groceries</option>
            <option value="furniture">Furniture</option>
            <option value="jaggery">Jaggery Products</option>
            <option value="others">Others</option>
          </select>
        </div>

        {/* Submit */}
        <button 
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 w-full rounded-lg font-semibold transition duration-200 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {message && (
          <p className={`mt-4 text-center text-sm font-medium ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}