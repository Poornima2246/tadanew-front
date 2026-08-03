 



//  import React, { useState, useEffect } from "react";
// import { useCart } from "../context/CartContext";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast, Toaster } from "react-hot-toast";



// // Hardcoded API URL - Change this to your actual backend URL
// const API_URL = "http://localhost:5000";

// // Razorpay script loader
// const loadRazorpayScript = () => {
//   return new Promise((resolve) => {
//     if (window.Razorpay) {
//       resolve(true);
//       return;
//     }
   
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => resolve(true);
//     script.onerror = () => {
//       console.error("Failed to load Razorpay script");
//       resolve(false);
//     };
//     document.body.appendChild(script);
//   });
// };

// const Cart = () => {
//   const navigate = useNavigate();
 
//   const {
//     cartItems,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     cartTotal,
//     cartCount
//   } = useCart();
  
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState("razorpay");
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
 
//   // Address Management States
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [showAddressForm, setShowAddressForm] = useState(false);
//   const [editingAddress, setEditingAddress] = useState(null);
//   const [addressLoading, setAddressLoading] = useState(false);
//   const [showSavedAddresses, setShowSavedAddresses] = useState(true);
//   const [expandedAddressId, setExpandedAddressId] = useState(null); // Track which address is expanded
//   const [addressFormData, setAddressFormData] = useState({
//     type: "home",
//     name: "",
//     street: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     country: "India",
//     phone: "",
//     isDefault: false
//   });

//   // Check if user is logged in
//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         setIsAuthenticated(true);
//         await fetchUserProfile(token);
//         await fetchAddresses();
//       } else {
//         setIsAuthenticated(false);
//         setLoading(false);
//       }
//     };
   
//     checkAuth();
//   }, []);

//   const fetchUserProfile = async (token) => {
//     try {
//       const response = await axios.get(`${API_URL}/api/users/profile`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (response.data.success) {
//         setUser(response.data.user);
//       }
//     } catch (error) {
//       console.error("Error fetching user profile:", error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem("token");
//         setIsAuthenticated(false);
//         toast.error("Session expired. Please login again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch saved addresses
//   const fetchAddresses = async () => {
//     try {
//       setAddressLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${API_URL}/api/addresses`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
     
//       if (response.data.success) {
//         setAddresses(response.data.addresses);
       
//         // Auto-select default address if exists
//         const defaultAddress = response.data.addresses.find(addr => addr.isDefault);
//         if (defaultAddress) {
//           setSelectedAddress(defaultAddress);
//         } else if (response.data.addresses.length > 0) {
//           setSelectedAddress(response.data.addresses[0]);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching addresses:", error);
//       toast.error("Failed to load addresses");
//     } finally {
//       setAddressLoading(false);
//     }
//   };

//   // Address Form Handlers
//   const handleAddressInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setAddressFormData(prev => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value
//     }));
//   };

//   const resetAddressForm = () => {
//     setAddressFormData({
//       type: "home",
//       name: "",
//       street: "",
//       city: "",
//       state: "",
//       zipCode: "",
//       country: "India",
//       phone: "",
//       isDefault: false
//     });
//     setEditingAddress(null);
//     setShowAddressForm(false);
//     setShowSavedAddresses(true);
//   };

//   const handleSaveAddress = async (e) => {
//     e.preventDefault();
   
//     // Validation
//     if (!addressFormData.name || !addressFormData.street || !addressFormData.city ||
//         !addressFormData.zipCode || !addressFormData.phone) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     // Phone number validation
//     const phoneRegex = /^[0-9]{10}$/;
//     if (!phoneRegex.test(addressFormData.phone)) {
//       toast.error("Please enter a valid 10-digit phone number");
//       return;
//     }

//     // Zip code validation
//     const zipRegex = /^[0-9]{6}$/;
//     if (!zipRegex.test(addressFormData.zipCode)) {
//       toast.error("Please enter a valid 6-digit ZIP code");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       let response;
     
//       if (editingAddress) {
//         response = await axios.put(`${API_URL}/api/addresses/${editingAddress._id}`, addressFormData, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         toast.success("Address updated successfully!");
//       } else {
//         response = await axios.post(`${API_URL}/api/addresses`, addressFormData, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         toast.success("Address added successfully!");
//       }
     
//       if (response.data.success) {
//         await fetchAddresses();
//         resetAddressForm();
//       }
//     } catch (error) {
//       console.error("Error saving address:", error);
//       toast.error(error.response?.data?.message || "Failed to save address");
//     }
//   };

//   const handleEditAddress = (address) => {
//     setEditingAddress(address);
//     setAddressFormData({
//       type: address.type,
//       name: address.name,
//       street: address.street,
//       city: address.city,
//       state: address.state || "",
//       zipCode: address.zipCode,
//       country: address.country || "India",
//       phone: address.phone,
//       isDefault: address.isDefault
//     });
//     setShowAddressForm(true);
//     setShowSavedAddresses(false);
//     setExpandedAddressId(null);
//   };

//   const handleDeleteAddress = async (addressId) => {
//     if (window.confirm("Are you sure you want to delete this address?")) {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.delete(`${API_URL}/api/addresses/${addressId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
       
//         if (response.data.success) {
//           await fetchAddresses();
//           if (selectedAddress?._id === addressId) {
//             setSelectedAddress(null);
//           }
//           toast.success("Address deleted successfully");
//         }
//       } catch (error) {
//         console.error("Error deleting address:", error);
//         toast.error(error.response?.data?.message || "Failed to delete address");
//       }
//     }
//   };

//   const handleSetDefaultAddress = async (addressId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.patch(`${API_URL}/api/addresses/default/${addressId}`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
     
//       if (response.data.success) {
//         await fetchAddresses();
//         toast.success("Default address updated successfully");
//       }
//     } catch (error) {
//       console.error("Error setting default address:", error);
//       toast.error(error.response?.data?.message || "Failed to set default address");
//     }
//   };

//   // Toggle address expansion
//   const toggleAddressExpand = (addressId) => {
//     if (expandedAddressId === addressId) {
//       setExpandedAddressId(null);
//     } else {
//       setExpandedAddressId(addressId);
//     }
//   };

//   // Handle quantity increase
//   const handleIncreaseQuantity = (productId) => {
//     updateQuantity(productId, 1);
//     toast.success("Quantity updated");
//   };

//   // Handle quantity decrease
//   const handleDecreaseQuantity = (productId) => {
//     updateQuantity(productId, -1);
//     toast.success("Quantity updated");
//   };

