import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import userService from "@/services/api/userService";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    avatar: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const roleOptions = [
    { value: "admin", label: "Administrator" },
    { value: "manager", label: "Sales Manager" },
    { value: "representative", label: "Sales Representative" },
    { value: "support", label: "Support Specialist" }
  ];

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const userData = await userService.getProfile();
      setProfile(userData);
    } catch (err) {
      setError("Failed to load profile data. Please try again.");
      console.error("Profile loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!profile.name.trim()) {
      errors.name = "Name is required";
    }

    if (!profile.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!profile.role) {
      errors.role = "Role is required";
    }

if (profile.phone && !/^[\d\s\-+()]+$/.test(profile.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      setSaving(true);
      await userService.updateProfile(profile);
      toast.success("Profile updated successfully!");
      
      // Update localStorage user data for Layout component
      localStorage.setItem("user", JSON.stringify(profile));
      
    } catch (err) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Profile update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    loadProfile(); // Reset to original data
    setValidationErrors({});
  };

  if (loading) return <Loading type="page" />;
  if (error) return <Error message={error} onRetry={loadProfile} type="page" />;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and account settings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Information Card */}
        <div className="card-premium p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            <ApperIcon name="User" className="w-5 h-5 text-gray-400" />
          </div>

          {/* Avatar Section */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ApperIcon name="User" className="w-12 h-12 text-primary-600" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Click to upload avatar"
              />
              <div className="absolute bottom-0 right-0 bg-primary-600 rounded-full p-2 cursor-pointer">
                <ApperIcon name="Camera" className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{profile.name || "User Name"}</h3>
              <p className="text-gray-500">{profile.role || "Role"}</p>
              <p className="text-sm text-gray-400 mt-1">Click on avatar to upload new image</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <Input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                className={`input-premium ${validationErrors.name ? "border-red-500 focus:ring-red-500" : ""}`}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email address"
                className={`input-premium ${validationErrors.email ? "border-red-500 focus:ring-red-500" : ""}`}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <Select
                value={profile.role}
                onChange={(value) => handleInputChange("role", value)}
                options={roleOptions}
                placeholder="Select your role"
                className={`${validationErrors.role ? "border-red-500 focus:ring-red-500" : ""}`}
              />
              {validationErrors.role && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.role}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                className={`input-premium ${validationErrors.phone ? "border-red-500 focus:ring-red-500" : ""}`}
              />
              {validationErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
            className="min-w-[120px]"
          >
            {saving ? (
              <div className="flex items-center space-x-2">
                <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ApperIcon name="Save" className="w-4 h-4" />
                <span>Save Changes</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;