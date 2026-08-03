import React, { useState, useEffect } from "react";
import { useAuth } from "../pages/AuthContext";
import DashboardSidebar from "./DashboardNav";
import axios from "axios";

const DashboardLayout = ({ children, activePage, onPageChange }) => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileRes = await axios.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        if (profileRes.data.success) {
          setProfile(profileRes.data.user);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Please log in to view your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans text-gray-800">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-400 mb-6">
        <span className="mr-2">🏠</span>
        <span className="mx-2">{">"}</span>
        <span className="text-gray-600">{activePage || "Dashboard"}</span>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <div className="col-span-12 md:col-span-3">
          <DashboardSidebar
            active={activePage}
            onNavigate={onPageChange}
            onLogout={logout}
            user={profile}
          />
        </div>

        {/* Main Content Area - Renders child components */}
        <div className="col-span-12 md:col-span-9">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;