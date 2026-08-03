// import React, { createContext, useState, useContext, useEffect } from "react";

// const CartContext = createContext();

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// };

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [wishlist, setWishlist] = useState([]);

//   // Load cart and wishlist from localStorage on initial render
//   useEffect(() => {
//     const savedCart = localStorage.getItem("cart");
//     const savedWishlist = localStorage.getItem("wishlist");
    
//     if (savedCart) {
//       try {
//         setCartItems(JSON.parse(savedCart));
//       } catch (error) {
//         console.error("Error parsing cart from localStorage:", error);
//       }
//     }
    
//     if (savedWishlist) {
//       try {
//         setWishlist(JSON.parse(savedWishlist));
//       } catch (error) {
//         console.error("Error parsing wishlist from localStorage:", error);
//       }
//     }
//   }, []);

//   // Save to localStorage whenever cart changes
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   }, [cartItems]);

//   // Save to localStorage whenever wishlist changes
//   useEffect(() => {
//     localStorage.setItem("wishlist", JSON.stringify(wishlist));
//   }, [wishlist]);

//   // Add to cart
//   const addToCart = (product, quantity = 1) => {
//     setCartItems(prevItems => {
//       // Check if product already exists in cart
//       const existingItem = prevItems.find(item => item.id === product._id);
      
//       if (existingItem) {
//         // If exists, increase quantity
//         return prevItems.map(item =>
//           item.id === product._id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       } else {
//         // If doesn't exist, add new item
//         return [...prevItems, {
//           id: product._id,
//           name: product.name || "Unnamed Product",
//           image: getProductImageUrl(product),
//           price: product.price || 0,
//           quantity: quantity,
//           category: product.category || "Jaggery Product",
//           stock: product.stock || 10
//         }];
//       }
//     });
//   };

//   // Helper function to get product image URL
//   const getProductImageUrl = (product) => {
//     if (product.images && product.images.length > 0) {
//       const firstImage = product.images[0];
//       if (typeof firstImage === 'string') {
//         return firstImage;
//       } else if (firstImage.url) {
//         return firstImage.url;
//       }
//     }
//     return "https://via.placeholder.com/300x300/4CAF50/white?text=No+Image";
//   };

//   // Remove from cart
//   const removeFromCart = (productId) => {
//     setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
//   };

//   // Update quantity
//   const updateQuantity = (productId, delta) => {
//     setCartItems(prevItems =>
//       prevItems.map(item =>
//         item.id === productId
//           ? { ...item, quantity: Math.max(1, item.quantity + delta) }
//           : item
//       )
//     );
//   };

//   // Clear cart
//   const clearCart = () => {
//     setCartItems([]);
//   };

//   // Toggle wishlist
//   const toggleWishlist = (product) => {
//     setWishlist(prev => {
//       const exists = prev.find(item => item.id === product._id);
//       if (exists) {
//         return prev.filter(item => item.id !== product._id);
//       } else {
//         return [...prev, {
//           id: product._id,
//           name: product.name || "Unnamed Product",
//           image: getProductImageUrl(product),
//           price: product.price || 0,
//           category: product.category || "Jaggery Product"
//         }];
//       }
//     });
//   };

//   // Check if in wishlist
//   const isInWishlist = (productId) => {
//     return wishlist.some(item => item.id === productId);
//   };

//   // Calculate cart totals
//   const cartTotal = cartItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   const cartCount = cartItems.reduce(
//     (count, item) => count + item.quantity,
//     0
//   );

//   const value = {
//     cartItems,
//     wishlist,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     toggleWishlist,
//     isInWishlist,
//     cartTotal,
//     cartCount
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };






//current final file 


// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// const CartContext = createContext();

// const API_URL = "http://localhost:5000";

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [cartTotal, setCartTotal] = useState(0);
//   const [cartCount, setCartCount] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);   // ← Add this

//   const getToken = () => localStorage.getItem("token");

//   const authHeaders = () => {
//     const token = getToken();
//     return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
//   };

//   const fetchCart = async () => {
//     const token = getToken();
//     if (!token) {
//       setCartItems([]);
//       setCartTotal(0);
//       setCartCount(0);
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await axios.get(`${API_URL}/api/cart`, authHeaders());

//       if (res.data.success) {
//         const items = res.data.data.items || [];
//         const summary = res.data.data.summary || {};

//         setCartItems(items);
//         setCartTotal(summary.subtotal || 0);
//         setCartCount(summary.itemCount || 0);
//       }
//     } catch (err) {
//       if (err.response?.status === 401) {
//         console.warn("Cart fetch → 401 Unauthorized. User likely not logged in.");
//         localStorage.removeItem("token"); // optional: clean invalid token
//       } else {
//         console.error("Fetch cart error:", err);
//       }
//       // Reset to empty on failure (prevents stale data)
//       setCartItems([]);
//       setCartTotal(0);
//       setCartCount(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToCart = async (product, quantity = 1) => {
//     const token = getToken();
//     if (!token) {
//       toast.error("Please login first");
//       return;
//     }

//     try {
//       // You were passing whole product → backend probably expects productId
//       const productId = product._id || product.id;
//       if (!productId) {
//         toast.error("Invalid product");
//         return;
//       }

