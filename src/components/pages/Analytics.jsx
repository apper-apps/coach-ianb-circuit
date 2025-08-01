import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Chart from "react-apexcharts";
import { contentService } from "@/services/api/contentService";
import { queryService } from "@/services/api/queryService";

const Analytics = ({ currentUser }) => {
  const [content, setContent] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("30");

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [contentData, queryData] = await Promise.all([
        currentUser.role === "super_admin" 
          ? contentService.getAll()
          : contentService.getBySME(currentUser.Id),
        queryService.getAll()
      ]);
      
      setContent(contentData);
      setQueries(queryData);
    } catch (err) {
      setError("Failed to load analytics data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [currentUser.Id, currentUser.role]);

  const timeRangeOptions = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 90 days" },
    { value: "365", label: "Last year" }
  ];

  // Calculate stats
  const totalQueries = queries.length;
  const totalRevenue = queries.reduce((sum, q) => sum + (q.creditsUsed * 0.1), 0); // $0.10 per credit
  const avgQueriesPerDay = totalQueries / parseInt(timeRange);
  const topSubjects = content.reduce((acc, item) => {
    acc[item.subject] = (acc[item.subject] || 0) + 1;
    return acc;
  }, {});

  // Chart data
  const queryTrendData = {
    series: [{
      name: "Queries",
      data: [12, 19, 15, 27, 23, 35, 42, 38, 45, 52, 48, 61]
    }],
    options: {
      chart: {
        type: "area",
        height: 300,
        sparkline: { enabled: false },
        toolbar: { show: false }
      },
      colors: ["#3b82f6"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          colorStops: [
            { offset: 0, color: "#3b82f6", opacity: 0.8 },
            { offset: 100, color: "#3b82f6", opacity: 0.1 }
          ]
        }
      },
      stroke: {
        curve: "smooth",
        width: 3
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      },
      yaxis: {
        show: true
      },
      grid: {
        borderColor: "#f1f5f9"
      }
    }
  };

  const contentTypeData = {
    series: [
      content.filter(c => c.type === "pdf").length,
      content.filter(c => c.type === "video").length,
      content.filter(c => c.type === "audio").length,
      content.filter(c => c.type === "ppt").length
    ],
    options: {
      chart: {
        type: "donut",
        height: 300
      },
      colors: ["#ef4444", "#3b82f6", "#7c3aed", "#f59e0b"],
      labels: ["PDF", "Video", "Audio", "Presentation"],
      legend: {
        position: "bottom"
      },
      plotOptions: {
        pie: {
          donut: {
            size: "70%"
          }
        }
      }
    }
  };

  if (loading) {
    return <Loading variant="skeleton" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAnalyticsData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {currentUser.role === "super_admin" ? "System Analytics" : "Your Analytics"}
          </h1>
          <p className="text-gray-600 mt-1">
            {currentUser.role === "super_admin" ? "Platform-wide insights and metrics" : "Track your content performance and engagement"}
          </p>
        </div>
        <Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          options={timeRangeOptions}
          className="w-48"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="MessageCircle" className="w-6 h-6 text-primary-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {totalQueries.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            Total Queries
          </div>
          <Badge variant="success" size="sm" className="mt-2">
            +12% this month
          </Badge>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-success/20 to-success/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="DollarSign" className="w-6 h-6 text-success" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">
            Revenue Generated
          </div>
          <Badge variant="success" size="sm" className="mt-2">
            +8% this month
          </Badge>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="FileText" className="w-6 h-6 text-secondary-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {content.length}
          </div>
          <div className="text-sm text-gray-600">
            Content Items
          </div>
          <Badge variant="secondary" size="sm" className="mt-2">
            +3 this week
          </Badge>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="TrendingUp" className="w-6 h-6 text-accent-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {avgQueriesPerDay.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">
            Avg Queries/Day
          </div>
          <Badge variant="accent" size="sm" className="mt-2">
            +15% this week
          </Badge>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Query Trend */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Query Trends</h2>
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-primary-600" />
          </div>
          <Chart
            options={queryTrendData.options}
            series={queryTrendData.series}
            type="area"
            height={300}
          />
        </Card>

        {/* Content Distribution */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Content Types</h2>
            <ApperIcon name="PieChart" className="w-5 h-5 text-secondary-600" />
          </div>
          <Chart
            options={contentTypeData.options}
            series={contentTypeData.series}
            type="donut"
            height={300}
          />
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Subjects */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Popular Subjects</h2>
          <div className="space-y-4">
            {Object.entries(topSubjects)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([subject, count], index) => (
                <div key={subject} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <span className="font-medium text-gray-900">{subject}</span>
                  </div>
                  <Badge variant="primary" size="sm">
                    {count} items
                  </Badge>
                </div>
              ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {queries.slice(0, 5).map((query, index) => (
              <div key={query.Id} className="flex items-start space-x-3 p-3 border border-gray-100 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                  <ApperIcon name="MessageCircle" className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Query about {query.subject}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(query.timestamp).toLocaleDateString()} • {query.creditsUsed} credits
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;