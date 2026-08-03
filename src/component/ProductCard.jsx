// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useCart } from "../context/CartContext";
// import { FaHeart, FaStar } from "react-icons/fa";
// import { FiEye } from "react-icons/fi";
// import { HiOutlineShoppingBag } from "react-icons/hi";
// import { toast } from "react-hot-toast";

// export default function FeaturedProducts() {
//   const [products, setProducts] = useState([]);
//   const [wishlistIds, setWishlistIds] = useState(new Set());
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { addToCart } = useCart();

//   const API_PRODUCTS = "http://localhost:5000/api/products";
//   const API_WISHLIST = "http://localhost:5000/api/wishlist";

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const [prodRes] = await Promise.all([
//           axios.get(API_PRODUCTS),
//           fetchWishlistIds(),
//         ]);
//         setProducts(Array.isArray(prodRes.data) ? prodRes.data.slice(0, 4) : []);
//       } catch (err) {
//         setError("Failed to load featured products");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInitialData();
//   }, []);

//   const fetchWishlistIds = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;
//     try {
//       const res = await axios.get(API_WISHLIST, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const ids = res.data?.items?.map(i => i.productId?._id || i.productId) || [];
//       setWishlistIds(new Set(ids));
//     } catch (e) { console.log("Wishlist sync failed"); }
//   };

//   const getProductImage = (product) => {
//     const img = product?.images?.[0];
//     return typeof img === "string" ? img : img?.url || "https://via.placeholder.com/300";
//   };

//   const toggleWishlist = async (product) => {
//     const token = localStorage.getItem("token");
//     if (!token) return toast.error("Please login first");

//     const isAdded = wishlistIds.has(product._id);
//     try {
//       if (isAdded) {
//         await axios.delete(`${API_WISHLIST}/${product._id}`, { headers: { Authorization: `Bearer ${token}` } });
//         setWishlistIds(prev => { const n = new Set(prev); n.delete(product._id); return n; });
//         toast.success("Removed from wishlist");
//       } else {
//         await axios.post(`${API_WISHLIST}/${product._id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
//         setWishlistIds(prev => new Set(prev).add(product._id));
//         toast.success("Added to wishlist ❤️");
//       }
//     } catch (err) { toast.error("Action failed"); }
//   };

//   if (loading) return <div className="py-20 text-center text-gray-500">Loading Featured...</div>;

//   return (
//     <section className="max-w-7xl mx-auto px-4   font-sans bg-white  rounded-2xl py-12 mt-10">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-3xl font-bold text-gray-900">Our Featured Products</h2>
//         <a href="/shop" className="text-green-600 font-semibold flex items-center hover:underline">
//           View All <span className="ml-2">→</span>
//         </a>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

//         {/* 1. Static Promo Banner */}
//         <div className="relative rounded-sm overflow-hidden h-[420px] group bg-orange-50">
//           <img
//             src="https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&q=80&w=800"
//             alt="Summer Sale"
//             className="w-full h-full object-cover brightness-75"
//           />
//           <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
//             <p className="uppercase tracking-widest text-sm mb-2">Summer Sale</p>
//             <h3 className="text-5xl font-bold text-orange-400 mb-2">50% off</h3>
//             <p className="text-lg italic font-light mb-6">Rich, Pure & Wholesome</p>
//             <h4 className="text-4xl font-serif text-orange-300 mb-8">Dry Fruits</h4>
//             <button className="bg-white text-orange-600 px-6 py-2 rounded-md font-bold hover:bg-orange-600 hover:text-white transition-colors">
//               Shop Now
//             </button>
//           </div>
//         </div>

//         {/* 2. Dynamic Product Cards */}
//         {products.map((product) => (
//           <div key={product._id} className="border border-gray-100 rounded-sm group relative bg-white hover:shadow-md transition-shadow h-[420px] flex flex-col">

//             {/* Image & Action Overlays */}
//             <div className="relative h-72 overflow-hidden bg-gray-50">
//               <img
//                 src={getProductImage(product)}
//                 alt={product.name}
//                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//               />

//               {/* Top Right Icons */}
//               <div className="absolute top-3 right-3 flex flex-col gap-2">
//                 <button
//                   onClick={() => toggleWishlist(product)}
//                   className={`p-2 rounded-full shadow-sm transition-colors ${
//                     wishlistIds.has(product._id) ? "bg-pink-500 text-white" : "bg-white text-gray-400 hover:text-pink-500"
//                   }`}
//                 >
//                   <FaHeart size={18} />
//                 </button>
//                 <button className="p-2 bg-white text-gray-400 rounded-full shadow-sm hover:text-green-600 transition-colors">
//                   <FiEye size={18} />
//                 </button>
//               </div>

//               {/* Bottom Right Cart Button */}
//               <button
//                 onClick={() => { addToCart(product); toast.success("Added to cart"); }}
//                 className="absolute bottom-4 right-4 bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-600 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
//               >
//                 <HiOutlineShoppingBag size={22} />
//               </button>
//             </div>

//             {/* Product Info */}
//             <div className="p-4">
//               <p className="text-gray-400 text-sm mb-1 capitalize">{product.category || "Product"}</p>
//               <h3 className="font-medium text-gray-800 mb-1 truncate">{product.name}</h3>
//               <div className="flex items-center justify-between">
//                 <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
//               </div>
//               <div className="flex text-orange-400 text-xs mt-2">
//                 {[...Array(5)].map((_, i) => (
//                   <FaStar key={i} className={i < 4 ? "fill-current" : "text-gray-200"} />
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}

//       </div>
//     </section>
//   );
// }

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useCart } from "../context/CartContext";
// import { FaHeart, FaStar } from "react-icons/fa";
// import { FiEye } from "react-icons/fi";
// import { HiOutlineShoppingBag } from "react-icons/hi";
// import { toast } from "react-hot-toast";
// import { ArrowRight } from "lucide-react";
// import { Link } from "react-router-dom";

