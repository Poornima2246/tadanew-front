 
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useCart } from "../context/CartContext";
// import { FaHeart, FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { FiShoppingCart } from "react-icons/fi";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useSearchParams } from "react-router-dom";

// //file
// import QuickViewModal from "../pages/QuickViewModal";

// export default function Productmain() {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
  
//   const [categories, setCategories] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(""); // "" = all
//   const [wishlistIds, setWishlistIds] = useState(new Set());
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchParams] = useSearchParams();
// const urlCategory = searchParams.get("category");
  
//   const productsPerPage = 12;

//   // New filter states
//   const [priceRange, setPriceRange] = useState([0, 1500]);     // min-max price
//   const [selectedRating, setSelectedRating] = useState(null);   // e.g. 4 → 4.0 & up
//   const [isDraggingMin, setIsDraggingMin] = useState(false);
//   const [isDraggingMax, setIsDraggingMax] = useState(false);

//   const { addToCart } = useCart();


//   const API_PRODUCTS = "http://localhost:5000/api/products";
//   const API_CATEGORIES = "http://localhost:5000/api/categories";
//   const API_WISHLIST = "http://localhost:5000/api/wishlist";



//   useEffect(() => {
//   if (urlCategory) {
//     // Convert slug back to category name if needed
//     const formattedCategory = urlCategory
//       .split('-')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');

//     setSelectedCategory(formattedCategory);
//   }
// }, [urlCategory]);
//   // Fetch data once
//   useEffect(() => {
//     const init = async () => {
//       try {
//         const [catRes, prodRes] = await Promise.all([
//           axios.get(API_CATEGORIES),
//           axios.get(API_PRODUCTS),
//         ]);
//         setCategories(catRes.data || []);
//         setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);

//         // Calculate max price from products
//         if (Array.isArray(prodRes.data) && prodRes.data.length > 0) {
//           const maxProductPrice = Math.max(...prodRes.data.map(p => Number(p.price)));
//           setPriceRange([0, Math.ceil(maxProductPrice)]);
//         }

//         const token = localStorage.getItem("token");
//         if (token) {
//           try {
//             const wishRes = await axios.get(API_WISHLIST, {
//               headers: { Authorization: `Bearer ${token}` },
//             });
//             const ids = wishRes.data?.items
//               ?.map((item) => item.productId?._id || item.productId)
//               .filter(Boolean) || [];
//             setWishlistIds(new Set(ids));
//           } catch (wishErr) {
//             console.log("Wishlist fetch failed", wishErr);
//           }
//         }
//       } catch (err) {
//         console.error("Data fetch error:", err);
//         setError("Failed to load products or categories");
//       } finally {
//         setLoading(false);
//       }
//     };
//     init();
//   }, []);

//   // Combined filtering logic
//   const filteredProducts = products.filter((p) => {
//     // Category filter
//     const matchCategory = !selectedCategory || p.category === selectedCategory;

//     // Price filter
//     const price = Number(p.price);
//     const matchPrice = price >= priceRange[0] && price <= priceRange[1];

//     // Rating filter (if selected)
//     const rating = p.rating || 4.5; // Default rating if not present
//     const matchRating = selectedRating === null || rating >= selectedRating;

//     return matchCategory && matchPrice && matchRating;
//   });

//   // Pagination
//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//   const startIndex = (currentPage - 1) * productsPerPage;
//   const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

//   const changePage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleCategoryClick = (cat) => {
//     setSelectedCategory((prev) => (prev === cat ? "" : cat));
//     setCurrentPage(1);
//   };

//   // Navigate to product details page
//   const handleProductClick = (productId, e) => {
//     // Prevent navigation if clicking on buttons (add to cart, wishlist, quick view)
//     if (e.target.closest('button')) {
//       e.stopPropagation();
//       return;
//     }
//     navigate(`/product/${productId}`);
//   };

//   // Price range handlers with drag functionality
//   const handlePriceSliderMouseDown = (type) => (e) => {
//     e.preventDefault();
//     if (type === "min") {
//       setIsDraggingMin(true);
//     } else {
//       setIsDraggingMax(true);
//     }
//   };

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (!isDraggingMin && !isDraggingMax) return;

//       const slider = document.getElementById('price-slider-container');
//       if (!slider) return;

//       const rect = slider.getBoundingClientRect();
//       const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
//       const percentage = x / rect.width;
//       const maxPrice = priceRange[1];
//       const value = Math.round(percentage * 1500);

//       if (isDraggingMin) {
//         setPriceRange(prev => [Math.min(value, prev[1] - 10), prev[1]]);
//       } else if (isDraggingMax) {
//         setPriceRange(prev => [prev[0], Math.max(value, prev[0] + 10)]);
//       }
//       setCurrentPage(1);
//     };

//     const handleMouseUp = () => {
//       setIsDraggingMin(false);
//       setIsDraggingMax(false);
//     };

//     if (isDraggingMin || isDraggingMax) {
//       window.addEventListener('mousemove', handleMouseMove);
//       window.addEventListener('mouseup', handleMouseUp);
//     }

//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('mouseup', handleMouseUp);
//     };
//   }, [isDraggingMin, isDraggingMax, priceRange]);

//   const handlePriceChange = (type, value) => {
//     setPriceRange((prev) => {
//       const newRange = [...prev];
//       if (type === "min") {
//         newRange[0] = Math.min(Number(value), prev[1] - 10);
//       } else {
//         newRange[1] = Math.max(Number(value), prev[0] + 10);
//       }
//       return newRange;
//     });
//     setCurrentPage(1);
//   };

//   const handleRatingChange = (rating) => {
//     setSelectedRating((prev) => (prev === rating ? null : rating));
//     setCurrentPage(1);
//   };

//   const getProductImage = (product) => {
//     const fallback = "https://via.placeholder.com/300";
//     if (!product?.images?.length) return fallback;
//     const img = product.images[0];
//     return typeof img === "string" ? img : img.url || fallback;
//   };

//   const handleAddToCart = (product, e) => {
//     e.stopPropagation(); // Prevent navigation to product details
//     addToCart(product);
//     toast.success(`${product.name} added to cart`);
//   };

//   const toggleWishlist = async (product, e) => {
//     e.stopPropagation(); // Prevent navigation to product details
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Please login to use wishlist");
//       return;
//     }
//     const productId = product._id;
//     const isCurrentlyInWishlist = wishlistIds.has(productId);
//     const url = `${API_WISHLIST}/${productId}`;

//     try {
//       let res;
//       if (isCurrentlyInWishlist) {
//         res = await axios.delete(url, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       } else {
//         res = await axios.post(url, {}, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       }
//       if (res.data?.success) {
//         setWishlistIds((prev) => {
//           const next = new Set(prev);
//           isCurrentlyInWishlist ? next.delete(productId) : next.add(productId);
//           return next;
//         });
//         toast.success(
//           isCurrentlyInWishlist ? "Removed from wishlist" : "Added to wishlist ❤️"
//         );
//       }
//     } catch (err) {
//       toast.error("Wishlist action failed");
//     }
//   };

//   const handleQuickView = (product, e) => {
//     e.stopPropagation(); // Prevent navigation to product details
//     setSelectedProduct(product);
//     setIsModalOpen(true);
//   };

//   if (loading) return <div className="flex items-center justify-center">Loading...</div>;
//   if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

//   return (
//     <div className="bg-white font-sans text-gray-800">
//       {/* Breadcrumb */}
//       <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-400 flex gap-2">
//         <span>🏠</span> <span>› Product ›</span> <span className="text-pink-500">Honey</span>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-8">
//         {/* SIDEBAR */}
//         <aside className="w-full md:w-64 flex-shrink-0">
//           <button className="w-full bg-pink-500 text-white py-2 px-4 rounded-md flex justify-between items-center mb-8">
//             Filter <span className="rotate-90">|||</span>
//           </button>

//           <div className="space-y-8">
//             {/* Categories */}
//             <div>
//               <h3 className="font-bold text-lg mb-4 flex justify-between items-center">
//                 All Categories <span className="text-xs">▲</span>
//               </h3>
//               <ul className="space-y-3 text-gray-600">
//                 <li
//                   className={`flex items-center gap-2 cursor-pointer hover:text-pink-500 transition-colors ${
//                     selectedCategory === "" ? "text-pink-500 font-medium" : ""
//                   }`}
//                   onClick={() => handleCategoryClick("")}
//                 >
//                   <div
//                     className={`w-4 h-4 border rounded-full flex-shrink-0 ${
//                       selectedCategory === "" ? "border-4 border-pink-500" : "border-gray-400"
//                     }`}
//                   ></div>
//                   All <span className="text-xs text-gray-500">({products.length})</span>
//                 </li>
//                 {categories.map((cat) => {
//                   const isSelected = selectedCategory === cat;
//                   const count = products.filter((p) => p.category === cat).length;
//                   return (
//                     <li
//                       key={cat}
//                       className={`flex items-center gap-2 cursor-pointer hover:text-pink-500 transition-colors ${
//                         isSelected ? "text-pink-500 font-medium" : ""
//                       }`}
//                       onClick={() => handleCategoryClick(cat)}
//                     >
//                       <div
//                         className={`w-4 h-4 border rounded-full flex-shrink-0 ${
//                           isSelected ? "border-4 border-pink-500" : "border-gray-400"
//                         }`}
//                       ></div>
//                       {cat} <span className="text-xs text-gray-500">({count})</span>
//                     </li>
//                   );
//                 })}
//                 {categories.length === 0 && (
//                   <li className="text-gray-400 text-sm">No categories found</li>
//                 )}
//               </ul>
//             </div>

//             {/* Price – now interactive with drag functionality */}
//             <div>
//               <h3 className="font-bold text-lg mb-4 flex justify-between items-center">
//                 Price <span>▲</span>
//               </h3>
//               <div 
//                 id="price-slider-container"
//                 className="relative h-1 bg-gray-200 rounded-full mb-2 cursor-pointer"
//               >
//                 {/* Visual representation – approximate position */}
//                 <div
//                   className="absolute h-full bg-pink-500 rounded-full"
//                   style={{
//                     left: `${(priceRange[0] / 1500) * 100}%`,
//                     width: `${((priceRange[1] - priceRange[0]) / 1500) * 100}%`,
//                   }}
//                 ></div>
//                 <div
//                   className="absolute w-4 h-4 bg-white border-2 border-pink-500 rounded-full -top-1.5 shadow-sm cursor-grab active:cursor-grabbing"
//                   style={{ left: `${(priceRange[0] / 1500) * 100}%` }}
//                   onMouseDown={handlePriceSliderMouseDown("min")}
//                   title="Drag to adjust minimum price"
//                 ></div>
//                 <div
//                   className="absolute w-4 h-4 bg-white border-2 border-pink-500 rounded-full -top-1.5 shadow-sm cursor-grab active:cursor-grabbing"
//                   style={{ left: `${(priceRange[1] / 1500) * 100}%` }}
//                   onMouseDown={handlePriceSliderMouseDown("max")}
//                   title="Drag to adjust maximum price"
//                 ></div>
//               </div>
//               <div className="flex justify-between items-center mt-4">
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-gray-500">Min:</span>
//                   <input
//                     type="number"
//                     value={priceRange[0]}
//                     onChange={(e) => handlePriceChange("min", Number(e.target.value))}
//                     className="w-20 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:border-pink-500"
//                     min="0"
//                     max={priceRange[1] - 10}
//                   />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-gray-500">Max:</span>
//                   <input
//                     type="number"
//                     value={priceRange[1]}
//                     onChange={(e) => handlePriceChange("max", Number(e.target.value))}
//                     className="w-20 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:border-pink-500"
//                     min={priceRange[0] + 10}
//                     max="1500"
//                   />
//                 </div>
//               </div>
//               <p className="text-sm text-gray-500 mt-2">
//                 Price: ₹{priceRange[0]} — ₹{priceRange[1]}
//               </p>
//             </div>

