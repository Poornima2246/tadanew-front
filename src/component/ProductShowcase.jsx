// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useCart } from "../context/CartContext";
// import { FaHeart, FaStar } from "react-icons/fa";
// import { FiEye } from "react-icons/fi";
// import { HiOutlineShoppingBag } from "react-icons/hi";
// import { toast } from "react-hot-toast";

// export default function ProductShowcase() {
//   const [products, setProducts] = useState([]);
//   const [wishlistIds, setWishlistIds] = useState(new Set());
//   const [loading, setLoading] = useState(true);

//   const { addToCart } = useCart();

//   const API_PRODUCTS = "http://localhost:5000/api/products";
//   const API_WISHLIST = "http://localhost:5000/api/wishlist";

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const prodRes = await axios.get(API_PRODUCTS);
//         setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
//         fetchWishlist();
//       } catch (err) {
//         console.log(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const fetchWishlist = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const res = await axios.get(API_WISHLIST, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const ids =
//         res.data?.items?.map((i) => i.productId?._id || i.productId) || [];

//       setWishlistIds(new Set(ids));
//     } catch (err) {
//       console.log("Wishlist error");
//     }
//   };

//   const toggleWishlist = async (product) => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       toast.error("Please login first");
//       return;
//     }

//     const isAdded = wishlistIds.has(product._id);

//     try {
//       if (isAdded) {
//         await axios.delete(`${API_WISHLIST}/${product._id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setWishlistIds((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(product._id);
//           return newSet;
//         });

//         toast.success("Removed from wishlist");
//       } else {
//         await axios.post(
//           `${API_WISHLIST}/${product._id}`,
//           {},
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         setWishlistIds((prev) => new Set(prev).add(product._id));

//         toast.success("Added to wishlist ❤️");
//       }
//     } catch (err) {
//       toast.error("Wishlist action failed");
//     }
//   };

//   const getProductImage = (product) => {
//     const img = product?.images?.[0];
//     return typeof img === "string"
//       ? img
//       : img?.url || "https://via.placeholder.com/300";
//   };

//   if (loading) return <div className="text-center py-20">Loading...</div>;

//   const ProductColumn = ({ title, items }) => (
//     <div>
//       <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
//         {title}
//       </h2>

//       <div className="grid gap-4">
//         {items.slice(0, 3).map((product) => (
//           <div
//             key={product._id}
//             className="border border-gray-100 rounded-sm group relative bg-white hover:shadow-md transition-shadow"
//           >
//             {/* Image */}
//             <div className="relative h-56 overflow-hidden bg-gray-50">
//               <img
//                 src={getProductImage(product)}
//                 alt={product.name}
//                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//               />

//               {/* Wishlist & View */}
//               <div className="absolute top-3 right-3 flex flex-col gap-2">
//                 <button
//                   onClick={() => toggleWishlist(product)}
//                   className={`p-2 rounded-full shadow-sm transition ${
//                     wishlistIds.has(product._id)
//                       ? "bg-pink-500 text-white"
//                       : "bg-white text-gray-400 hover:text-pink-500"
//                   }`}
//                 >
//                   <FaHeart size={16} />
//                 </button>

//                 <button className="p-2 bg-white text-gray-400 rounded-full shadow-sm hover:text-green-600">
//                   <FiEye size={16} />
//                 </button>
//               </div>

//               {/* Add to cart */}
//               <button
//                 onClick={() => {
//                   addToCart(product);
//                   toast.success(`${product.name} added to cart`);
//                 }}
//                 className="absolute bottom-3 right-3 bg-green-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
//               >
//                 <HiOutlineShoppingBag size={18} />
//               </button>
//             </div>

//             {/* Info */}
//             <div className="p-3">
//               <p className="text-gray-400 text-xs capitalize">
//                 {product.category || "Product"}
//               </p>

//               <h3 className="font-medium text-gray-800 truncate">
//                 {product.name}
//               </h3>

//               <div className="flex items-center justify-between mt-1">
//                 <span className="text-lg font-bold text-gray-900">
//                   ₹{product.price}
//                 </span>
//               </div>

//               <div className="flex text-orange-400 text-xs mt-1">
//                 {[...Array(5)].map((_, i) => (
//                   <FaStar
//                     key={i}
//                     className={i < 4 ? "fill-current" : "text-gray-200"}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-12">
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
//         <ProductColumn title="Hot Deals" items={products} />

//         <ProductColumn
//           title="Best Seller"
//           items={[...products].reverse()}
//         />

//         <ProductColumn
//           title="Top Rated"
//           items={products.slice(2)}
//         />

//         {/* Side Banner */}
//         <div className="hidden lg:block rounded-xl bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-100 border-2 border-dashed border-gray-200 min-h-[420px] flex items-center justify-center">
//           <span className="text-gray-400">Promo Banner</span>
//         </div>
//       </div>
//     </div>
//   );
// }





import React, { useState } from "react";
import oil from "../assets/oilad.jpg";
import nuts from "../assets/nuts.jpg";

const SpiceCard = ({ imageUrl, title, isPlaceholder }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (isPlaceholder) {
    return (
      <div className="w-full aspect-[4/3] rounded-lg border border-gray-200" />
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg shadow-lg group bg-gray-100">
      {/* Loading skeleton */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Image with dynamic sizing */}
      <img
        src={imageError ? placeholderImage : imageUrl}
        alt={title}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        } ${
          // Using object-cover ensures image fills container while maintaining aspect ratio
          // Crop the image to cover the container (may cut off edges)
          'object-cover'
          
          // Alternative options (uncomment to try different behaviors):
          // 'object-contain' // Shows entire image with letterboxing
          // 'object-fill' // Stretches image to fill container (may distort)
          // 'object-scale-down' // Scales down to fit container without cropping
        } transition-transform duration-300 group-hover:scale-110`}
        
        // Optional: Add image optimization parameters for external images
        srcSet={!imageUrl.startsWith('http') ? undefined : 
          `${imageUrl}&w=400 400w,
           ${imageUrl}&w=800 800w,
           ${imageUrl}&w=1200 1200w`
        }
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        
        // Prevent image dragging
        draggable="false"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

      {/* Shop Now button */}
      <button className="absolute bottom-4 right-4 bg-white text-orange-600 px-4 py-1.5 rounded-md font-semibold text-sm shadow-md hover:bg-orange-50 transition-colors z-10">
        Shop Now
      </button>
    </div>
  );
};

// Optional: Add a default placeholder image
const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='2' width='20' height='20' rx='2.18'%3E%3C/rect%3E%3Cline x1='9' y1='9' x2='15' y2='15'%3E%3C/line%3E%3Cline x1='15' y1='9' x2='9' y2='15'%3E%3C/line%3E%3C/svg%3E";

const SpiceGallery = () => {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <SpiceCard
          imageUrl="https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=800"
          title="Spices"
        />

        <SpiceCard imageUrl={oil} title="Oil" />

        <SpiceCard imageUrl={nuts} title="Nuts" />
      </div>
    </div>
  );
};

export default SpiceGallery;