// import Banner2 from "../assets/Banner2.jpg";

// export default function ProductShowcase() {
//   const [products, setProducts] = useState([]);
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [wishlistIds, setWishlistIds] = useState(new Set());
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { addToCart } = useCart();

//   const API_PRODUCTS = "http://localhost:5000/api/products";
//   const API_WISHLIST = "http://localhost:5000/api/wishlist";

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const prodRes = await axios.get(API_PRODUCTS);
//         const productsData = Array.isArray(prodRes.data) ? prodRes.data : [];

//         setProducts(productsData);
//         setFeaturedProducts(productsData.slice(0, 4));

//         fetchWishlist();
//       } catch (err) {
//         setError("Failed to load products");
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
//         headers: { Authorization: `Bearer ${token}` }
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
//           headers: { Authorization: `Bearer ${token}` }
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
//             headers: { Authorization: `Bearer ${token}` }
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
//   if (error)
//     return <div className="text-center py-20 text-red-500">{error}</div>;

//   const ProductColumn = ({ title, items }) => (
//     <div className="flex flex-col gap-4">
//       <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>

//       <div className="flex flex-col gap-3">
//         {items.slice(0, 3).map((product) => (
//           <div
//             key={product._id}
//             className="group flex items-center p-2 border border-gray-100 rounded-md hover:border-green-500 transition-colors bg-white"
//           >
//             <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center overflow-hidden">
//               <img
//                 src={getProductImage(product)}
//                 alt={product.name}
//                 className="w-full h-full object-contain"
//               />
//             </div>

//             <div className="ml-4 flex-grow">
//               <h3 className="text-sm text-gray-600">{product.name}</h3>

//               <div className="text-base font-semibold text-gray-900 mt-0.5">
//                 ₹{product.price}
//               </div>

//               <div className="flex text-orange-400 text-[10px] mt-1">
//                 {[...Array(5)].map((_, i) => (
//                   <FaStar
//                     key={i}
//                     className={i < 4 ? "fill-current" : "text-gray-200"}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div className="hidden group-hover:flex items-center gap-2 pr-2">
//               <button
//                 onClick={() => addToCart(product)}
//                 className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
//               >
//                 <HiOutlineShoppingBag size={14} />
//               </button>

