import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";

const TaskItem = ({ task, onToggle, onEdit, onDelete, index = 0 }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-green-100 text-green-800 border-green-200"
  };

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
  const isDueToday = format(new Date(task.dueDate), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <motion.div
      className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 ${
        task.completed 
          ? "bg-gray-50 border-gray-200" 
          : "bg-white border-gray-200 hover:border-primary-300 hover:shadow-sm"
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <button
        onClick={() => onToggle(task.Id)}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          task.completed
            ? "bg-primary-600 border-primary-600"
            : "border-gray-300 hover:border-primary-500"
        }`}
      >
        {task.completed && (
          <ApperIcon name="Check" className="w-3 h-3 text-white" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-3 mb-1">
          <h4 className={`font-medium truncate ${
            task.completed ? "text-gray-500 line-through" : "text-gray-900"
          }`}>
            {task.title}
          </h4>
          
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
            priorityColors[task.priority] || priorityColors.low
          }`}>
            {task.priority}
          </span>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Calendar" className="w-4 h-4" />
            <span className={
              isOverdue ? "text-red-600 font-medium" :
              isDueToday ? "text-amber-600 font-medium" : ""
            }>
              {format(new Date(task.dueDate), "MMM dd, yyyy")}
            </span>
            {isOverdue && (
              <span className="text-red-600 text-xs font-medium">(Overdue)</span>
            )}
            {isDueToday && !isOverdue && (
              <span className="text-amber-600 text-xs font-medium">(Due Today)</span>
            )}
          </div>

          {task.relatedTo && (
            <div className="flex items-center space-x-1">
              <ApperIcon name="Link" className="w-4 h-4" />
              <span>{task.relatedTo}</span>
            </div>
          )}
        </div>

        {task.description && (
          <p className={`mt-2 text-sm ${
            task.completed ? "text-gray-400" : "text-gray-600"
          } line-clamp-2`}>
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <ApperIcon name="Edit2" className="w-4 h-4" />
        </button>
<button
          onClick={() => setShowDeleteConfirm(true)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <ApperIcon name="Trash2" className="w-4 h-4" />
        </button>
      </div>
<Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{task.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onDelete(task.Id);
                setShowDeleteConfirm(false);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default TaskItem;