//             {/* Rating – now interactive */}
//             <div>
//               <h3 className="font-bold text-lg mb-4 flex justify-between items-center">
//                 Rating <span>▲</span>
//               </h3>
//               <div className="space-y-2">
//                 {[5, 4, 3, 2, 1].map((star) => (
//                   <label
//                     key={star}
//                     className="flex items-center gap-2 cursor-pointer group"
//                     onClick={() => handleRatingChange(star)}
//                   >
//                     <input
//                       type="checkbox"
//                       className="accent-pink-500 w-4 h-4 cursor-pointer"
//                       checked={selectedRating === star}
//                       onChange={() => {}} // Handled by parent label onClick
//                     />
//                     <span className="text-yellow-400 text-sm">
//                       {"★".repeat(star)}
//                       {"☆".repeat(5 - star)}
//                     </span>
//                     <span className="text-xs text-gray-500 group-hover:text-pink-500 transition-colors">
//                       {star}.0 & up
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* MAIN CONTENT */}
//         <main className="flex-1">
//           <div className="flex justify-between items-center mb-6 text-sm">
//             <div className="flex items-center gap-2">
//               <span className="text-gray-400">Sort by:</span>
//               <select className="border-none font-medium focus:ring-0">
//                 <option>Latest</option>
//               </select>
//             </div>
//             <p className="text-gray-400">
//               <span className="text-gray-900 font-bold">{filteredProducts.length}</span> Results Found
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {currentProducts.map((product) => (
//               <div
//                 key={product._id}
//                 onClick={(e) => handleProductClick(product._id, e)}
//                 className="group border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-all relative cursor-pointer"
//               >
//                 <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
//                   <button
//                     onClick={(e) => toggleWishlist(product, e)}
//                     className={`p-2 rounded-full border bg-white hover:scale-110 transition-transform ${
//                       wishlistIds.has(product._id) ? "text-pink-500 border-pink-500" : "text-gray-400 hover:text-pink-500"
//                     }`}
//                   >
//                     <FaHeart size={14} />
//                   </button>

//                   <button
//                     onClick={(e) => handleQuickView(product, e)}
//                     className="p-2 rounded-full border bg-white text-gray-400 hover:text-pink-500 hover:scale-110 transition-transform"
//                   >
//                     <FaEye size={14} />
//                   </button>
//                 </div>
//                 <div className="aspect-square bg-gray-50 overflow-hidden">
//                   <img
//                     src={getProductImage(product)}
//                     alt={product.name}
//                     className="w-full h-full object-cover transition-transform group-hover:scale-105"
//                   />
//                 </div>
//                 <div className="p-4 bg-white border-t border-gray-50">
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
//                         {product.name}
//                       </h3>
//                       <p className="text-lg font-bold text-gray-900 mt-1">
//                         ₹{Number(product.price).toFixed(2)}
//                       </p>
//                       <div className="text-yellow-400 text-[10px] mt-1">
//                         {"★".repeat(Math.floor(product.rating || 4))}
//                         {"☆".repeat(5 - Math.floor(product.rating || 4))}
//                       </div>
//                     </div>
//                     <button
//                       onClick={(e) => handleAddToCart(product, e)}
//                       className="p-3 bg-gray-100 rounded-full hover:bg-pink-500 hover:text-white transition-colors hover:scale-110"
//                     >
//                       <FiShoppingCart size={18} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {totalPages > 1 && (
//             <div className="my-12 flex justify-center items-center gap-1">
//               <button
//                 onClick={() => changePage(currentPage - 1)}
//                 className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={currentPage === 1}
//               >
//                 <FaChevronLeft size={12} />
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => changePage(page)}
//                   className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
//                     currentPage === page
//                       ? "bg-pink-500 text-white"
//                       : "text-gray-600 hover:bg-gray-100"
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}
//               <button
//                 onClick={() => changePage(currentPage + 1)}
//                 className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={currentPage === totalPages}
//               >
//                 <FaChevronRight size={12} />
//               </button>
//             </div>
//           )}

//           <QuickViewModal
//             product={selectedProduct}
//             isOpen={isModalOpen}
//             onClose={() => setIsModalOpen(false)}
//             onAddToCart={handleAddToCart}
//             onToggleWishlist={toggleWishlist}
//           />
//         </main>
//       </div>
//     </div>
//   );
// }




// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { useCart } from "../context/CartContext";
// import { FaHeart, FaEye, FaChevronLeft, FaChevronRight, FaSlidersH, FaTimes, FaFilter, FaStar, FaRegStar } from "react-icons/fa";
// import { FiShoppingCart } from "react-icons/fi";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useSearchParams } from "react-router-dom";
// import { MdOutlineCategory, MdAttachMoney, MdStar } from "react-icons/md";

// //file
// import QuickViewModal from "../pages/QuickViewModal";

// export default function Productmain() {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
  
//   const [categories, setCategories] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(""); // "" = all
//   const [wishlistIds, setWishlistIds] = useState(new Set());
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchParams] = useSearchParams();
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [activeFilterTab, setActiveFilterTab] = useState("categories");
  
//   const urlCategory = searchParams.get("category");
  
//   const productsPerPage = 12;

//   // New filter states
//   const [priceRange, setPriceRange] = useState([0, 1500]);     // min-max price
//   const [selectedRating, setSelectedRating] = useState(null);   // e.g. 4 → 4.0 & up
//   const [isDraggingMin, setIsDraggingMin] = useState(false);
//   const [isDraggingMax, setIsDraggingMax] = useState(false);
//   const [isSidebarSticky, setIsSidebarSticky] = useState(false);
//   const [expandedSections, setExpandedSections] = useState({
//     categories: true,
//     price: true,
//     rating: true
//   });

//   const { addToCart } = useCart();

//   const API_PRODUCTS = "http://localhost:5000/api/products";
//   const API_CATEGORIES = "http://localhost:5000/api/categories";
//   const API_WISHLIST = "http://localhost:5000/api/wishlist";

//   useEffect(() => {
//     if (urlCategory) {
//       const formattedCategory = urlCategory
//         .split('-')
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ');
//       setSelectedCategory(formattedCategory);
//     }
//   }, [urlCategory]);

//   // Fetch data once
//   useEffect(() => {
//     const init = async () => {
//       try {
//         const [catRes, prodRes] = await Promise.all([
//           axios.get(API_CATEGORIES),
//           axios.get(API_PRODUCTS),
//         ]);
//         setCategories(catRes.data || []);
//         setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);

//         if (Array.isArray(prodRes.data) && prodRes.data.length > 0) {
//           const maxProductPrice = Math.max(...prodRes.data.map(p => Number(p.price)));
//           setPriceRange([0, Math.ceil(maxProductPrice)]);
//         }

//         const token = localStorage.getItem("token");
//         if (token) {
//           try {
//             const wishRes = await axios.get(API_WISHLIST, {
//               headers: { Authorization: `Bearer ${token}` },
//             });
//             const ids = wishRes.data?.items
//               ?.map((item) => item.productId?._id || item.productId)
//               .filter(Boolean) || [];
//             setWishlistIds(new Set(ids));
//           } catch (wishErr) {
//             console.log("Wishlist fetch failed", wishErr);
//           }
//         }
//       } catch (err) {
//         console.error("Data fetch error:", err);
//         setError("Failed to load products or categories");
//       } finally {
//         setLoading(false);
//       }
//     };
//     init();
//   }, []);

//   // Sticky sidebar effect
//   useEffect(() => {
//     const handleScroll = () => {
//       const sidebar = document.querySelector('.sidebar-sticky-container');
//       const mainContent = document.querySelector('.main-content-area');
      
//       if (sidebar && mainContent) {
//         const mainRect = mainContent.getBoundingClientRect();
//         if (mainRect.top <= 80) {
//           setIsSidebarSticky(true);
//         } else {
//           setIsSidebarSticky(false);
//         }
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Combined filtering logic
//   const filteredProducts = products.filter((p) => {
//     const matchCategory = !selectedCategory || p.category === selectedCategory;
//     const price = Number(p.price);
//     const matchPrice = price >= priceRange[0] && price <= priceRange[1];
//     const rating = p.rating || 4.5;
//     const matchRating = selectedRating === null || rating >= selectedRating;
//     return matchCategory && matchPrice && matchRating;
//   });

//   // Pagination
//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//   const startIndex = (currentPage - 1) * productsPerPage;
//   const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

//   const changePage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleCategoryClick = (cat) => {
//     setSelectedCategory((prev) => (prev === cat ? "" : cat));
//     setCurrentPage(1);
//   };

//   const handleProductClick = (productId, e) => {
//     if (e.target.closest('button')) {
//       e.stopPropagation();
//       return;
//     }
//     navigate(`/product/${productId}`);
//   };

//   const handlePriceSliderMouseDown = (type) => (e) => {
//     e.preventDefault();
//     if (type === "min") {
//       setIsDraggingMin(true);
//     } else {
//       setIsDraggingMax(true);
//     }
//   };

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (!isDraggingMin && !isDraggingMax) return;

//       const slider = document.getElementById('price-slider-container');
//       if (!slider) return;

//       const rect = slider.getBoundingClientRect();
//       const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
//       const percentage = x / rect.width;
//       const maxPrice = priceRange[1];
//       const value = Math.round(percentage * 1500);

//       if (isDraggingMin) {
//         setPriceRange(prev => [Math.min(value, prev[1] - 10), prev[1]]);
//       } else if (isDraggingMax) {
//         setPriceRange(prev => [prev[0], Math.max(value, prev[0] + 10)]);
//       }
//       setCurrentPage(1);
//     };

//     const handleMouseUp = () => {
//       setIsDraggingMin(false);
//       setIsDraggingMax(false);
//     };

//     if (isDraggingMin || isDraggingMax) {
//       window.addEventListener('mousemove', handleMouseMove);
//       window.addEventListener('mouseup', handleMouseUp);
//     }

//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('mouseup', handleMouseUp);
//     };
//   }, [isDraggingMin, isDraggingMax, priceRange]);

//   const handlePriceChange = (type, value) => {
//     setPriceRange((prev) => {
//       const newRange = [...prev];
//       if (type === "min") {
//         newRange[0] = Math.min(Number(value), prev[1] - 10);
//       } else {
//         newRange[1] = Math.max(Number(value), prev[0] + 10);
//       }
//       return newRange;
//     });
//     setCurrentPage(1);
//   };

//   const handleRatingChange = (rating) => {
//     setSelectedRating((prev) => (prev === rating ? null : rating));
//     setCurrentPage(1);
//   };

//   const getProductImage = (product) => {
//     const fallback = "https://via.placeholder.com/300";
//     if (!product?.images?.length) return fallback;
//     const img = product.images[0];
//     return typeof img === "string" ? img : img.url || fallback;
//   };

//   const handleAddToCart = (product, e) => {
//     e.stopPropagation();
//     addToCart(product);
//     toast.success(`${product.name} added to cart`);
//   };

//   const toggleWishlist = async (product, e) => {
//     e.stopPropagation();
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Please login to use wishlist");
//       return;
//     }
//     const productId = product._id;
//     const isCurrentlyInWishlist = wishlistIds.has(productId);
//     const url = `${API_WISHLIST}/${productId}`;

//     try {
//       let res;
//       if (isCurrentlyInWishlist) {
//         res = await axios.delete(url, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       } else {
//         res = await axios.post(url, {}, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       }
//       if (res.data?.success) {
//         setWishlistIds((prev) => {
//           const next = new Set(prev);
//           isCurrentlyInWishlist ? next.delete(productId) : next.add(productId);
//           return next;
//         });
//         toast.success(
//           isCurrentlyInWishlist ? "Removed from wishlist" : "Added to wishlist ❤️"
//         );
//       }
//     } catch (err) {
//       toast.error("Wishlist action failed");
//     }
//   };

//   const handleQuickView = (product, e) => {
//     e.stopPropagation();
//     setSelectedProduct(product);
//     setIsModalOpen(true);
//   };

//   const toggleSection = (section) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   const clearAllFilters = () => {
//     setSelectedCategory("");
//     setPriceRange([0, 1500]);
//     setSelectedRating(null);
//     setCurrentPage(1);
//     toast.success("All filters cleared");
//   };

//   const getActiveFiltersCount = () => {
//     let count = 0;
//     if (selectedCategory) count++;
//     if (selectedRating) count++;
//     if (priceRange[0] > 0 || priceRange[1] < 1500) count++;
//     return count;
//   };

//   if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
//   if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

//   return (
//     <div className="bg-gradient-to-br from-gray-50 to-white font-sans text-gray-800">
//       {/* Breadcrumb */}
//       <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-500">
//         <div className="flex gap-2 items-center">
//           <span className="hover:text-pink-500 cursor-pointer transition-colors">🏠 Home</span> 
//           <span className="text-gray-300">›</span> 
//           <span className="hover:text-pink-500 cursor-pointer transition-colors">Product</span> 
//           <span className="text-gray-300">›</span> 
//           <span className="text-pink-500 font-medium">Honey</span>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-8 relative">
//         {/* Mobile Filter Button */}
//         <div className="lg:hidden fixed bottom-6 right-6 z-50">
//           <button
//             onClick={() => setIsFilterOpen(!isFilterOpen)}
//             className="bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition-all transform hover:scale-105"
//           >
//             <div className="relative">
//               <FaFilter size={20} />
//               {getActiveFiltersCount() > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                   {getActiveFiltersCount()}
//                 </span>
//               )}
//             </div>
//           </button>
//         </div>

