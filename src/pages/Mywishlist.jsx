 


// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { X } from "lucide-react";

// export default function Wishlist() {
//   const [wishlist, setWishlist] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [addingToCart, setAddingToCart] = useState(null);
//   const [addedItems, setAddedItems] = useState(new Set()); // Track successfully added items

//   const token = localStorage.getItem("token");
//   const API_WISHLIST = "http://localhost:5000/api/wishlist";
//   const API_CART = "http://localhost:5000/api/cart/add";

//   const fetchWishlist = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(API_WISHLIST, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setWishlist(res.data.items || []);
//     } catch (err) {
//       console.error("Fetch wishlist error:", err);
//       toast.error("Failed to load wishlist");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToCart = async (productId) => {
//     if (!token) {
//       toast.error("Please login to add items to cart");
//       return;
//     }

//     if (addedItems.has(productId)) {
//       toast("Already added to cart", { icon: "🛒" });
//       return;
//     }

//     setAddingToCart(productId);

//     try {
//       const res = await axios.post(
//         API_CART,
//         { productId, quantity: 1 },
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );

//       if (res.data.success) {
//         toast.success("Added to cart successfully!");
//         setAddedItems(prev => new Set(prev).add(productId));
//       }
//     } catch (err) {
//       console.error("Add to cart error:", err);
//       const message = err.response?.data?.message || "Failed to add to cart";
//       toast.error(message);
//     } finally {
//       setAddingToCart(null);
//     }
//   };

//   const removeItem = async (id) => {
//     try {
//       const response = await axios.delete(`${API_WISHLIST}/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setWishlist(prev => prev.filter(item => item.productId?._id !== id));
//         // Also remove from addedItems if it was added
//         setAddedItems(prev => {
//           const newSet = new Set(prev);
//           newSet.delete(id);
//           return newSet;
//         });
//         toast.success("Removed from wishlist");
//       }
//     } catch (err) {
//       console.error("Remove item error:", err);
//       toast.error("Failed to remove item");
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchWishlist();
//     } else {
//       setLoading(false);
//     }
//   }, [token]);

//   if (loading) return <div className="p-10 text-center text-gray-500">Loading wishlist...</div>;

//   if (!token) {
//     return (
//       <div className="p-10 text-center">
//         <h2 className="text-2xl font-bold mb-4">Please Login</h2>
//         <p>You need to be logged in to view your wishlist.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6 md:p-10">
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="border-b border-gray-100 text-left">
//               <th className="pb-4 font-medium text-gray-400 text-sm uppercase tracking-wider">Product</th>
//               <th className="pb-4 font-medium text-gray-400 text-sm uppercase tracking-wider">Price</th>
//               <th className="pb-4 font-medium text-gray-400 text-sm uppercase tracking-wider text-center">Stock Status</th>
//               <th className="pb-4"></th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {wishlist.length === 0 ? (
//               <tr>
//                 <td colSpan="4" className="py-10 text-center text-gray-500">Your wishlist is empty</td>
//               </tr>
//             ) : (
//               wishlist.map(item => {
//                 const product = item.productId;
//                 if (!product) return null;

//                 const imageUrl = product.images?.[0]?.url || product.images?.[0] || "https://via.placeholder.com/100";
//                 const isOutOfStock = product.stock <= 0;
//                 const isAddedToCart = addedItems.has(product._id);

//                 return (
//                   <tr key={product._id} className="group">
//                     {/* Product Column */}
//                     <td className="py-6">
//                       <div className="flex items-center gap-6">
//                         <img
//                           src={imageUrl}
//                           alt={product.name}
//                           className="h-20 w-20 object-contain rounded-md"
//                         />
//                         <span className="font-medium text-gray-700">{product.name}</span>
//                       </div>
//                     </td>

//                     {/* Price Column */}
//                     <td className="py-6">
//                       <div className="flex items-center gap-2">
//                         <span className="font-bold text-gray-800">₹{product.price}</span>
//                         {product.oldPrice && (
//                           <span className="text-gray-400 line-through text-sm">₹{product.oldPrice}</span>
//                         )}
//                       </div>
//                     </td>

//                     {/* Stock Status Column */}
//                     <td className="py-6 text-center">
//                       <span className={`px-3 py-1 rounded-md text-xs font-medium ${
//                         isOutOfStock 
//                           ? "bg-red-50 text-red-400" 
//                           : "bg-green-50 text-green-500"
//                       }`}>
//                         {isOutOfStock ? "Out of Stock" : "In Stock"}
//                       </span>
//                     </td>

