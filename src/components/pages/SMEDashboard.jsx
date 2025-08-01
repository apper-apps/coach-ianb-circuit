import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { contentService } from "@/services/api/contentService";
import ApperIcon from "@/components/ApperIcon";
import ContentCard from "@/components/molecules/ContentCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const SMEDashboard = ({ currentUser }) => {
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadContent = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contentService.getBySME(currentUser.Id);
      setContent(data);
    } catch (err) {
      setError("Failed to load your content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [currentUser.Id]);

  const stats = [
    {
      label: "Total Content",
      value: content.length,
      icon: "FileText",
      color: "primary"
    },
    {
      label: "Queries This Month",
      value: "124",
      icon: "MessageCircle",
      color: "secondary"
    },
    {
      label: "Revenue Earned",
      value: "$2,847",
      icon: "DollarSign",
      color: "success"
    },
    {
      label: "Content Views",
      value: "1,256",
      icon: "Eye",
      color: "accent"
    }
  ];

const quickActions = [
    {
      title: "Upload New Content",
      description: "Add videos, PDFs, audio files with auto-transcription",
      icon: "Upload",
      action: () => navigate("/uploads"),
      color: "primary"
    },
    {
      title: "View Analytics",
      description: "See how your content performs",
      icon: "TrendingUp",
      action: () => navigate("/analytics"),
      color: "secondary"
    },
    {
      title: "Manage Profile",
      description: "Update your expert profile",
      icon: "Settings",
      action: () => navigate("/account"),
      color: "accent"
    }
  ];

  if (loading) {
    return <Loading variant="skeleton" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadContent} />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-secondary-600 to-primary-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {currentUser.name}! 🎯
            </h1>
            <p className="text-secondary-100 text-lg">
              Your expertise is helping clients succeed. You have {content.length} pieces of content shared.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Lightbulb" className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
<Button
            onClick={() => navigate("/uploads")}
            className="bg-white text-secondary-700 hover:bg-gray-50"
          >
            <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
            Upload Media & Files
          </Button>
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
            <div className="text-sm text-gray-600">
              {stat.label}
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-secondary-300 transition-all"
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

        {/* Recent Content */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Content Library</h2>
              <Button
                size="sm"
                onClick={() => navigate("/uploads")}
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Content
              </Button>
            </div>
            
            {content.length === 0 ? (
              <Empty
                title="No content uploaded yet"
                description="Start sharing your expertise by uploading your first piece of content."
                icon="Upload"
                action={() => navigate("/uploads")}
                actionLabel="Upload Content"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.slice(0, 4).map((item) => (
                  <ContentCard
                    key={item.Id}
                    content={item}
                    showActions={true}
                  />
                ))}
              </div>
            )}
            
            {content.length > 4 && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={() => navigate("/uploads")}
                >
                  View All Content ({content.length})
                </Button>
              </div>
            )}
          </Card>
</div>
      </div>
    </div>
  </div>
  );
};

export default SMEDashboard;