//   // Handle remove item
//   const handleRemoveItem = (productId, productName) => {
//     if (window.confirm(`Remove ${productName} from cart?`)) {
//       removeFromCart(productId);
//       toast.success(`${productName} removed from cart`);
//     }
//   };

//   // Handle clear cart
//   const handleClearCart = () => {
//     if (window.confirm("Are you sure you want to clear your entire cart?")) {
//       clearCart();
//       toast.success("Cart cleared successfully");
//     }
//   };

//   // Calculate final amount
//   const shippingCost = cartTotal >= 500 ? 0 : 50;
//   const taxAmount = cartTotal * 0.05;
//   const finalAmount = cartTotal + shippingCost + taxAmount;

//   // Handle Razorpay Payment
//   const handleRazorpayPayment = async () => {
//     if (!selectedAddress) {
//       toast.error("Please select a shipping address");
//       setShowSavedAddresses(true);
//       return;
//     }

//     try {
//       setIsProcessing(true);
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login", { state: { from: "/cart" } });
//         return;
//       }

//       const scriptLoaded = await loadRazorpayScript();
//       if (!scriptLoaded) {
//         toast.error("Failed to load payment gateway. Please try again.");
//         setIsProcessing(false);
//         return;
//       }

//       const response = await axios.post(
//         `${API_URL}/api/payments/create-order`,
//         {
//           amount: finalAmount,
//           currency: "INR"
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );

//       if (!response.data.success) {
//         throw new Error(response.data.message || "Failed to create order");
//       }

//       const { order, key } = response.data;
//       const orderItems = cartItems.map(item => ({
//         id: item.id,
//         name: item.name,
//         price: item.price,
//         quantity: item.quantity,
//         image: item.image
//       }));

//       const options = {
//         key: key,
//         amount: order.amount,
//         currency: order.currency,
//         name: "Jaggery Shop",
//         description: `Payment for ${cartCount} items`,
//         image: "https://via.placeholder.com/150x50/4CAF50/white?text=Jaggery+Shop",
//         order_id: order.id,
//         handler: async (paymentResponse) => {
//           try {
//             const verifyResponse = await axios.post(
//               `${API_URL}/api/payments/verify`,
//               {
//                 razorpay_payment_id: paymentResponse.razorpay_payment_id,
//                 razorpay_order_id: paymentResponse.razorpay_order_id,
//                 razorpay_signature: paymentResponse.razorpay_signature,
//                 orderData: {
//                   items: orderItems,
//                   shippingAddress: selectedAddress,
//                   totalAmount: finalAmount,
//                   paymentMethod: "Razorpay"
//                 }
//               },
//               {
//                 headers: { Authorization: `Bearer ${token}` }
//               }
//             );

//             if (verifyResponse.data.success) {
//               toast.success("Payment successful! Your order has been placed.");
//               clearCart();
//               navigate("/orders");
//             } else {
//               toast.error("Payment verification failed. Please contact support.");
//             }
//           } catch (error) {
//             console.error("Payment verification error:", error);
//             toast.error(error.response?.data?.message || "Payment verification failed.");
//           } finally {
//             setIsProcessing(false);
//           }
//         },
//         prefill: {
//           name: selectedAddress.name,
//           email: user?.email || "",
//           contact: selectedAddress.phone
//         },
//         notes: {
//           address: `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.zipCode}`
//         },
//         theme: {
//           color: "#4CAF50"
//         },
//         modal: {
//           ondismiss: () => {
//             setIsProcessing(false);
//           }
//         }
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (error) {
//       console.error("Payment error:", error);
//       toast.error(error.response?.data?.message || "Payment failed. Please try again.");
//       setIsProcessing(false);
//     }
//   };

//   // Handle Cash on Delivery
//   const handleCOD = async () => {
//     if (!selectedAddress) {
//       toast.error("Please select a shipping address");
//       setShowSavedAddresses(true);
//       return;
//     }

//     try {
//       setIsProcessing(true);
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login", { state: { from: "/cart" } });
//         return;
//       }

//       const orderItems = cartItems.map(item => ({
//         id: item.id,
//         name: item.name,
//         price: item.price,
//         quantity: item.quantity,
//         image: item.image
//       }));

//       const response = await axios.post(
//         `${API_URL}/api/orders/create-cod`,
//         {
//           items: orderItems,
//           shippingAddress: selectedAddress,
//           totalAmount: finalAmount,
//           paymentMethod: "Cash on Delivery"
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );

//       if (response.data.success) {
//         toast.success("Order placed successfully! You can pay cash upon delivery.");
//         clearCart();
//         navigate("/orders");
//       } else {
//         toast.error(response.data.message || "Failed to place order");
//       }
//     } catch (error) {
//       console.error("COD order error:", error);
//       toast.error(error.response?.data?.message || "Failed to place order");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handlePayment = () => {
//     if (!isAuthenticated) {
//       navigate("/login", { state: { from: "/cart" } });
//       return;
//     }

//     if (!selectedAddress) {
//       toast.error("Please select a shipping address");
//       setShowSavedAddresses(true);
//       return;
//     }

//     if (paymentMethod === "razorpay") {
//       handleRazorpayPayment();
//     } else if (paymentMethod === "cod") {
//       handleCOD();
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-[60vh] flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading cart...</p>
//         </div>
//       </div>
//     );
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-[60vh] flex items-center justify-center">
//         <Toaster position="top-right" reverseOrder={false} />
//         <div className="text-center max-w-md p-8 animate-fade-in">
//           <div className="bg-gray-50 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
//             <svg
//               className="w-16 h-16 text-gray-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//               />
//             </svg>
//           </div>
//           <h2 className="text-3xl font-semibold text-gray-800 mb-4">Your Cart is Empty</h2>
//           <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
//           <Link
//             to="/products"
//             className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg"
//           >
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//             </svg>
//             Start Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen py-8">
//       <Toaster position="top-right" reverseOrder={false} />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//             <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//             </svg>
//             Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
//           </h1>
//           <p className="text-gray-600 mt-2">Review and modify your items before checkout</p>
//         </div>
       
//         <div className="lg:grid lg:grid-cols-3 lg:gap-8">
//           {/* Cart Items Section */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//               {/* Desktop Header */}
//               <div className="hidden lg:grid lg:grid-cols-12 gap-4 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-200">
//                 <div className="col-span-6">Product Details</div>
//                 <div className="col-span-2 text-center">Price</div>
//                 <div className="col-span-2 text-center">Quantity</div>
//                 <div className="col-span-1 text-center">Total</div>
//                 <div className="col-span-1"></div>
//               </div>
              
