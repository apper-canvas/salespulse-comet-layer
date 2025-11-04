import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white px-4">
      <motion.div
        className="text-center space-y-8 max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 404 Animation */}
        <motion.div
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-24 h-24 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-gray-600 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/")}
              icon="Home"
              size="lg"
            >
              Go to Dashboard
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.history.back()}
              icon="ArrowLeft"
              size="lg"
            >
              Go Back
            </Button>
          </div>

          {/* Quick Links */}
          <div className="pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/contacts")}
                className="flex items-center space-x-2 p-3 text-left text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
              >
                <ApperIcon name="Users" className="w-5 h-5" />
                <span className="text-sm font-medium">Contacts</span>
              </button>
              <button
                onClick={() => navigate("/deals")}
                className="flex items-center space-x-2 p-3 text-left text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
              >
                <ApperIcon name="DollarSign" className="w-5 h-5" />
                <span className="text-sm font-medium">Deals</span>
              </button>
              <button
                onClick={() => navigate("/tasks")}
                className="flex items-center space-x-2 p-3 text-left text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
              >
                <ApperIcon name="CheckSquare" className="w-5 h-5" />
                <span className="text-sm font-medium">Tasks</span>
              </button>
              <button
                onClick={() => navigate("/reports")}
                className="flex items-center space-x-2 p-3 text-left text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
              >
                <ApperIcon name="PieChart" className="w-5 h-5" />
                <span className="text-sm font-medium">Reports</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;