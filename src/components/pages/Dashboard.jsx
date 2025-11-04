import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import taskService from "@/services/api/taskService";
import activityService from "@/services/api/activityService";
import { format } from "date-fns";

const Dashboard = () => {
  const [data, setData] = useState({
    contacts: [],
    deals: [],
    tasks: [],
    activities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [contacts, deals, tasks, activities] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        taskService.getAll(),
        activityService.getAll()
      ]);

      setData({ contacts, deals, tasks, activities });
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} type="inline" />;

  const metrics = [
    {
      title: "Total Contacts",
      value: data.contacts.length.toLocaleString(),
      icon: "Users",
      color: "primary",
      trend: "up",
      trendValue: "+12%"
    },
    {
      title: "Active Deals",
      value: data.deals.filter(d => d.stage !== "Closed").length.toString(),
      icon: "DollarSign",
      color: "success",
      trend: "up",
      trendValue: "+8%"
    },
    {
      title: "Tasks Due",
      value: data.tasks.filter(t => !t.completed && new Date(t.dueDate) <= new Date()).length.toString(),
      icon: "Clock",
      color: "warning",
      trend: "down",
      trendValue: "-15%"
    },
    {
      title: "Total Revenue",
      value: `$${data.deals.filter(d => d.stage === "Closed").reduce((sum, d) => sum + (d.value || 0), 0).toLocaleString()}`,
      icon: "TrendingUp",
      color: "danger",
      trend: "up",
      trendValue: "+23%"
    }
  ];

  const recentActivities = data.activities.slice(0, 5);
  const upcomingTasks = data.tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const dealsByStage = data.deals.reduce((acc, deal) => {
    acc[deal.stage] = (acc[deal.stage] || 0) + 1;
    return acc;
  }, {});

  const getActivityIcon = (type) => {
    switch (type) {
      case "call": return "Phone";
      case "email": return "Mail";
      case "meeting": return "Calendar";
      case "note": return "FileText";
      default: return "Activity";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "call": return "text-green-600 bg-green-100";
      case "email": return "text-blue-600 bg-blue-100";
      case "meeting": return "text-purple-600 bg-purple-100";
      case "note": return "text-orange-600 bg-orange-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your sales today.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.title} {...metric} index={index} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <ApperIcon name="Activity" className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.Id}
                  className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                    <ApperIcon name={getActivityIcon(activity.type)} className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(activity.timestamp), "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </motion.div>
              ))}

              {recentActivities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Activity" className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Upcoming Tasks */}
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Tasks</h2>
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <motion.div
                  key={task.Id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === "high" ? "bg-red-500" :
                    task.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Due {format(new Date(task.dueDate), "MMM dd")}
                    </p>
                  </div>
                </motion.div>
              ))}

              {upcomingTasks.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <ApperIcon name="CheckCircle" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">All caught up!</p>
                </div>
              )}
            </div>
          </div>

          {/* Pipeline Overview */}
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Pipeline Overview</h2>
              <ApperIcon name="PieChart" className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-3">
              {Object.entries(dealsByStage).map(([stage, count]) => (
                <div key={stage} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      stage === "Lead" ? "bg-blue-500" :
                      stage === "Qualified" ? "bg-green-500" :
                      stage === "Proposal" ? "bg-yellow-500" :
                      stage === "Negotiation" ? "bg-orange-500" :
                      stage === "Closed" ? "bg-purple-500" : "bg-gray-500"
                    }`} />
                    <span className="text-sm text-gray-700">{stage}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;