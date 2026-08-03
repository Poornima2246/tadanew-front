 

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { FaHeart, FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar, FaPlus, FaMinus } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  // State for Tabs
  const [activeTab, setActiveTab] = useState("Description");

  const API_URL = `http://localhost:5000/api/products/${id}`;
  const API_WISHLIST = "http://localhost:5000/api/wishlist";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        if (response.data.success) {
          setProduct(response.data.product);
          const token = localStorage.getItem("token");
          if (token) {
            try {
              const wishRes = await axios.get(API_WISHLIST, {
                headers: { Authorization: `Bearer ${token}` },
              });
              const wishlistIds = wishRes.data?.items
                ?.map((item) => item.productId?._id || item.productId)
                .filter(Boolean) || [];
              setIsInWishlist(wishlistIds.includes(id));
            } catch (err) { console.log("Wishlist check failed", err); }
          }
        } else { setError("Product not found"); }
      } catch (err) { setError("Failed to load product details"); }
      finally { setLoading(false); }
    };
    fetchProduct();
  }, [id, API_URL]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // toast.success(`${product.name} added to cart`);
  };

  const toggleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login"); navigate("/login"); return; }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = isInWishlist 
        ? await axios.delete(`${API_WISHLIST}/${id}`, config) 
        : await axios.post(`${API_WISHLIST}/${id}`, {}, config);
      if (res.data?.success) {
        setIsInWishlist(!isInWishlist);
        toast.success(isInWishlist ? "Removed" : "Added ❤️");
      }
    } catch (err) { toast.error("Action failed"); }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div></div>;
  if (error || !product) return <div className="text-center py-20 text-red-500 font-bold">{error || "Product not found"}</div>;

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 py-4 text-xs text-gray-400 flex items-center gap-2">
        <span className="cursor-pointer hover:text-pink-500" onClick={() => navigate("/shop")}>🏠 Product</span>
        <span>›</span>
        <span className="text-pink-500 font-medium capitalize">{product.category || "Shop"}</span>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 mt-6">
        {/* Left: Product Image */}
        <div className="flex justify-center items-center bg-[#fdfdfd] border border-gray-100 rounded-2xl p-10">
          <img 
            src={product.images?.[selectedImage]?.url || product.images?.[selectedImage] || "https://via.placeholder.com/500"} 
            alt={product.name} 
            className="max-h-[450px] w-auto object-contain transition-transform hover:scale-105 duration-300"
          />
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>
            <span className="bg-pink-100 text-pink-600 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">In Stock</span>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex text-yellow-400 text-sm">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.floor(product.rating || 5) ? "fill-current" : "text-gray-200"} />
              ))}
            </div>
            <span className="text-gray-400 text-xs font-medium tracking-wide">
              {product.numReviews || 0} Reviews | SKU: {product._id?.slice(-8).toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-black text-green-600">₹{product.price}</span>
            {product.originalPrice && (
               <>
                 <span className="text-gray-400 line-through text-lg">₹{product.originalPrice}</span>
                 <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-1 rounded-md font-bold">
                   {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                 </span>
               </>
            )}
          </div>

          <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-lg">
            {product.shortDescription || product.description?.substring(0, 200) + "..."}
          </p>

          {/* Controls */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-gray-500 hover:text-pink-500"><FaMinus size={12}/></button>
              <span className="px-5 font-bold text-gray-800 text-sm">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-gray-500 hover:text-pink-500"><FaPlus size={12}/></button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-full flex items-center justify-center gap-3 transition-all shadow-lg shadow-pink-100 uppercase text-xs tracking-widest"
            >
              Add To Cart <FaShoppingCart size={16}/>
            </button>
            
            <button 
              onClick={toggleWishlist}
              className={`p-4 rounded-full border transition-all ${isInWishlist ? 'bg-pink-50 border-pink-500 text-pink-500' : 'bg-gray-50 text-gray-400 hover:border-pink-200'}`}
            >
              <FaHeart size={18} />
            </button>
          </div>

          {/* DYNAMIC CATEGORY & TAGS */}
          <div className="space-y-2 pt-6 border-t border-gray-100">
            <p className="text-sm"><span className="font-bold text-gray-800">Category:</span> <span className="text-gray-500 ml-2">{product.category || "General"}</span></p>
            <p className="text-sm">
              <span className="font-bold text-gray-800">Tags:</span> 
              <span className="text-gray-500 ml-2">
                {product.tags && product.tags.length > 0 ? product.tags.join(", ") : "Healthy, Natural, Organic"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* DYNAMIC TABS SECTION */}
      <div className="max-w-6xl mx-auto px-6 mt-20">
        <div className="flex justify-center border-b border-gray-100 gap-12 mb-10">
          {["Description", "Additional Information", "Customer Feedback"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold tracking-tight transition-all relative ${activeTab === tab ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 transition-all"></div>}
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-gray-500 text-sm leading-8 min-h-[150px]">
          {activeTab === "Description" && (
            <div className="animate-fadeIn">
              {product.description || "No detailed description available."}
            </div>
          )}
          
          {activeTab === "Additional Information" && (
            <div className="animate-fadeIn grid grid-cols-2 gap-4 border border-gray-100 p-6 rounded-xl">
              <div className="font-bold text-gray-700">Weight</div><div>{product.weight || "500g"}</div>
              <div className="font-bold text-gray-700">Dimensions</div><div>{product.dimensions || "10 x 10 x 15 cm"}</div>
              <div className="font-bold text-gray-700">Origin</div><div>{product.origin || "India"}</div>
            </div>
          )}

          {activeTab === "Customer Feedback" && (
            <div className="animate-fadeIn space-y-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev, i) => (
                  <div key={i} className="border-b border-gray-50 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex text-yellow-400 text-[10px]"><FaStar/><FaStar/><FaStar/></div>
                      <span className="font-bold text-gray-800 text-xs">{rev.name || "User"}</span>
                    </div>
                    <p className="italic">"{rev.comment}"</p>
                  </div>
                ))
              ) : (
                <p className="text-center py-4">No reviews yet for this product.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}