//         {/* Mobile Filter Drawer */}
//         {isFilterOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={() => setIsFilterOpen(false)}>
//             <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform" onClick={e => e.stopPropagation()}>
//               <div className="p-4 border-b flex justify-between items-center">
//                 <h3 className="font-bold text-lg">Filters</h3>
//                 <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
//                   <FaTimes />
//                 </button>
//               </div>
//               <div className="p-4 overflow-y-auto h-full pb-24">
//                 <FilterContent
//                   categories={categories}
//                   products={products}
//                   selectedCategory={selectedCategory}
//                   handleCategoryClick={handleCategoryClick}
//                   priceRange={priceRange}
//                   handlePriceSliderMouseDown={handlePriceSliderMouseDown}
//                   handlePriceChange={handlePriceChange}
//                   selectedRating={selectedRating}
//                   handleRatingChange={handleRatingChange}
//                   expandedSections={expandedSections}
//                   toggleSection={toggleSection}
//                   clearAllFilters={clearAllFilters}
//                   getActiveFiltersCount={getActiveFiltersCount}
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Desktop Sidebar */}
//         <aside className={`hidden lg:block w-80 flex-shrink-0 transition-all duration-300 ${
//           isSidebarSticky ? 'lg:sticky lg:top-24' : ''
//         }`}>
//           <div className="sidebar-sticky-container bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//             <div className="flex justify-between items-center mb-6 pb-4 border-b">
//               <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
//                 Filters
//               </h2>
//               {getActiveFiltersCount() > 0 && (
//                 <button
//                   onClick={clearAllFilters}
//                   className="text-sm text-pink-500 hover:text-pink-600 transition-colors flex items-center gap-1"
//                 >
//                   <FaTimes size={12} />
//                   Clear all
//                 </button>
//               )}
//             </div>
            
//             <FilterContent
//               categories={categories}
//               products={products}
//               selectedCategory={selectedCategory}
//               handleCategoryClick={handleCategoryClick}
//               priceRange={priceRange}
//               handlePriceSliderMouseDown={handlePriceSliderMouseDown}
//               handlePriceChange={handlePriceChange}
//               selectedRating={selectedRating}
//               handleRatingChange={handleRatingChange}
//               expandedSections={expandedSections}
//               toggleSection={toggleSection}
//               clearAllFilters={clearAllFilters}
//               getActiveFiltersCount={getActiveFiltersCount}
//             />
//           </div>
//         </aside>

//         {/* MAIN CONTENT */}
//         <main className="flex-1 main-content-area">
//           {/* Header with results and sort */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
//             <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></div>
//                 <p className="text-gray-700">
//                   Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> results
//                   {selectedCategory && <span className="text-pink-500"> in {selectedCategory}</span>}
//                 </p>
//               </div>
//               <div className="flex items-center gap-3">
//                 <span className="text-gray-500 text-sm">Sort by:</span>
//                 <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-500 bg-white">
//                   <option>Latest</option>
//                   <option>Price: Low to High</option>
//                   <option>Price: High to Low</option>
//                   <option>Popularity</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Products Grid - UNCHANGED */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {currentProducts.map((product) => (
//               <div
//                 key={product._id}
//                 onClick={(e) => handleProductClick(product._id, e)}
//                 className="group border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-all relative cursor-pointer"
//               >
//                 <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
//                   <button
//                     onClick={(e) => toggleWishlist(product, e)}
//                     className={`p-2 rounded-full border bg-white hover:scale-110 transition-transform ${
//                       wishlistIds.has(product._id) ? "text-pink-500 border-pink-500" : "text-gray-400 hover:text-pink-500"
//                     }`}
//                   >
//                     <FaHeart size={14} />
//                   </button>

//                   <button
//                     onClick={(e) => handleQuickView(product, e)}
//                     className="p-2 rounded-full border bg-white text-gray-400 hover:text-pink-500 hover:scale-110 transition-transform"
//                   >
//                     <FaEye size={14} />
//                   </button>
//                 </div>
//                 <div className="aspect-square bg-gray-50 overflow-hidden">
//                   <img
//                     src={getProductImage(product)}
//                     alt={product.name}
//                     className="w-full h-full object-cover transition-transform group-hover:scale-105"
//                   />
//                 </div>
//                 <div className="p-4 bg-white border-t border-gray-50">
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
//                         {product.name}
//                       </h3>
//                       <p className="text-lg font-bold text-gray-900 mt-1">
//                         ₹{Number(product.price).toFixed(2)}
//                       </p>
//                       <div className="text-yellow-400 text-[10px] mt-1">
//                         {"★".repeat(Math.floor(product.rating || 4))}
//                         {"☆".repeat(5 - Math.floor(product.rating || 4))}
//                       </div>
//                     </div>
//                     <button
//                       onClick={(e) => handleAddToCart(product, e)}
//                       className="p-3 bg-gray-100 rounded-full hover:bg-pink-500 hover:text-white transition-colors hover:scale-110"
//                     >
//                       <FiShoppingCart size={18} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="my-12 flex justify-center items-center gap-2">
//               <button
//                 onClick={() => changePage(currentPage - 1)}
//                 className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                 disabled={currentPage === 1}
//               >
//                 <FaChevronLeft size={12} />
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => changePage(page)}
//                   className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
//                     currentPage === page
//                       ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md"
//                       : "text-gray-600 hover:bg-gray-100"
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}
//               <button
//                 onClick={() => changePage(currentPage + 1)}
//                 className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                 disabled={currentPage === totalPages}
//               >
//                 <FaChevronRight size={12} />
//               </button>
//             </div>
//           )}

//           <QuickViewModal
//             product={selectedProduct}
//             isOpen={isModalOpen}
//             onClose={() => setIsModalOpen(false)}
//             onAddToCart={handleAddToCart}
//             onToggleWishlist={toggleWishlist}
//           />
//         </main>
//       </div>
//     </div>
//   );
// }

// // Separate component for filter content to avoid repetition
// function FilterContent({ 
//   categories, products, selectedCategory, handleCategoryClick,
//   priceRange, handlePriceSliderMouseDown, handlePriceChange,
//   selectedRating, handleRatingChange, expandedSections, toggleSection,
//   clearAllFilters, getActiveFiltersCount
// }) {
//   return (
//     <div className="space-y-6">
//       {/* Categories Section */}
//       <div className="filter-section">
//         <button
//           onClick={() => toggleSection('categories')}
//           className="w-full flex justify-between items-center py-2 group"
//         >
//           <div className="flex items-center gap-2">
//             <MdOutlineCategory className="text-pink-500" size={18} />
//             <h3 className="font-semibold text-gray-800">Categories</h3>
//           </div>
//           <span className="text-gray-400 transform transition-transform group-hover:text-pink-500">
//             {expandedSections.categories ? '−' : '+'}
//           </span>
//         </button>
        
//         {expandedSections.categories && (
//           <div className="mt-3 space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
//             <div
//               className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
//                 selectedCategory === "" ? "bg-pink-50 text-pink-500" : "hover:bg-gray-50"
//               }`}
//               onClick={() => handleCategoryClick("")}
//             >
//               <div className="flex items-center gap-2">
//                 <div className={`w-4 h-4 border rounded-full flex-shrink-0 ${
//                   selectedCategory === "" ? "border-4 border-pink-500" : "border-gray-300"
//                 }`}></div>
//                 <span className="text-sm">All Products</span>
//               </div>
//               <span className="text-xs text-gray-400">({products.length})</span>
//             </div>
//             {categories.map((cat) => {
//               const isSelected = selectedCategory === cat;
//               const count = products.filter((p) => p.category === cat).length;
//               return (
//                 <div
//                   key={cat}
//                   className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
//                     isSelected ? "bg-pink-50 text-pink-500" : "hover:bg-gray-50"
//                   }`}
//                   onClick={() => handleCategoryClick(cat)}
//                 >
//                   <div className="flex items-center gap-2">
//                     <div className={`w-4 h-4 border rounded-full flex-shrink-0 ${
//                       isSelected ? "border-4 border-pink-500" : "border-gray-300"
//                     }`}></div>
//                     <span className="text-sm">{cat}</span>
//                   </div>
//                   <span className="text-xs text-gray-400">({count})</span>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Price Section */}
//       <div className="filter-section border-t pt-4">
//         <button
//           onClick={() => toggleSection('price')}
//           className="w-full flex justify-between items-center py-2 group"
//         >
//           <div className="flex items-center gap-2">
//             <MdAttachMoney className="text-pink-500" size={18} />
//             <h3 className="font-semibold text-gray-800">Price Range</h3>
//           </div>
//           <span className="text-gray-400 transform transition-transform group-hover:text-pink-500">
//             {expandedSections.price ? '−' : '+'}
//           </span>
//         </button>
        
//         {expandedSections.price && (
//           <div className="mt-4">
//             <div 
//               id="price-slider-container"
//               className="relative h-1 bg-gray-200 rounded-full mb-6 cursor-pointer"
//             >
//               <div
//                 className="absolute h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
//                 style={{
//                   left: `${(priceRange[0] / 1500) * 100}%`,
//                   width: `${((priceRange[1] - priceRange[0]) / 1500) * 100}%`,
//                 }}
//               ></div>
//               <div
//                 className="absolute w-5 h-5 bg-white border-2 border-pink-500 rounded-full -top-2 shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
//                 style={{ left: `${(priceRange[0] / 1500) * 100}%` }}
//                 onMouseDown={handlePriceSliderMouseDown("min")}
//                 title="Drag to adjust minimum price"
//               ></div>
//               <div
//                 className="absolute w-5 h-5 bg-white border-2 border-pink-500 rounded-full -top-2 shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
//                 style={{ left: `${(priceRange[1] / 1500) * 100}%` }}
//                 onMouseDown={handlePriceSliderMouseDown("max")}
//                 title="Drag to adjust maximum price"
//               ></div>
//             </div>
            
//             <div className="flex gap-3 mt-4">
//               <div className="flex-1">
//                 <label className="text-xs text-gray-500 block mb-1">Min Price</label>
//                 <input
//                   type="number"
//                   value={priceRange[0]}
//                   onChange={(e) => handlePriceChange("min", Number(e.target.value))}
//                   className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
//                   min="0"
//                   max={priceRange[1] - 10}
//                 />
//               </div>
//               <div className="flex-1">
//                 <label className="text-xs text-gray-500 block mb-1">Max Price</label>
//                 <input
//                   type="number"
//                   value={priceRange[1]}
//                   onChange={(e) => handlePriceChange("max", Number(e.target.value))}
//                   className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
//                   min={priceRange[0] + 10}
//                   max="1500"
//                 />
//               </div>
//             </div>
//             <div className="mt-3 text-center text-sm font-medium text-gray-700">
//               ₹{priceRange[0]} - ₹{priceRange[1]}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Rating Section */}
//       <div className="filter-section border-t pt-4">
//         <button
//           onClick={() => toggleSection('rating')}
//           className="w-full flex justify-between items-center py-2 group"
//         >
//           <div className="flex items-center gap-2">
//             <MdStar className="text-pink-500" size={18} />
//             <h3 className="font-semibold text-gray-800">Customer Rating</h3>
//           </div>
//           <span className="text-gray-400 transform transition-transform group-hover:text-pink-500">
//             {expandedSections.rating ? '−' : '+'}
//           </span>
//         </button>
        
//         {expandedSections.rating && (
//           <div className="mt-3 space-y-3">
//             {[5, 4, 3, 2, 1].map((star) => (
//               <label
//                 key={star}
//                 className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
//                   selectedRating === star ? "bg-pink-50" : "hover:bg-gray-50"
//                 }`}
//                 onClick={() => handleRatingChange(star)}
//               >
//                 <input
//                   type="checkbox"
//                   className="accent-pink-500 w-4 h-4 cursor-pointer"
//                   checked={selectedRating === star}
//                   onChange={() => {}}
//                 />
//                 <div className="flex items-center gap-1">
//                   {[...Array(5)].map((_, i) => (
//                     i < star ? (
//                       <FaStar key={i} className="text-yellow-400 text-sm" />
//                     ) : (
//                       <FaRegStar key={i} className="text-gray-300 text-sm" />
//                     )
//                   ))}
//                 </div>
//                 <span className="text-xs text-gray-600">& up</span>
//               </label>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

 






// import { useEffect, useState, useRef, useCallback } from "react";
// import axios from "axios";
// import { useCart } from "../context/CartContext";
// import { FaHeart, FaEye, FaChevronLeft, FaChevronRight, FaFilter, FaTimes, FaSlidersH, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
// import { FiShoppingCart } from "react-icons/fi";
// import { toast } from "react-hot-toast";
// import { useNavigate, useSearchParams } from "react-router-dom";

// import QuickViewModal from "../pages/QuickViewModal";

// export default function Productmain() {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [wishlistIds, setWishlistIds] = useState(new Set());
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchParams] = useSearchParams();
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [sortBy, setSortBy] = useState("latest");
//   const [isSidebarSticky, setIsSidebarSticky] = useState(false);

//   // Filter states
//   const [priceRange, setPriceRange] = useState([0, 1500]);
//   const [selectedRating, setSelectedRating] = useState(null);

//   const { addToCart } = useCart();

//   const API_PRODUCTS = "http://localhost:5000/api/products";
//   const API_CATEGORIES = "http://localhost:5000/api/categories";
//   const API_WISHLIST = "http://localhost:5000/api/wishlist";

//   const urlCategory = searchParams.get("category");
//   const productsPerPage = 12;

