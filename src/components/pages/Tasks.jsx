import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TaskItem from "@/components/molecules/TaskItem";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import taskService from "@/services/api/taskService";
import { toast } from "react-toastify";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    relatedTo: "",
    relatedId: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
  ];

  const relatedToOptions = [
    { value: "", label: "None" },
    { value: "Contact", label: "Contact" },
    { value: "Deal", label: "Deal" },
    { value: "General", label: "General" }
  ];

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Tasks loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      relatedTo: "",
      relatedId: ""
    });
    setFormErrors({});
    setEditingTask(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title || "",
      description: task.description || "",
      dueDate: task.dueDate || "",
      priority: task.priority || "medium",
      relatedTo: task.relatedTo || "",
      relatedId: task.relatedId || ""
    });
    setEditingTask(task);
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await taskService.delete(id);
      setTasks(tasks.filter(t => t.Id !== id));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Delete error:", error);
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await taskService.toggleComplete(id);
      setTasks(tasks.map(t => t.Id === id ? updated : t));
      toast.success(updated.completed ? "Task completed!" : "Task marked as incomplete");
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Toggle error:", error);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.dueDate) errors.dueDate = "Due date is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      if (editingTask) {
        const updated = await taskService.update(editingTask.Id, formData);
        setTasks(tasks.map(t => t.Id === editingTask.Id ? updated : t));
        toast.success("Task updated successfully");
      } else {
        const created = await taskService.create(formData);
        setTasks([...tasks, created]);
        toast.success("Task created successfully");
      }
      
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(editingTask ? "Failed to update task" : "Failed to create task");
      console.error("Submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadTasks} type="inline" />;

  const filteredTasks = tasks.filter(task => {
    const priorityMatch = filterPriority === "all" || task.priority === filterPriority;
    const statusMatch = filterStatus === "all" || 
      (filterStatus === "completed" && task.completed) ||
      (filterStatus === "pending" && !task.completed);
    return priorityMatch && statusMatch;
  });

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length
  };

  if (tasks.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
          <p className="text-gray-600">
            Stay organized and track your to-do items and deadlines.
          </p>
        </div>
        <Empty
          title="No tasks yet"
          description="Start organizing your work by creating your first task"
          actionLabel="Add First Task"
          onAction={handleAdd}
          icon="CheckSquare"
          type="inline"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
          <p className="text-gray-600">
            Stay organized and track your to-do items and deadlines.
          </p>
        </div>
        <Button onClick={handleAdd} icon="Plus">
          Add Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          className="bg-white p-4 rounded-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-4 rounded-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{taskStats.completed}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-4 rounded-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ApperIcon name="Clock" className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{taskStats.pending}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-4 rounded-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ApperIcon name="AlertCircle" className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{taskStats.overdue}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Priority:</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="text-sm border border-gray-200 rounded-md px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded-md px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="text-sm text-gray-500">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task, index) => (
          <TaskItem
            key={task.Id}
            task={task}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
            index={index}
          />
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ApperIcon name="Search" className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No tasks match your current filters</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingTask ? "Edit Task" : "Add New Task"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Task Title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            error={formErrors.title}
            placeholder="Enter task title"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="input-premium resize-none"
              placeholder="Enter task description (optional)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
              error={formErrors.dueDate}
            />

            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => handleInputChange("priority", e.target.value)}
              options={priorityOptions}
            />

            <Select
              label="Related To"
              value={formData.relatedTo}
              onChange={(e) => handleInputChange("relatedTo", e.target.value)}
              options={relatedToOptions}
              placeholder="Select category"
            />

            {formData.relatedTo && (
              <Input
                label="Related ID"
                value={formData.relatedId}
                onChange={(e) => handleInputChange("relatedId", e.target.value)}
                placeholder="Enter related item ID (optional)"
              />
            )}
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={submitting}
              icon={editingTask ? "Save" : "Plus"}
            >
              {editingTask ? "Update Task" : "Add Task"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;