//       const res = await axios.post(
//         `${API_URL}/api/cart/add`,
//         { productId, quantity },
//         authHeaders()
//       );

//       if (res.data.success) {
//         setCartItems(res.data.data.items || []);
//         setCartTotal(res.data.data.summary?.subtotal || 0);
//         setCartCount(res.data.data.summary?.itemCount || 0);
//         toast.success("Added to cart");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to add to cart");
//     }
//   };

//   const updateQuantity = async (productId, change) => {
//     const token = getToken();
//     if (!token) return;

//     try {
//       const item = cartItems.find((i) => (i._id || i.id) === productId);
//       if (!item) return;

//       const newQty = item.quantity + change;
//       if (newQty < 1) return;

//       const res = await axios.put(
//         `${API_URL}/api/cart/update/${productId}`,
//         { quantity: newQty },
//         authHeaders()
//       );

//       if (res.data.success) {
//         setCartItems(res.data.data.items || []);
//         setCartTotal(res.data.data.summary?.subtotal || 0);
//         setCartCount(res.data.data.summary?.itemCount || 0);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to update cart");
//     }
//   };

//   const removeFromCart = async (productId) => {
//     const token = getToken();
//     if (!token) return;

//     try {
//       const res = await axios.delete(
//         `${API_URL}/api/cart/remove/${productId}`,
//         authHeaders()
//       );

//       if (res.data.success) {
//         setCartItems((prev) => prev.filter((i) => (i._id || i.id) !== productId));
//         toast.success("Item removed");
//         fetchCart(); // refresh full state
//       }
//     } catch (err) {
//       toast.error("Failed to remove item");
//     }
//   };

//   const clearCart = async () => {
//     const token = getToken();
//     if (!token) return;

//     try {
//       const res = await axios.delete(`${API_URL}/api/cart/clear`, authHeaders());

//       if (res.data.success) {
//         setCartItems([]);
//         setCartTotal(0);
//         setCartCount(0);
//         toast.success("Cart cleared");
//       }
//     } catch (err) {
//       toast.error("Failed to clear cart");
//     }
//   };

  

//   useEffect(() => {
//     fetchCart();
//     // Optional: listen for storage changes (login/logout from other tabs)
//     const handleStorageChange = (e) => {
//       if (e.key === "token") {
//         fetchCart();
//       }
//     };
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         cartTotal,
//         cartCount,
//         loading,
//         fetchCart,
//         addToCart,
//         updateQuantity,
//         removeFromCart,
//         clearCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);


import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const CartContext = createContext();

const API_URL = "http://localhost:5000";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

  const getToken = () => localStorage.getItem("token");

  const authHeaders = () => {
    const token = getToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchCart = async () => {
    const token = getToken();
    if (!token) {
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(`${API_URL}/api/cart`, authHeaders());

      if (res.data.success) {
        const items = res.data.data.items || [];
        const summary = res.data.data.summary || {};

        setCartItems(items);
        setCartTotal(summary.subtotal || 0);
        setCartCount(summary.itemCount || 0);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        console.warn("Cart fetch → 401 Unauthorized. User likely not logged in.");
        localStorage.removeItem("token");
      } else {
        console.error("Fetch cart error:", err);
      }
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    const token = getToken();
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      const productId = product._id || product.id;
      if (!productId) {
        toast.error("Invalid product");
        return;
      }

      const res = await axios.post(
        `${API_URL}/api/cart/add`,
        { productId, quantity },
        authHeaders()
      );

      if (res.data.success) {
        setCartItems(res.data.data.items || []);
        setCartTotal(res.data.data.summary?.subtotal || 0);
        setCartCount(res.data.data.summary?.itemCount || 0);
        // toast.success("Added to cart");
        openMiniCart(); // Auto-open mini cart when item is added
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const updateQuantity = async (productId, change) => {
    const token = getToken();
    if (!token) return;

    try {
      const item = cartItems.find((i) => (i._id || i.id) === productId);
      if (!item) return;

      const newQty = item.quantity + change;
      if (newQty < 1) return;

      const res = await axios.put(
        `${API_URL}/api/cart/update/${productId}`,
        { quantity: newQty },
        authHeaders()
      );

      if (res.data.success) {
        setCartItems(res.data.data.items || []);
        setCartTotal(res.data.data.summary?.subtotal || 0);
        setCartCount(res.data.data.summary?.itemCount || 0);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update cart");
    }
  };

  const removeFromCart = async (productId) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.delete(
        `${API_URL}/api/cart/remove/${productId}`,
        authHeaders()
      );

      if (res.data.success) {
        setCartItems((prev) => prev.filter((i) => (i._id || i.id) !== productId));
        // toast.success("Item removed");
        fetchCart();
      }
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.delete(`${API_URL}/api/cart/clear`, authHeaders());

      if (res.data.success) {
        setCartItems([]);
        setCartTotal(0);
        setCartCount(0);
        // toast.success("Cart cleared");
      }
    } catch (err) {
      toast.error("Failed to clear cart");
    }
  };

  const openMiniCart = () => {
    setIsMiniCartOpen(true);
  };

  const closeMiniCart = () => {
    setIsMiniCartOpen(false);
  };

  useEffect(() => {
    fetchCart();
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        fetchCart();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        cartCount,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isMiniCartOpen,
        openMiniCart,
        closeMiniCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);