//   // Sticky Sidebar Ref
//   const sidebarRef = useRef(null);
//   const mainContentRef = useRef(null);

//   // Format URL category
//   useEffect(() => {
//     if (urlCategory) {
//       const formattedCategory = urlCategory
//         .split('-')
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ');
//       setSelectedCategory(formattedCategory);
//     }
//   }, [urlCategory]);

//   // Fetch initial data
//   useEffect(() => {
//     const init = async () => {
//       try {
//         const [catRes, prodRes] = await Promise.all([
//           axios.get(API_CATEGORIES),
//           axios.get(API_PRODUCTS),
//         ]);

//         setCategories(catRes.data || []);
//         const prodData = Array.isArray(prodRes.data) ? prodRes.data : [];
//         setProducts(prodData);

//         if (prodData.length > 0) {
//           const maxPrice = Math.max(...prodData.map(p => Number(p.price)));
//           setPriceRange([0, Math.ceil(maxPrice)]);
//         }

//         const token = localStorage.getItem("token");
//         if (token) {
//           try {
//             const wishRes = await axios.get(API_WISHLIST, {
//               headers: { Authorization: `Bearer ${token}` },
//             });
//             const ids = wishRes.data?.items
//               ?.map(item => item.productId?._id || item.productId)
//               .filter(Boolean) || [];
//             setWishlistIds(new Set(ids));
//           } catch (wishErr) {
//             console.log("Wishlist fetch failed", wishErr);
//           }
//         }
//       } catch (err) {
//         console.error("Data fetch error:", err);
//         setError("Failed to load products or categories");
//       } finally {
//         setLoading(false);
//       }
//     };
//     init();
//   }, []);

//   // Improved Sticky Sidebar Logic
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         setIsSidebarSticky(!entry.isIntersecting);
//       },
//       {
//         root: null,
//         threshold: 0,
//         rootMargin: "-100px 0px 0px 0px" // Triggers sticky when header is passed
//       }
//     );

//     const headerElement = document.querySelector('header'); // or your navbar
//     if (headerElement) {
//       observer.observe(headerElement);
//     }

//     return () => observer.disconnect();
//   }, []);

//   // Apply filters and sorting
//   const getFilteredAndSortedProducts = useCallback(() => {
//     let filtered = products.filter((p) => {
//       const matchCategory = !selectedCategory || p.category === selectedCategory;
//       const price = Number(p.price);
//       const matchPrice = price >= priceRange[0] && price <= priceRange[1];
//       const rating = p.rating || 0;
//       const matchRating = selectedRating === null || rating >= selectedRating;
//       return matchCategory && matchPrice && matchRating;
//     });

//     // Sorting
//     switch (sortBy) {
//       case "price_low_high":
//         filtered.sort((a, b) => Number(a.price) - Number(b.price));
//         break;
//       case "price_high_low":
//         filtered.sort((a, b) => Number(b.price) - Number(a.price));
//         break;
//       case "rating":
//         filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
//         break;
//       case "latest":
//       default:
//         filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         break;
//     }

//     return filtered;
//   }, [products, selectedCategory, priceRange, selectedRating, sortBy]);

//   const filteredProducts = getFilteredAndSortedProducts();
//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//   const startIndex = (currentPage - 1) * productsPerPage;
//   const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

//   const changePage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleCategoryClick = (cat) => {
//     setSelectedCategory(prev => prev === cat ? "" : cat);
//     setCurrentPage(1);
//   };

//   const handleProductClick = (productId, e) => {
//     if (e.target.closest('button')) return;
//     navigate(`/product/${productId}`);
//   };

//   // Price Slider Handlers (Improved)
//   const handlePriceSliderMouseDown = (type) => (e) => {
//     e.preventDefault();
//     const slider = document.getElementById('price-slider-container');
//     if (!slider) return;

//     const handleMove = (moveEvent) => {
//       const rect = slider.getBoundingClientRect();
//       let x = moveEvent.clientX - rect.left;
//       x = Math.max(0, Math.min(x, rect.width));
//       const percentage = x / rect.width;
//       const value = Math.round(percentage * 1500);

//       setPriceRange(prev => {
//         if (type === "min") {
//           return [Math.min(value, prev[1] - 10), prev[1]];
//         } else {
//           return [prev[0], Math.max(value, prev[0] + 10)];
//         }
//       });
//       setCurrentPage(1);
//     };

//     const handleUp = () => {
//       document.removeEventListener('mousemove', handleMove);
//       document.removeEventListener('mouseup', handleUp);
//     };

//     document.addEventListener('mousemove', handleMove);
//     document.addEventListener('mouseup', handleUp);
//   };

//   const handlePriceChange = (type, value) => {
//     setPriceRange(prev => {
//       const newRange = [...prev];
//       if (type === "min") newRange[0] = Math.min(Number(value), prev[1] - 10);
//       else newRange[1] = Math.max(Number(value), prev[0] + 10);
//       return newRange;
//     });
//     setCurrentPage(1);
//   };

//   const handleRatingChange = (rating) => {
//     setSelectedRating(prev => prev === rating ? null : rating);
//     setCurrentPage(1);
//   };

//   const handleSortChange = (e) => {
//     setSortBy(e.target.value);
//     setCurrentPage(1);
//   };

//   const getProductImage = (product) => {
//     if (!product?.images?.length) return "https://via.placeholder.com/300";
//     const img = product.images[0];
//     return typeof img === "string" ? img : img.url || "https://via.placeholder.com/300";
//   };

//   const handleAddToCart = (product, e) => {
//     e.stopPropagation();
//     addToCart(product);
//     toast.success(`${product.name} added to cart`);
//   };

//   const toggleWishlist = async (product, e) => {
//     e.stopPropagation();
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Please login to use wishlist");
//       return;
//     }

//     const productId = product._id;
//     const isInWishlist = wishlistIds.has(productId);
//     const url = `${API_WISHLIST}/${productId}`;

//     try {
//       await (isInWishlist 
//         ? axios.delete(url, { headers: { Authorization: `Bearer ${token}` } })
//         : axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } })
//       );

//       setWishlistIds(prev => {
//         const next = new Set(prev);
//         isInWishlist ? next.delete(productId) : next.add(productId);
//         return next;
//       });

//       toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist ❤️");
//     } catch (err) {
//       toast.error("Wishlist action failed");
//     }
//   };

//   const handleQuickView = (product, e) => {
//     e.stopPropagation();
//     setSelectedProduct(product);
//     setIsModalOpen(true);
//   };

//   const clearAllFilters = () => {
//     setSelectedCategory("");
//     setPriceRange([0, 1500]);
//     setSelectedRating(null);
//     setCurrentPage(1);
//     toast.success("All filters cleared");
//   };

//   const getActiveFiltersCount = () => {
//     let count = 0;
//     if (selectedCategory) count++;
//     if (selectedRating) count++;
//     if (priceRange[0] > 0 || priceRange[1] < 1500) count++;
//     return count;
//   };

//   if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
//   if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

//   return (
//     <div className="bg-white font-sans text-gray-800">
//       {/* Breadcrumb */}
//       <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-400 flex gap-2">
//         <span>🏠</span> <span>› Product ›</span> <span className="text-pink-500">Honey</span>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-8 relative">
//         {/* Mobile Filter Button */}
//         <div className="lg:hidden fixed bottom-6 right-6 z-50">
//           <button
//             onClick={() => setIsFilterOpen(!isFilterOpen)}
//             className="bg-pink-500 text-white p-4 rounded-full shadow-xl hover:bg-pink-600 transition-all active:scale-95"
//           >
//             <FaFilter size={22} />
//             {getActiveFiltersCount() > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
//                 {getActiveFiltersCount()}
//               </span>
//             )}
//           </button>
//         </div>

//         {/* Mobile Filter Drawer */}
//         {isFilterOpen && (
//           <div className="fixed inset-0 bg-black/60 z-[60] lg:hidden" onClick={() => setIsFilterOpen(false)}>
//             <div 
//               className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto"
//               onClick={e => e.stopPropagation()}
//             >
//               <div className="p-5 border-b flex justify-between items-center sticky top-0 bg-white z-10">
//                 <h3 className="font-bold text-xl">Filters</h3>
//                 <button onClick={() => setIsFilterOpen(false)} className="p-2">
//                   <FaTimes size={24} />
//                 </button>
//               </div>
//               <div className="p-5">
//                 <FilterSidebarContent
//                   categories={categories}
//                   products={products}
//                   selectedCategory={selectedCategory}
//                   handleCategoryClick={handleCategoryClick}
//                   priceRange={priceRange}
//                   handlePriceSliderMouseDown={handlePriceSliderMouseDown}
//                   handlePriceChange={handlePriceChange}
//                   selectedRating={selectedRating}
//                   handleRatingChange={handleRatingChange}
//                   clearAllFilters={clearAllFilters}
//                   getActiveFiltersCount={getActiveFiltersCount}
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* LEFT SIDEBAR - Improved UI */}
//         <aside 
//           ref={sidebarRef}
//           className={`w-full lg:w-80 flex-shrink-0 transition-all duration-300 lg:sticky lg:top-24 self-start`}
//         >
//           <div className="bg-gradient-to-br from-white to-pink-50/30 rounded-2xl border border-pink-100 shadow-lg overflow-hidden">
//             {/* Header with gradient */}
//             <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <FaSlidersH className="text-white text-lg" />
//                   <h2 className="font-bold text-xl text-white">Filters</h2>
//                 </div>
//                 {getActiveFiltersCount() > 0 && (
//                   <button
//                     onClick={clearAllFilters}
//                     className="text-white/90 hover:text-white text-sm font-medium flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full transition-all hover:bg-white/30"
//                   >
//                     <FaTimes size={12} /> Clear all ({getActiveFiltersCount()})
//                   </button>
//                 )}
//               </div>
//             </div>

//             <div className="p-5">
//               <FilterSidebarContent
//                 categories={categories}
//                 products={products}
//                 selectedCategory={selectedCategory}
//                 handleCategoryClick={handleCategoryClick}
//                 priceRange={priceRange}
//                 handlePriceSliderMouseDown={handlePriceSliderMouseDown}
//                 handlePriceChange={handlePriceChange}
//                 selectedRating={selectedRating}
//                 handleRatingChange={handleRatingChange}
//                 clearAllFilters={clearAllFilters}
//                 getActiveFiltersCount={getActiveFiltersCount}
//               />
//             </div>
//           </div>
//         </aside>

