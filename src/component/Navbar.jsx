 
 
// import { Link, useNavigate } from "react-router-dom";
// import { useState, useRef, useEffect } from "react";
// import { useAuth } from "../pages/AuthContext";
// import { useCart } from "../context/CartContext";
// import {
//   FaChevronDown,
//   FaBars,
//   FaTimes
// } from "react-icons/fa";
// import { FiSearch, FiHeart, FiShoppingBag, FiUser } from "react-icons/fi";
// import logo from "../assets/Loho.png";

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
  
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [loadingSearch, setLoadingSearch] = useState(false);
//   const [searchError, setSearchError] = useState(null);

//   const [categories, setCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(true);

//   const { user, logout } = useAuth();
//   const { cartCount } = useCart();
//   const navigate = useNavigate();

//   const dropdownRef = useRef(null);
//   const categoriesRef = useRef(null);
//   const searchRef = useRef(null);
//   const searchInputRef = useRef(null);

//   // Fetch Categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch("https://tadaa-bacend.onrender.com/api/categories");
//         if (res.ok) {
//           const data = await res.json();
//           setCategories(Array.isArray(data) ? data.sort() : []);
//         }
//       } catch (err) {
//         console.error("Failed to fetch categories:", err);
//         // Fallback categories
//         setCategories([
//           "Millets", "Pulses & Lentils", "Whole Pulses", "Edible Oils",
//           "Spices", "Sweeteners", "Honey", "Dry Fruits", "Nuts & Seeds",
//           "Flours", "Traditional Mixes"
//         ]);
//       } finally {
//         setLoadingCategories(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Debounced Search
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (searchQuery.trim().length >= 2) {
//         performSearch(searchQuery.trim());
//       } else {
//         setSearchResults([]);
//         setSearchError(null);
//       }
//     }, 300);

//     return () => clearTimeout(timeoutId);
//   }, [searchQuery]);

//   const performSearch = async (query) => {
//     setLoadingSearch(true);
//     setSearchError(null);

//     try {
//       console.log(`🔍 Searching for: "${query}"`);

//       const response = await fetch(
//         `https://tadaa-bacend.onrender.com/api/products?search=${encodeURIComponent(query)}&limit=8`
//       );

//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log(`✅ Found ${data.length} products`);

//       setSearchResults(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Search error:", error);
//       setSearchError("Something went wrong. Please try again.");
//       setSearchResults([]);
//     } finally {
//       setLoadingSearch(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//     setIsProfileMenuOpen(false);
//     setIsMenuOpen(false);
//   };

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setIsProfileMenuOpen(false);
//       }
//       if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
//         setIsCategoriesOpen(false);
//       }
//       if (searchRef.current && !searchRef.current.contains(e.target)) {
//         setIsSearchOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const navItems = [
//     { name: "Home", path: "/" },
//     { name: "Shop by Categories", path: "/shop", hasDropdown: true },
//     { name: "Best Sellers", path: "/best-sellers" },
//     { name: "New Arrivals", path: "/new-arrivals" },
//     { name: "Offers", path: "/offers" }
//   ];

//   return (
//     <nav className="bg-white sticky top-0 z-50 shadow-sm border-b">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20">
          
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Link to="/">
//               <img src={logo} alt="Logo" className="h-10 w-auto" />
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             {navItems.map((item) => (
//               <div
//                 key={item.name}
//                 className="relative"
//                 ref={item.hasDropdown ? categoriesRef : null}
//               >
//                 {item.hasDropdown ? (
//                   <button
//                     onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
//                     className="text-gray-700 hover:text-black font-medium flex items-center gap-1 py-2 transition-all"
//                   >
//                     {item.name}
//                     <FaChevronDown
//                       className={`text-xs transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`}
//                     />
//                   </button>
//                 ) : (
//                   <Link
//                     to={item.path}
//                     className="text-gray-700 hover:text-black font-medium py-2 transition-all relative group"
//                   >
//                     {item.name}
//                     <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform" />
//                   </Link>
//                 )}

//                 {/* Categories Dropdown */}
//                 {item.hasDropdown && isCategoriesOpen && (
//                   <div className="absolute left-0 mt-4 w-[720px] bg-white border border-gray-100 shadow-2xl rounded-2xl p-8 grid grid-cols-3 gap-6 z-50">
//                     {loadingCategories ? (
//                       <div className="col-span-3 py-8 text-center text-gray-500">Loading categories...</div>
//                     ) : (
//                       categories.map((category) => (
//                         <Link
//                           key={category}
//                           to={`/shop?category=${encodeURIComponent(category)}`}
//                           className="group"
//                           onClick={() => setIsCategoriesOpen(false)}
//                         >
//                           <h3 className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
//                             {category}
//                           </h3>
//                           <p className="text-xs text-pink-500 mt-1">Shop now →</p>
//                         </Link>
//                       ))
//                     )}
//                     <div className="col-span-3 mt-6 pt-6 border-t text-center">
//                       <Link
//                         to="/shop"
//                         className="text-pink-600 hover:text-pink-700 font-medium"
//                         onClick={() => setIsCategoriesOpen(false)}
//                       >
//                         View All Products →
//                       </Link>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Desktop Search Bar */}
//           <div className="hidden md:block flex-1 max-w-md mx-8 relative" ref={searchRef}>
//             <div className="relative">
//               <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onFocus={() => setIsSearchOpen(true)}
//                 placeholder="Search millets, spices, dry fruits..."
//                 className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-pink-500 focus:bg-white text-sm"
//               />
//             </div>

//             {/* Search Results Dropdown */}
//             {isSearchOpen && searchQuery.trim().length >= 2 && (
//               <div className="absolute mt-3 w-full bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-50 max-h-[420px] overflow-y-auto">
//                 {loadingSearch ? (
//                   <div className="p-8 text-center text-gray-500">Searching...</div>
//                 ) : searchError ? (
//                   <div className="p-8 text-center text-red-500">{searchError}</div>
//                 ) : searchResults.length > 0 ? (
//                   searchResults.map((product) => (
//                     <Link
//                       key={product._id}
//                       to={`/product/${product._id}`}
//                       className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 border-b last:border-none"
//                       onClick={() => {
//                         setSearchQuery("");
//                         setIsSearchOpen(false);
//                       }}
//                     >
//                       <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
//                         {product.images && product.images[0] ? (
//                          <img
//                   src={product.images[0]}           // ← FIXED: Use array index
//                   alt={product.name}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform"
//                   onError={(e) => {
//                     e.target.src = "https://via.placeholder.com/48?text=No+Image"; 
//                   }}
//                 />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
//                             No Image
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex-1">
//                         <p className="font-medium text-gray-800 line-clamp-1">{product.name}</p>
//                         <p className="text-pink-600 font-medium">₹{product.price}</p>
//                       </div>
//                     </Link>
//                   ))
//                 ) : (
//                   <div className="p-10 text-center text-gray-500">
//                     No products found for <span className="font-medium">"{searchQuery}"</span>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Utility Icons */}
//           <div className="hidden md:flex items-center space-x-6 text-gray-700">
//             <Link to="/wishlist" className="hover:text-pink-500 transition-colors">
//               <FiHeart size={24} />
//             </Link>
//             <Link to="/cart" className="relative hover:text-pink-500 transition-colors">
//               <FiShoppingBag size={24} />
//               {cartCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-green-700 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>

//             <div className="relative" ref={dropdownRef}>
//               <button
//                 onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
//                 className="hover:text-pink-500 transition-colors"
//               >
//                 <FiUser size={24} />
//               </button>

//               {isProfileMenuOpen && (
//                 <div className="absolute right-0 mt-4 w-56 bg-white border border-gray-100 shadow-xl rounded-xl py-2 text-sm z-50">
//                   {user ? (
//                     <>
//                       <div className="px-4 py-3 border-b">
//                         <p className="font-semibold">{user.name}</p>
//                         <p className="text-xs text-gray-500">{user.email}</p>
//                       </div>
//                       <Link to="/user" className="block px-4 py-2.5 hover:bg-gray-50" onClick={() => setIsProfileMenuOpen(false)}>
//                         My Account
//                       </Link>
//                       <Link to="/orders" className="block px-4 py-2.5 hover:bg-gray-50" onClick={() => setIsProfileMenuOpen(false)}>
//                         My Orders
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-gray-50"
//                       >
//                         Logout
//                       </button>
//                     </>
//                   ) : (
//                     <Link
//                       to="/login"
//                       className="block px-4 py-2.5 hover:bg-gray-50"
//                       onClick={() => setIsProfileMenuOpen(false)}
//                     >
//                       Login / Register
//                     </Link>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden flex items-center gap-3">
//             <button
//               onClick={() => setIsSearchOpen(!isSearchOpen)}
//               className="text-gray-700"
//             >
//               <FiSearch size={24} />
//             </button>
//             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800">
//               {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Search */}
//       {isSearchOpen && (
//         <div className="md:hidden border-t bg-white px-4 py-4">
//           <div className="relative">
//             <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search products..."
//               className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-pink-500"
//             />
//           </div>
//         </div>
//       )}

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden bg-white border-t">
//           <div className="px-4 py-6 space-y-4">
//             {navItems.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.path}
//                 className="block text-gray-700 font-medium py-2"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 {item.name}
//               </Link>
//             ))}

//             <div className="pt-4 border-t">
//               <p className="text-sm text-gray-500 mb-3">Categories</p>
//               {categories.map((category) => (
//                 <Link
//                   key={category}
//                   to={`/shop?category=${encodeURIComponent(category)}`}
//                   className="block py-2.5 text-gray-600 hover:text-pink-500"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {category}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   ); 
// }


//final woring file 


// import { Link, useNavigate } from "react-router-dom";
// import { useState, useRef, useEffect } from "react";
// import { useAuth } from "../pages/AuthContext";
// import { useCart } from "../context/CartContext";
// import {
//   FaChevronDown,
//   FaBars,
//   FaTimes
// } from "react-icons/fa";
// import { FiSearch, FiHeart, FiShoppingBag, FiUser } from "react-icons/fi";
// import logo from "../assets/Loho.png";

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
  
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [loadingSearch, setLoadingSearch] = useState(false);
//   const [searchError, setSearchError] = useState(null);

//   const [categories, setCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(true);

//   const { user, logout } = useAuth();
//   const { cartCount } = useCart();
//   const navigate = useNavigate();

//   const dropdownRef = useRef(null);
//   const categoriesRef = useRef(null);
//   const searchRef = useRef(null);
//   const searchInputRef = useRef(null);
  

//   // Helper function to get image URL
//   const getProductImage = (product) => {
//     if (!product?.images?.length) return null;
//     const img = product.images[0];
//     // Handle both string URLs and object formats
//     if (typeof img === 'string') return img;
//     if (img?.url) return img.url;
//     return null;
//   };

//   // Fetch Categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch("https://tadaa-bacend.onrender.com/api/categories");
//         if (res.ok) {
//           const data = await res.json();
//           setCategories(Array.isArray(data) ? data.sort() : []);
//         }
//       } catch (err) {
//         console.error("Failed to fetch categories:", err);
//         // Fallback categories
//         setCategories([
//           "Millets", "Pulses & Lentils", "Whole Pulses", "Edible Oils",
//           "Spices", "Sweeteners", "Honey", "Dry Fruits", "Nuts & Seeds",
//           "Flours", "Traditional Mixes"
//         ]);
//       } finally {
//         setLoadingCategories(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Debounced Search
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (searchQuery.trim().length >= 2) {
//         performSearch(searchQuery.trim());
//       } else {
//         setSearchResults([]);
//         setSearchError(null);
//       }
//     }, 300);

//     return () => clearTimeout(timeoutId);
//   }, [searchQuery]);

//   const performSearch = async (query) => {
//     setLoadingSearch(true);
//     setSearchError(null);

//     try {
//       console.log(`🔍 Searching for: "${query}"`);

//       const response = await fetch(
//         `https://tadaa-bacend.onrender.com/api/products?search=${encodeURIComponent(query)}&limit=8`
//       );

//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log(`✅ Found ${data.length} products`);

//       setSearchResults(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Search error:", error);
//       setSearchError("Something went wrong. Please try again.");
//       setSearchResults([]);
//     } finally {
//       setLoadingSearch(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//     setIsProfileMenuOpen(false);
//     setIsMenuOpen(false);
//   };

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setIsProfileMenuOpen(false);
//       }
//       if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
//         setIsCategoriesOpen(false);
//       }
//       if (searchRef.current && !searchRef.current.contains(e.target)) {
//         setIsSearchOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const navItems = [
//     { name: "Home", path: "/" },
//     { name: "Shop by Categories", path: "/shop", hasDropdown: true },
//     { name: "Best Sellers", path: "/best-sellers" },
//     { name: "New Arrivals", path: "/new-arrivals" },
//     { name: "Offers", path: "/offers" }
//   ];

//   return (
//     <nav className="bg-white sticky top-0 z-50 shadow-sm  ">
//       <div className="max-w-9xl mx-auto container">
//         <div className="flex justify-between items-center h-20">
          
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Link to="/">
//               <img src={logo} alt="Logo" className="h-10 w-auto" />
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             {navItems.map((item) => (
//               <div
//                 key={item.name}
//                 className="relative"
//                 ref={item.hasDropdown ? categoriesRef : null}
//               >
//                 {item.hasDropdown ? (
//                   <button
//                     onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
//                     className="text-gray-700 hover:text-black font-medium flex items-center gap-1 py-2 transition-all"
//                   >
//                     {item.name}
//                     <FaChevronDown
//                       className={`text-xs transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`}
//                     />
//                   </button>
//                 ) : (
//                   <Link
//                     to={item.path}
//                     className="text-gray-700 hover:text-black font-medium py-2 transition-all relative group"
//                   >
//                     {item.name}
//                     <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform" />
//                   </Link>
//                 )}

//                 {/* Categories Dropdown */}
//                 {item.hasDropdown && isCategoriesOpen && (
//                   <div className="absolute left-0 mt-4 w-[720px] bg-white border border-gray-100 shadow-2xl rounded-2xl p-8 grid grid-cols-3 gap-6 z-50">
//                     {loadingCategories ? (
//                       <div className="col-span-3 py-8 text-center text-gray-500">Loading categories...</div>
//                     ) : (
//                       categories.map((category) => (
//                         <Link
//                           key={category}
//                           to={`/shop?category=${encodeURIComponent(category)}`}
//                           className="group"
//                           onClick={() => setIsCategoriesOpen(false)}
//                         >
//                           <h3 className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
//                             {category}
//                           </h3>
//                           <p className="text-xs text-pink-500 mt-1">Shop now →</p>
//                         </Link>
//                       ))
//                     )}
//                     <div className="col-span-3 mt-6 pt-6 border-t text-center">
//                       <Link
//                         to="/shop"
//                         className="text-pink-600 hover:text-pink-700 font-medium"
//                         onClick={() => setIsCategoriesOpen(false)}
//                       >
//                         View All Products →
//                       </Link>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Desktop Search Bar - Reduced width */}
//           <div className="hidden md:block flex-1 max-w-3xs   relative" ref={searchRef}>
//             <div className="relative">
//               <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onFocus={() => setIsSearchOpen(true)}
//                 placeholder="Search millets, spices, dry fruits..."
//                 className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-pink-500 focus:bg-white text-sm"
//               />
//             </div>

//             {/* Search Results Dropdown */}
//             {isSearchOpen && searchQuery.trim().length >= 2 && (
//               <div className="absolute mt-3 w-full bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-50 max-h-[380px] overflow-y-auto">
//                 {loadingSearch ? (
//                   <div className="p-8 text-center text-gray-500">Searching...</div>
//                 ) : searchError ? (
//                   <div className="p-8 text-center text-red-500">{searchError}</div>
//                 ) : searchResults.length > 0 ? (
//                   searchResults.map((product) => {
//                     const imageUrl = getProductImage(product);
//                     return (
//                       <Link
//                         key={product._id}
//                         to={`/product/${product._id}`}
//                         className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b last:border-none transition-colors"
//                         onClick={() => {
//                           setSearchQuery("");
//                           setIsSearchOpen(false);
//                         }}
//                       >
//                         {/* Product Image - Fixed */}
//                         <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
//                           {imageUrl ? (
//                             <img
//                               src={imageUrl}
//                               alt={product.name}
//                               className="w-full h-full  "
//                               onError={(e) => {
//                                 e.target.onerror = null;
//                                 e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
//                               }}
//                             />
//                           ) : (
//                             <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                               <FiShoppingBag className="text-gray-400" size={20} />
//                             </div>
//                           )}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium text-gray-800 text-sm truncate">{product.name}</p>
//                           <div className="flex items-center gap-2 mt-1">
//                             <p className="text-pink-600 font-semibold text-sm">₹{Number(product.price).toFixed(2)}</p>
//                             {product.category && (
//                               <span className="text-xs text-gray-400 truncate">{product.category}</span>
//                             )}
//                           </div>
//                         </div>
//                       </Link>
//                     );
//                   })
//                 ) : (
//                   <div className="p-8 text-center text-gray-500">
//                     <p>No products found for</p>
//                     <p className="font-medium text-gray-700 mt-1">"{searchQuery}"</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Utility Icons */}
//           <div className="hidden md:flex items-center space-x-6 text-gray-700">
//             <Link to="/wishlist" className="hover:text-pink-500 transition-colors">
//               <FiHeart size={24} />
//             </Link>
//             <Link to="/cart" className="relative hover:text-pink-500 transition-colors">
//               <FiShoppingBag size={24} />
//               {cartCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-green-700 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>

//             <div className="relative" ref={dropdownRef}>
//               <button
//                 onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
//                 className="hover:text-pink-500 transition-colors"
//               >
//                 <FiUser size={24} />
//               </button>

//               {isProfileMenuOpen && (
//                 <div className="absolute right-0 mt-4 w-56 bg-white border border-gray-100 shadow-xl rounded-xl py-2 text-sm z-50">
//                   {user ? (
//                     <>
//                       <div className="px-4 py-3 border-b">
//                         <p className="font-semibold">{user.name}</p>
//                         <p className="text-xs text-gray-500">{user.email}</p>
//                       </div>
//                       <Link to="/user" className="block px-4 py-2.5 hover:bg-gray-50" onClick={() => setIsProfileMenuOpen(false)}>
//                         My Account
//                       </Link>
//                       <Link to="/orders" className="block px-4 py-2.5 hover:bg-gray-50" onClick={() => setIsProfileMenuOpen(false)}>
//                         My Orders
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-gray-50"
//                       >
//                         Logout
//                       </button>
//                     </>
//                   ) : (
//                     <Link
//                       to="/login"
//                       className="block px-4 py-2.5 hover:bg-gray-50"
//                       onClick={() => setIsProfileMenuOpen(false)}
//                     >
//                       Login / Register
//                     </Link>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden flex items-center gap-3">
//             <button
//               onClick={() => setIsSearchOpen(!isSearchOpen)}
//               className="text-gray-700"
//             >
//               <FiSearch size={24} />
//             </button>
//             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800">
//               {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Search */}
//       {isSearchOpen && (
//         <div className="md:hidden border-t bg-white px-4 py-4">
//           <div className="relative">
//             <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search products..."
//               className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-pink-500"
//             />
//           </div>
//           {/* Mobile search results */}
//           {searchQuery.trim().length >= 2 && (
//             <div className="mt-3 bg-white border rounded-xl overflow-hidden max-h-96 overflow-y-auto">
//               {loadingSearch ? (
//                 <div className="p-4 text-center text-gray-500">Searching...</div>
//               ) : searchResults.length > 0 ? (
//                 searchResults.map((product) => {
//                   const imageUrl = getProductImage(product);
//                   return (
//                     <Link
//                       key={product._id}
//                       to={`/product/${product._id}`}
//                       className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b last:border-none"
//                       onClick={() => {
//                         setSearchQuery("");
//                         setIsSearchOpen(false);
//                       }}
//                     >
//                       <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
//                         {imageUrl ? (
//                           <img
//                             src={imageUrl}
//                             alt={product.name}
//                             className="w-full h-full object-cover"
//                             onError={(e) => {
//                               e.target.onerror = null;
//                               e.target.src = 'https://via.placeholder.com/40x40?text=No+Image';
//                             }}
//                           />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                             <FiShoppingBag className="text-gray-400" size={16} />
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex-1">
//                         <p className="font-medium text-gray-800 text-sm">{product.name}</p>
//                         <p className="text-pink-600 font-semibold text-sm">₹{Number(product.price).toFixed(2)}</p>
//                       </div>
//                     </Link>
//                   );
//                 })
//               ) : (
//                 <div className="p-4 text-center text-gray-500">
//                   No products found for "{searchQuery}"
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden bg-white border-t">
//           <div className="px-4 py-6 space-y-4">
//             {navItems.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.path}
//                 className="block text-gray-700 font-medium py-2"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 {item.name}
//               </Link>
//             ))}

//             <div className="pt-4 border-t">
//               <p className="text-sm text-gray-500 mb-3">Categories</p>
//               {categories.map((category) => (
//                 <Link
//                   key={category}
//                   to={`/shop?category=${encodeURIComponent(category)}`}
//                   className="block py-2.5 text-gray-600 hover:text-pink-500"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {category}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }



import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../pages/AuthContext";
import { useCart } from "../context/CartContext";
import {
  FaChevronDown,
  FaBars,
  FaTimes,
  FaFire,
  FaStar,
  FaGift,
  FaHome
} from "react-icons/fa";
import { FiSearch, FiHeart, FiShoppingBag, FiUser } from "react-icons/fi";
import logo from "../assets/Loho.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  const categoriesRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  

  // Helper function to get image URL
  const getProductImage = (product) => {
    if (!product?.images?.length) return null;
    const img = product.images[0];
    // Handle both string URLs and object formats
    if (typeof img === 'string') return img;
    if (img?.url) return img.url;
    return null;
  };

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://tadaa-bacend.onrender.com/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(Array.isArray(data) ? data.sort() : []);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        // Fallback categories
        setCategories([
          "Millets", "Pulses & Lentils", "Whole Pulses", "Edible Oils",
          "Spices", "Sweeteners", "Honey", "Dry Fruits", "Nuts & Seeds",
          "Flours", "Traditional Mixes"
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Debounced Search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery.trim());
      } else {
        setSearchResults([]);
        setSearchError(null);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const performSearch = async (query) => {
    setLoadingSearch(true);
    setSearchError(null);

    try {
      console.log(`🔍 Searching for: "${query}"`);

      const response = await fetch(
        `https://tadaa-bacend.onrender.com/api/products?search=${encodeURIComponent(query)}&limit=8`
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Found ${data.length} products`);

      setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchError("Something went wrong. Please try again.");
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setIsCategoriesOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigation items with enhanced features - NO EMOJIS
  const navItems = [
    { 
      name: "Home", 
      path: "/",
      // icon: <FaHome className="mr-1" size={14} />,
      badge: null
    },
    { 
      name: "Shop by Categories", 
      path: "/shop", 
      hasDropdown: true,
      // icon: null,
      badge: null
    },
    { 
      name: "Best Sellers", 
      path: "/shop?filter=bestsellers",
      // icon: <FaFire className="text-orange-500 mr-1" size={14} />,
      // badge: "Bestseller"
    },
    { 
      name: "New Arrivals", 
      path: "/shop?filter=newarrivals",
      // icon: <FaStar className="text-yellow-500 mr-1" size={14} />,
      // badge: "New"
    },
    { 
      name: "Offers", 
      path: "/shop?filter=offers",
      // icon: <FaGift className="text-red-500 mr-1" size={14} />,
      // badge: "Sale"
    }
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-9xl mx-auto container">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                ref={item.hasDropdown ? categoriesRef : null}
              >
                {item.hasDropdown ? (
                  <button
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    className="text-gray-700 hover:text-black font-medium flex items-center gap-1 py-2 transition-all"
                  >
                    {item.name}
                    <FaChevronDown
                      className={`text-xs transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className="text-gray-700 hover:text-black font-medium py-2 transition-all relative group flex items-center gap-1"
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.icon && <span className="flex items-center">{item.icon}</span>}
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ml-1 text-[10px] bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-semibold">
                        {item.badge}
                      </span>
                    )}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform" />
                  </Link>
                )}

                {/* Categories Dropdown */}
                {item.hasDropdown && isCategoriesOpen && (
                  <div className="absolute left-0 mt-4 w-[720px] bg-white border border-gray-100 shadow-2xl rounded-2xl p-8 grid grid-cols-3 gap-6 z-50">
                    {loadingCategories ? (
                      <div className="col-span-3 py-8 text-center text-gray-500">Loading categories...</div>
                    ) : (
                      categories.map((category) => (
                        <Link
                          key={category}
                          to={`/shop?category=${encodeURIComponent(category)}`}
                          className="group"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          <h3 className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
                            {category}
                          </h3>
                          <p className="text-xs text-pink-500 mt-1">Shop now →</p>
                        </Link>
                      ))
                    )}
                    <div className="col-span-3 mt-6 pt-6 border-t text-center">
                      <Link
                        to="/shop"
                        className="text-pink-600 hover:text-pink-700 font-medium"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        View All Products →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-1 max-w-3xs relative" ref={searchRef}>
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search millets, spices, dry fruits..."
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-pink-500 focus:bg-white text-sm"
              />
            </div>

            {/* Search Results Dropdown */}
            {isSearchOpen && searchQuery.trim().length >= 2 && (
              <div className="absolute mt-3 w-full bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-50 max-h-[380px] overflow-y-auto">
                {loadingSearch ? (
                  <div className="p-8 text-center text-gray-500">Searching...</div>
                ) : searchError ? (
                  <div className="p-8 text-center text-red-500">{searchError}</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => {
                    const imageUrl = getProductImage(product);
                    return (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b last:border-none transition-colors"
                        onClick={() => {
                          setSearchQuery("");
                          setIsSearchOpen(false);
                        }}
                      >
                        {/* Product Image */}
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <FiShoppingBag className="text-gray-400" size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm truncate">{product.name}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <p className="text-pink-600 font-semibold text-sm">₹{Number(product.price).toFixed(2)}</p>
                            {product.category && (
                              <span className="text-xs text-gray-400 truncate">{product.category}</span>
                            )}
                            {product.isBestSeller && (
                              <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full font-semibold">Bestseller</span>
                            )}
                            {product.discountPrice && product.discountPrice < product.price && (
                              <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">
                                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>No products found for</p>
                    <p className="font-medium text-gray-700 mt-1">"{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Utility Icons */}
          <div className="hidden md:flex items-center space-x-6 text-gray-700">
            <Link to="/wishlist" className="hover:text-pink-500 transition-colors">
              <FiHeart size={24} />
            </Link>
            <Link to="/cart" className="relative hover:text-pink-500 transition-colors">
              <FiShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-700 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="hover:text-pink-500 transition-colors"
              >
                <FiUser size={24} />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-4 w-56 bg-white border border-gray-100 shadow-xl rounded-xl py-2 text-sm z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link to="/user" className="block px-4 py-2.5 hover:bg-gray-50" onClick={() => setIsProfileMenuOpen(false)}>
                        My Account
                      </Link>
                      <Link to="/orders" className="block px-4 py-2.5 hover:bg-gray-50" onClick={() => setIsProfileMenuOpen(false)}>
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="block px-4 py-2.5 hover:bg-gray-50"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Login / Register
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-700"
            >
              <FiSearch size={24} />
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800">
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {isSearchOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-pink-500"
            />
          </div>
          {/* Mobile search results */}
          {searchQuery.trim().length >= 2 && (
            <div className="mt-3 bg-white border rounded-xl overflow-hidden max-h-96 overflow-y-auto">
              {loadingSearch ? (
                <div className="p-4 text-center text-gray-500">Searching...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((product) => {
                  const imageUrl = getProductImage(product);
                  return (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b last:border-none"
                      onClick={() => {
                        setSearchQuery("");
                        setIsSearchOpen(false);
                      }}
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/40x40?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <FiShoppingBag className="text-gray-400" size={16} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                        <p className="text-pink-600 font-semibold text-sm">₹{Number(product.price).toFixed(2)}</p>
                        {product.isBestSeller && (
                          <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full font-semibold">Bestseller</span>
                        )}
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No products found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block text-gray-700 font-medium py-2 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.name}</span>
                {item.badge && (
                  <span className="text-[10px] bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-semibold">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500 mb-3">Categories</p>
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/shop?category=${encodeURIComponent(category)}`}
                  className="block py-2.5 text-gray-600 hover:text-pink-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}