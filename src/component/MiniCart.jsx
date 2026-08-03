import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const MiniCart = ({ isOpen, onClose }) => {
  const { cartItems, cartTotal, cartCount, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const shippingCost = cartTotal >= 500 ? 0 : 50;
  const taxAmount = cartTotal * 0.05;
  const finalAmount = cartTotal + shippingCost + taxAmount;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Lower z-index */}
      <div 
        className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side Panel - Higher z-index + Proper Slide Animation */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl 
                   z-50 flex flex-col transform transition-transform duration-300 ease-in-out
                   ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-green-50">
          <h2 className="text-2xl font-bold text-gray-900">
            Your cart ({cartCount})
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Cart Items - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-xl">Your cart is empty</p>
              <p className="mt-2 text-sm">Start adding some products!</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-6 last:border-b-0">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x300/4CAF50/white?text=No+Image";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    ₹{item.price} × {item.quantity}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-3 py-1 hover:bg-gray-100 text-lg leading-none"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 border-x font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-3 py-1 hover:bg-gray-100 text-lg leading-none"
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="font-semibold text-green-600 whitespace-nowrap">
                  ₹{((item.price || 0) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-6 bg-white">
            <div className="flex justify-between items-center text-xl font-bold mb-6">
              <span>Total</span>
              <span className="text-green-600">₹{finalAmount.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
              <Link
                to="/cart"
                onClick={onClose}
                className="block w-full text-center py-3.5 border-2 border-green-600 text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-colors"
              >
                View Full Cart
              </Link>
              
              <button
                onClick={() => {
                  onClose();
                  navigate('/cart');   // or '/checkout' if you have a separate checkout page
                }}
                className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-5">
              Free shipping on orders above ₹500
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default MiniCart;