//         {/* MAIN CONTENT */}
//         <main ref={mainContentRef} className="flex-1">
//           {/* Sort & Results - Enhanced */}
//           <div className="bg-white rounded-xl border border-gray-100 p-4 mb-8 shadow-sm">
//             <div className="flex justify-between items-center flex-wrap gap-4">
//               <div className="flex items-center gap-3">
//                 <span className="text-gray-600 font-medium">Sort by:</span>
//                 <select
//                   value={sortBy}
//                   onChange={handleSortChange}
//                   className="border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 bg-white shadow-sm cursor-pointer"
//                 >
//                   <option value="latest">✨ Latest Arrivals</option>
//                   <option value="price_low_high">💰 Price: Low to High</option>
//                   <option value="price_high_low">💰 Price: High to Low</option>
//                   <option value="rating">⭐ Top Rated</option>
//                 </select>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <p className="text-gray-500">
//                   <span className="font-bold text-gray-900 text-lg">{filteredProducts.length}</span> 
//                   <span className="ml-1">products found</span>
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Products Grid - Unchanged */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {currentProducts.map((product) => (
//               <div
//                 key={product._id}
//                 onClick={(e) => handleProductClick(product._id, e)}
//                 className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 relative cursor-pointer bg-white"
//               >
//                 {/* Wishlist & Quick View Buttons */}
//                 <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
//                   <button
//                     onClick={(e) => toggleWishlist(product, e)}
//                     className={`p-3 rounded-full bg-white shadow-md hover:scale-110 transition-all ${
//                       wishlistIds.has(product._id) ? "text-pink-500" : "text-gray-400 hover:text-pink-500"
//                     }`}
//                   >
//                     <FaHeart size={16} />
//                   </button>
//                   <button
//                     onClick={(e) => handleQuickView(product, e)}
//                     className="p-3 rounded-full bg-white shadow-md text-gray-400 hover:text-pink-500 hover:scale-110 transition-all"
//                   >
//                     <FaEye size={16} />
//                   </button>
//                 </div>

//                 <div className="aspect-square bg-gray-50 overflow-hidden">
//                   <img
//                     src={getProductImage(product)}
//                     alt={product.name}
//                     className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
//                   />
//                 </div>

//                 <div className="p-5">
//                   <h3 className="text-base font-medium text-gray-800 line-clamp-2 mb-2">
//                     {product.name}
//                   </h3>
//                   <p className="text-2xl font-bold text-gray-900">₹{Number(product.price).toFixed(2)}</p>
                  
//                   <div className="flex items-center gap-2 mt-3">
//                     <div className="text-yellow-400 text-lg">
//                       {"★".repeat(Math.floor(product.rating || 4))}
//                       {"☆".repeat(5 - Math.floor(product.rating || 4))}
//                     </div>
//                     <button
//                       onClick={(e) => handleAddToCart(product, e)}
//                       className="ml-auto p-3 bg-gray-100 hover:bg-pink-500 hover:text-white rounded-full transition-all active:scale-95"
//                     >
//                       <FiShoppingCart size={20} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center gap-2 mt-12 mb-8">
//               <button
//                 onClick={() => changePage(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
//               >
//                 <FaChevronLeft size={14} />
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                 <button
//                   key={page}
//                   onClick={() => changePage(page)}
//                   className={`w-11 h-11 rounded-full text-sm font-medium transition-all ${
//                     currentPage === page 
//                       ? "bg-pink-500 text-white shadow-md" 
//                       : "border border-gray-200 hover:bg-gray-50"
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}
//               <button
//                 onClick={() => changePage(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
//               >
//                 <FaChevronRight size={14} />
//               </button>
//             </div>
//           )}

//           <QuickViewModal
//             product={selectedProduct}
//             isOpen={isModalOpen}
//             onClose={() => setIsModalOpen(false)}
//             onAddToCart={handleAddToCart}
//             onToggleWishlist={toggleWishlist}
//           />
//         </main>
//       </div>
//     </div>
//   );
// }

// // ==================== IMPROVED FILTER SIDEBAR UI ====================

// function FilterSidebarContent({
//   categories, products, selectedCategory, handleCategoryClick,
//   priceRange, handlePriceSliderMouseDown, handlePriceChange,
//   selectedRating, handleRatingChange, clearAllFilters, getActiveFiltersCount
// }) {
//   // Helper to render star rating display
//   const renderStars = (rating) => {
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 !== 0;
//     const emptyStars = 5 - Math.ceil(rating);
    
//     return (
//       <div className="flex items-center gap-0.5 text-lg">
//         {[...Array(fullStars)].map((_, i) => (
//           <FaStar key={`full-${i}`} className="text-yellow-400" />
//         ))}
//         {hasHalfStar && <FaStarHalfAlt className="text-yellow-400" />}
//         {[...Array(emptyStars)].map((_, i) => (
//           <FaRegStar key={`empty-${i}`} className="text-gray-300" />
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-8">
//       {/* Categories Section - Card Style */}
//       <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//         <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
//           <div className="w-1 h-6 bg-pink-500 rounded-full"></div>
//           <h3 className="font-semibold text-gray-800 text-base">Categories</h3>
//         </div>
//         <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
//           <div
//             onClick={() => handleCategoryClick("")}
//             className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
//               selectedCategory === "" 
//                 ? "bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 shadow-sm" 
//                 : "hover:bg-gray-50 border border-transparent"
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               <div className={`w-4 h-4 rounded-full border-2 transition-all flex-shrink-0 ${
//                 selectedCategory === "" ? "border-pink-500 bg-pink-500 ring-2 ring-pink-200" : "border-gray-300 group-hover:border-pink-300"
//               }`} />
//               <span className={`font-medium text-sm ${selectedCategory === "" ? "text-pink-600" : "text-gray-700"}`}>
//                 All Products
//               </span>
//             </div>
//             <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
//               selectedCategory === "" ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-500"
//             }`}>
//               {products.length}
//             </span>
//           </div>

//           {categories.map((cat) => {
//             const count = products.filter(p => p.category === cat).length;
//             const isSelected = selectedCategory === cat;
//             return (
//               <div
//                 key={cat}
//                 onClick={() => handleCategoryClick(cat)}
//                 className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
//                   isSelected 
//                     ? "bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 shadow-sm" 
//                     : "hover:bg-gray-50 border border-transparent"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className={`w-4 h-4 rounded-full border-2 transition-all flex-shrink-0 ${
//                     isSelected ? "border-pink-500 bg-pink-500 ring-2 ring-pink-200" : "border-gray-300 group-hover:border-pink-300"
//                   }`} />
//                   <span className={`font-medium text-sm ${isSelected ? "text-pink-600" : "text-gray-700"}`}>
//                     {cat}
//                   </span>
//                 </div>
//                 <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
//                   isSelected ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-500"
//                 }`}>
//                   {count}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Price Range Section - Modern Slider */}
//       <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//         <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
//           <div className="w-1 h-6 bg-pink-500 rounded-full"></div>
//           <h3 className="font-semibold text-gray-800 text-base">Price Range</h3>
//         </div>
        
//         <div className="px-1">
//           <div 
//             id="price-slider-container"
//             className="relative h-1.5 bg-gray-100 rounded-full cursor-pointer mb-8"
//           >
//             <div
//               className="absolute h-1.5 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
//               style={{
//                 left: `${(priceRange[0] / 1500) * 100}%`,
//                 right: `${100 - (priceRange[1] / 1500) * 100}%`,
//               }}
//             />
//             <div
//               className="absolute w-5 h-5 -top-2 bg-white border-2 border-pink-500 rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
//               style={{ left: `${(priceRange[0] / 1500) * 100}%` }}
//               onMouseDown={handlePriceSliderMouseDown("min")}
//             />
//             <div
//               className="absolute w-5 h-5 -top-2 bg-white border-2 border-pink-500 rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
//               style={{ left: `${(priceRange[1] / 1500) * 100}%` }}
//               onMouseDown={handlePriceSliderMouseDown("max")}
//             />
//           </div>

//           <div className="flex items-center justify-between gap-3">
//             <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
//               <span className="text-xs text-gray-400 block">Min</span>
//               <span className="text-pink-600 font-bold">₹{priceRange[0]}</span>
//             </div>
//             <span className="text-gray-300 font-light">—</span>
//             <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
//               <span className="text-xs text-gray-400 block">Max</span>
//               <span className="text-pink-600 font-bold">₹{priceRange[1]}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Rating Filter Section - Modern Checkboxes */}
//       <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//         <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
//           <div className="w-1 h-6 bg-pink-500 rounded-full"></div>
//           <h3 className="font-semibold text-gray-800 text-base">Customer Rating</h3>
//         </div>
//         <div className="space-y-2">
//           {[5, 4, 3, 2, 1].map((star) => {
//             const isSelected = selectedRating === star;
//             return (
//               <div
//                 key={star}
//                 onClick={() => handleRatingChange(star)}
//                 className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
//                   isSelected 
//                     ? "bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200" 
//                     : "hover:bg-gray-50 border border-transparent"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
//                     isSelected ? "border-pink-500 bg-pink-500" : "border-gray-300 group-hover:border-pink-300 bg-white"
//                   }`}>
//                     {isSelected && (
//                       <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
//                       </svg>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-1">
//                     {renderStars(star)}
//                     <span className="text-xs text-gray-500 ml-1">& Up</span>
//                   </div>
//                 </div>
//                 <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
//                   isSelected ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-500"
//                 }`}>
//                   {star}+
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Active Filters Summary */}
//       {getActiveFiltersCount() > 0 && (
//         <div className="bg-pink-50 rounded-xl p-3 border border-pink-100">
//           <p className="text-xs text-pink-600 font-medium mb-2">Active Filters:</p>
//           <div className="flex flex-wrap gap-1.5">
//             {selectedCategory && (
//               <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-pink-600 shadow-sm">
//                 {selectedCategory}
//                 <button onClick={() => handleCategoryClick(selectedCategory)} className="hover:text-pink-800">×</button>
//               </span>
//             )}
//             {(priceRange[0] > 0 || priceRange[1] < 1500) && (
//               <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-pink-600 shadow-sm">
//                 ₹{priceRange[0]} - ₹{priceRange[1]}
//                 <button onClick={() => {}} className="hover:text-pink-800">×</button>
//               </span>
//             )}
//             {selectedRating && (
//               <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-pink-600 shadow-sm">
//                 {selectedRating}+ Stars
//                 <button onClick={() => handleRatingChange(selectedRating)} className="hover:text-pink-800">×</button>
//               </span>
//             )}
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 4px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #f472b6;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #ec4899;
//         }
//       `}</style>
//     </div>
//   );
// }


 

// current wor file 



// import { useEffect, useState, useRef, useCallback } from "react";
// import axios from "axios";
// import { useCart } from "../context/CartContext";
// import { FaHeart, FaEye, FaChevronLeft, FaChevronRight, FaFilter, FaTimes, FaSlidersH, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
// import { FiShoppingCart } from "react-icons/fi";
// import { toast } from "react-hot-toast";
// import { useNavigate, useSearchParams } from "react-router-dom";

// import QuickViewModal from "../pages/QuickViewModal";

// export default function Productmain() {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [wishlistIds, setWishlistIds] = useState(new Set());
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchParams] = useSearchParams();
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [sortBy, setSortBy] = useState("latest");
//   const [isSidebarSticky, setIsSidebarSticky] = useState(false);

//   // Collapsible sections state
//   const [openSections, setOpenSections] = useState({
//     categories: true,
//     price: true,
//     rating: true,
//   });

//   // Filter states
//   const [priceRange, setPriceRange] = useState([0, 1500]);
//   const [selectedRating, setSelectedRating] = useState(null);

//   const { addToCart } = useCart();

//   const API_PRODUCTS = "http://localhost:5000/api/products";
//   const API_CATEGORIES = "http://localhost:5000/api/categories";
//   const API_WISHLIST = "http://localhost:5000/api/wishlist";

//   const urlCategory = searchParams.get("category");
//   const productsPerPage = 12;

//   // Sticky Sidebar Ref
//   const sidebarRef = useRef(null);
//   const mainContentRef = useRef(null);

//   // Toggle section function
//   const toggleSection = (section) => {
//     setOpenSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   // Format URL category
//   useEffect(() => {
//     if (urlCategory) {
//       const formattedCategory = urlCategory
//         .split('-')
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ');
//       setSelectedCategory(formattedCategory);
//     }
//   }, [urlCategory]);

//   // Fetch initial data
//   useEffect(() => {
//     const init = async () => {
//       try {
//         const [catRes, prodRes] = await Promise.all([
//           axios.get(API_CATEGORIES),
//           axios.get(API_PRODUCTS),
//         ]);

//         setCategories(catRes.data || []);
//         const prodData = Array.isArray(prodRes.data) ? prodRes.data : [];
//         setProducts(prodData);

//         if (prodData.length > 0) {
//           const maxPrice = Math.max(...prodData.map(p => Number(p.price)));
//           setPriceRange([0, Math.ceil(maxPrice)]);
//         }

//         const token = localStorage.getItem("token");
//         if (token) {
//           try {
//             const wishRes = await axios.get(API_WISHLIST, {
//               headers: { Authorization: `Bearer ${token}` },
//             });
//             const ids = wishRes.data?.items
//               ?.map(item => item.productId?._id || item.productId)
//               .filter(Boolean) || [];
//             setWishlistIds(new Set(ids));
//           } catch (wishErr) {
//             console.log("Wishlist fetch failed", wishErr);
//           }
//         }
//       } catch (err) {
//         console.error("Data fetch error:", err);
//         setError("Failed to load products or categories");
//       } finally {
//         setLoading(false);
//       }
//     };
//     init();
//   }, []);

//   // Improved Sticky Sidebar Logic
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         setIsSidebarSticky(!entry.isIntersecting);
//       },
//       {
//         root: null,
//         threshold: 0,
//         rootMargin: "-100px 0px 0px 0px"
//       }
//     );

//     const headerElement = document.querySelector('header');
//     if (headerElement) {
//       observer.observe(headerElement);
//     }

//     return () => observer.disconnect();
//   }, []);

//   // Apply filters and sorting
//   const getFilteredAndSortedProducts = useCallback(() => {
//     let filtered = products.filter((p) => {
//       const matchCategory = !selectedCategory || p.category === selectedCategory;
//       const price = Number(p.price);
//       const matchPrice = price >= priceRange[0] && price <= priceRange[1];
//       const rating = p.rating || 0;
//       const matchRating = selectedRating === null || rating >= selectedRating;
//       return matchCategory && matchPrice && matchRating;
//     });

//     // Sorting
//     switch (sortBy) {
//       case "price_low_high":
//         filtered.sort((a, b) => Number(a.price) - Number(b.price));
//         break;
//       case "price_high_low":
//         filtered.sort((a, b) => Number(b.price) - Number(a.price));
//         break;
//       case "rating":
//         filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
//         break;
//       case "latest":
//       default:
//         filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         break;
//     }

//     return filtered;
//   }, [products, selectedCategory, priceRange, selectedRating, sortBy]);

//   const filteredProducts = getFilteredAndSortedProducts();
//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//   const startIndex = (currentPage - 1) * productsPerPage;
//   const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

//   const changePage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleCategoryClick = (cat) => {
//     setSelectedCategory(prev => prev === cat ? "" : cat);
//     setCurrentPage(1);
//   };

//   const handleProductClick = (productId, e) => {
//     if (e.target.closest('button')) return;
//     navigate(`/product/${productId}`);
//   };