//               <button className="p-2 border border-gray-200 text-gray-400 rounded-full hover:bg-gray-50">
//                 <FiEye size={14} />
//               </button>

//               <button
//                 onClick={() => toggleWishlist(product)}
//                 className="p-2 border border-gray-200 text-gray-400 rounded-full hover:bg-gray-50"
//               >
//                 <FaHeart
//                   size={14}
//                   className={wishlistIds.has(product._id) ? "text-red-500" : ""}
//                 />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   return (
//     <section className="max-w-7xl mx-auto px-4 font-sans py-10">

//       {/* HEADER */}
//       <div className="flex flex-col items-center text-center mb-12">
//         <div className="relative inline-block">
//           <h2 className="text-5xl md:text-6xl font-serif text-[#4A1D1F]">
//             Featured{" "}
//             <span className="italic text-[#A22161]">Products</span>
//           </h2>

//           {/* <svg
//             className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-64 h-3"
//             viewBox="0 0 200 20"
//             fill="none"
//           >
//             <path
//               d="M5 15C30 12 60 10 100 10C140 10 170 12 195 15"
//               stroke="#D80073"
//               strokeWidth="6"
//               strokeLinecap="round"
//               className="opacity-30"
//             />
//           </svg> */}
//         </div>
//       </div>

//       {/* FEATURED GRID */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

//         {/* PROMO BANNER */}
//         <div className="relative rounded-sm overflow-hidden h-[420px] group bg-orange-50">
//           <img
//             src="https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&q=80&w=800"
//             alt="Summer Sale"
//             className="w-full h-full object-cover brightness-75"
//           />

//           <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
//             <p className="uppercase tracking-widest text-sm mb-2">
//               Summer Sale
//             </p>

//             <h3 className="text-5xl font-bold text-orange-400 mb-2">
//               50% off
//             </h3>

//             <p className="text-lg italic font-light mb-6">
//               Rich, Pure & Wholesome
//             </p>

//             <h4 className="text-4xl font-serif text-orange-300 mb-8">
//               Dry Fruits
//             </h4>

//             <button className="bg-white text-orange-600 px-6 py-2 rounded-md font-bold hover:bg-orange-600 hover:text-white transition-colors">
//               Shop Now
//             </button>
//           </div>
//         </div>

//         {/* PRODUCT CARDS */}
//         {featuredProducts.map((product) => (
//           <div
//             key={product._id}
//             className="border border-gray-100 rounded-sm group relative bg-white hover:shadow-md transition-shadow h-[420px] flex flex-col"
//           >
//             <div className="relative h-72 overflow-hidden bg-gray-50">
//               <img
//                 src={getProductImage(product)}
//                 alt={product.name}
//                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//               />

//               <div className="absolute top-3 right-3 flex flex-col gap-2">
//                 <button
//                   onClick={() => toggleWishlist(product)}
//                   className={`p-2 rounded-full shadow-sm ${
//                     wishlistIds.has(product._id)
//                       ? "bg-pink-500 text-white"
//                       : "bg-white text-gray-400 hover:text-pink-500"
//                   }`}
//                 >
//                   <FaHeart size={18} />
//                 </button>

//                 <button className="p-2 bg-white text-gray-400 rounded-full shadow-sm hover:text-green-600">
//                   <FiEye size={18} />
//                 </button>
//               </div>

//               <button
//                 onClick={() => {
//                   addToCart(product);
//                   toast.success("Added to cart");
//                 }}
//                 className="absolute bottom-4 right-4 bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-600 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
//               >
//                 <HiOutlineShoppingBag size={22} />
//               </button>
//             </div>

//             <div className="p-4">
//               <p className="text-gray-400 text-sm mb-1 capitalize">
//                 {product.category || "Product"}
//               </p>

//               <h3 className="font-medium text-gray-800 mb-1 truncate">
//                 {product.name}
//               </h3>

