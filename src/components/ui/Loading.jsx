import { motion } from "framer-motion";

const Loading = ({ type = "page" }) => {
  if (type === "table") {
    return (
      <div className="space-y-4 p-6">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="h-10 w-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="card-premium p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 animate-pulse" />
              <div className="h-8 w-8 bg-gradient-to-r from-primary-200 to-primary-300 rounded-full animate-pulse" />
            </div>
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse mb-2" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 animate-pulse" />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-lg font-semibold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Loading SalesPulse
          </p>
          <p className="text-gray-500">Please wait while we prepare your dashboard...</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Loading;