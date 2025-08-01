import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const Header = ({ currentUser, onLogout, onToggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getNavigationItems = () => {
    const baseItems = [
      { path: "/account", label: "Account", icon: "Settings" }
    ];

    switch (currentUser.role) {
      case "client":
        return [
          { path: "/", label: "Chat", icon: "MessageCircle" },
          ...baseItems
        ];
      case "sme":
        return [
          { path: "/", label: "Dashboard", icon: "BarChart3" },
          { path: "/uploads", label: "Uploads", icon: "Upload" },
          { path: "/analytics", label: "Analytics", icon: "TrendingUp" },
          ...baseItems
        ];
      case "super_admin":
        return [
          { path: "/", label: "Admin", icon: "Shield" },
          { path: "/chat", label: "Chat", icon: "MessageCircle" },
          { path: "/uploads", label: "Uploads", icon: "Upload" },
          { path: "/analytics", label: "Analytics", icon: "TrendingUp" },
          ...baseItems
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "super_admin": return "Super Admin";
      case "sme": return "Expert";
      case "client": return "Client";
      default: return "User";
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "super_admin": return "accent";
      case "sme": return "secondary";
      case "client": return "primary";
      default: return "outline";
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="Brain" className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Coach IanB AI
                </h1>
              </div>
            </div>
          </div>

          {/* Center - Navigation (hidden on mobile) */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex items-center space-x-2",
                    isActive && "bg-primary-50 text-primary-700"
                  )}
                >
                  <ApperIcon name={item.icon} className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Credits for clients */}
            {currentUser.role === "client" && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-accent-50 rounded-full">
                <ApperIcon name="Coins" className="w-4 h-4 text-accent-600" />
                <span className="text-sm font-medium text-accent-700">
                  {currentUser.credits} credits
                </span>
              </div>
            )}

            {/* User menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {currentUser.name}
                  </div>
                  <Badge variant={getRoleBadgeVariant(currentUser.role)} size="sm">
                    {getRoleDisplayName(currentUser.role)}
                  </Badge>
                </div>
                <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-500" />
              </Button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        navigate("/account");
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <ApperIcon name="Settings" className="w-4 h-4" />
                      <span>Account Settings</span>
                    </button>
                    
                    <hr className="my-1" />
                    
                    <button
                      onClick={onLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <ApperIcon name="LogOut" className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;