//   // Price Slider Handlers
//   const handlePriceSliderMouseDown = (type) => (e) => {
//     e.preventDefault();
//     const slider = document.getElementById('price-slider-container');
//     if (!slider) return;

//     const handleMove = (moveEvent) => {
//       const rect = slider.getBoundingClientRect();
//       let x = moveEvent.clientX - rect.left;
//       x = Math.max(0, Math.min(x, rect.width));
//       const percentage = x / rect.width;
//       const value = Math.round(percentage * 1500);

//       setPriceRange(prev => {
//         if (type === "min") {
//           return [Math.min(value, prev[1] - 10), prev[1]];
//         } else {
//           return [prev[0], Math.max(value, prev[0] + 10)];
//         }
//       });
//       setCurrentPage(1);
//     };

//     const handleUp = () => {
//       document.removeEventListener('mousemove', handleMove);
//       document.removeEventListener('mouseup', handleUp);
//     };

//     document.addEventListener('mousemove', handleMove);
//     document.addEventListener('mouseup', handleUp);
//   };

//   const handlePriceChange = (type, value) => {
//     setPriceRange(prev => {
//       const newRange = [...prev];
//       if (type === "min") newRange[0] = Math.min(Number(value), prev[1] - 10);
//       else newRange[1] = Math.max(Number(value), prev[0] + 10);
//       return newRange;
//     });
//     setCurrentPage(1);
//   };

//   const handleRatingChange = (rating) => {
//     setSelectedRating(prev => prev === rating ? null : rating);
//     setCurrentPage(1);
//   };

//   const handleSortChange = (e) => {
//     setSortBy(e.target.value);
//     setCurrentPage(1);
//   };

//   const getProductImage = (product) => {
//     if (!product?.images?.length) return "https://via.placeholder.com/300";
//     const img = product.images[0];
//     return typeof img === "string" ? img : img.url || "https://via.placeholder.com/300";
//   };

//   const handleAddToCart = (product, e) => {
//     e.stopPropagation();
//     addToCart(product);
//     toast.success(`${product.name} added to cart`);
//   };

//   const toggleWishlist = async (product, e) => {
//     e.stopPropagation();
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Please login to use wishlist");
//       return;
//     }

//     const productId = product._id;
//     const isInWishlist = wishlistIds.has(productId);
//     const url = `${API_WISHLIST}/${productId}`;

//     try {
//       await (isInWishlist 
//         ? axios.delete(url, { headers: { Authorization: `Bearer ${token}` } })
//         : axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } })
//       );

//       setWishlistIds(prev => {
//         const next = new Set(prev);
//         isInWishlist ? next.delete(productId) : next.add(productId);
//         return next;
//       });

//       toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist ❤️");
//     } catch (err) {
//       toast.error("Wishlist action failed");
//     }
//   };

//   const handleQuickView = (product, e) => {
//     e.stopPropagation();
//     setSelectedProduct(product);
//     setIsModalOpen(true);
//   };

//   const clearAllFilters = () => {
//     setSelectedCategory("");
//     setPriceRange([0, 1500]);
//     setSelectedRating(null);
//     setCurrentPage(1);
//     toast.success("All filters cleared");
//   };

//   const getActiveFiltersCount = () => {
//     let count = 0;
//     if (selectedCategory) count++;
//     if (selectedRating) count++;
//     if (priceRange[0] > 0 || priceRange[1] < 1500) count++;
//     return count;
//   };

//   if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
//   if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

//   return (
//     <div className="bg-white font-sans text-gray-800">
//       {/* Breadcrumb */}
//       <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-400 flex gap-2">
//         <span>🏠</span> <span>› Product ›</span> <span className="text-pink-500">Honey</span>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-8 relative">
//         {/* Mobile Filter Button */}
//         <div className="lg:hidden fixed bottom-6 right-6 z-50">
//           <button
//             onClick={() => setIsFilterOpen(!isFilterOpen)}
//             className="bg-pink-500 text-white p-4 rounded-full shadow-xl hover:bg-pink-600 transition-all active:scale-95"
//           >
//             <FaFilter size={22} />
//             {getActiveFiltersCount() > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
//                 {getActiveFiltersCount()}
//               </span>
//             )}
//           </button>
//         </div>

//         {/* Mobile Filter Drawer */}
//         {isFilterOpen && (
//           <div className="fixed inset-0 bg-black/60 z-[60] lg:hidden" onClick={() => setIsFilterOpen(false)}>
//             <div 
//               className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto"
//               onClick={e => e.stopPropagation()}
//             >
//               <div className="p-5 border-b flex justify-between items-center sticky top-0 bg-white z-10">
//                 <h3 className="font-bold text-xl">Filters</h3>
//                 <button onClick={() => setIsFilterOpen(false)} className="p-2">
//                   <FaTimes size={24} />
//                 </button>
//               </div>
//               <div className="p-5">
//                 <FilterSidebarContent
//                   categories={categories}
//                   products={products}
//                   selectedCategory={selectedCategory}
//                   handleCategoryClick={handleCategoryClick}
//                   priceRange={priceRange}
//                   handlePriceSliderMouseDown={handlePriceSliderMouseDown}
//                   handlePriceChange={handlePriceChange}
//                   selectedRating={selectedRating}
//                   handleRatingChange={handleRatingChange}
//                   clearAllFilters={clearAllFilters}
//                   getActiveFiltersCount={getActiveFiltersCount}
//                   openSections={openSections}
//                   toggleSection={toggleSection}
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* LEFT SIDEBAR - Improved UI */}
//         <aside 
//           ref={sidebarRef}
//           className={`w-full lg:w-80 flex-shrink-0 transition-all duration-300 lg:sticky lg:top-24 self-start`}
//         >
//           <div className="bg-gradient-to-br from-white to-pink-50/30 rounded-2xl border border-pink-100 shadow-lg overflow-hidden">
//             {/* Header with gradient */}
//             <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <FaSlidersH className="text-white text-lg" />
//                   <h2 className="font-bold text-xl text-white">Filters</h2>
//                 </div>
//                 {getActiveFiltersCount() > 0 && (
//                   <button
//                     onClick={clearAllFilters}
//                     className="text-white/90 hover:text-white text-sm font-medium flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full transition-all hover:bg-white/30"
//                   >
//                     <FaTimes size={12} /> Clear all ({getActiveFiltersCount()})
//                   </button>
//                 )}
//               </div>
//             </div>

//             <div className="p-5">
//               <FilterSidebarContent
//                 categories={categories}
//                 products={products}
//                 selectedCategory={selectedCategory}
//                 handleCategoryClick={handleCategoryClick}
//                 priceRange={priceRange}
//                 handlePriceSliderMouseDown={handlePriceSliderMouseDown}
//                 handlePriceChange={handlePriceChange}
//                 selectedRating={selectedRating}
//                 handleRatingChange={handleRatingChange}
//                 clearAllFilters={clearAllFilters}
//                 getActiveFiltersCount={getActiveFiltersCount}
//                 openSections={openSections}
//                 toggleSection={toggleSection}
//               />
//             </div>
//           </div>
//         </aside>

