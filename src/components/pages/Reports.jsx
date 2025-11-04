import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import taskService from "@/services/api/taskService";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns";

const Reports = () => {
  const [data, setData] = useState({
    contacts: [],
    deals: [],
    tasks: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("6months");

  const loadReportsData = async () => {
    try {
      setLoading(true);
      setError("");

      const [contacts, deals, tasks] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        taskService.getAll()
      ]);

      setData({ contacts, deals, tasks });
    } catch (err) {
      setError("Failed to load reports data. Please try again.");
      console.error("Reports data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportsData();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadReportsData} type="inline" />;

  const { contacts, deals, tasks } = data;

  // Calculate metrics
  const totalRevenue = deals.filter(d => d.stage === "Closed").reduce((sum, d) => sum + (d.value || 0), 0);
  const pipelineValue = deals.filter(d => d.stage !== "Closed").reduce((sum, d) => sum + (d.value || 0), 0);
  const avgDealSize = deals.length > 0 ? totalRevenue / deals.filter(d => d.stage === "Closed").length : 0;
  const conversionRate = deals.length > 0 ? (deals.filter(d => d.stage === "Closed").length / deals.length * 100) : 0;

  const metrics = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: "DollarSign",
      color: "success",
      trend: "up",
      trendValue: "+18%"
    },
    {
      title: "Pipeline Value",
      value: `$${pipelineValue.toLocaleString()}`,
      icon: "TrendingUp",
      color: "primary",
      trend: "up",
      trendValue: "+12%"
    },
    {
      title: "Avg Deal Size",
      value: `$${Math.round(avgDealSize).toLocaleString()}`,
      icon: "Target",
      color: "warning",
      trend: "up",
      trendValue: "+8%"
    },
    {
      title: "Conversion Rate",
      value: `${Math.round(conversionRate)}%`,
      icon: "Percent",
      color: "danger",
      trend: "down",
      trendValue: "-2%"
    }
  ];

  // Generate monthly data for charts
  const months = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date()
  });

  const monthlyData = months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const monthDeals = deals.filter(deal => {
      const dealDate = new Date(deal.createdAt);
      return dealDate >= monthStart && dealDate <= monthEnd;
    });

    const closedDeals = monthDeals.filter(d => d.stage === "Closed");
    const revenue = closedDeals.reduce((sum, d) => sum + (d.value || 0), 0);
    
    return {
      month: format(month, "MMM"),
      deals: monthDeals.length,
      revenue: revenue,
      closed: closedDeals.length
    };
  });

  // Deal stage distribution
  const stageDistribution = deals.reduce((acc, deal) => {
    acc[deal.stage] = (acc[deal.stage] || 0) + 1;
    return acc;
  }, {});

  // Charts configuration
  const revenueChartOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      sparkline: { enabled: false }
    },
    colors: ["#3b82f6"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1
      }
    },
    stroke: {
      curve: "smooth",
      width: 3
    },
    xaxis: {
      categories: monthlyData.map(d => d.month),
      labels: {
        style: { colors: "#6b7280" }
      }
    },
    yaxis: {
      labels: {
        style: { colors: "#6b7280" },
        formatter: (value) => `$${(value / 1000).toFixed(0)}K`
      }
    },
    grid: {
      borderColor: "#e5e7eb"
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value.toLocaleString()}`
      }
    }
  };

  const revenueChartSeries = [{
    name: "Revenue",
    data: monthlyData.map(d => d.revenue)
  }];

  const dealsChartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false }
    },
    colors: ["#10b981", "#3b82f6"],
    xaxis: {
      categories: monthlyData.map(d => d.month),
      labels: {
        style: { colors: "#6b7280" }
      }
    },
    yaxis: {
      labels: {
        style: { colors: "#6b7280" }
      }
    },
    grid: {
      borderColor: "#e5e7eb"
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%"
      }
    },
    dataLabels: {
      enabled: false
    }
  };

  const dealsChartSeries = [
    {
      name: "Total Deals",
      data: monthlyData.map(d => d.deals)
    },
    {
      name: "Closed Deals",
      data: monthlyData.map(d => d.closed)
    }
  ];

  const pipelineChartOptions = {
    chart: {
      type: "donut"
    },
    colors: ["#3b82f6", "#10b981", "#f59e0b", "#f97316", "#8b5cf6"],
    labels: Object.keys(stageDistribution),
    legend: {
      position: "bottom"
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%"
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${Math.round(val)}%`
    }
  };

  const pipelineChartSeries = Object.values(stageDistribution);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">
            Track your sales performance and gain insights into your business.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="3months">Last 3 months</option>
            <option value="6months">Last 6 months</option>
            <option value="12months">Last 12 months</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.title} {...metric} index={index} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <motion.div
          className="card-premium p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Revenue Trend</h2>
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-gray-400" />
          </div>
          <Chart
            options={revenueChartOptions}
            series={revenueChartSeries}
            type="area"
            height={300}
          />
        </motion.div>

        {/* Deals Overview */}
        <motion.div
          className="card-premium p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Deals Overview</h2>
            <ApperIcon name="BarChart3" className="w-5 h-5 text-gray-400" />
          </div>
          <Chart
            options={dealsChartOptions}
            series={dealsChartSeries}
            type="bar"
            height={300}
          />
        </motion.div>

        {/* Pipeline Distribution */}
        <motion.div
          className="card-premium p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Pipeline Distribution</h2>
            <ApperIcon name="PieChart" className="w-5 h-5 text-gray-400" />
          </div>
          <Chart
            options={pipelineChartOptions}
            series={pipelineChartSeries}
            type="donut"
            height={300}
          />
        </motion.div>

        {/* Performance Summary */}
        <motion.div
          className="card-premium p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Performance Summary</h2>
            <ApperIcon name="Award" className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="Users" className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Total Contacts</p>
                  <p className="text-sm text-gray-600">Customer base growth</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{contacts.length}</p>
                <p className="text-sm text-green-600">+12% this month</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="Target" className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Active Deals</p>
                  <p className="text-sm text-gray-600">Opportunities in pipeline</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{deals.filter(d => d.stage !== "Closed").length}</p>
                <p className="text-sm text-blue-600">+8% this month</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="CheckSquare" className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Tasks Completed</p>
                  <p className="text-sm text-gray-600">Productivity measure</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-amber-600">{tasks.filter(t => t.completed).length}</p>
                <p className="text-sm text-amber-600">
                  {Math.round((tasks.filter(t => t.completed).length / Math.max(tasks.length, 1)) * 100)}% completion rate
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        className="card-premium p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center space-x-2 mb-6">
          <ApperIcon name="Lightbulb" className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Key Insights</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Top Performing Stage</h3>
            <p className="text-2xl font-bold text-primary-600 mb-1">
              {Object.entries(stageDistribution).reduce((a, b) => stageDistribution[a[0]] > stageDistribution[b[0]] ? a : b)[0]}
            </p>
            <p className="text-sm text-gray-600">
              {Math.max(...Object.values(stageDistribution))} deals in this stage
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Best Month</h3>
            <p className="text-2xl font-bold text-green-600 mb-1">
              {monthlyData.reduce((a, b) => a.revenue > b.revenue ? a : b).month}
            </p>
            <p className="text-sm text-gray-600">
              ${Math.max(...monthlyData.map(d => d.revenue)).toLocaleString()} revenue
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Task Efficiency</h3>
            <p className="text-2xl font-bold text-amber-600 mb-1">
              {Math.round((tasks.filter(t => t.completed).length / Math.max(tasks.length, 1)) * 100)}%
            </p>
            <p className="text-sm text-gray-600">
              {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;