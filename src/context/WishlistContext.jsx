import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../pages/AuthContext'; // adjust path as needed
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || ' https://tadanew-bac.onrender.com/api';

  const getAuthToken = () => localStorage.getItem('token');

  // Fetch wishlist from server
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setWishlist({ items: [] });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) throw new Error('No auth token found');

      const response = await axios.get(`${API_URL}/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Backend returns array directly → wrap it into { items: [...] }
        setWishlist({
          items: response.data.wishlist || [],
        });
      } else {
        setWishlist({ items: [] });
      }
    } catch (err) {
      console.error('Fetch wishlist error:', err);
      setError(err.response?.data?.message || 'Failed to load wishlist');

      // Only show toast for real errors (skip 401/unauthorized)
      if (err.response?.status !== 401) {
        toast.error(err.response?.data?.message || 'Could not load wishlist');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Load wishlist when auth state changes
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Add product to wishlist
  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return false;
    }

    setLoading(true);

    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${API_URL}/wishlist/${productId}`, // or /wishlist/add/${productId} — match your backend
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success('Added to wishlist');
        await fetchWishlist(); // refresh full list
        return true;
      } else {
        toast.error(response.data.message || 'Failed to add');
        return false;
      }
    } catch (err) {
      console.error('Add to wishlist error:', err);
      const msg = err.response?.data?.message || 'Failed to add to wishlist';

      if (err.response?.status === 400) {
        toast.error(msg.includes('already') ? 'Already in wishlist' : msg);
      } else {
        toast.error(msg);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove from wishlist (now takes productId)
  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return false;

    setLoading(true);

    try {
      const token = getAuthToken();
      const response = await axios.delete(`${API_URL}/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success('Removed from wishlist');
        await fetchWishlist(); // refresh
        return true;
      } else {
        toast.error(response.data.message || 'Failed to remove');
        return false;
      }
    } catch (err) {
      console.error('Remove error:', err);
      toast.error(err.response?.data?.message || 'Failed to remove from wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    if (!isAuthenticated) return false;

    if (!window.confirm('Clear your entire wishlist?')) return false;

    setLoading(true);

    try {
      const token = getAuthToken();
      const response = await axios.delete(`${API_URL}/wishlist/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setWishlist({ items: [] });
        toast.success('Wishlist cleared');
        return true;
      }
      return false;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to clear wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if product is in wishlist (async version)
  const checkWishlist = async (productId) => {
    if (!isAuthenticated) return false;

    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/wishlist/check/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.success && response.data.isInWishlist;
    } catch {
      return false;
    }
  };

  // Move item from wishlist to cart
  const moveToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login first');
      return false;
    }

    setLoading(true);

    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${API_URL}/wishlist/move-to-cart/${productId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success('Moved to cart');
        await fetchWishlist(); // refresh wishlist
        return true;
      } else {
        toast.error(response.data.message || 'Failed to move to cart');
        return false;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to move to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Sync check (for UI - heart icon fill)
  const isInWishlist = (productId) => {
    return wishlist.items?.some((item) => {
      const id = item.product?._id || item.product || item._id;
      return id === productId;
    }) || false;
  };

  // Toggle add/remove
  const toggleWishlist = async (product) => {
    const productId = product?._id || product;

    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  const getWishlistCount = () => wishlist.items?.length || 0;

  const value = {
    wishlist,
    loading,
    error,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    checkWishlist,
    moveToCart,
    isInWishlist,
    toggleWishlist,
    getWishlistCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};