//               <span className="text-lg font-bold text-gray-900">
//                 ₹{product.price}
//               </span>

//               <div className="flex text-orange-400 text-xs mt-2">
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

//       {/* PRODUCT SHOWCASE */}
//       <div className="max-w-7xl mx-auto px-4 pt-12">
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">

//           <ProductColumn title="Hot Deals" items={products} />

//           <ProductColumn
//             title="Best Seller"
//             items={[...products].reverse()}
//           />

//           <ProductColumn title="Top Rated" items={products.slice(2)} />

//           <div className="hidden lg:block rounded-xl bg-gray-100 border-2 border-dashed border-gray-200 min-h-[420px] flex items-center justify-center overflow-hidden">
//             <img
//               src={Banner2}
//               alt="Special Offers"
//               className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//             />
//           </div>
//         </div>
//       </div>

//       {/* VIEW ALL BUTTON */}
//       <div className="flex justify-center  -mt-20">
//         <Link
//           to="/shop"
//           className="group flex items-center gap-3 bg-[#A22161] text-white px-8 py-4 rounded-full font-bold hover:bg-[#851b4f] transition-all shadow-lg hover:shadow-pink-200"
//         >
//           View All Range
//           <ArrowRight
//             size={20}
//             className="group-hover:translate-x-2 transition-transform"
//           />
//         </Link>
//       </div>
//     </section>
//   );
// }





// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useCart } from "../context/CartContext";
// import { FaHeart, FaStar } from "react-icons/fa";
// import { FiEye } from "react-icons/fi";
// import { HiOutlineShoppingBag } from "react-icons/hi";
// import { toast } from "react-hot-toast";
// import { ArrowRight } from "lucide-react";
// import { Link } from "react-router-dom";

// import Banner2 from "../assets/Banner2.jpg";

// export default function ProductShowcase() {
//   const [products, setProducts] = useState([]);
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [wishlistIds, setWishlistIds] = useState(new Set());
//   const [activeTab, setActiveTab] = useState("hot");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { addToCart } = useCart();

//   const API_PRODUCTS = "http://localhost:5000/api/products";
//   const API_WISHLIST = "http://localhost:5000/api/wishlist";

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const prodRes = await axios.get(API_PRODUCTS);
//         const productsData = Array.isArray(prodRes.data) ? prodRes.data : [];

//         setProducts(productsData);
//         setFeaturedProducts(productsData.slice(0, 4));

//         fetchWishlist();
//       } catch (err) {
//         setError("Failed to load products");
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
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         setWishlistIds((prev) => new Set(prev).add(product._id));

//         toast.success("Added to wishlist ❤️");
//       }
//     } catch {
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
//   if (error)
//     return <div className="text-center py-20 text-red-500">{error}</div>;

//   const tabs = {
//     hot: products,
//     best: [...products].reverse(),
//     rated: products.slice(2),
//   };

//   return (
//     <section className="max-w-7xl mx-auto px-4 font-sans py-10">
//       {/* HEADER */}
//       <div className="flex flex-col items-center text-center mb-12">
//         <h2 className="text-5xl md:text-6xl font-serif text-[#4A1D1F]">
//           Featured <span className="italic text-[#A22161]">Products</span>
//         </h2>
//       </div>

//       {/* FEATURED GRID */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//         {/* PROMO BANNER */}
//         <div className="relative rounded-sm overflow-hidden h-[420px] group bg-orange-50">
//           <img
//             src="https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&q=80&w=800"
//             alt="Summer Sale"
//             className="w-full h-full object-cover brightness-75"
//           />

//           <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
//             <p className="uppercase tracking-widest text-sm mb-2">Summer Sale</p>
//             <h3 className="text-5xl font-bold text-orange-400 mb-2">50% off</h3>
//             <p className="text-lg italic font-light mb-6">Rich, Pure & Wholesome</p>
//             <h4 className="text-4xl font-serif text-orange-300 mb-8">Dry Fruits</h4>
//             <button className="bg-white text-orange-600 px-6 py-2 rounded-md font-bold hover:bg-orange-600 hover:text-white transition-colors">
//               Shop Now
//             </button>
//           </div>
//         </div>

