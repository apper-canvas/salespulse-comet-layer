import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, type = "page" }) => {
  if (type === "inline") {
    return (
      <motion.div
        className="flex items-center justify-center p-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="space-y-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="AlertCircle" className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-gray-600 mb-3">{message}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="btn-primary text-sm px-4 py-2"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
      <motion.div
        className="text-center space-y-6 max-w-md mx-auto p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <ApperIcon name="AlertCircle" className="w-10 h-10 text-red-600" />
        </motion.div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">Oops! Something went wrong</h2>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>
        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="btn-primary inline-flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon name="RotateCcw" className="w-4 h-4" />
            <span>Try Again</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default Error;