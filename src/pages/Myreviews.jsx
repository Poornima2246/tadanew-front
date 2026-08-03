import React, { useState } from "react";
import { FaStar, FaTrash, FaEdit, FaRegComment, FaCalendar, FaEllipsisV, FaCheckCircle } from "react-icons/fa";
import { HiSparkles, HiPencil, HiTrash } from "react-icons/hi";

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      productName: "Wireless Noise Cancelling Headphones",
      rating: 4.5,
      reviewText: "Absolutely love these headphones! The noise cancellation is incredible and battery life lasts all day. Perfect for work and travel.",
      image: "src/assets/test1.jpg",
      date: "2024-01-15",
      verified: true,
      helpful: 12,
      productPrice: "$299.99",
      status: "published"
    },
    {
      id: 2,
      productName: "Smart Fitness Watch Series X",
      rating: 3.5,
      reviewText: "Good features but the heart rate monitor could be more accurate. Love the battery life though!",
      image: "src/assets/test1.jpg",
      date: "2024-01-10",
      verified: true,
      helpful: 8,
      productPrice: "$199.99",
      status: "published"
    },
    {
      id: 3,
      productName: "Organic Cotton Premium T-Shirt",
      rating: 5.0,
      reviewText: "The most comfortable t-shirt I've ever owned! Perfect fit and the fabric quality is outstanding.",
      image: "src/assets/test1.jpg",
      date: "2024-01-08",
      verified: false,
      helpful: 25,
      productPrice: "$39.99",
      status: "published"
    },
    {
      id: 4,
      productName: "Portable Espresso Maker Pro",
      rating: 4.0,
      reviewText: "Great for camping trips! Makes decent espresso but takes some practice to get it right.",
      image: "src/assets/test1.jpg",
      date: "2024-01-05",
      verified: true,
      helpful: 15,
      productPrice: "$89.99",
      status: "published"
    },
    {
      id: 5,
      productName: "Mechanical Keyboard RGB",
      rating: 2.5,
      reviewText: "Keys are too loud for office use and the RGB software is complicated. Not what I expected.",
      image: "src/assets/test1.jpg",
      date: "2024-01-03",
      verified: true,
      helpful: 5,
      productPrice: "$129.99",
      status: "published"
    },
    {
      id: 6,
      productName: "Wireless Charging Pad",
      rating: 4.5,
      reviewText: "Fast charging and works through phone cases. LED indicator is a nice touch!",
      image: "src/assets/test1.jpg",
      date: "2024-01-01",
      verified: false,
      helpful: 18,
      productPrice: "$49.99",
      status: "published"
    },
  ]);

  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showEditModal, setShowEditModal] = useState(null);

  const handleDelete = (id) => {
    setReviews(reviews.filter((review) => review.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleEdit = (review) => {
    setShowEditModal(review);
    // In a real app, this would open a modal with form
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`text-lg transition-colors ${
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        } ${i === Math.floor(rating) && rating % 1 !== 0 ? "text-yellow-400" : ""}`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredReviews = reviews.filter(review => {
    if (activeFilter === "high-rating") return review.rating >= 4;
    if (activeFilter === "low-rating") return review.rating < 3;
    if (activeFilter === "verified") return review.verified;
    return true;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
    if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    return 0;
  });

  const stats = {
    total: reviews.length,
    average: (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1),
    verified: reviews.filter(review => review.verified).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <span>Account</span>
            <span>•</span>
            <span className="text-purple-600 font-medium">My Reviews</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
                  <FaRegComment className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    My Reviews
                  </h1>
                  <p className="text-gray-600 mt-2 text-lg">
                    {stats.total} reviews • {stats.average} average rating
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats and Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-gray-600">Total Reviews</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-yellow-500">{stats.average}</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-green-500">{stats.verified}</div>
              <div className="text-gray-600">Verified Purchases</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-blue-500">
                {reviews.filter(r => r.rating >= 4).length}
              </div>
              <div className="text-gray-600">Positive Reviews</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: "all", label: "All Reviews", count: reviews.length },
              { id: "high-rating", label: "Positive", count: reviews.filter(r => r.rating >= 4).length },
              { id: "low-rating", label: "Critical", count: reviews.filter(r => r.rating < 3).length },
              { id: "verified", label: "Verified", count: reviews.filter(r => r.verified).length }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-2xl font-medium whitespace-nowrap transition-all duration-300 ${
                  activeFilter === filter.id
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                    : "bg-white/80 text-gray-600 hover:bg-white hover:shadow-md border border-gray-100"
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        {sortedReviews.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl flex items-center justify-center shadow-lg">
              <HiSparkles className="text-5xl text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No reviews found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              {activeFilter === "all" 
                ? "You haven't written any reviews yet. Share your thoughts on recent purchases!"
                : "No reviews match your current filter criteria."}
            </p>
            {activeFilter !== "all" && (
              <button
                onClick={() => setActiveFilter("all")}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Show All Reviews
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {sortedReviews.map((review) => (
              <div
                key={review.id}
                className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={review.image}
                        alt={review.productName}
                        className="w-16 h-16 rounded-2xl object-cover shadow-sm"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">
                          {review.productName}
                        </h3>
                        <p className="text-gray-600 font-semibold">{review.productPrice}</p>
                      </div>
                    </div>
                    
                    {/* Actions Dropdown */}
                    <div className="relative">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                        <FaEllipsisV />
                      </button>
                    </div>
                  </div>

                  {/* Rating and Meta */}
                  <div className="flex items-center gap-4 mb-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        {review.rating}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaCalendar className="text-xs" />
                        {formatDate(review.date)}
                      </div>
                      
                      {review.verified && (
                        <div className="flex items-center gap-1 text-green-600">
                          <FaCheckCircle className="text-xs" />
                          Verified Purchase
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <HiSparkles className="text-xs" />
                        {review.helpful} found helpful
                      </div>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 leading-relaxed mb-6 line-clamp-3">
                    {review.reviewText}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    {/* <button
                      onClick={() => handleEdit(review)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                    >
                      <HiPencil className="text-sm group-hover:scale-110 transition-transform" />
                      Edit Review
                    </button> */}
                    
                    <button
                      onClick={() => setShowDeleteConfirm(review.id)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                    >
                      <HiTrash className="text-sm group-hover:scale-110 transition-transform" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl transform animate-scale-in">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
                  <HiTrash className="text-2xl text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Review?</h3>
                <p className="text-gray-600 mb-6">
                  This action cannot be undone. Your review will be permanently deleted.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-semibold transition-all hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteConfirm)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    Delete Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes scale-in {
          from { 
            opacity: 0; 
            transform: scale(0.9) translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MyReviewsPage;