//         {/* FEATURED PRODUCTS */}
//         {featuredProducts.map((product) => (
//           <div
//             key={product._id}
//             className="border border-gray-100 rounded-sm group relative bg-white hover:shadow-md transition-shadow h-[420px] flex flex-col"
//           >
//             <div className="relative h-72 overflow-hidden bg-gray-50">
//               <img
//                 src={getProductImage(product)}
//                 alt={product.name}
//                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//               />

//               <div className="absolute top-3 right-3 flex flex-col gap-2">
//                 <button
//                   onClick={() => toggleWishlist(product)}
//                   className={`p-2 rounded-full shadow-sm transition-colors ${
//                     wishlistIds.has(product._id)
//                       ? "bg-pink-500 text-white"
//                       : "bg-white text-gray-400 hover:text-pink-500"
//                   }`}
//                 >
//                   <FaHeart size={18} />
//                 </button>
//                 <button className="p-2 bg-white text-gray-400 rounded-full shadow-sm hover:text-green-600">
//                   <FiEye size={18} />
//                 </button>
//               </div>
//             </div>

//             {/* TEXT AREA WITH CART INTEGRATED */}
//             <div className="p-4 flex justify-between items-start">
//               <div className="flex-1 min-w-0">
//                 <p className="text-gray-400 text-sm mb-1 capitalize">
//                   {product.category || "Product"}
//                 </p>
//                 <h3 className="font-medium text-gray-800 mb-1 truncate">
//                   {product.name}
//                 </h3>
//                 <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
//                 <div className="flex text-orange-400 text-xs mt-2">
//                   {[...Array(5)].map((_, i) => (
//                     <FaStar key={i} className={i < 4 ? "fill-current" : "text-gray-200"} />
//                   ))}
//                 </div>
//               </div>

//               <button
//                 onClick={() => {
//                   addToCart(product);
//                   toast.success("Added to cart");
//                 }}
//                 className="bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-600 transition-colors ml-2"
//               >
//                 <HiOutlineShoppingBag size={22} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* TABS SECTION */}
//       <div className="max-w-7xl mx-auto pt-16 grid grid-cols-1 lg:grid-cols-4 gap-8">
//         <div className="lg:col-span-3">
//           {/* TAB BUTTONS */}
//           <div className="flex gap-6 border-b mb-6">
//             {["hot", "best", "rated"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`pb-2 font-semibold capitalize transition-colors ${
//                   activeTab === tab
//                     ? "text-pink-600 border-b-2 border-pink-600"
//                     : "text-gray-500 hover:text-pink-400"
//                 }`}
//               >
//                 {tab === "hot" ? "Hot Deals" : tab === "best" ? "Best Seller" : "Top Rated"}
//               </button>
//             ))}
//           </div>

//           {/* HORIZONTAL PRODUCTS GRID WITH HOVER INTERACTION */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
//             {tabs[activeTab].slice(0, 6).map((product) => (
//               <div
//                 key={product._id}
//                 className="group relative flex items-center border border-gray-100 p-3 rounded-md bg-white hover:shadow-md transition-all duration-300 overflow-hidden"
//               >
//                 {/* Product Image */}
//                 <img
//                   src={getProductImage(product)}
//                   alt={product.name}
//                   className="w-20 h-20 object-contain transition-transform duration-300 group-hover:scale-110"
//                 />

//                 {/* Text Info (Fades out on hover) */}
//                 <div className="ml-4 transition-opacity duration-300 group-hover:opacity-0">
//                   <h3 className="text-sm text-gray-700 truncate w-32">{product.name}</h3>
//                   <div className="text-base font-semibold text-gray-900">₹{product.price}</div>
//                   <div className="flex text-orange-400 text-xs mt-1">
//                     {[...Array(5)].map((_, i) => (
//                       <FaStar key={i} className={i < 4 ? "fill-current" : "text-gray-200"} />
//                     ))}
//                   </div>
//                 </div>