//                     {/* Actions Column */}
//                     <td className="py-6">
//                       <div className="flex items-center justify-end gap-4">
//                         <button
//                           onClick={() => addToCart(product._id)}
//                           disabled={isOutOfStock || addingToCart === product._id || isAddedToCart}
//                           className={`px-6 py-2.5 rounded-full font-semibold text-white transition-all shadow-sm ${
//                             isOutOfStock || isAddedToCart
//                               ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
//                               : "bg-[#FF5CBB] hover:bg-[#ff40ac]"
//                           }`}
//                         >
//                           {addingToCart === product._id 
//                             ? "Adding..." 
//                             : isAddedToCart 
//                               ? "Added to Cart" 
//                               : "Add to Cart"
//                           }
//                         </button>

//                         <button 
//                           onClick={() => removeItem(product._id)}
//                           className="p-1 text-gray-400 hover:text-red-500 border border-gray-200 rounded-full transition-colors"
//                         >
//                           <X size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



// Wishlist.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";
import { useCart } from "../context/CartContext"; // Import this

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const [addedItems, setAddedItems] = useState(new Set());

  // Get cart functions from context
  const { addToCart, fetchCart } = useCart();

  const token = localStorage.getItem("token");
  const API_WISHLIST = "http://localhost:5000/api/wishlist";

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_WISHLIST, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(res.data.items || []);
    } catch (err) {
      console.error("Fetch wishlist error:", err);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const addToCartHandler = async (productId) => {
    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }

    if (addedItems.has(productId)) {
      toast("Already added to cart", { icon: "🛒" });
      return;
    }

    setAddingToCart(productId);

    try {
      // Find the product in wishlist to get full product object
      const wishlistItem = wishlist.find(item => item.productId?._id === productId);
      const product = wishlistItem?.productId;

      if (!product) {
        toast.error("Product not found");
        return;
      }

      // Call the context's addToCart with product object and quantity
      await addToCart(product, 1);
      
      // Mark as added
      setAddedItems(prev => new Set(prev).add(productId));
      
      // Refresh cart to ensure everything is in sync
      setTimeout(() => {
        fetchCart();
      }, 500);
      
    } catch (err) {
      console.error("Add to cart error:", err);
      const message = err.response?.data?.message || "Failed to add to cart";
      toast.error(message);
    } finally {
      setAddingToCart(null);
    }
  };

  const removeItem = async (id) => {
    try {
      const response = await axios.delete(`${API_WISHLIST}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setWishlist(prev => prev.filter(item => item.productId?._id !== id));
        setAddedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        toast.success("Removed from wishlist");
      }
    } catch (err) {
      console.error("Remove item error:", err);
      toast.error("Failed to remove item");
    }
  };

  useEffect(() => {
    if (token) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading wishlist...</div>;

  if (!token) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p>You need to be logged in to view your wishlist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="pb-4 font-medium text-gray-400 text-sm uppercase tracking-wider">Product</th>
              <th className="pb-4 font-medium text-gray-400 text-sm uppercase tracking-wider">Price</th>
              <th className="pb-4 font-medium text-gray-400 text-sm uppercase tracking-wider text-center">Stock Status</th>
              <th className="pb-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {wishlist.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-10 text-center text-gray-500">Your wishlist is empty</td>
              </tr>
            ) : (
              wishlist.map(item => {
                const product = item.productId;
                if (!product) return null;

                const imageUrl = product.images?.[0]?.url || product.images?.[0] || "https://via.placeholder.com/100";
                const isOutOfStock = product.stock <= 0;
                const isAddedToCart = addedItems.has(product._id);

                return (
                  <tr key={product._id} className="group">
                    {/* Product Column */}
                    <td className="py-6">
                      <div className="flex items-center gap-6">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="h-20 w-20 object-contain rounded-md"
                        />
                        <span className="font-medium text-gray-700">{product.name}</span>
                      </div>
                    </td>

                    {/* Price Column */}
                    <td className="py-6">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">₹{product.price}</span>
                        {product.oldPrice && (
                          <span className="text-gray-400 line-through text-sm">₹{product.oldPrice}</span>
                        )}
                      </div>
                    </td>

                    {/* Stock Status Column */}
                    <td className="py-6 text-center">
                      <span className={`px-3 py-1 rounded-md text-xs font-medium ${
                        isOutOfStock 
                          ? "bg-red-50 text-red-400" 
                          : "bg-green-50 text-green-500"
                      }`}>
                        {isOutOfStock ? "Out of Stock" : "In Stock"}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="py-6">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          onClick={() => addToCartHandler(product._id)}
                          disabled={isOutOfStock || addingToCart === product._id || isAddedToCart}
                          className={`px-6 py-2.5 rounded-full font-semibold text-white transition-all shadow-sm ${
                            isOutOfStock || isAddedToCart
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                              : "bg-[#FF5CBB] hover:bg-[#ff40ac]"
                          }`}
                        >
                          {addingToCart === product._id 
                            ? "Adding..." 
                            : isAddedToCart 
                              ? "Added to Cart" 
                              : "Add to Cart"
                          }
                        </button>

                        <button 
                          onClick={() => removeItem(product._id)}
                          className="p-1 text-gray-400 hover:text-red-500 border border-gray-200 rounded-full transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}