//               {/* Cart Items */}
//               <div className="divide-y divide-gray-100">
//                 {cartItems.map((item) => (
//                   <div key={item.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200">
//                     {/* Mobile Layout */}
//                     <div className="lg:hidden">
//                       <div className="flex gap-4 mb-4">
//                         <div className="relative">
//                           <img
//                             src={item.image || "https://via.placeholder.com/300x300/4CAF50/white?text=No+Image"}
//                             alt={item.name}
//                             className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
//                             onError={(e) => {
//                               e.target.src = "https://via.placeholder.com/300x300/4CAF50/white?text=No+Image";
//                             }}
//                           />
//                           {item.stock && item.stock <= 5 && (
//                             <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
//                               Low Stock
//                             </span>
//                           )}
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
//                           <p className="text-sm text-gray-600 mb-2">{item.category || "Jaggery Product"}</p>
//                           {item.stock && (
//                             <p className={`text-xs font-medium ${
//                               item.stock > 5 ? 'text-green-600' : 'text-orange-600'
//                             }`}>
//                               {item.stock > 5 ? '✓ In Stock' : `⚠️ Only ${item.stock} left`}
//                             </p>
//                           )}
//                         </div>
//                       </div>
                     
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <p className="text-xs text-gray-500 mb-1">Price</p>
//                           <p className="text-lg font-bold text-gray-900">₹{item.price?.toFixed(2) || "0.00"}</p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-500 mb-1">Quantity</p>
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() => handleDecreaseQuantity(item.id)}
//                               disabled={item.quantity <= 1}
//                               className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                             >
//                               -
//                             </button>
//                             <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
//                             <button
//                               onClick={() => handleIncreaseQuantity(item.id)}
//                               disabled={item.stock && item.quantity >= item.stock}
//                               className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                             >
//                               +
//                             </button>
//                           </div>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-500 mb-1">Total</p>
//                           <p className="text-lg font-bold text-green-600">
//                             ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
//                           </p>
//                         </div>
//                         <div className="flex justify-end items-end">
//                           <button
//                             onClick={() => handleRemoveItem(item.id, item.name)}
//                             className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
//                           >
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                             </svg>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
                    
//                     {/* Desktop Layout */}
//                     <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">
//                       <div className="col-span-6 flex items-center gap-4">
//                         <div className="relative">
//                           <img
//                             src={item.image || "https://via.placeholder.com/300x300/4CAF50/white?text=No+Image"}
//                             alt={item.name}
//                             className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
//                             onError={(e) => {
//                               e.target.src = "https://via.placeholder.com/300x300/4CAF50/white?text=No+Image";
//                             }}
//                           />
//                           {item.stock && item.stock <= 5 && (
//                             <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
//                               Low Stock
//                             </span>
//                           )}
//                         </div>
//                         <div>
//                           <h3 className="font-semibold text-gray-800 hover:text-green-600 transition-colors">
//                             {item.name}
//                           </h3>
//                           <p className="text-sm text-gray-600">{item.category || "Jaggery Product"}</p>
//                           {item.stock && (
//                             <p className={`text-xs font-medium mt-1 ${
//                               item.stock > 5 ? 'text-green-600' : 'text-orange-600'
//                             }`}>
//                               {item.stock > 5 ? '✓ In Stock' : `⚠️ Only ${item.stock} left`}
//                             </p>
//                           )}
//                         </div>
//                       </div>
                     
//                       <div className="col-span-2 text-center">
//                         <span className="font-semibold text-gray-900">₹{item.price?.toFixed(2) || "0.00"}</span>
//                       </div>
                      
//                       <div className="col-span-2">
//                         <div className="flex items-center justify-center gap-2">
//                           <button
//                             onClick={() => handleDecreaseQuantity(item.id)}
//                             disabled={item.quantity <= 1}
//                             className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                           >
//                             -
//                           </button>
//                           <span className="w-10 text-center font-semibold text-gray-800">{item.quantity}</span>
//                           <button
//                             onClick={() => handleIncreaseQuantity(item.id)}
//                             disabled={item.stock && item.quantity >= item.stock}
//                             className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                           >
//                             +
//                           </button>
//                         </div>
//                       </div>
                      
//                       <div className="col-span-1 text-center">
//                         <span className="font-bold text-green-600">₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
//                       </div>
                      
//                       <div className="col-span-1 text-right">
//                         <button
//                           onClick={() => handleRemoveItem(item.id, item.name)}
//                           className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
//                           title="Remove item"
//                         >
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               {/* Cart Actions */}
//               <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-200">
//                 <button
//                   onClick={handleClearCart}
//                   className="w-full sm:w-auto px-6 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200 font-medium flex items-center justify-center gap-2"
//                 >
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                   </svg>
//                   Clear Cart
//                 </button>
//                 <Link
//                   to="/products"
//                   className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-center rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-sm"
//                 >
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                   </svg>
//                   Continue Shopping
//                 </Link>
//               </div>
//             </div>
//           </div>
          
//           {/* Order Summary Section */}
//           <div className="lg:col-span-1 mt-8 lg:mt-0">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
//               <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200 flex items-center gap-2">
//                 <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//                 Order Summary
//               </h2>
             
//               {/* Login Reminder */}
//               {!isAuthenticated && (
//                 <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
//                   <p className="text-sm text-yellow-800 text-center">
//                     🔐 Please <Link to="/login" className="font-bold underline hover:text-yellow-900">login</Link> to checkout
//                   </p>
//                 </div>
//               )}
              
//               {/* Shipping Address Section */}
//               {isAuthenticated && (
//                 <div className="mb-6">
//                   <div className="flex justify-between items-center mb-3">
//                     <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                       <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                       </svg>
//                       Shipping Address
//                     </h3>
//                     <button
//                       onClick={() => {
//                         resetAddressForm();
//                         setShowSavedAddresses(!showSavedAddresses);
//                         setShowAddressForm(false);
//                       }}
//                       className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
//                     >
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                       </svg>
//                       {showSavedAddresses ? "Add New" : "Back"}
//                     </button>
//                   </div>
                  
