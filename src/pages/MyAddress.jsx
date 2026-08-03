import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { State, City } from "country-state-city";

export default function AddressManagement() {

  const API = "http://localhost:5000/api"; // change to your backend URL

  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    type: "home",
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: "",
    isDefault: false
  });

  // ===============================
  // GET TOKEN WITH PROPER FORMAT
  // ===============================
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    // Check if token exists and format it properly
    if (!token) {
      return null;
    }
    // If token doesn't have 'Bearer ' prefix, add it
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  };

  // ===============================
  // CHECK AUTHENTICATION
  // ===============================
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  // ===============================
  // RESET FORM
  // ===============================

  const resetForm = () => {
    setFormData({
      type: "home",
      name: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      phone: "",
      isDefault: false
    });
    setSelectedState(null);
    setSelectedCity(null);
    setCities([]);
    setErrors({});
  };

  // ===============================
  // LOAD STATES
  // ===============================

  useEffect(() => {

    const indianStates = State.getStatesOfCountry("IN");

    const formatted = indianStates.map(s => ({
      value: s.isoCode,
      label: s.name
    }));

    setStates(formatted);

    // Check if user is authenticated
    if (!isAuthenticated()) {
      setAuthError("Please login to manage addresses");
    }

  }, []);

  // ===============================
  // FETCH ADDRESSES
  // ===============================

  const fetchAddresses = async () => {

    const authHeader = getAuthHeader();
    
    if (!authHeader) {
      setAuthError("Please login to view addresses");
      setLoading(false);
      return;
    }

    setLoading(true);
    setAuthError("");

    try {

      const res = await axios.get(`${API}/addresses`, {
        headers: {
          Authorization: authHeader
        }
      });

      setAddresses(res.data.addresses);

    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setAuthError("Your session has expired. Please login again.");
        // Optional: Redirect to login
        // window.location.href = "/login";
      } else {
        setAuthError("Failed to fetch addresses");
      }
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    if (isAuthenticated()) {
      fetchAddresses();
    }
  }, []);

  // ===============================
  // VALIDATE FORM
  // ===============================

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.street.trim()) newErrors.street = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "Pincode is required";
    if (formData.zipCode.length !== 6) newErrors.zipCode = "Pincode must be 6 digits";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (formData.phone.length !== 10) newErrors.phone = "Phone number must be 10 digits";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===============================
  // STATE CHANGE
  // ===============================

  const handleStateChange = (state) => {

    setSelectedState(state);

    const cityList = City.getCitiesOfState("IN", state.value);

    const formattedCities = cityList.map(c => ({
      value: c.name,
      label: c.name
    }));

    setCities(formattedCities);
    setSelectedCity(null);

    setFormData(prev => ({
      ...prev,
      state: state.label,
      city: "" // Reset city when state changes
    }));

    // Clear city error if exists
    if (errors.city) {
      setErrors(prev => ({ ...prev, city: undefined }));
    }

  };

  // ===============================
  // CITY CHANGE
  // ===============================

  const handleCityChange = (city) => {

    setSelectedCity(city);

    setFormData(prev => ({
      ...prev,
      city: city.label
    }));

    // Clear city error if exists
    if (errors.city) {
      setErrors(prev => ({ ...prev, city: undefined }));
    }

  };

  // ===============================
  // PINCODE AUTO DETECT
  // ===============================

  const handlePincodeChange = async (e) => {

    const pin = e.target.value;

    // Only allow numbers
    if (pin && !/^\d+$/.test(pin)) return;

    setFormData(prev => ({
      ...prev,
      zipCode: pin
    }));

    // Clear pincode error
    if (errors.zipCode) {
      setErrors(prev => ({ ...prev, zipCode: undefined }));
    }

    if (pin.length === 6) {

      try {

        const res = await axios.get(
          `https://api.postalpincode.in/pincode/${pin}`
        );

        const data = res.data[0];

        if (data.Status === "Success") {

          const po = data.PostOffice[0];

          setFormData(prev => ({
            ...prev,
            city: po.District,
            state: po.State
          }));

          // Find and set state in dropdown
          const stateOption = states.find(s => s.label === po.State);
          if (stateOption) {
            setSelectedState(stateOption);
            
            // Load cities for this state
            const cityList = City.getCitiesOfState("IN", stateOption.value);
            const formattedCities = cityList.map(c => ({
              value: c.name,
              label: c.name
            }));
            setCities(formattedCities);
            
            // Find and set city in dropdown
            const cityOption = formattedCities.find(c => c.label === po.District);
            if (cityOption) {
              setSelectedCity(cityOption);
            }
          }

        }

      } catch (err) {
        console.log("Invalid pincode");
      }

    }

  };

  // ===============================
  // INPUT CHANGE
  // ===============================

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

  };

  // ===============================
  // SUBMIT
  // ===============================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) return;

    const authHeader = getAuthHeader();
    
    if (!authHeader) {
      setAuthError("Please login to save addresses");
      return;
    }

    setSubmitting(true);
    setAuthError("");

    try {

      const config = {
        headers: { 
          Authorization: authHeader,
          'Content-Type': 'application/json'
        }
      };

      if (editingId) {

        await axios.put(
          `${API}/addresses/${editingId}`,
          formData,
          config
        );

      } else {

        await axios.post(
          `${API}/addresses`,
          formData,
          config
        );

      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchAddresses();

    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setAuthError("Your session has expired. Please login again.");
      } else {
        alert(err.response?.data?.message || "Error saving address");
      }
    } finally {
      setSubmitting(false);
    }

  };

  // ===============================
  // DELETE
  // ===============================

  const deleteAddress = async (id) => {

    if (!window.confirm("Are you sure you want to delete this address?")) return;

    const authHeader = getAuthHeader();
    
    if (!authHeader) {
      setAuthError("Please login to delete addresses");
      return;
    }

    try {

      await axios.delete(`${API}/addresses/${id}`, {
        headers: { Authorization: authHeader }
      });

      fetchAddresses();

    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setAuthError("Your session has expired. Please login again.");
      } else {
        alert(err.response?.data?.message || "Error deleting address");
      }
    }

  };

  // ===============================
  // SET DEFAULT
  // ===============================

  const setDefault = async (id) => {

    const authHeader = getAuthHeader();
    
    if (!authHeader) {
      setAuthError("Please login to set default address");
      return;
    }

    try {

      await axios.patch(
        `${API}/addresses/default/${id}`,
        {},
        { headers: { Authorization: authHeader } }
      );

      fetchAddresses();

    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setAuthError("Your session has expired. Please login again.");
      } else {
        alert(err.response?.data?.message || "Error setting default address");
      }
    }

  };

  // ===============================
  // EDIT ADDRESS
  // ===============================

  const editAddress = (addr) => {
    setEditingId(addr._id);
    setFormData(addr);
    
    // Set state in dropdown
    const stateOption = states.find(s => s.label === addr.state);
    if (stateOption) {
      setSelectedState(stateOption);
      
      // Load cities for this state
      const cityList = City.getCitiesOfState("IN", stateOption.value);
      const formattedCities = cityList.map(c => ({
        value: c.name,
        label: c.name
      }));
      setCities(formattedCities);
      
      // Set city in dropdown
      const cityOption = formattedCities.find(c => c.label === addr.city);
      if (cityOption) {
        setSelectedCity(cityOption);
      }
    }
    
    setShowForm(true);
  };

  // ===============================
  // LOGIN REDIRECT
  // ===============================

  const goToLogin = () => {
    window.location.href = "/login"; // Adjust this to your login route
  };

  return (

    <div className="max-w-5xl mx-auto p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">My Addresses</h2>

        {isAuthenticated() ? (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Add New Address
          </button>
        ) : (
          <button
            onClick={goToLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Login to Manage Addresses
          </button>
        )}

      </div>

      {/* AUTH ERROR */}

      {authError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{authError}</p>
          {authError.includes("login") && (
            <button 
              onClick={goToLogin}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Go to Login
            </button>
          )}
        </div>
      )}

      {/* LOADING STATE */}

      {loading && (
        <div className="text-center py-8">
          <p>Loading addresses...</p>
        </div>
      )}

      {/* ADDRESS LIST */}

      {!loading && isAuthenticated() && addresses.length === 0 && (
        <div className="text-center py-8 border rounded bg-gray-50">
          <p className="text-gray-600">No addresses found. Add your first address!</p>
        </div>
      )}

      {!loading && !isAuthenticated() && (
        <div className="text-center py-8 border rounded bg-gray-50">
          <p className="text-gray-600">Please login to view your addresses</p>
        </div>
      )}

      {addresses.map(addr => (

        <div
          key={addr._id}
          className="border p-4 mb-4 rounded flex justify-between hover:shadow-md transition"
        >

          <div>

            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-lg">{addr.name}</p>
              {addr.type && (
                <span className="text-xs bg-gray-200 px-2 py-1 rounded capitalize">
                  {addr.type}
                </span>
              )}
            </div>

            <p className="text-gray-700">{addr.street}</p>
            <p className="text-gray-700">{addr.city}, {addr.state} - {addr.zipCode}</p>
            <p className="text-gray-700">Phone: {addr.phone}</p>

            {addr.isDefault && (
              <span className="inline-block mt-2 text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded">
                ✓ Default Address
              </span>
            )}

          </div>

          <div className="flex flex-col gap-2">

            {!addr.isDefault && (
              <button 
                onClick={() => setDefault(addr._id)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Set as Default
              </button>
            )}

            <button
              onClick={() => editAddress(addr)}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              Edit
            </button>

            <button
              onClick={() => deleteAddress(addr._id)}
              className="text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Delete
            </button>

          </div>

        </div>

      ))}

      {/* FORM MODAL - Only show if authenticated */}

      {showForm && isAuthenticated() && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            
            <div className="p-6">
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {editingId ? "Edit Address" : "Add New Address"}
                </h3>
                <button 
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Address Type */}
                <div>
                  <label className="block text-sm font-medium mb-1">Address Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input
                    name="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-sm font-medium mb-1">Street Address *</label>
                  <input
                    name="street"
                    placeholder="Enter street address"
                    value={formData.street}
                    onChange={handleChange}
                    className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.street ? "border-red-500" : ""
                    }`}
                  />
                  {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <Select
                    options={states}
                    value={selectedState}
                    onChange={handleStateChange}
                    placeholder="Search and select state"
                    className={errors.state ? "border-red-500" : ""}
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <Select
                    options={cities}
                    value={selectedCity}
                    onChange={handleCityChange}
                    placeholder={selectedState ? "Search and select city" : "Select state first"}
                    isDisabled={!selectedState}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-medium mb-1">Pincode *</label>
                  <input
                    name="zipCode"
                    placeholder="Enter 6-digit pincode"
                    value={formData.zipCode}
                    onChange={handlePincodeChange}
                    maxLength="6"
                    className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.zipCode ? "border-red-500" : ""
                    }`}
                  />
                  {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number *</label>
                  <input
                    name="phone"
                    placeholder="Enter 10-digit phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="10"
                    className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Country (disabled) */}
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <input
                    value="India"
                    disabled
                    className="w-full border p-2 rounded bg-gray-100"
                  />
                </div>

                {/* Default Address Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Set as default address</span>
                </label>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Saving..." : (editingId ? "Update Address" : "Save Address")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>

              </form>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}