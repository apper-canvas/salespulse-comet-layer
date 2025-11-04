import { motion } from "framer-motion";
import { useDrag } from "react-dnd";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const DealCard = ({ deal, onEdit, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "deal",
    item: { id: deal.Id, stage: deal.stage },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const stageColors = {
    Lead: "border-l-blue-500 bg-blue-50",
    Qualified: "border-l-green-500 bg-green-50",
    Proposal: "border-l-yellow-500 bg-yellow-50",
    Negotiation: "border-l-orange-500 bg-orange-50",
    Closed: "border-l-purple-500 bg-purple-50"
  };

  const probabilityColor = deal.probability >= 75 ? "text-green-600" : 
                          deal.probability >= 50 ? "text-yellow-600" : "text-red-600";

  return (
    <motion.div
      ref={drag}
      className={`p-4 rounded-lg border-l-4 cursor-move transition-all duration-200 ${
        stageColors[deal.stage] || "border-l-gray-500 bg-gray-50"
      } ${isDragging ? "opacity-50 shadow-2xl" : "shadow-sm hover:shadow-md"}`}
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-900 text-sm">{deal.companyName}</h4>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(deal)}
            className="p-1 hover:bg-white rounded transition-colors"
          >
            <ApperIcon name="Edit2" className="w-4 h-4 text-gray-400 hover:text-primary-600" />
          </button>
          <button
            onClick={() => onDelete(deal.Id)}
            className="p-1 hover:bg-white rounded transition-colors"
          >
            <ApperIcon name="Trash2" className="w-4 h-4 text-gray-400 hover:text-red-600" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-lg font-bold text-gray-900">
          ${deal.value?.toLocaleString() || "0"}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className={`font-medium ${probabilityColor}`}>
            {deal.probability}% probability
          </span>
          <span>
            {deal.expectedCloseDate ? format(new Date(deal.expectedCloseDate), "MMM dd") : "No date"}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-3 h-3 text-primary-600" />
          </div>
          <span className="text-xs text-gray-600 truncate">{deal.assignedTo}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DealCard;