//         {/* MAIN CONTENT */}
//         <main ref={mainContentRef} className="flex-1">
//           {/* Sort & Results - Enhanced */}
//           <div className="bg-white rounded-xl border border-gray-100 p-4 mb-8 shadow-sm">
//             <div className="flex justify-between items-center flex-wrap gap-4">
//               <div className="flex items-center gap-3">
//                 <span className="text-gray-600 font-medium">Sort by:</span>
//                 <select
//                   value={sortBy}
//                   onChange={handleSortChange}
//                   className="border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 bg-white shadow-sm cursor-pointer"
//                 >
//                   <option value="latest">✨ Latest Arrivals</option>
//                   <option value="price_low_high">💰 Price: Low to High</option>
//                   <option value="price_high_low">💰 Price: High to Low</option>
//                   <option value="rating">⭐ Top Rated</option>
//                 </select>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <p className="text-gray-500">
//                   <span className="font-bold text-gray-900 text-lg">{filteredProducts.length}</span> 
//                   <span className="ml-1">products found</span>
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Products Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {currentProducts.map((product) => (
//               <div
//                 key={product._id}
//                 onClick={(e) => handleProductClick(product._id, e)}
//                 className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 relative cursor-pointer bg-white"
//               >
//                 {/* Wishlist & Quick View Buttons */}
//                 <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
//                   <button
//                     onClick={(e) => toggleWishlist(product, e)}
//                     className={`p-3 rounded-full bg-white shadow-md hover:scale-110 transition-all ${
//                       wishlistIds.has(product._id) ? "text-pink-500" : "text-gray-400 hover:text-pink-500"
//                     }`}
//                   >
//                     <FaHeart size={16} />
//                   </button>
//                   <button
//                     onClick={(e) => handleQuickView(product, e)}
//                     className="p-3 rounded-full bg-white shadow-md text-gray-400 hover:text-pink-500 hover:scale-110 transition-all"
//                   >
//                     <FaEye size={16} />
//                   </button>
//                 </div>

//                 <div className="aspect-square bg-gray-50 overflow-hidden">
//                   <img
//                     src={getProductImage(product)}
//                     alt={product.name}
//                     className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
//                   />
//                 </div>

//                 <div className="p-5">
//                   <h3 className="text-base font-medium text-gray-800 line-clamp-2 mb-2">
//                     {product.name}
//                   </h3>
//                   <p className="text-2xl font-bold text-gray-900">₹{Number(product.price).toFixed(2)}</p>
                  
//                   <div className="flex items-center gap-2 mt-3">
//                     <div className="text-yellow-400 text-lg">
//                       {"★".repeat(Math.floor(product.rating || 4))}
//                       {"☆".repeat(5 - Math.floor(product.rating || 4))}
//                     </div>
//                     <button
//                       onClick={(e) => handleAddToCart(product, e)}
//                       className="ml-auto p-3 bg-gray-100 hover:bg-pink-500 hover:text-white rounded-full transition-all active:scale-95"
//                     >
//                       <FiShoppingCart size={20} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center gap-2 mt-12 mb-8">
//               <button
//                 onClick={() => changePage(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
//               >
//                 <FaChevronLeft size={14} />
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                 <button
//                   key={page}
//                   onClick={() => changePage(page)}
//                   className={`w-11 h-11 rounded-full text-sm font-medium transition-all ${
//                     currentPage === page 
//                       ? "bg-pink-500 text-white shadow-md" 
//                       : "border border-gray-200 hover:bg-gray-50"
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}
//               <button
//                 onClick={() => changePage(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
//               >
//                 <FaChevronRight size={14} />
//               </button>
//             </div>
//           )}

//           <QuickViewModal
//             product={selectedProduct}
//             isOpen={isModalOpen}
//             onClose={() => setIsModalOpen(false)}
//             onAddToCart={handleAddToCart}
//             onToggleWishlist={toggleWishlist}
//           />
//         </main>
//       </div>
//     </div>
//   );
// }

// // ==================== FILTER SIDEBAR WITH COLLAPSIBLE SECTIONS (+ / -) ====================

// function FilterSidebarContent({
//   categories, products, selectedCategory, handleCategoryClick,
//   priceRange, handlePriceSliderMouseDown, handlePriceChange,
//   selectedRating, handleRatingChange, clearAllFilters, getActiveFiltersCount,
//   openSections, toggleSection
// }) {
//   // Helper to render star rating display
//   const renderStars = (rating) => {
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 !== 0;
//     const emptyStars = 5 - Math.ceil(rating);
    
//     return (
//       <div className="flex items-center gap-0.5 text-lg">
//         {[...Array(fullStars)].map((_, i) => (
//           <FaStar key={`full-${i}`} className="text-yellow-400" />
//         ))}
//         {hasHalfStar && <FaStarHalfAlt className="text-yellow-400" />}
//         {[...Array(emptyStars)].map((_, i) => (
//           <FaRegStar key={`empty-${i}`} className="text-gray-300" />
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {/* Categories Section - Collapsible */}
//       <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
//         <div
//           onClick={() => toggleSection('categories')}
//           className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
//         >
//           <div className="flex items-center gap-2">
//             <div className="w-1 h-5 bg-pink-500 rounded-full"></div>
//             <h3 className="font-semibold text-gray-800 text-base">Categories</h3>
//           </div>
//           <span className="text-2xl text-gray-400 font-light transition-transform duration-200">
//             {openSections.categories ? '−' : '+'}
//           </span>
//         </div>
        
//         {openSections.categories && (
//           <div className="p-4 pt-0 border-t border-gray-100">
//             {/* Fixed height container with scrollbar */}
//             <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar mt-3">
//               {/* All Products - Radio button */}
//               <div
//                 onClick={() => handleCategoryClick("")}
//                 className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
//                   selectedCategory === "" 
//                     ? "bg-pink-50 border border-pink-200" 
//                     : "hover:bg-gray-50 border border-transparent"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   {/* Circular Radio Button */}
//                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
//                     selectedCategory === "" 
//                       ? "border-pink-500 bg-pink-500" 
//                       : "border-gray-300 group-hover:border-pink-300 bg-white"
//                   }`}>
//                     {selectedCategory === "" && (
//                       <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
//                     )}
//                   </div>
//                   <span className={`font-medium text-sm ${selectedCategory === "" ? "text-pink-600" : "text-gray-700"}`}>
//                     All Products
//                   </span>
//                 </div>
//                 <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
//                   selectedCategory === "" ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-500"
//                 }`}>
//                   {products.length}
//                 </span>
//               </div>

//               {/* Dynamic Categories - Radio buttons */}
//               {categories.map((cat) => {
//                 const count = products.filter(p => p.category === cat).length;
//                 const isSelected = selectedCategory === cat;
//                 return (
//                   <div
//                     key={cat}
//                     onClick={() => handleCategoryClick(cat)}
//                     className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
//                       isSelected 
//                         ? "bg-pink-50 border border-pink-200" 
//                         : "hover:bg-gray-50 border border-transparent"
//                     }`}
//                   >
//                     <div className="flex items-center gap-3">
//                       {/* Circular Radio Button */}
//                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
//                         isSelected 
//                           ? "border-pink-500 bg-pink-500" 
//                           : "border-gray-300 group-hover:border-pink-300 bg-white"
//                       }`}>
//                         {isSelected && (
//                           <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
//                         )}
//                       </div>
//                       <span className={`font-medium text-sm ${isSelected ? "text-pink-600" : "text-gray-700"}`}>
//                         {cat}
//                       </span>
//                     </div>
//                     <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
//                       isSelected ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-500"
//                     }`}>
//                       {count}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Price Range Section - Collapsible */}
//       <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
//         <div
//           onClick={() => toggleSection('price')}
//           className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
//         >
//           <div className="flex items-center gap-2">
//             <div className="w-1 h-5 bg-pink-500 rounded-full"></div>
//             <h3 className="font-semibold text-gray-800 text-base">Price Range</h3>
//           </div>
//           <span className="text-2xl text-gray-400 font-light transition-transform duration-200">
//             {openSections.price ? '−' : '+'}
//           </span>
//         </div>
        
//         {openSections.price && (
//           <div className="p-4 pt-0 border-t border-gray-100">
//             <div className="px-1 mt-3">
//               <div 
//                 id="price-slider-container"
//                 className="relative h-1.5 bg-gray-100 rounded-full cursor-pointer mb-8"
//               >
//                 <div
//                   className="absolute h-1.5 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
//                   style={{
//                     left: `${(priceRange[0] / 1500) * 100}%`,
//                     right: `${100 - (priceRange[1] / 1500) * 100}%`,
//                   }}
//                 />
//                 <div
//                   className="absolute w-5 h-5 -top-2 bg-white border-2 border-pink-500 rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
//                   style={{ left: `${(priceRange[0] / 1500) * 100}%` }}
//                   onMouseDown={handlePriceSliderMouseDown("min")}
//                 />
//                 <div
//                   className="absolute w-5 h-5 -top-2 bg-white border-2 border-pink-500 rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
//                   style={{ left: `${(priceRange[1] / 1500) * 100}%` }}
//                   onMouseDown={handlePriceSliderMouseDown("max")}
//                 />
//               </div>

//               <div className="flex items-center justify-between gap-3">
//                 <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
//                   <span className="text-xs text-gray-400 block">Min</span>
//                   <span className="text-pink-600 font-bold">₹{priceRange[0]}</span>
//                 </div>
//                 <span className="text-gray-300 font-light">—</span>
//                 <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
//                   <span className="text-xs text-gray-400 block">Max</span>
//                   <span className="text-pink-600 font-bold">₹{priceRange[1]}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Rating Section - Collapsible */}
//       <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
//         <div
//           onClick={() => toggleSection('rating')}
//           className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
//         >
//           <div className="flex items-center gap-2">
//             <div className="w-1 h-5 bg-pink-500 rounded-full"></div>
//             <h3 className="font-semibold text-gray-800 text-base">Customer Rating</h3>
//           </div>
//           <span className="text-2xl text-gray-400 font-light transition-transform duration-200">
//             {openSections.rating ? '−' : '+'}
//           </span>
//         </div>
        
//         {openSections.rating && (
//           <div className="p-4 pt-0 border-t border-gray-100">
//             <div className="space-y-2 mt-3">
//               {[5, 4, 3, 2, 1].map((star) => {
//                 const isSelected = selectedRating === star;
//                 return (
//                   <div
//                     key={star}
//                     onClick={() => handleRatingChange(star)}
//                     className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
//                       isSelected 
//                         ? "bg-pink-50 border border-pink-200" 
//                         : "hover:bg-gray-50 border border-transparent"
//                     }`}
//                   >
//                     <div className="flex items-center gap-3">
//                       {/* Square Checkbox for Rating */}
//                       <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
//                         isSelected ? "border-pink-500 bg-pink-500" : "border-gray-300 group-hover:border-pink-300 bg-white"
//                       }`}>
//                         {isSelected && (
//                           <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
//                           </svg>
//                         )}
//                       </div>
//                       <div className="flex items-center gap-1">
//                         {renderStars(star)}
//                         <span className="text-xs text-gray-500 ml-1">& Up</span>
//                       </div>
//                     </div>
//                     <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
//                       isSelected ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-500"
//                     }`}>
//                       {star}+
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Active Filters Summary */}
//       {getActiveFiltersCount() > 0 && (
//         <div className="bg-pink-50 rounded-xl p-3 border border-pink-100">
//           <p className="text-xs text-pink-600 font-medium mb-2">Active Filters:</p>
//           <div className="flex flex-wrap gap-1.5">
//             {selectedCategory && (
//               <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-pink-600 shadow-sm">
//                 {selectedCategory}
//                 <button onClick={() => handleCategoryClick(selectedCategory)} className="hover:text-pink-800">×</button>
//               </span>
//             )}
//             {(priceRange[0] > 0 || priceRange[1] < 1500) && (
//               <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-pink-600 shadow-sm">
//                 ₹{priceRange[0]} - ₹{priceRange[1]}
//                 <button onClick={clearAllFilters} className="hover:text-pink-800">×</button>
//               </span>
//             )}
//             {selectedRating && (
//               <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-pink-600 shadow-sm">
//                 {selectedRating}+ Stars
//                 <button onClick={() => handleRatingChange(selectedRating)} className="hover:text-pink-800">×</button>
//               </span>
//             )}
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 4px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #f472b6;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #ec4899;
//         }
//       `}</style>
//     </div>
//   );
// }




// Productmain.js - Complete Updated Version
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { 
  FaHeart, FaEye, FaChevronLeft, FaChevronRight, FaFilter, 
  FaTimes, FaSlidersH, FaStar, FaStarHalfAlt, FaRegStar,
  FaFire, FaGift, FaArrowLeft
} from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import QuickViewModal from "../pages/QuickViewModal";

export default function Productmain() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get URL parameters
  const urlCategory = searchParams.get("category");
  const urlFilter = searchParams.get("filter");
  
  // State declarations
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [specialFilter, setSpecialFilter] = useState(null);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [isSidebarSticky, setIsSidebarSticky] = useState(false);

  // Collapsible sections state
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    rating: true,
  });

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [selectedRating, setSelectedRating] = useState(null);

  const { addToCart } = useCart();

  // API endpoints
  const API_PRODUCTS = "http://localhost:5000/api/products";
  const API_CATEGORIES = "http://localhost:5000/api/categories";
  const API_WISHLIST = "http://localhost:5000/api/wishlist";

  const productsPerPage = 12;

  // Refs
  const sidebarRef = useRef(null);
  const mainContentRef = useRef(null);

  // Toggle section function
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle URL parameters
  useEffect(() => {
    // Handle category parameter
    if (urlCategory) {
      const formattedCategory = urlCategory
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setSelectedCategory(formattedCategory);
    } else {
      setSelectedCategory("");
    }
    
    // Handle special filter parameter
    if (urlFilter) {
      setSpecialFilter(urlFilter);
    } else {
      setSpecialFilter(null);
    }
    
    // Reset to first page when filter changes
    setCurrentPage(1);
  }, [urlCategory, urlFilter]);

  // Fetch initial data
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get(API_CATEGORIES),
          axios.get(API_PRODUCTS),
        ]);

        setCategories(catRes.data || []);
        const prodData = Array.isArray(prodRes.data) ? prodRes.data : [];
        setProducts(prodData);

        if (prodData.length > 0) {
          const maxPrice = Math.max(...prodData.map(p => Number(p.price)));
          setPriceRange([0, Math.ceil(maxPrice)]);
        }

        const token = localStorage.getItem("token");
        if (token) {
          try {
            const wishRes = await axios.get(API_WISHLIST, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const ids = wishRes.data?.items
              ?.map(item => item.productId?._id || item.productId)
              .filter(Boolean) || [];
            setWishlistIds(new Set(ids));
          } catch (wishErr) {
            console.log("Wishlist fetch failed", wishErr);
          }
        }
      } catch (err) {
        console.error("Data fetch error:", err);
        setError("Failed to load products or categories");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Sticky Sidebar Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSidebarSticky(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "-100px 0px 0px 0px"
      }
    );

    const headerElement = document.querySelector('nav');
    if (headerElement) {
      observer.observe(headerElement);
    }

    return () => observer.disconnect();
  }, []);

  // Apply filters and sorting
  const getFilteredAndSortedProducts = useCallback(() => {
    let filtered = products.filter((p) => {
      // Category filter
      const matchCategory = !selectedCategory || p.category === selectedCategory;
      
      // Price filter
      const price = Number(p.price);
      const matchPrice = price >= priceRange[0] && price <= priceRange[1];
      
      // Rating filter
      const rating = p.rating || 0;
      const matchRating = selectedRating === null || rating >= selectedRating;
      
      // Special filters
      let matchSpecialFilter = true;
      if (specialFilter === 'bestsellers') {
        matchSpecialFilter = p.isBestSeller === true || p.soldCount > 50;
      } else if (specialFilter === 'newarrivals') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        matchSpecialFilter = new Date(p.createdAt) > oneMonthAgo;
      } else if (specialFilter === 'offers') {
        matchSpecialFilter = p.discountPrice && p.discountPrice < p.price;
      }
      
      return matchCategory && matchPrice && matchRating && matchSpecialFilter;
    });

    // Sorting
    switch (sortBy) {
      case "price_low_high":
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price_high_low":
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "bestseller":
        filtered.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
        break;
      case "latest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filtered;
  }, [products, selectedCategory, priceRange, selectedRating, sortBy, specialFilter]);

  const filteredProducts = getFilteredAndSortedProducts();
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(prev => prev === cat ? "" : cat);
    setCurrentPage(1);
  };

  const handleProductClick = (productId, e) => {
    if (e.target.closest('button')) return;
    navigate(`/product/${productId}`);
  };

  // Price Slider Handlers
  const handlePriceSliderMouseDown = (type) => (e) => {
    e.preventDefault();
    const slider = document.getElementById('price-slider-container');
    if (!slider) return;

    const handleMove = (moveEvent) => {
      const rect = slider.getBoundingClientRect();
      let x = moveEvent.clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const percentage = x / rect.width;
      const maxPrice = Math.max(...products.map(p => Number(p.price)));
      const value = Math.round(percentage * maxPrice);

      setPriceRange(prev => {
        if (type === "min") {
          return [Math.min(value, prev[1] - 10), prev[1]];
        } else {
          return [prev[0], Math.max(value, prev[0] + 10)];
        }
      });
      setCurrentPage(1);
    };

    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  const handlePriceChange = (type, value) => {
    setPriceRange(prev => {
      const newRange = [...prev];
      if (type === "min") newRange[0] = Math.min(Number(value), prev[1] - 10);
      else newRange[1] = Math.max(Number(value), prev[0] + 10);
      return newRange;
    });
    setCurrentPage(1);
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(prev => prev === rating ? null : rating);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const getProductImage = (product) => {
    if (!product?.images?.length) return "https://via.placeholder.com/300";
    const img = product.images[0];
    return typeof img === "string" ? img : img.url || "https://via.placeholder.com/300";
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const toggleWishlist = async (product, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to use wishlist");
      return;
    }

    const productId = product._id;
    const isInWishlist = wishlistIds.has(productId);
    const url = `${API_WISHLIST}/${productId}`;

    try {
      await (isInWishlist 
        ? axios.delete(url, { headers: { Authorization: `Bearer ${token}` } })
        : axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } })
      );

      setWishlistIds(prev => {
        const next = new Set(prev);
        isInWishlist ? next.delete(productId) : next.add(productId);
        return next;
      });

      toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist ❤️");
    } catch (err) {
      toast.error("Wishlist action failed");
    }
  };

  const handleQuickView = (product, e) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const clearAllFilters = () => {
    setSelectedCategory("");
    setSpecialFilter(null);
    setPriceRange([0, 1500]);
    setSelectedRating(null);
    setCurrentPage(1);
    navigate('/shop');
    toast.success("All filters cleared");
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedRating) count++;
    if (specialFilter) count++;
    if (priceRange[0] > 0 || priceRange[1] < 1500) count++;
    return count;
  };

  // Get filter display name
  const getFilterDisplayName = (filter) => {
    const names = {
      'bestsellers': '🔥 Best Sellers',
      'newarrivals': '✨ New Arrivals',
      'offers': '💰 Special Offers'
    };
    return names[filter] || filter;
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="bg-white font-sans text-gray-800">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-400 flex items-center gap-2">
        <span>🏠</span> 
        <span>›</span> 
        <span>Product</span>
        {specialFilter && (
          <>
            <span>›</span>
            <span className="text-pink-500 font-medium">{getFilterDisplayName(specialFilter)}</span>
          </>
        )}
        {selectedCategory && (
          <>
            <span>›</span>
            <span className="text-pink-500 font-medium">{selectedCategory}</span>
          </>
        )}
      </div>

      {/* Active Filter Banner */}
      {specialFilter && (
        <div className="max-w-7xl mx-auto px-6 mb-4">
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {specialFilter === 'bestsellers' && '🔥'}
                {specialFilter === 'newarrivals' && '✨'}
                {specialFilter === 'offers' && '💰'}
              </span>
              <div>
                <h3 className="font-bold text-gray-800">
                  {getFilterDisplayName(specialFilter)}
                </h3>
                <p className="text-sm text-gray-600">
                  {filteredProducts.length} products found
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSpecialFilter(null);
                navigate('/shop');
              }}
              className="text-pink-600 hover:text-pink-800 flex items-center gap-1 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all"
            >
              <FaTimes size={14} />
              <span className="text-sm font-medium">Clear</span>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-8 relative">
        {/* Mobile Filter Button */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-pink-500 text-white p-4 rounded-full shadow-xl hover:bg-pink-600 transition-all active:scale-95"
          >
            <FaFilter size={22} />
            {getActiveFiltersCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Filter Drawer */}
        {isFilterOpen && (
          <div className="fixed inset-0 bg-black/60 z-[60] lg:hidden" onClick={() => setIsFilterOpen(false)}>
            <div 
              className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-5 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="font-bold text-xl">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)} className="p-2">
                  <FaTimes size={24} />
                </button>
              </div>
              <div className="p-5">
                <FilterSidebarContent
                  categories={categories}
                  products={products}
                  selectedCategory={selectedCategory}
                  handleCategoryClick={handleCategoryClick}
                  priceRange={priceRange}
                  handlePriceSliderMouseDown={handlePriceSliderMouseDown}
                  handlePriceChange={handlePriceChange}
                  selectedRating={selectedRating}
                  handleRatingChange={handleRatingChange}
                  clearAllFilters={clearAllFilters}
                  getActiveFiltersCount={getActiveFiltersCount}
                  openSections={openSections}
                  toggleSection={toggleSection}
                  specialFilter={specialFilter}
                />
              </div>
            </div>
          </div>
        )}

        {/* LEFT SIDEBAR */}
        <aside 
          ref={sidebarRef}
          className={`w-full lg:w-80 flex-shrink-0 transition-all duration-300 lg:sticky lg:top-24 self-start`}
        >
          <div className="bg-gradient-to-br from-white to-pink-50/30 rounded-2xl border border-pink-100 shadow-lg overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaSlidersH className="text-white text-lg" />
                  <h2 className="font-bold text-xl text-white">Filters</h2>
                </div>
                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-white/90 hover:text-white text-sm font-medium flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full transition-all hover:bg-white/30"
                  >
                    <FaTimes size={12} /> Clear all ({getActiveFiltersCount()})
                  </button>
                )}
              </div>
            </div>

            <div className="p-5">
              <FilterSidebarContent
                categories={categories}
                products={products}
                selectedCategory={selectedCategory}
                handleCategoryClick={handleCategoryClick}
                priceRange={priceRange}
                handlePriceSliderMouseDown={handlePriceSliderMouseDown}
                handlePriceChange={handlePriceChange}
                selectedRating={selectedRating}
                handleRatingChange={handleRatingChange}
                clearAllFilters={clearAllFilters}
                getActiveFiltersCount={getActiveFiltersCount}
                openSections={openSections}
                toggleSection={toggleSection}
                specialFilter={specialFilter}
              />
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main ref={mainContentRef} className="flex-1">
          {/* Sort & Results */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-8 shadow-sm">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-600 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 bg-white shadow-sm cursor-pointer"
                >
                  <option value="latest">✨ Latest Arrivals</option>
                  <option value="price_low_high">💰 Price: Low to High</option>
                  <option value="price_high_low">💰 Price: High to Low</option>
                  <option value="rating">⭐ Top Rated</option>
                  {specialFilter === 'bestsellers' && (
                    <option value="bestseller">🔥 Best Selling</option>
                  )}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-gray-500">
                  <span className="font-bold text-gray-900 text-lg">{filteredProducts.length}</span> 
                  <span className="ml-1">products found</span>
                </p>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.map((product) => (
              <div
                key={product._id}
                onClick={(e) => handleProductClick(product._id, e)}
                className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 relative cursor-pointer bg-white"
              >
                {/* Product Badges */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  {product.isBestSeller && (
                    <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <FaFire size={12} /> Best Seller
                    </span>
                  )}
                  {product.discountPrice && product.discountPrice < product.price && (
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <FaGift size={12} /> 
                      {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                    </span>
                  )}
                  {specialFilter === 'newarrivals' && (
                    <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <FaStar size={12} /> New
                    </span>
                  )}
                </div>

                {/* Wishlist & Quick View Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
                  <button
                    onClick={(e) => toggleWishlist(product, e)}
                    className={`p-3 rounded-full bg-white shadow-md hover:scale-110 transition-all ${
                      wishlistIds.has(product._id) ? "text-pink-500" : "text-gray-400 hover:text-pink-500"
                    }`}
                  >
                    <FaHeart size={16} />
                  </button>
                  <button
                    onClick={(e) => handleQuickView(product, e)}
                    className="p-3 rounded-full bg-white shadow-md text-gray-400 hover:text-pink-500 hover:scale-110 transition-all"
                  >
                    <FaEye size={16} />
                  </button>
                </div>

                <div className="aspect-square bg-gray-50 overflow-hidden">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-base font-medium text-gray-800 line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-3">
                    {product.discountPrice && product.discountPrice < product.price ? (
                      <>
                        <span className="text-2xl font-bold text-pink-600">
                          ₹{Number(product.discountPrice).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ₹{Number(product.price).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{Number(product.price).toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <div className="text-yellow-400 text-lg">
                      {"★".repeat(Math.floor(product.rating || 4))}
                      {"☆".repeat(5 - Math.floor(product.rating || 4))}
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="ml-auto p-3 bg-gray-100 hover:bg-pink-500 hover:text-white rounded-full transition-all active:scale-95"
                    >
                      <FiShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {currentProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your filters or search criteria
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-pink-500 text-white px-6 py-3 rounded-full font-medium hover:bg-pink-600 transition-all"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12 mb-8">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
              >
                <FaChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => changePage(page)}
                  className={`w-11 h-11 rounded-full text-sm font-medium transition-all ${
                    currentPage === page 
                      ? "bg-pink-500 text-white shadow-md" 
                      : "border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
              >
                <FaChevronRight size={14} />
              </button>
            </div>
          )}

          <QuickViewModal
            product={selectedProduct}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddToCart={handleAddToCart}
            onToggleWishlist={toggleWishlist}
          />
        </main>
      </div>
    </div>
  );
}

// ==================== FILTER SIDEBAR COMPONENT ====================

function FilterSidebarContent({
  categories, products, selectedCategory, handleCategoryClick,
  priceRange, handlePriceSliderMouseDown, handlePriceChange,
  selectedRating, handleRatingChange, clearAllFilters, getActiveFiltersCount,
  openSections, toggleSection, specialFilter
}) {
  // Helper to render star rating display
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
    
    return (
      <div className="flex items-center gap-0.5 text-lg">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-pink-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-800 text-base">Categories</h3>
          </div>
          <span className="text-2xl text-gray-400 font-light transition-transform duration-200">
            {openSections.categories ? '−' : '+'}
          </span>
        </div>
        
        {openSections.categories && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar mt-3">
              {/* All Products */}
              <div
                onClick={() => handleCategoryClick("")}
                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedCategory === "" 
                    ? "bg-pink-50 border border-pink-200" 
                    : "hover:bg-gray-50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    selectedCategory === "" 
                      ? "border-pink-500 bg-pink-500" 
                      : "border-gray-300 group-hover:border-pink-300 bg-white"
                  }`}>
                    {selectedCategory === "" && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className={`font-medium text-sm ${selectedCategory === "" ? "text-pink-600" : "text-gray-700"}`}>
                    All Products
                  </span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  selectedCategory === "" ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-500"
                }`}>
                  {products.length}
                </span>
              </div>

              {/* Dynamic Categories */}
              {categories.map((cat) => {
                const count = products.filter(p => p.category === cat).length;
                const isSelected = selectedCategory === cat;
                return (
                  <div
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? "bg-pink-50 border border-pink-200" 
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        isSelected 
                          ? "border-pink-500 bg-pink-500" 
                          : "border-gray-300 group-hover:border-pink-300 bg-white"
                      }`}>
                        {isSelected && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className={`font-medium text-sm ${isSelected ? "text-pink-600" : "text-gray-700"}`}>
                        {cat}
                      </span>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      isSelected ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-500"
                    }`}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-pink-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-800 text-base">Price Range</h3>
          </div>
          <span className="text-2xl text-gray-400 font-light transition-transform duration-200">
            {openSections.price ? '−' : '+'}
          </span>
        </div>
        
        {openSections.price && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="px-1 mt-3">
              <div 
                id="price-slider-container"
                className="relative h-1.5 bg-gray-100 rounded-full cursor-pointer mb-8"
              >
                <div
                  className="absolute h-1.5 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
                  style={{
                    left: `${(priceRange[0] / 1500) * 100}%`,
                    right: `${100 - (priceRange[1] / 1500) * 100}%`,
                  }}
                />
                <div
                  className="absolute w-5 h-5 -top-2 bg-white border-2 border-pink-500 rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                  style={{ left: `${(priceRange[0] / 1500) * 100}%` }}
                  onMouseDown={handlePriceSliderMouseDown("min")}
                />
                <div
                  className="absolute w-5 h-5 -top-2 bg-white border-2 border-pink-500 rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                  style={{ left: `${(priceRange[1] / 1500) * 100}%` }}
                  onMouseDown={handlePriceSliderMouseDown("max")}
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                  <span className="text-xs text-gray-400 block">Min</span>
                  <span className="text-pink-600 font-bold">₹{priceRange[0]}</span>
                </div>
                <span className="text-gray-300 font-light">—</span>
                <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                  <span className="text-xs text-gray-400 block">Max</span>
                  <span className="text-pink-600 font-bold">₹{priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rating Section */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-pink-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-800 text-base">Customer Rating</h3>
          </div>
          <span className="text-2xl text-gray-400 font-light transition-transform duration-200">
            {openSections.rating ? '−' : '+'}
          </span>
        </div>
        
        {openSections.rating && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="space-y-2 mt-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const isSelected = selectedRating === star;
                return (
                  <div
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? "bg-pink-50 border border-pink-200" 
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        isSelected ? "border-pink-500 bg-pink-500" : "border-gray-300 group-hover:border-pink-300 bg-white"
                      }`}>
                        {isSelected && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(star)}
                        <span className="text-xs text-gray-500 ml-1">& Up</span>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      isSelected ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-500"
                    }`}>
                      {star}+
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {getActiveFiltersCount() > 0 && (
        <div className="bg-pink-50 rounded-xl p-3 border border-pink-100">
          <p className="text-xs text-pink-600 font-medium mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-1.5">
            {specialFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-pink-600 shadow-sm">
                {specialFilter === 'bestsellers' && '🔥 Best Sellers'}
                {specialFilter === 'newarrivals' && '✨ New Arrivals'}
                {specialFilter === 'offers' && '💰 Special Offers'}
                <button onClick={() => {
                  setSpecialFilter(null);
                  navigate('/shop');
                }} className="hover:text-pink-800">×</button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-pink-600 shadow-sm">
                {selectedCategory}
                <button onClick={() => handleCategoryClick(selectedCategory)} className="hover:text-pink-800">×</button>
              </span>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 1500) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-pink-600 shadow-sm">
                ₹{priceRange[0]} - ₹{priceRange[1]}
                <button onClick={clearAllFilters} className="hover:text-pink-800">×</button>
              </span>
            )}
            {selectedRating && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-pink-600 shadow-sm">
                {selectedRating}+ Stars
                <button onClick={() => handleRatingChange(selectedRating)} className="hover:text-pink-800">×</button>
              </span>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f472b6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ec4899;
        }
      `}</style>
    </div>
  );
}