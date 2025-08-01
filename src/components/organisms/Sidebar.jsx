import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const Sidebar = ({ currentUser, isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getNavigationItems = () => {
    switch (currentUser.role) {
      case "client":
        return [
          { path: "/", label: "AI Chat", icon: "MessageCircle", description: "Ask questions to experts" },
          { path: "/account", label: "Account", icon: "Settings", description: "Manage your profile" }
        ];
      case "sme":
        return [
          { path: "/", label: "Dashboard", icon: "BarChart3", description: "Overview of your content" },
          { path: "/uploads", label: "Content Library", icon: "Upload", description: "Manage your uploads" },
          { path: "/analytics", label: "Analytics", icon: "TrendingUp", description: "Usage insights" },
          { path: "/account", label: "Account", icon: "Settings", description: "Profile settings" }
        ];
      case "super_admin":
        return [
          { path: "/", label: "Admin Panel", icon: "Shield", description: "System overview" },
          { path: "/chat", label: "AI Chat", icon: "MessageCircle", description: "Test the AI system" },
          { path: "/uploads", label: "All Content", icon: "Upload", description: "Manage all uploads" },
          { path: "/analytics", label: "System Analytics", icon: "TrendingUp", description: "Platform insights" },
          { path: "/account", label: "Account", icon: "Settings", description: "Admin settings" }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const handleNavigation = (path) => {
    navigate(path);
    onClose?.();
  };

  const getRoleInfo = () => {
    switch (currentUser.role) {
      case "super_admin":
        return {
          title: "Super Admin",
          subtitle: "Full system access",
          variant: "accent",
          icon: "Crown"
        };
      case "sme":
        return {
          title: "Subject Expert",
          subtitle: "Content creator",
          variant: "secondary",
          icon: "Lightbulb"
        };
      case "client":
        return {
          title: "Client Access",
          subtitle: "Query and learn",
          variant: "primary",
          icon: "User"
        };
      default:
        return {
          title: "User",
          subtitle: "Standard access",
          variant: "outline",
          icon: "User"
        };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-md border-r border-gray-200 z-50 transform transition-transform duration-300 ease-out lg:relative lg:transform-none",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Brain" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    Coach IanB AI
                  </h1>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>

            {/* User Info */}
            <div className="bg-gradient-to-r from-gray-50 to-primary-50/50 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <ApperIcon name={roleInfo.icon} className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge variant={roleInfo.variant} size="sm">
                  {roleInfo.title}
                </Badge>
                {currentUser.role === "client" && (
                  <div className="flex items-center space-x-1 text-xs text-accent-600">
                    <ApperIcon name="Coins" className="w-3 h-3" />
                    <span>{currentUser.credits}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group",
                    isActive 
                      ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg" 
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary-700"
                  )}
                >
                  <ApperIcon 
                    name={item.icon} 
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-white" : "text-gray-500 group-hover:text-primary-600"
                    )} 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.label}</div>
                    <div className={cn(
                      "text-xs truncate",
                      isActive ? "text-white/80" : "text-gray-500"
                    )}>
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="space-y-3">
              {currentUser.role === "client" && (
                <Button 
                  className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white"
                  onClick={() => handleNavigation("/upgrade")}
                >
                  <ApperIcon name="Crown" className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              )}
              
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <span>Help</span>
                <span>•</span>
                <span>Privacy</span>
                <span>•</span>
                <span>Terms</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;