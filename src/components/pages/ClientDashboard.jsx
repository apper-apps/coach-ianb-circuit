import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const ClientDashboard = ({ currentUser }) => {
  const navigate = useNavigate();

  const stats = [
    {
      label: "Available Credits",
      value: currentUser.credits,
      icon: "Coins",
      color: "accent"
    },
    {
      label: "Queries This Month",
      value: "47",
      icon: "MessageCircle",
      color: "primary"
    },
    {
      label: "Experts Consulted",
      value: "8",
      icon: "Users",
      color: "secondary"
    },
    {
      label: "Topics Explored",
      value: "12",
      icon: "BookOpen",
      color: "success"
    }
  ];

  const recentExperts = [
    { name: "Coach IanB", specialty: "Leadership & Performance", lastQuery: "2 hours ago" },
    { name: "Dr. Sarah Chen", specialty: "Wellness & Nutrition", lastQuery: "1 day ago" },
    { name: "Mike Rodriguez", specialty: "Business Strategy", lastQuery: "3 days ago" }
  ];

  const quickActions = [
    {
      title: "Ask a Question",
      description: "Query our AI experts instantly",
      icon: "MessageCircle",
      action: () => navigate("/chat"),
      color: "primary"
    },
    {
      title: "Browse Experts",
      description: "Explore subject matter experts",
      icon: "Users",
      action: () => navigate("/chat"),
      color: "secondary"
    },
    {
      title: "Purchase Credits",
      description: "Add more query credits",
      icon: "CreditCard",
      action: () => navigate("/account"),
      color: "accent"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {currentUser.name.split(" ")[0]}! 👋
            </h1>
            <p className="text-primary-100 text-lg">
              Ready to learn from the best experts? You have {currentUser.credits} credits available.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Brain" className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button
            onClick={() => navigate("/chat")}
            className="bg-white text-primary-700 hover:bg-gray-50"
          >
            <ApperIcon name="MessageCircle" className="w-4 h-4 mr-2" />
            Start Asking Questions
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
            <div className="text-sm text-gray-600">
              {stat.label}
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-primary-300 transition-all"
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

        {/* Recent Experts */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recently Consulted Experts</h2>
          <div className="space-y-4">
            {recentExperts.map((expert, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{expert.name}</h3>
                    <p className="text-sm text-gray-600">{expert.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" size="sm">
                    {expert.lastQuery}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => navigate("/chat")}
          >
            <ApperIcon name="MessageCircle" className="w-4 h-4 mr-2" />
            Start New Conversation
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;