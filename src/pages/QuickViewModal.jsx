import React, { useState } from "react";
import { FaTimes, FaStar, FaMinus, FaPlus, FaRegHeart, FaShoppingBag } from "react-icons/fa";

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
}) {
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (!isOpen || !product) return null;

  // Fallback Data & Image Handling
  const images = product?.images?.length
    ? product.images.map((img) => (typeof img === "string" ? img : img.url))
    : ["https://via.placeholder.com/500"];

  // Dynamic Calculations
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  // Design Constants
  const brandPink = "bg-[#FF69B4]"; 
  const brandPinkText = "text-[#FF69B4]";
  const brandPinkLight = "bg-[#FF69B41A]";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden relative animate-fadeIn">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors z-10"
        >
          <FaTimes size={24} />
        </button>

        <div className="grid md:grid-cols-2 p-6 md:p-12 gap-8 items-center">
          
          {/* LEFT SIDE: DYNAMIC IMAGE GALLERY */}
          <div className="flex flex-col items-center">
             <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full max-h-[400px] object-contain transition-all duration-300"
              />
              {/* Optional: Multi-image thumbnails if product has more than 1 */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-4">
                  {images.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveImage(i)}
                      className={`w-12 h-12 border-2 rounded-md overflow-hidden ${activeImage === i ? 'border-[#FF69B4]' : 'border-transparent'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="thumb" />
                    </button>
                  ))}
                </div>
              )}
          </div>

          {/* RIGHT SIDE: DYNAMIC CONTENT */}
          <div className="flex flex-col">
            
            {/* TITLE & STOCK STATUS */}
            <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                    {product.name}
                </h2>
                {product.inStock && (
                  <span className={`px-3 py-1 rounded text-[10px] uppercase font-bold ${brandPinkLight} ${brandPinkText}`}>
                      In Stock
                  </span>
                )}
            </div>

            {/* RATING & SKU */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < Math.floor(product.rating || 0) ? "text-orange-400" : "text-gray-200"} 
                    size={14} 
                  />
                ))}
                <span className="text-sm text-gray-400 ml-1">{product.reviewsCount || 0} Review</span>
              </div>
              <span className="text-sm text-gray-400">• SKU: {product.sku || "N/A"}</span>
            </div>

            {/* DYNAMIC PRICE SECTION */}
            <div className="flex items-center gap-3 mb-6">
              {hasDiscount && (
                <span className="text-gray-300 line-through text-xl font-light">
                  ₹{product.oldPrice}
                </span>
              )}
              <span className="text-3xl font-bold text-[#20B21E]">
                ₹{product.price}
              </span>
              {hasDiscount && (
                <span className="bg-red-50 text-red-500 text-xs font-bold px-3 py-1 rounded-full">
                  {discountPercentage}% Off
                </span>
              )}
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            {/* ACTION ROW (Quantity + Add to Cart + Wishlist) */}
            <div className="flex items-center gap-3 mb-8">
              {/* QUANTITY SELECTOR */}
              <div className="flex items-center bg-gray-50 rounded-full border border-gray-100 p-1">
                <button
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-white rounded-full transition shadow-sm"
                >
                  <FaMinus size={10} />
                </button>
                <span className="w-10 text-center font-bold text-gray-700">{qty}</span>
                <button
                  onClick={() => setQty((prev) => prev + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-white rounded-full transition shadow-sm"
                >
                  <FaPlus size={10} />
                </button>
              </div>

              {/* ADD TO CART */}
              <button
                onClick={() => onAddToCart({ ...product, quantity: qty })}
                className={`flex-1 ${brandPink} text-white h-12 rounded-full flex items-center justify-center gap-3 font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all`}
              >
                Add to Cart <FaShoppingBag size={18} />
              </button>

              {/* WISHLIST */}
              <button
                onClick={() => onToggleWishlist(product)}
                className={`w-12 h-12 flex items-center justify-center rounded-full ${brandPinkLight} ${brandPinkText} hover:bg-[#FF69B426] transition-colors`}
              >
                <FaRegHeart size={20} />
              </button>
            </div>

            <hr className="border-gray-100 mb-6" />

            {/* DYNAMIC META DATA */}
            <div className="space-y-2">
              <p className="text-sm text-gray-900">
                <span className="font-bold">Category:</span> 
                <span className="text-gray-500 ml-2">{product.category || "General"}</span>
              </p>
              <p className="text-sm text-gray-900">
                <span className="font-bold">Tag:</span> 
                <span className="text-gray-400 ml-2">
                  {product.tags?.map((tag, index) => (
                    <span key={tag} className={index === 2 ? "text-gray-600 font-medium" : ""}>
                      {tag}{index < product.tags.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}