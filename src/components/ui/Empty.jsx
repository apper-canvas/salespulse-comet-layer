import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item", 
  actionLabel = "Add Item", 
  onAction,
  icon = "Package",
  type = "page"
}) => {
  if (type === "inline") {
    return (
      <motion.div
        className="flex items-center justify-center p-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name={icon} className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 mb-4 max-w-sm">{description}</p>
            {onAction && (
              <button
                onClick={onAction}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
                <span>{actionLabel}</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <motion.div
        className="text-center space-y-8 max-w-md mx-auto p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <ApperIcon name={icon} className="w-12 h-12 text-primary-600" />
        </motion.div>
        <div className="space-y-3">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
        </div>
        {onAction && (
          <motion.button
            onClick={onAction}
            className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span>{actionLabel}</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default Empty;