//                 {/* Hover Icons (Slides in on hover) */}
//                 <div className="absolute right-4 flex items-center gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
//                   <button
//                     onClick={() => {
//                       addToCart(product);
//                       toast.success("Added to cart");
//                     }}
//                     className="p-2 bg-[#28a745] text-white rounded-full hover:bg-green-600 shadow-md transition-colors"
//                   >
//                     <HiOutlineShoppingBag size={18} />
//                   </button>
//                   <button className="p-2 bg-white border border-gray-100 text-gray-400 rounded-full hover:text-blue-500 hover:border-blue-500 shadow-sm transition-colors">
//                     <FiEye size={18} />
//                   </button>
//                   <button
//                     onClick={() => toggleWishlist(product)}
//                     className={`p-2 rounded-full border shadow-sm transition-colors ${
//                       wishlistIds.has(product._id)
//                         ? "bg-pink-50 border-pink-200 text-pink-500"
//                         : "bg-white border-gray-100 text-gray-400 hover:text-pink-500"
//                     }`}
//                   >
//                     <FaHeart size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* FIXED BANNER */}
//         <div className="hidden lg:block rounded-xl bg-gray-100 border-2 border-dashed border-gray-200 min-h-[420px] overflow-hidden">
//           <img src={Banner2} alt="Special Offers" className="w-full h-full object-cover" />
//         </div>
//       </div>

//       {/* VIEW ALL BUTTON */}
//       <div className="flex justify-center mt-12">
//         <Link
//           to="/shop"
//           className="group flex items-center gap-3 bg-[#A22161] text-white px-8 py-4 rounded-full font-bold hover:bg-[#851b4f] transition-all"
//         >
//           View All Range
//           <ArrowRight size={20} />
//         </Link>
//       </div>
//     </section>
//   );
// }



 
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { FaHeart, FaStar } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Banner2 from "../assets/Banner2.jpg";
import QuickViewModal from "../pages/QuickViewModal";   // ← Import this

