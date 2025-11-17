import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const TopNav = ({ onMenuClick, user }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    toast.success("You've been logged out successfully");
    window.location.reload();
  };

  const notifications = [
    { id: 1, message: "New deal added: Acme Corp - $50,000", time: "5 min ago", unread: true },
    { id: 2, message: "Task due today: Follow up with John Smith", time: "1 hour ago", unread: true },
    { id: 3, message: "Deal moved to negotiation stage", time: "2 hours ago", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="lg:pl-64">
      <div className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={onMenuClick}
        >
          <ApperIcon name="Menu" className="h-6 w-6" />
        </button>

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="flex flex-1 items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Welcome back, {user?.name || "User"}
            </h1>
          </div>

          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative"
              >
                <ApperIcon name="Bell" className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                            notification.unread ? "bg-blue-50" : ""
                          }`}
                        >
                          <p className="text-sm text-gray-900 mb-1">{notification.message}</p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-100">
                      <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.company}</p>
                </div>
                <ApperIcon name="ChevronDown" className="h-4 w-4 text-gray-400" />
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <div className="py-1">
<button 
                        onClick={() => navigate("/profile")}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <ApperIcon name="User" className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                        <ApperIcon name="Settings" className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                    </div>
                    <div className="py-1 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <ApperIcon name="LogOut" className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;