//                   {/* Saved Addresses List */}
//                   {showSavedAddresses && !showAddressForm && (
//                     <>
//                       {addressLoading ? (
//                         <div className="text-center py-4">
//                           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
//                         </div>
//                       ) : addresses.length === 0 ? (
//                         <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
//                           <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                           </svg>
//                           <p className="text-gray-500 text-sm mb-3">No saved addresses</p>
//                           <button
//                             onClick={() => {
//                               resetAddressForm();
//                               setShowSavedAddresses(false);
//                               setShowAddressForm(true);
//                             }}
//                             className="text-sm text-green-600 hover:text-green-700 font-medium"
//                           >
//                             Add your first address
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
//                           {addresses.map((address) => (
//                             <div
//                               key={address._id}
//                               className={`border-2 rounded-lg transition-all duration-200 ${
//                                 selectedAddress?._id === address._id
//                                   ? "border-green-500 bg-gradient-to-r from-green-50 to-white"
//                                   : "border-gray-200 hover:border-green-300"
//                               }`}
//                             >
//                               {/* Address Header - Always Visible */}
//                               <div 
//                                 className="p-3 cursor-pointer"
//                                 onClick={() => toggleAddressExpand(address._id)}
//                               >
//                                 <div className="flex justify-between items-center">
//                                   <div className="flex items-center gap-2 flex-1">
//                                     {/* Radio button for selection */}
//                                     <input
//                                       type="radio"
//                                       name="selectedAddress"
//                                       checked={selectedAddress?._id === address._id}
//                                       onChange={() => setSelectedAddress(address)}
//                                       onClick={(e) => e.stopPropagation()}
//                                       className="text-green-600 focus:ring-green-500 w-4 h-4"
//                                     />
                                    
//                                     <div className="flex-1">
//                                       <div className="flex items-center gap-2 flex-wrap">
//                                         <span className="text-sm font-semibold text-gray-900">
//                                           {address.name}
//                                         </span>
//                                         {address.isDefault && (
//                                           <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
//                                             Default
//                                           </span>
//                                         )}
//                                         <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
//                                           {address.type === "home" ? "🏠 Home" : address.type === "office" ? "💼 Office" : "📍 Other"}
//                                         </span>
//                                       </div>
//                                       {/* Show only city and zip in collapsed view */}
//                                       <p className="text-xs text-gray-500 mt-1">
//                                         {address.city}, {address.zipCode}
//                                       </p>
//                                     </div>
                                    
//                                     {/* Expand/Collapse Icon */}
//                                     <div className="flex items-center gap-2">
//                                       <svg 
//                                         className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
//                                           expandedAddressId === address._id ? 'rotate-180' : ''
//                                         }`}
//                                         fill="none" 
//                                         stroke="currentColor" 
//                                         viewBox="0 0 24 24"
//                                       >
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                                       </svg>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
                              
//                               {/* Expanded Address Details */}
//                               {expandedAddressId === address._id && (
//                                 <div className="px-3 pb-3 pt-0 border-t border-gray-100 mt-2 animate-slide-down">
//                                   <div className="bg-gray-50 rounded-lg p-3 space-y-2">
//                                     <p className="text-sm text-gray-700">
//                                       <span className="font-medium">Street:</span> {address.street}
//                                     </p>
//                                     <p className="text-sm text-gray-700">
//                                       <span className="font-medium">City:</span> {address.city}
//                                     </p>
//                                     {address.state && (
//                                       <p className="text-sm text-gray-700">
//                                         <span className="font-medium">State:</span> {address.state}
//                                       </p>
//                                     )}
//                                     <p className="text-sm text-gray-700">
//                                       <span className="font-medium">ZIP Code:</span> {address.zipCode}
//                                     </p>
//                                     <p className="text-sm text-gray-700">
//                                       <span className="font-medium">Country:</span> {address.country}
//                                     </p>
//                                     <p className="text-sm text-gray-700">
//                                       <span className="font-medium">Phone:</span> {address.phone}
//                                     </p>
                                    
//                                     {/* Action Buttons */}
//                                     <div className="flex gap-2 pt-2">
//                                       <button
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           handleEditAddress(address);
//                                         }}
//                                         className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium py-1 px-2 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
//                                       >
//                                         Edit
//                                       </button>
//                                       <button
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           handleDeleteAddress(address._id);
//                                         }}
//                                         className="flex-1 text-red-600 hover:text-red-700 text-sm font-medium py-1 px-2 border border-red-200 rounded hover:bg-red-50 transition-colors"
//                                       >
//                                         Delete
//                                       </button>
//                                       {!address.isDefault && (
//                                         <button
//                                           onClick={(e) => {
//                                             e.stopPropagation();
//                                             handleSetDefaultAddress(address._id);
//                                           }}
//                                           className="flex-1 text-green-600 hover:text-green-700 text-sm font-medium py-1 px-2 border border-green-200 rounded hover:bg-green-50 transition-colors"
//                                         >
//                                           Set Default
//                                         </button>
//                                       )}
//                                     </div>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </>
//                   )}
                  
//                   {/* Add/Edit Address Form */}
//                   {(showAddressForm || (!showSavedAddresses && !showAddressForm && addresses.length === 0)) && (
//                     <form onSubmit={handleSaveAddress} className="space-y-3 mt-3">
//                       <div className="grid grid-cols-2 gap-2">
//                         <select
//                           name="type"
//                           value={addressFormData.type}
//                           onChange={handleAddressInputChange}
//                           className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                         >
//                           <option value="home">🏠 Home</option>
//                           <option value="office">💼 Office</option>
//                           <option value="other">📍 Other</option>
//                         </select>
//                         <label className="flex items-center gap-2 text-sm">
//                           <input
//                             type="checkbox"
//                             name="isDefault"
//                             checked={addressFormData.isDefault}
//                             onChange={handleAddressInputChange}
//                             className="text-green-600 focus:ring-green-500 rounded"
//                           />
//                           <span className="text-gray-700">Set as default</span>
//                         </label>
//                       </div>
                     
//                       <input
//                         type="text"
//                         name="name"
//                         placeholder="Full Name *"
//                         value={addressFormData.name}
//                         onChange={handleAddressInputChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                         required
//                       />
                     
//                       <input
//                         type="text"
//                         name="street"
//                         placeholder="Street Address *"
//                         value={addressFormData.street}
//                         onChange={handleAddressInputChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                         required
//                       />
                     
//                       <div className="grid grid-cols-2 gap-2">
//                         <input
//                           type="text"
//                           name="city"
//                           placeholder="City *"
//                           value={addressFormData.city}
//                           onChange={handleAddressInputChange}
//                           className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                           required
//                         />
//                         <input
//                           type="text"
//                           name="state"
//                           placeholder="State"
//                           value={addressFormData.state}
//                           onChange={handleAddressInputChange}
//                           className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                         />
//                       </div>
                     