export default function ProductShowcase() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState("hot");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addToCart } = useCart();
  const API_PRODUCTS = "http://localhost:5000/api/products";
  const API_WISHLIST = "http://localhost:5000/api/wishlist";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await axios.get(API_PRODUCTS);
        const productsData = Array.isArray(prodRes.data) ? prodRes.data : [];
        setProducts(productsData);
        setFeaturedProducts(productsData.slice(0, 4));
        fetchWishlist();
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(API_WISHLIST, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ids = res.data?.items?.map((i) => i.productId?._id || i.productId) || [];
      setWishlistIds(new Set(ids));
    } catch (err) {
      console.log("Wishlist error");
    }
  };

  const toggleWishlist = async (product, e) => {
    if (e) e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }
    const isAdded = wishlistIds.has(product._id);
    try {
      if (isAdded) {
        await axios.delete(`${API_WISHLIST}/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(product._id);
          return newSet;
        });
        // toast.success("Removed from wishlist");
      } else {
        await axios.post(`${API_WISHLIST}/${product._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistIds((prev) => new Set(prev).add(product._id));
        // toast.success("Added to wishlist ❤️");
      }
    } catch {
      toast.error("Wishlist action failed");
    }
  };

  const getProductImage = (product) => {
    const img = product?.images?.[0];
    return typeof img === "string" ? img : img?.url || "https://via.placeholder.com/300";
  };

  // Navigate to Product Details
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Open Quick View Modal
  const handleQuickView = (product, e) => {
    if (e) e.stopPropagation();
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    addToCart(product);
    // toast.success(`${product.name} added to cart`);
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  const tabs = {
    hot: products,
    best: [...products].reverse(),
    rated: products.slice(2),
  };

  return (
    <section className="max-w-9xl  container mx-auto font-sans py-10">
      {/* HEADER */}
      <div className="flex flex-col items-center text-center mb-12">
        <h2 className="text-5xl md:text-6xl font-serif text-[#4A1D1F]">
          Featured <span className="italic text-[#A22161]">Products</span>
        </h2>
      </div>

      {/* FEATURED GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* PROMO BANNER */}
        <div className="relative rounded-sm overflow-hidden h-[480px] group bg-orange-50">
    
            <img
              src="https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&q=80&w=800"
              alt="Summer Sale"
              className="w-full h-full brightness-75"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
              <p className="uppercase tracking-widest text-sm mb-2">Summer Sale</p>
              <h3 className="text-5xl font-bold text-orange-400 mb-2">50% off</h3>
              <p className="text-lg italic font-light mb-6">Rich, Pure & Wholesome</p>
              <h4 className="text-4xl font-serif text-orange-300 mb-8">Dry Fruits</h4>
              <button className="bg-white text-orange-600 px-6 py-2 rounded-md font-bold hover:bg-orange-600 hover:text-white transition-colors">
                Shop Now
              </button>
            </div>
       
        </div>

        {/* FEATURED PRODUCTS */}
        {featuredProducts.map((product) => (
          <div
            key={product._id}
            onClick={() => handleProductClick(product._id)}
            className="border border-gray-100 rounded-sm group relative bg-white hover:shadow-md transition-shadow h-[480px] flex flex-col cursor-pointer"
          >
            <div className="relative h-82 overflow-hidden bg-gray-50">
              <img
                src={getProductImage(product)}
                alt={product.name}
                className="w-full h-full  group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button
                  onClick={(e) => toggleWishlist(product, e)}
                  className={`p-2 rounded-full shadow-sm transition-colors ${
                    wishlistIds.has(product._id)
                      ? "bg-pink-500 text-white"
                      : "bg-white text-gray-400 hover:text-pink-500"
                  }`}
                >
                  <FaHeart size={18} />
                </button>
                <button
                  onClick={(e) => handleQuickView(product, e)}
                  className="p-2 bg-white text-gray-400 rounded-full shadow-sm hover:text-pink-500"
                >
                  <FiEye size={18} />
                </button>
              </div>
            </div>

            <div className="p-4 flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-sm mb-1 capitalize">
                  {product.category || "Product"}
                </p>
                <h3 className="font-medium text-gray-800 mb-1 truncate">
                  {product.name}
                </h3>
                <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                <div className="flex text-orange-400 text-xs mt-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < 4 ? "fill-current" : "text-gray-200"} />
                  ))}
                </div>
              </div>
              <button
                onClick={(e) => handleAddToCart(product, e)}
                className="bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-600 transition-colors ml-2"
              >
                <HiOutlineShoppingBag size={22} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* TABS SECTION */}
     
    {/* TABS SECTION */}
     <div className="max-w-9xl container mx-auto pt-16  grid grid-cols-1 lg:grid-cols-4 gap-8 bg-[#fdfcf0]">
    <div className="lg:col-span-3">
    {/* Tab Headers */}
    <div className="flex gap-8 border-b border-gray-200 mb-8">
      {["hot", "best", "rated"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-3 text-sm font-bold uppercase tracking-wider transition-all relative ${
            activeTab === tab ? "text-pink-600" : "text-gray-400"
          }`}
        >
          {tab === "hot" ? "Hot Deals" : tab === "best" ? "Best Seller" : "Top Rated"}
          {activeTab === tab && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-600" />
          )}
        </button>
      ))}
    </div>

    {/* Product Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {tabs[activeTab].slice(0, 6).map((product) => (
        <div key={product._id} className="group bg-white   overflow-hidden flex flex-col relative h-[480px] ">
          
          {/* IMAGE CONTAINER */}
          <div className="relative h-82 overflow-hidden ">
            <img
              src={getProductImage(product)}
              alt={product.name}
              className="w-full h-full   transition-transform duration-500 group-hover:scale-105"
            />

            {/* Top Right Actions (Wishlist & View) */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
              <button 
                onClick={(e) => toggleWishlist(product, e)}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${
                  wishlistIds.has(product._id) ? "bg-pink-600 text-white" : "bg-white text-gray-400"
                }`}
              >
                <FaHeart size={18} />
              </button>
              <button 
                onClick={(e) => handleQuickView(product, e)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-md hover:text-pink-600 transition-colors"
              >
                <FiEye size={18} />
              </button>
            </div>

             
          </div>

          {/* TEXT INFO */}
           <div className="p-4 flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-sm mb-1 capitalize">
                  {product.category || "Product"}
                </p>
                <h3 className="font-medium text-gray-800 mb-1 truncate">
                  {product.name}
                </h3>
                <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                <div className="flex text-orange-400 text-xs mt-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < 4 ? "fill-current" : "text-gray-200"} />
                  ))}
                </div>
              </div>
              <button
                onClick={(e) => handleAddToCart(product, e)}
                className="bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-600 transition-colors ml-2"
              >
                <HiOutlineShoppingBag size={22} />
              </button>
            </div>
        </div>
      ))}
    </div>
  </div>

  {/* SIDE BANNER */}
  <div className="hidden lg:block h-full mt-10">
    <div className="sticky top-10 rounded-xl overflow-hidden h-[500px] shadow-sm">
      <img src={Banner2} className="w-full h-full object-cover" alt="Ad" />
    </div>
  </div>
     </div>

      {/* VIEW ALL BUTTON */}
      <div className="flex justify-center mt-12">
        <Link
          to="/shop"
          className="group flex items-center gap-3 bg-[#A22161] text-white px-8 py-4 rounded-full font-bold hover:bg-[#851b4f] transition-all"
        >
          View All Range
          <ArrowRight size={20} />
        </Link>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={toggleWishlist}
      />
    </section>
  );
}



