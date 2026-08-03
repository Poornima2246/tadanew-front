import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const CreateProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    // address: "",
    gender: "",
  });
  const [avatar, setAvatar] = useState(null);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    setAvatar(URL.createObjectURL(file));
  };

  const handleGender = (gender) => {
    setProfile({ ...profile, gender });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile Created:", profile);
    // send profile to backend API
  };

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Create Profile</h2>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="w-24 h-24 text-gray-400" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatar}
          className="mb-4 w-full"
        />

        {/* Name */}
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full mb-8 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-third"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full mb-8 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-third"
          required
        />

        {/* Phone */}
        <input
          type="tel"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full mb-8 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-third"
        />
  
        {/* Gender Selection */}
        {/* <h4 className="mb-2 font-medium">Gender</h4> */}
<div className="mb-8 flex flex-wrap gap-4">
  {["Female", "Male", "Other"].map((g) => (
    <button
      type="button"
      key={g}
      onClick={() => handleGender(g)}
      className={`px-4 py-2 rounded-md border transition focus:outline-none ${
        profile.gender === g
          ? "bg-third text-white border-third"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
    >
      {g}
    </button>
  ))}
</div>


        <button
          type="submit"
          className="w-full bg-third text-black py-2 rounded-md hover:bg-purple-700 transition"
        >
          Create Profile
        </button>
      </form>
    </div>
  );
};

export default CreateProfile;