//                       <div className="grid grid-cols-2 gap-2">
//                         <input
//                           type="text"
//                           name="zipCode"
//                           placeholder="ZIP Code *"
//                           value={addressFormData.zipCode}
//                           onChange={handleAddressInputChange}
//                           className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                           required
//                         />
//                         <input
//                           type="text"
//                           name="country"
//                           placeholder="Country"
//                           value={addressFormData.country}
//                           onChange={handleAddressInputChange}
//                           className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                         />
//                       </div>
                     
//                       <input
//                         type="tel"
//                         name="phone"
//                         placeholder="Phone Number *"
//                         value={addressFormData.phone}
//                         onChange={handleAddressInputChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                         required
//                       />
                     
//                       <div className="flex gap-2">
//                         <button
//                           type="submit"
//                           className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 transition-all"
//                         >
//                           {editingAddress ? "Update Address" : "Save Address"}
//                         </button>
//                         <button
//                           type="button"
//                           onClick={resetAddressForm}
//                           className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </form>
//                   )}
                  
//                   {/* Selected Address Display */}
//                   {selectedAddress && !showAddressForm && showSavedAddresses && (
//                     <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-white border border-green-200 rounded-lg">
//                       <p className="text-xs text-green-700 font-medium mb-1 flex items-center gap-1">
//                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                         </svg>
//                         Selected Address:
//                       </p>
//                       <p className="text-sm font-semibold text-gray-900">{selectedAddress.name}</p>
//                       <p className="text-xs text-gray-600">{selectedAddress.street}</p>
//                       <p className="text-xs text-gray-600">
//                         {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zipCode}
//                       </p>
//                       <p className="text-xs text-gray-600">📞 {selectedAddress.phone}</p>
//                     </div>
//                   )}
//                 </div>
//               )}
              
//               {/* Price Breakdown */}
//               <div className="space-y-3 mb-6">
//                 <div className="flex justify-between text-gray-600">
//                   <span>Subtotal ({cartCount} items)</span>
//                   <span className="font-semibold text-gray-900">₹{cartTotal?.toFixed(2) || "0.00"}</span>
//                 </div>
             
//                 <div className="flex justify-between text-gray-600">
//                   <span>Shipping</span>
//                   <span className="font-semibold text-gray-900">
//                     {shippingCost === 0 ? (
//                       <span className="text-green-600">Free</span>
//                     ) : (
//                       `₹${shippingCost.toFixed(2)}`
//                     )}
//                   </span>
//                 </div>
             
//                 <div className="flex justify-between text-gray-600">
//                   <span>Tax (GST @ 5%)</span>
//                   <span className="font-semibold text-gray-900">₹{taxAmount.toFixed(2)}</span>
//                 </div>
             
//                 <div className="border-t border-gray-200 pt-3 mt-3">
//                   <div className="flex justify-between text-xl font-bold text-gray-900">
//                     <span>Total Amount</span>
//                     <span className="text-green-600">₹{finalAmount.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>
              
//               {cartTotal < 500 && (
//                 <div className="mb-6 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
//                   <p className="text-sm text-green-800 text-center font-medium">
//                     🎉 Add ₹{(500 - cartTotal).toFixed(2)} more to get <span className="font-bold">FREE shipping</span>!
//                   </p>
//                   <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
//                     <div
//                       className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
//                       style={{ width: `${Math.min((cartTotal / 500) * 100, 100)}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               )}
              
//               {/* Payment Method Selection */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Payment Method
//                 </label>
//                 <div className="space-y-2">
//                   <label className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
//                     paymentMethod === "razorpay" 
//                       ? "border-green-500 bg-green-50" 
//                       : "border-gray-200 hover:border-green-300"
//                   } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}>
//                     <input
//                       type="radio"
//                       name="paymentMethod"
//                       value="razorpay"
//                       checked={paymentMethod === "razorpay"}
//                       onChange={(e) => setPaymentMethod(e.target.value)}
//                       className="text-green-600 focus:ring-green-500"
//                       disabled={!isAuthenticated}
//                     />
//                     <div className="flex-1">
//                       <span className="font-medium">Razorpay</span>
//                       <p className="text-xs text-gray-500">Credit/Debit Card, UPI, NetBanking</p>
//                     </div>
//                     <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="h-6" />
//                   </label>
               
//                   <label className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
//                     paymentMethod === "cod" 
//                       ? "border-green-500 bg-green-50" 
//                       : "border-gray-200 hover:border-green-300"
//                   } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}>
//                     <input
//                       type="radio"
//                       name="paymentMethod"
//                       value="cod"
//                       checked={paymentMethod === "cod"}
//                       onChange={(e) => setPaymentMethod(e.target.value)}
//                       className="text-green-600 focus:ring-green-500"
//                       disabled={!isAuthenticated}
//                     />
//                     <div>
//                       <span className="font-medium">Cash on Delivery</span>
//                       <p className="text-xs text-gray-500">Pay when you receive the order</p>
//                     </div>
//                   </label>
//                 </div>
//               </div>
              
//               {/* Checkout Button */}
//               {!isAuthenticated ? (
//                 <Link
//                   to="/login"
//                   state={{ from: "/cart" }}
//                   className="w-full block text-center bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 mb-4 shadow-md"
//                 >
//                   Login to Checkout
//                 </Link>
//               ) : (
//                 <button
//                   onClick={handlePayment}
//                   disabled={isProcessing || !selectedAddress}
//                   className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
//                 >
//                   {isProcessing ? (
//                     <>
//                       <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Processing...
//                     </>
//                   ) : (
//                     !selectedAddress ? (
//                       <>
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                         </svg>
//                         Select Address
//                       </>
//                     ) : (
//                       `Proceed to ${paymentMethod === "razorpay" ? "Pay" : "Checkout"}`
//                     )
//                   )}
//                 </button>
//               )}
              