//old tab design section 

{/* <div className="max-w-7xl mx-auto pt-16 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="flex gap-6 border-b mb-6">
            {["hot", "best", "rated"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? "text-pink-600 border-b-2 border-pink-600"
                    : "text-gray-500 hover:text-pink-400"
                }`}
              >
                {tab === "hot" ? "Hot Deals" : tab === "best" ? "Best Seller" : "Top Rated"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
            {tabs[activeTab].slice(0, 6).map((product) => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product._id)}
                className="group relative flex items-center border border-gray-100 p-3 rounded-md bg-white hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
              >
                
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="w-20 h-20 object-contain transition-transform duration-300 group-hover:scale-110"
                />

                
                <div className="ml-4 transition-opacity duration-300 group-hover:opacity-0">
                  <h3 className="text-sm text-gray-700 truncate w-32">{product.name}</h3>
                  <div className="text-base font-semibold text-gray-900">₹{product.price}</div>
                  <div className="flex text-orange-400 text-xs mt-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < 4 ? "fill-current" : "text-gray-200"} />
                    ))}
                  </div>
                </div>

            
                <div className="absolute right-4 flex items-center gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="p-2 bg-[#28a745] text-white rounded-full hover:bg-green-600 shadow-md transition-colors"
                  >
                    <HiOutlineShoppingBag size={18} />
                  </button>
                  <button
                    onClick={(e) => handleQuickView(product, e)}
                    className="p-2 bg-white border border-gray-100 text-gray-400 rounded-full hover:text-pink-500 hover:border-pink-500 shadow-sm transition-colors"
                  >
                    <FiEye size={18} />
                  </button>
                  <button
                    onClick={(e) => toggleWishlist(product, e)}
                    className={`p-2 rounded-full border shadow-sm transition-colors ${
                      wishlistIds.has(product._id)
                        ? "bg-pink-50 border-pink-200 text-pink-500"
                        : "bg-white border-gray-100 text-gray-400 hover:text-pink-500"
                    }`}
                  >
                    <FaHeart size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <div className="hidden lg:block rounded-xl bg-gray-100 border-2 border-dashed border-gray-200 min-h-[420px] overflow-hidden">
          <img src={Banner2} alt="Special Offers" className="w-full h-full object-cover" />
        </div>
      </div> */}