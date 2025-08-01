import { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const AccountSettings = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    bio: "",
    specialties: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: "profile", label: "Profile", icon: "User" },
    { id: "billing", label: "Billing", icon: "CreditCard" },
    { id: "preferences", label: "Preferences", icon: "Settings" },
    { id: "security", label: "Security", icon: "Shield" }
  ];

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "super_admin": return "Super Administrator";
      case "sme": return "Subject Matter Expert";
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

  const plans = [
    {
      name: "Free Trial",
      price: "$0",
      period: "/month",
      credits: 50,
      features: ["50 queries per month", "Basic support", "Email notifications"],
      current: currentUser.role === "client"
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      credits: 500,
      features: ["500 queries per month", "Priority support", "Advanced analytics", "Custom subjects"],
      current: false
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      credits: 2000,
      features: ["2000 queries per month", "Dedicated support", "Custom integrations", "White-label options"],
      current: false
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="User" className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{currentUser.name}</h1>
        <p className="text-gray-600 mt-1">{currentUser.email}</p>
        <Badge variant={getRoleBadgeVariant(currentUser.role)} className="mt-2">
          {getRoleDisplayName(currentUser.role)}
        </Badge>
      </div>

      {/* Tabs */}
      <Card>
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="name"
                    label="Full Name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    required
                  />
                  <Input
                    name="email"
                    type="email"
                    label="Email Address"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
              </div>

              {currentUser.role === "sme" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    placeholder="Tell us about your expertise and background..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="4"
                  />
                </div>
              )}

              {currentUser.role === "sme" && (
                <Input
                  name="specialties"
                  label="Specialties"
                  value={profileForm.specialties}
                  onChange={handleProfileChange}
                  placeholder="e.g., Leadership, Business Strategy, Personal Development"
                />
              )}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing & Subscription</h2>
                
                {currentUser.role === "client" && (
                  <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Current Credits</h3>
                        <p className="text-gray-600">Available for queries</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">{currentUser.credits}</div>
                        <Button size="sm" className="mt-2">
                          <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
                          Buy Credits
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan, index) => (
                    <div
                      key={index}
                      className={`border-2 rounded-xl p-6 transition-all ${
                        plan.current 
                          ? "border-primary-500 bg-primary-50" 
                          : "border-gray-200 hover:border-primary-300"
                      }`}
                    >
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-900 text-lg">{plan.name}</h3>
                        <div className="mt-2">
                          <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                          <span className="text-gray-600">{plan.period}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{plan.credits} credits included</p>
                      </div>

                      <ul className="mt-6 space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center space-x-2">
                            <ApperIcon name="Check" className="w-4 h-4 text-success" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={`w-full mt-6 ${
                          plan.current ? "bg-gray-400 cursor-not-allowed" : ""
                        }`}
                        disabled={plan.current}
                      >
                        {plan.current ? "Current Plan" : "Upgrade"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive updates about your queries and content</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                    <p className="text-sm text-gray-600">Get text alerts for important updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Weekly Digest</h3>
                    <p className="text-sm text-gray-600">Summary of your platform activity</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Settings</h2>
              
              <div className="space-y-4">
                <Card variant="compact" className="border-l-4 border-l-success">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Shield" className="w-5 h-5 text-success" />
                    <div>
                      <h3 className="font-medium text-gray-900">Account Security</h3>
                      <p className="text-sm text-gray-600">Your account is secured with strong encryption</p>
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    <ApperIcon name="Key" className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                  
                  <Button variant="outline" className="justify-start">
                    <ApperIcon name="Smartphone" className="w-4 h-4 mr-2" />
                    Two-Factor Auth
                  </Button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <ApperIcon name="AlertTriangle" className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-yellow-800">Security Recommendations</h3>
                      <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                        <li>• Enable two-factor authentication for better security</li>
                        <li>• Use a strong, unique password</li>
                        <li>• Review your account activity regularly</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AccountSettings;