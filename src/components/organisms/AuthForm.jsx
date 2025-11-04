import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const AuthForm = ({ mode = "login", onModeChange, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (mode === "signup" && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (mode === "signup" && !formData.company.trim()) {
      newErrors.company = "Company is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (mode === "signup" && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store auth state
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify({
        name: formData.name || "John Doe",
        email: formData.email,
        company: formData.company || "Demo Company"
      }));

      toast.success(
        mode === "signup" 
          ? "Account created successfully! Welcome to SalesPulse." 
          : "Welcome back! You're now logged in."
      );
      
      onSuccess();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          className="w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center mx-auto mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
        >
          <ApperIcon name="BarChart3" className="w-6 h-6 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h2>
        <p className="text-gray-600">
          {mode === "signup" 
            ? "Start managing your customer relationships effortlessly" 
            : "Sign in to your SalesPulse account"}
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => onModeChange("login")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            mode === "login"
              ? "bg-white text-primary-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => onModeChange("signup")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            mode === "signup"
              ? "bg-white text-primary-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <Input
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={errors.name}
            placeholder="Enter your full name"
          />
        )}

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          error={errors.email}
          placeholder="Enter your email address"
        />

        {mode === "signup" && (
          <Input
            label="Company"
            type="text"
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            error={errors.company}
            placeholder="Enter your company name"
          />
        )}

        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          error={errors.password}
          placeholder="Enter your password"
        />

        <Button
          type="submit"
          className="w-full"
          loading={loading}
          size="lg"
        >
          {mode === "signup" ? "Create Account" : "Sign In"}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center text-sm text-gray-600">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => onModeChange("login")}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => onModeChange("signup")}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;