//               <div className="text-center">
//                 <p className="text-sm text-gray-600 mb-2">We accept:</p>
//                 <div className="flex flex-wrap gap-2 justify-center text-xs">
//                   <span className="px-2 py-1 bg-gray-100 rounded-full">💳 Credit Card</span>
//                   <span className="px-2 py-1 bg-gray-100 rounded-full">🏦 Debit Card</span>
//                   <span className="px-2 py-1 bg-gray-100 rounded-full">📱 UPI</span>
//                   <span className="px-2 py-1 bg-gray-100 rounded-full">💵 Cash on Delivery</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <style jsx>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #c1c1c1;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #a8a8a8;
//         }
        
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @keyframes slide-down {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-fade-in {
//           animation: fade-in 0.5s ease-out;
//         }
        
//         .animate-slide-down {
//           animation: slide-down 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Cart;



import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

// Hardcoded API URL - Change this to your actual backend URL
const API_URL = "http://localhost:5000";

// Razorpay script loader
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
   
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const Cart = () => {
  const navigate = useNavigate();
 
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount
  } = useCart();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
 
  // Address Management States
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [showSavedAddresses, setShowSavedAddresses] = useState(true);
  const [expandedAddressId, setExpandedAddressId] = useState(null); // Track which address is expanded
  const [addressFormData, setAddressFormData] = useState({
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

  // Remove Modal States
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
        await fetchUserProfile(token);
        await fetchAddresses();
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
   
    checkAuth();
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        toast.error("Session expired. Please login again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved addresses
  const fetchAddresses = async () => {
    try {
      setAddressLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
     
      if (response.data.success) {
        setAddresses(response.data.addresses);
       
        // Auto-select default address if exists
        const defaultAddress = response.data.addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        } else if (response.data.addresses.length > 0) {
          setSelectedAddress(response.data.addresses[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setAddressLoading(false);
    }
  };

  // Address Form Handlers
  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const resetAddressForm = () => {
    setAddressFormData({
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
    setEditingAddress(null);
    setShowAddressForm(false);
    setShowSavedAddresses(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
   
    // Validation
    if (!addressFormData.name || !addressFormData.street || !addressFormData.city ||
        !addressFormData.zipCode || !addressFormData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(addressFormData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    // Zip code validation
    const zipRegex = /^[0-9]{6}$/;
    if (!zipRegex.test(addressFormData.zipCode)) {
      toast.error("Please enter a valid 6-digit ZIP code");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let response;
     
      if (editingAddress) {
        response = await axios.put(`${API_URL}/api/addresses/${editingAddress._id}`, addressFormData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Address updated successfully!");
      } else {
        response = await axios.post(`${API_URL}/api/addresses`, addressFormData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Address added successfully!");
      }
     
      if (response.data.success) {
        await fetchAddresses();
        resetAddressForm();
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(error.response?.data?.message || "Failed to save address");
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressFormData({
      type: address.type,
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state || "",
      zipCode: address.zipCode,
      country: address.country || "India",
      phone: address.phone,
      isDefault: address.isDefault
    });
    setShowAddressForm(true);
    setShowSavedAddresses(false);
    setExpandedAddressId(null);
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${API_URL}/api/addresses/${addressId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
       
        if (response.data.success) {
          await fetchAddresses();
          if (selectedAddress?._id === addressId) {
            setSelectedAddress(null);
          }
          toast.success("Address deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting address:", error);
        toast.error(error.response?.data?.message || "Failed to delete address");
      }
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(`${API_URL}/api/addresses/default/${addressId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
     
      if (response.data.success) {
        await fetchAddresses();
        toast.success("Default address updated successfully");
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error(error.response?.data?.message || "Failed to set default address");
    }
  };

  // Toggle address expansion
  const toggleAddressExpand = (addressId) => {
    if (expandedAddressId === addressId) {
      setExpandedAddressId(null);
    } else {
      setExpandedAddressId(addressId);
    }
  };

  // Handle quantity increase
  const handleIncreaseQuantity = (productId) => {
    updateQuantity(productId, 1);
    toast.success("Quantity updated");
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = (productId) => {
    updateQuantity(productId, -1);
    toast.success("Quantity updated");
  };

  // Handle remove item - Updated to show custom modal
  const handleRemoveItem = (productId, productName, productImage) => {
    // Show custom popup instead of window.confirm
    setItemToRemove({
      id: productId,
      name: productName,
      image: productImage
    });
    setShowRemoveModal(true);
  };

  // Confirm remove item
  const confirmRemoveItem = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove.id);
      toast.success(`${itemToRemove.name} removed from cart`);
      setShowRemoveModal(false);
      setItemToRemove(null);
    }
  };

  // Handle clear cart
  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      clearCart();
      toast.success("Cart cleared successfully");
    }
  };

  // Calculate final amount
  const shippingCost = cartTotal >= 500 ? 0 : 50;
  const taxAmount = cartTotal * 0.05;
  const finalAmount = cartTotal + shippingCost + taxAmount;

  // Handle Razorpay Payment
  const handleRazorpayPayment = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      setShowSavedAddresses(true);
      return;
    }

    try {
      setIsProcessing(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { state: { from: "/cart" } });
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        setIsProcessing(false);
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/payments/create-order`,
        {
          amount: finalAmount,
          currency: "INR"
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create order");
      }

      const { order, key } = response.data;
      const orderItems = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));

      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "Jaggery Shop",
        description: `Payment for ${cartCount} items`,
        image: "https://via.placeholder.com/150x50/4CAF50/white?text=Jaggery+Shop",
        order_id: order.id,
        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await axios.post(
              `${API_URL}/api/payments/verify`,
              {
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                orderData: {
                  items: orderItems,
                  shippingAddress: selectedAddress,
                  totalAmount: finalAmount,
                  paymentMethod: "Razorpay"
                }
              },
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );

            if (verifyResponse.data.success) {
              toast.success("Payment successful! Your order has been placed.");
              clearCart();
              navigate("/orders");
            } else {
              toast.error("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error(error.response?.data?.message || "Payment verification failed.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: selectedAddress.name,
          email: user?.email || "",
          contact: selectedAddress.phone
        },
        notes: {
          address: `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.zipCode}`
        },
        theme: {
          color: "#4CAF50"
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  // Handle Cash on Delivery
  const handleCOD = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      setShowSavedAddresses(true);
      return;
    }

    try {
      setIsProcessing(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { state: { from: "/cart" } });
        return;
      }

      const orderItems = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));

      const response = await axios.post(
        `${API_URL}/api/orders/create-cod`,
        {
          items: orderItems,
          shippingAddress: selectedAddress,
          totalAmount: finalAmount,
          paymentMethod: "Cash on Delivery"
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success("Order placed successfully! You can pay cash upon delivery.");
        clearCart();
        navigate("/orders");
      } else {
        toast.error(response.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("COD order error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      setShowSavedAddresses(true);
      return;
    }

    if (paymentMethod === "razorpay") {
      handleRazorpayPayment();
    } else if (paymentMethod === "cod") {
      handleCOD();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Toaster position="top-right" reverseOrder={false} />
        <div className="text-center max-w-md p-8 animate-fade-in">
          <div className="bg-gray-50 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-gray-600 mt-2">Review and modify your items before checkout</p>
        </div>
       
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              {/* Desktop Header */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-4 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-200">
                <div className="col-span-6">Product Details</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-1 text-center">Total</div>
                <div className="col-span-1"></div>
              </div>
              
              {/* Cart Items */}
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200">
                    {/* Mobile Layout */}
                    <div className="lg:hidden">
                      <div className="flex gap-4 mb-4">
                        <div className="relative">
                          <img
                            src={item.image || "https://via.placeholder.com/300x300/4CAF50/white?text=No+Image"}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/300x300/4CAF50/white?text=No+Image";
                            }}
                          />
                          {item.stock && item.stock <= 5 && (
                            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                              Low Stock
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{item.category || "Jaggery Product"}</p>
                          {item.stock && (
                            <p className={`text-xs font-medium ${
                              item.stock > 5 ? 'text-green-600' : 'text-orange-600'
                            }`}>
                              {item.stock > 5 ? '✓ In Stock' : `⚠️ Only ${item.stock} left`}
                            </p>
                          )}
                        </div>
                      </div>
                     
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Price</p>
                          <p className="text-lg font-bold text-gray-900">₹{item.price?.toFixed(2) || "0.00"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Quantity</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDecreaseQuantity(item.id)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
                            <button
                              onClick={() => handleIncreaseQuantity(item.id)}
                              disabled={item.stock && item.quantity >= item.stock}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Total</p>
                          <p className="text-lg font-bold text-green-600">
                            ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex justify-end items-end">
                          <button
                            onClick={() => handleRemoveItem(item.id, item.name, item.image)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Desktop Layout */}
                    <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">
                      <div className="col-span-6 flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={item.image || "https://via.placeholder.com/300x300/4CAF50/white?text=No+Image"}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/300x300/4CAF50/white?text=No+Image";
                            }}
                          />
                          {item.stock && item.stock <= 5 && (
                            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                              Low Stock
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 hover:text-green-600 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">{item.category || "Jaggery Product"}</p>
                          {item.stock && (
                            <p className={`text-xs font-medium mt-1 ${
                              item.stock > 5 ? 'text-green-600' : 'text-orange-600'
                            }`}>
                              {item.stock > 5 ? '✓ In Stock' : `⚠️ Only ${item.stock} left`}
                            </p>
                          )}
                        </div>
                      </div>
                     
                      <div className="col-span-2 text-center">
                        <span className="font-semibold text-gray-900">₹{item.price?.toFixed(2) || "0.00"}</span>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDecreaseQuantity(item.id)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            -
                          </button>
                          <span className="w-10 text-center font-semibold text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => handleIncreaseQuantity(item.id)}
                            disabled={item.stock && item.quantity >= item.stock}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-span-1 text-center">
                        <span className="font-bold text-green-600">₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                      </div>
                      
                      <div className="col-span-1 text-right">
                        <button
                          onClick={() => handleRemoveItem(item.id, item.name, item.image)}
                          className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Cart Actions */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-200">
                <button
                  onClick={handleClearCart}
                  className="w-full sm:w-auto px-6 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Cart
                </button>
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-center rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
          
          {/* Order Summary Section */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Order Summary
              </h2>
             
              {/* Login Reminder */}
              {!isAuthenticated && (
                <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 text-center">
                    🔐 Please <Link to="/login" className="font-bold underline hover:text-yellow-900">login</Link> to checkout
                  </p>
                </div>
              )}
              
              {/* Shipping Address Section */}
              {isAuthenticated && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Shipping Address
                    </h3>
                    <button
                      onClick={() => {
                        resetAddressForm();
                        setShowSavedAddresses(!showSavedAddresses);
                        setShowAddressForm(false);
                      }}
                      className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {showSavedAddresses ? "Add New" : "Back"}
                    </button>
                  </div>
                  
                  {/* Saved Addresses List */}
                  {showSavedAddresses && !showAddressForm && (
                    <>
                      {addressLoading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                        </div>
                      ) : addresses.length === 0 ? (
                        <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                          <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <p className="text-gray-500 text-sm mb-3">No saved addresses</p>
                          <button
                            onClick={() => {
                              resetAddressForm();
                              setShowSavedAddresses(false);
                              setShowAddressForm(true);
                            }}
                            className="text-sm text-green-600 hover:text-green-700 font-medium"
                          >
                            Add your first address
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                          {addresses.map((address) => (
                            <div
                              key={address._id}
                              className={`border-2 rounded-lg transition-all duration-200 ${
                                selectedAddress?._id === address._id
                                  ? "border-green-500 bg-gradient-to-r from-green-50 to-white"
                                  : "border-gray-200 hover:border-green-300"
                              }`}
                            >
                              {/* Address Header - Always Visible */}
                              <div 
                                className="p-3 cursor-pointer"
                                onClick={() => toggleAddressExpand(address._id)}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2 flex-1">
                                    {/* Radio button for selection */}
                                    <input
                                      type="radio"
                                      name="selectedAddress"
                                      checked={selectedAddress?._id === address._id}
                                      onChange={() => setSelectedAddress(address)}
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-green-600 focus:ring-green-500 w-4 h-4"
                                    />
                                    
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-semibold text-gray-900">
                                          {address.name}
                                        </span>
                                        {address.isDefault && (
                                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                            Default
                                          </span>
                                        )}
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                          {address.type === "home" ? "🏠 Home" : address.type === "office" ? "💼 Office" : "📍 Other"}
                                        </span>
                                      </div>
                                      {/* Show only city and zip in collapsed view */}
                                      <p className="text-xs text-gray-500 mt-1">
                                        {address.city}, {address.zipCode}
                                      </p>
                                    </div>
                                    
                                    {/* Expand/Collapse Icon */}
                                    <div className="flex items-center gap-2">
                                      <svg 
                                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                                          expandedAddressId === address._id ? 'rotate-180' : ''
                                        }`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Expanded Address Details */}
                              {expandedAddressId === address._id && (
                                <div className="px-3 pb-3 pt-0 border-t border-gray-100 mt-2 animate-slide-down">
                                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                                    <p className="text-sm text-gray-700">
                                      <span className="font-medium">Street:</span> {address.street}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      <span className="font-medium">City:</span> {address.city}
                                    </p>
                                    {address.state && (
                                      <p className="text-sm text-gray-700">
                                        <span className="font-medium">State:</span> {address.state}
                                      </p>
                                    )}
                                    <p className="text-sm text-gray-700">
                                      <span className="font-medium">ZIP Code:</span> {address.zipCode}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      <span className="font-medium">Country:</span> {address.country}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      <span className="font-medium">Phone:</span> {address.phone}
                                    </p>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditAddress(address);
                                        }}
                                        className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium py-1 px-2 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteAddress(address._id);
                                        }}
                                        className="flex-1 text-red-600 hover:text-red-700 text-sm font-medium py-1 px-2 border border-red-200 rounded hover:bg-red-50 transition-colors"
                                      >
                                        Delete
                                      </button>
                                      {!address.isDefault && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleSetDefaultAddress(address._id);
                                          }}
                                          className="flex-1 text-green-600 hover:text-green-700 text-sm font-medium py-1 px-2 border border-green-200 rounded hover:bg-green-50 transition-colors"
                                        >
                                          Set Default
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Add/Edit Address Form */}
                  {(showAddressForm || (!showSavedAddresses && !showAddressForm && addresses.length === 0)) && (
                    <form onSubmit={handleSaveAddress} className="space-y-3 mt-3">
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          name="type"
                          value={addressFormData.type}
                          onChange={handleAddressInputChange}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="home">🏠 Home</option>
                          <option value="office">💼 Office</option>
                          <option value="other">📍 Other</option>
                        </select>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            name="isDefault"
                            checked={addressFormData.isDefault}
                            onChange={handleAddressInputChange}
                            className="text-green-600 focus:ring-green-500 rounded"
                          />
                          <span className="text-gray-700">Set as default</span>
                        </label>
                      </div>
                     
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name *"
                        value={addressFormData.name}
                        onChange={handleAddressInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                     
                      <input
                        type="text"
                        name="street"
                        placeholder="Street Address *"
                        value={addressFormData.street}
                        onChange={handleAddressInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                     
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          name="city"
                          placeholder="City *"
                          value={addressFormData.city}
                          onChange={handleAddressInputChange}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                        <input
                          type="text"
                          name="state"
                          placeholder="State"
                          value={addressFormData.state}
                          onChange={handleAddressInputChange}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                     
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          name="zipCode"
                          placeholder="ZIP Code *"
                          value={addressFormData.zipCode}
                          onChange={handleAddressInputChange}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                        <input
                          type="text"
                          name="country"
                          placeholder="Country"
                          value={addressFormData.country}
                          onChange={handleAddressInputChange}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                     
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number *"
                        value={addressFormData.phone}
                        onChange={handleAddressInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                     
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 transition-all"
                        >
                          {editingAddress ? "Update Address" : "Save Address"}
                        </button>
                        <button
                          type="button"
                          onClick={resetAddressForm}
                          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                  
                  {/* Selected Address Display */}
                  {selectedAddress && !showAddressForm && showSavedAddresses && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-white border border-green-200 rounded-lg">
                      <p className="text-xs text-green-700 font-medium mb-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Selected Address:
                      </p>
                      <p className="text-sm font-semibold text-gray-900">{selectedAddress.name}</p>
                      <p className="text-xs text-gray-600">{selectedAddress.street}</p>
                      <p className="text-xs text-gray-600">
                        {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zipCode}
                      </p>
                      <p className="text-xs text-gray-600">📞 {selectedAddress.phone}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-semibold text-gray-900">₹{cartTotal?.toFixed(2) || "0.00"}</span>
                </div>
             
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
             
                <div className="flex justify-between text-gray-600">
                  <span>Tax (GST @ 5%)</span>
                  <span className="font-semibold text-gray-900">₹{taxAmount.toFixed(2)}</span>
                </div>
             
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-green-600">₹{finalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {cartTotal < 500 && (
                <div className="mb-6 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 text-center font-medium">
                    🎉 Add ₹{(500 - cartTotal).toFixed(2)} more to get <span className="font-bold">FREE shipping</span>!
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((cartTotal / 500) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Payment Method Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Payment Method
                </label>
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "razorpay" 
                      ? "border-green-500 bg-green-50" 
                      : "border-gray-200 hover:border-green-300"
                  } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-green-600 focus:ring-green-500"
                      disabled={!isAuthenticated}
                    />
                    <div className="flex-1">
                      <span className="font-medium">Razorpay</span>
                      <p className="text-xs text-gray-500">Credit/Debit Card, UPI, NetBanking</p>
                    </div>
                    <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="h-6" />
                  </label>
               
                  <label className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "cod" 
                      ? "border-green-500 bg-green-50" 
                      : "border-gray-200 hover:border-green-300"
                  } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-green-600 focus:ring-green-500"
                      disabled={!isAuthenticated}
                    />
                    <div>
                      <span className="font-medium">Cash on Delivery</span>
                      <p className="text-xs text-gray-500">Pay when you receive the order</p>
                    </div>
                  </label>
                </div>
              </div>
              
              {/* Checkout Button */}
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  state={{ from: "/cart" }}
                  className="w-full block text-center bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 mb-4 shadow-md"
                >
                  Login to Checkout
                </Link>
              ) : (
                <button
                  onClick={handlePayment}
                  disabled={isProcessing || !selectedAddress}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    !selectedAddress ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Select Address
                      </>
                    ) : (
                      `Proceed to ${paymentMethod === "razorpay" ? "Pay" : "Checkout"}`
                    )
                  )}
                </button>
              )}
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">We accept:</p>
                <div className="flex flex-wrap gap-2 justify-center text-xs">
                  <span className="px-2 py-1 bg-gray-100 rounded-full">💳 Credit Card</span>
                  <span className="px-2 py-1 bg-gray-100 rounded-full">🏦 Debit Card</span>
                  <span className="px-2 py-1 bg-gray-100 rounded-full">📱 UPI</span>
                  <span className="px-2 py-1 bg-gray-100 rounded-full">💵 Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Remove Confirmation Modal - Overlay */}
      {showRemoveModal && itemToRemove && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowRemoveModal(false);
              setItemToRemove(null);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 transform transition-all duration-300 scale-100 animate-slide-up relative">
            {/* Close button */}
            <button
              onClick={() => {
                setShowRemoveModal(false);
                setItemToRemove(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              {/* Warning Icon */}
              <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">Remove Item?</h3>
              
              {/* Product Preview */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                <img
                  src={itemToRemove.image || "https://via.placeholder.com/300x300/4CAF50/white?text=No+Image"}
                  alt={itemToRemove.name}
                  className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x300/4CAF50/white?text=No+Image";
                  }}
                />
                <div className="text-left">
                  <p className="font-semibold text-gray-800 text-sm">{itemToRemove.name}</p>
                  <p className="text-xs text-gray-500">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-600 mb-6 text-sm">
                Are you sure you want to remove <span className="font-semibold text-gray-900">"{itemToRemove.name}"</span> from your cart?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRemoveModal(false);
                    setItemToRemove(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveItem}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        
      `}</style>
    </div>
  );
};

export default Cart;