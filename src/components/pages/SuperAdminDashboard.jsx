import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { userService } from "@/services/api/userService";
import { contentService } from "@/services/api/contentService";

const SuperAdminDashboard = ({ currentUser }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [allContent, setAllContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const [usersData, contentData] = await Promise.all([
        userService.getAll(),
        contentService.getAll()
      ]);
      setUsers(usersData);
      setAllContent(contentData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: "Users",
      color: "primary",
      breakdown: {
        clients: users.filter(u => u.role === "client").length,
        smes: users.filter(u => u.role === "sme").length,
        admins: users.filter(u => u.role === "super_admin").length
      }
    },
    {
      label: "Total Content",
      value: allContent.length,
      icon: "FileText",
      color: "secondary"
    },
    {
      label: "Monthly Revenue",
      value: "$12,847",
      icon: "DollarSign",
      color: "success"
    },
    {
      label: "System Health",
      value: "99.9%",
      icon: "Shield",
      color: "accent"
    }
  ];

  const smeUsers = users.filter(u => u.role === "sme");
  const recentContent = allContent.slice(0, 5);

const quickActions = [
    {
      title: "System Chat Test",
      description: "Test the AI query system",
      icon: "MessageCircle",
      action: () => navigate("/chat"),
      color: "primary"
    },
    {
      title: "Manage Users",
      description: "Set up SME accounts and passwords",
      icon: "UserGroup",
      action: () => navigate("/users"),
      color: "primary"
    },
    {
      title: "Manage Content",
      description: "View and organize all content",
      icon: "FolderOpen",
      action: () => navigate("/uploads"),
      color: "secondary"
    },
    {
      title: "View Analytics",
      description: "System-wide performance metrics",
      icon: "BarChart3",
      action: () => navigate("/analytics"),
      color: "accent"
    }
  ];

  if (loading) {
    return <Loading variant="skeleton" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-accent-600 to-primary-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Admin Control Center 👑
            </h1>
            <p className="text-accent-100 text-lg">
              Welcome back, {currentUser.name}. You have full system access and oversight.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Crown" className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <Button
            onClick={() => navigate("/analytics")}
            className="bg-white text-accent-700 hover:bg-gray-50"
          >
            <ApperIcon name="BarChart3" className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/chat")}
            className="border-white text-white hover:bg-white/10"
          >
            <ApperIcon name="MessageCircle" className="w-4 h-4 mr-2" />
            Test System
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 rounded-full flex items-center justify-center mx-auto mb-4`}>
              <ApperIcon name={stat.icon} className={`w-6 h-6 text-${stat.color}-600`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 mb-3">
              {stat.label}
            </div>
            {stat.breakdown && (
              <div className="flex justify-center space-x-2">
                <Badge variant="primary" size="sm">{stat.breakdown.clients} Clients</Badge>
                <Badge variant="secondary" size="sm">{stat.breakdown.smes} SMEs</Badge>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Admin Actions</h2>
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-accent-300 transition-all"
              >
                <div className={`w-10 h-10 bg-gradient-to-br from-${action.color}-100 to-${action.color}-200 rounded-lg flex items-center justify-center`}>
                  <ApperIcon name={action.icon} className={`w-5 h-5 text-${action.color}-600`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
                <ApperIcon name="ChevronRight" className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </Card>

        {/* Subject Matter Experts */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Subject Matter Experts</h2>
          <div className="space-y-4">
            {smeUsers.slice(0, 4).map((expert) => {
              const expertContent = allContent.filter(c => c.smeId === expert.Id);
              return (
                <div key={expert.Id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{expert.name}</h3>
                      <p className="text-sm text-gray-600">{expert.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" size="sm">
                      {expertContent.length} files
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
          
          {smeUsers.length > 4 && (
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                View All SMEs ({smeUsers.length})
              </Button>
            </div>
          )}
        </Card>

        {/* Recent Content */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Uploads</h2>
          <div className="space-y-4">
            {recentContent.map((content) => {
              const uploader = users.find(u => u.Id === content.smeId);
              return (
                <div key={content.Id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="FileText" className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm truncate max-w-32">
                        {content.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        by {uploader?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" size="sm">
                    {content.type}
                  </Badge>
                </div>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            onClick={() => navigate("/uploads")}
          >
            <ApperIcon name="FolderOpen" className="w-4 h-4 mr-2" />
            Manage All Content
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;