import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  index = 0 
}) => {
  const colors = {
    primary: "from-primary-500 to-primary-600",
    success: "from-emerald-500 to-emerald-600",
    warning: "from-amber-500 to-amber-600",
    danger: "from-red-500 to-red-600"
  };

  const bgColors = {
    primary: "bg-primary-50",
    success: "bg-emerald-50",
    warning: "bg-amber-50",
    danger: "bg-red-50"
  };

  return (
    <motion.div
      className="card-premium p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <div className={`absolute top-0 right-0 w-16 h-16 ${bgColors[color]} rounded-full -mr-8 -mt-8 opacity-50`} />
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {title}
        </h3>
        <div className={`p-2 rounded-lg bg-gradient-to-r ${colors[color]} text-white shadow-lg`}>
          <ApperIcon name={icon} className="w-5 h-5" />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        
        {trend && trendValue && (
          <div className="flex items-center space-x-1">
            <ApperIcon 
              name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
              className={`w-4 h-4 ${trend === "up" ? "text-emerald-500" : "text-red-500"}`} 
            />
            <span className={`text-sm font-medium ${trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
              {trendValue}
            </span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MetricCard;